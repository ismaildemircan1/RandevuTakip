const firebaseConfig = window.APP_CONFIG?.firebase;
if (!firebaseConfig || !firebaseConfig.apiKey) {
    alert('Firebase yapılandırması eksik. config.js dosyasını doldurun.');
    throw new Error('Missing Firebase config');
}

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

let appointments = [];
let patients = [];
let currentRole = 'secretary';

const STATUS_LABELS = {
    confirmed: 'Onaylandı',
    cancelled: 'İptal',
    arrived: 'Geldi',
    in_progress: 'Muayenede',
    completed: 'Tamamlandı',
    no_show: 'Gelmedi'
};

const MESSAGE_TEMPLATES = {
    reminder: apt => `Merhaba ${apt.patientName}, hatırlatma: Randevunuz ${new Date(apt.appointmentTime).toLocaleString('tr-TR')} tarihinde.`,
    cancel: apt => `Merhaba ${apt.patientName}, ${new Date(apt.appointmentTime).toLocaleString('tr-TR')} randevunuz iptal edildi.`,
    update: apt => `Merhaba ${apt.patientName}, randevunuz güncellendi. Yeni zaman: ${new Date(apt.appointmentTime).toLocaleString('tr-TR')}.`
};

function normalizePhone(phone) {
    const digits = phone.replace(/[^\d+]/g, '');
    return digits.startsWith('+') ? digits : `+${digits.replace(/^0/, '')}`;
}

function hasPermission(action) {
    const permissions = {
        admin: ['create', 'edit', 'cancel', 'delete', 'payment', 'reports'],
        secretary: ['create', 'edit', 'cancel', 'payment', 'reports'],
        doctor: ['edit', 'reports']
    };
    return permissions[currentRole]?.includes(action);
}

async function ensureRole(uid, fallbackEmail, selectedRole = 'secretary') {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
        await userRef.set({ email: fallbackEmail, role: selectedRole, createdAt: new Date().toISOString() });
        return selectedRole;
    }
    return doc.data().role || 'secretary';
}

auth.onAuthStateChanged(async user => {
    const contentSection = document.getElementById('contentSection');
    const userInfo = document.getElementById('userInfo');
    const roleInfo = document.getElementById('roleInfo');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutButton = document.getElementById('logoutButton');
    const authTitle = document.getElementById('authTitle');
    const toggleAuth = document.getElementById('toggleAuth');

    if (user) {
        currentRole = await ensureRole(user.uid, user.email);
        userInfo.classList.remove('hidden');
        roleInfo.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        contentSection.classList.remove('hidden');
        userInfo.textContent = `Hoş geldiniz, ${user.email}`;
        roleInfo.textContent = `Rol: ${currentRole}`;
        authTitle.textContent = 'Hesap';
        toggleAuth.classList.add('hidden');
        await renderAppointments();
        await renderPatients();
    } else {
        userInfo.classList.add('hidden');
        roleInfo.classList.add('hidden');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        logoutButton.classList.add('hidden');
        contentSection.classList.add('hidden');
        authTitle.textContent = 'Giriş Yap';
        toggleAuth.classList.remove('hidden');
        toggleAuth.textContent = 'Kayıt Ol';
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        await auth.signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value);
        this.reset();
    } catch (error) {
        alert('Giriş hatası: ' + error.message);
    }
});

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await ensureRole(result.user.uid, email, role);
        this.reset();
    } catch (error) {
        alert('Kayıt hatası: ' + error.message);
    }
});

document.getElementById('toggleAuth').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('registerForm').classList.toggle('hidden');
    const isLogin = !document.getElementById('loginForm').classList.contains('hidden');
    document.getElementById('authTitle').textContent = isLogin ? 'Giriş Yap' : 'Kayıt Ol';
    this.textContent = isLogin ? 'Kayıt Ol' : 'Giriş Yap';
});

document.getElementById('logoutButton').addEventListener('click', async () => auth.signOut());

document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!hasPermission('create')) return alert('Bu işlem için yetkiniz yok.');

    const appointment = {
        id: Date.now(),
        patientName: document.getElementById('patientName').value.trim(),
        doctorName: document.getElementById('doctorName').value.trim(),
        patientPhone: normalizePhone(document.getElementById('patientPhone').value),
        patientAddress: document.getElementById('patientAddress').value.trim(),
        appointmentTime: document.getElementById('appointmentTime').value,
        note: document.getElementById('appointmentNote').value.trim(),
        attachmentUrl: document.getElementById('attachmentUrl').value.trim(),
        status: 'confirmed',
        paymentStatus: 'pending',
        paymentAmount: 0,
        createdByRole: currentRole
    };

    if (appointments.some(a => a.doctorName === appointment.doctorName && a.appointmentTime === appointment.appointmentTime && a.status !== 'cancelled')) {
        return alert('Çakışma: Bu doktor için aynı saatte başka randevu var.');
    }

    try {
        const patientRef = db.collection('patients').doc(appointment.patientPhone);
        const patientDoc = await patientRef.get();
        if (!patientDoc.exists) {
            await patientRef.set({
                name: appointment.patientName,
                phone: appointment.patientPhone,
                address: appointment.patientAddress || '',
                appointmentIds: [appointment.id]
            });
        } else {
            await patientRef.update({
                name: appointment.patientName,
                address: appointment.patientAddress || patientDoc.data().address,
                appointmentIds: firebase.firestore.FieldValue.arrayUnion(appointment.id)
            });
        }

        await db.collection('appointments').doc(String(appointment.id)).set(appointment);
        await sendWhatsAppMessage(appointment.patientPhone, MESSAGE_TEMPLATES.reminder(appointment));
        this.reset();
        await renderAppointments();
        await renderPatients();
    } catch (error) {
        alert('Hata: ' + error.message);
    }
});

document.getElementById('paymentForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!hasPermission('payment')) return alert('Bu işlem için yetkiniz yok.');

    const paymentAmount = Number(document.getElementById('paymentAmount').value);
    const paymentMethodId = document.getElementById('paymentMethodId').value.trim();

    try {
        const response = await fetch('http://localhost:3000/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': window.APP_CONFIG.apiKey || '' },
            body: JSON.stringify({ amount: Math.round(paymentAmount * 100), paymentMethodId })
        });
        const data = await response.json();
        if (!data.success) return alert(`Ödeme başarısız: ${data.error}`);

        const lastAppointment = appointments[appointments.length - 1];
        if (lastAppointment) {
            await db.collection('appointments').doc(String(lastAppointment.id)).update({ paymentStatus: 'paid', paymentAmount });
            alert(`Ödeme alındı. PaymentIntent: ${data.paymentIntentId}`);
        }
        this.reset();
        await renderAppointments();
    } catch (error) {
        alert('Hata: ' + error.message);
    }
});

async function renderAppointments() {
    appointments = [];
    const snapshot = await db.collection('appointments').get();
    snapshot.forEach(doc => appointments.push(doc.data()));
    appointments.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));

    const list = document.getElementById('appointmentList');
    list.innerHTML = '';
    const paymentFilter = document.getElementById('paymentFilter').value;
    const fromDate = document.getElementById('fromDate').value;

    appointments
        .filter(apt => paymentFilter === 'all' || apt.paymentStatus === paymentFilter)
        .filter(apt => !fromDate || new Date(apt.appointmentTime) >= new Date(fromDate))
        .forEach(apt => {
            const div = document.createElement('div');
            div.className = 'appointment-item';
            const statusOptions = Object.keys(STATUS_LABELS)
                .map(s => `<option value="${s}" ${apt.status === s ? 'selected' : ''}>${STATUS_LABELS[s]}</option>`)
                .join('');
            div.innerHTML = `
                <p><strong>Hasta:</strong> ${apt.patientName}</p>
                <p><strong>Doktor:</strong> ${apt.doctorName || '-'}</p>
                <p><strong>Telefon:</strong> ${apt.patientPhone}</p>
                <p><strong>Zaman:</strong> ${new Date(apt.appointmentTime).toLocaleString('tr-TR')}</p>
                <p><strong>Durum:</strong> ${STATUS_LABELS[apt.status] || apt.status}</p>
                <p><strong>Ödeme:</strong> ${apt.paymentStatus === 'paid' ? `Ödendi (${apt.paymentAmount} TL)` : 'Bekliyor'}</p>
                <p><strong>Not:</strong> ${apt.note || '-'}</p>
                <p><strong>Ek:</strong> ${apt.attachmentUrl ? `<a class="text-blue-600" target="_blank" href="${apt.attachmentUrl}">Dosya</a>` : '-'}</p>
                <div class="mt-2 flex gap-2 flex-wrap">
                    <select onchange="updateStatus(${apt.id}, this.value)" class="border rounded p-1">${statusOptions}</select>
                    <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="editAppointment(${apt.id})">Düzenle</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="cancelAppointment(${apt.id})">İptal</button>
                    <button class="bg-gray-700 text-white px-3 py-1 rounded" onclick="deleteAppointment(${apt.id})">Sil</button>
                </div>
            `;
            list.appendChild(div);
        });

    renderCalendar();
    renderNotifications();
    renderReports();
}

async function renderPatients() {
    const term = document.getElementById('patientSearch').value.toLowerCase();
    const phoneTerm = document.getElementById('patientPhoneFilter').value;
    const list = document.getElementById('patientList');
    list.innerHTML = '';
    patients = [];

    const snapshot = await db.collection('patients').get();
    snapshot.forEach(doc => patients.push(doc.data()));

    patients
        .filter(p => p.name.toLowerCase().includes(term))
        .filter(p => !phoneTerm || p.phone.includes(phoneTerm))
        .forEach(patient => {
            const div = document.createElement('div');
            div.className = 'patient-item';
            div.innerHTML = `
                <p><strong>Ad:</strong> ${patient.name}</p>
                <p><strong>Telefon:</strong> ${patient.phone}</p>
                <p><strong>Adres:</strong> ${patient.address || 'Belirtilmemiş'}</p>
                <p><strong>Randevular:</strong> ${patient.appointmentIds.length} adet</p>
                <button class="bg-blue-500 text-white px-3 py-1 rounded" onclick="viewPatientDetails('${patient.phone}')">Detayları Gör</button>
            `;
            list.appendChild(div);
        });
}

async function viewPatientDetails(phone) {
    const patientDoc = await db.collection('patients').doc(phone).get();
    const snapshot = await db.collection('appointments').where('patientPhone', '==', phone).get();
    const patientApts = [];
    snapshot.forEach(doc => patientApts.push(doc.data()));
    const appointmentDetails = patientApts.map(apt => `${new Date(apt.appointmentTime).toLocaleString('tr-TR')} - ${STATUS_LABELS[apt.status] || apt.status}`).join('\n');
    alert(`Hasta: ${patientDoc.data().name}\nTelefon: ${phone}\nRandevular:\n${appointmentDetails || 'Yok'}`);
}

async function updateStatus(id, status) {
    if (!hasPermission('edit')) return alert('Bu işlem için yetkiniz yok.');
    await db.collection('appointments').doc(String(id)).update({ status });
    await renderAppointments();
}
window.updateStatus = updateStatus;

async function cancelAppointment(id) {
    if (!hasPermission('cancel')) return alert('Bu işlem için yetkiniz yok.');
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;
    await db.collection('appointments').doc(String(id)).update({ status: 'cancelled' });
    await sendWhatsAppMessage(apt.patientPhone, MESSAGE_TEMPLATES.cancel(apt));
    await renderAppointments();
}
window.cancelAppointment = cancelAppointment;

function editAppointment(id) {
    const apt = appointments.find(a => a.id === id);
    if (!apt || !hasPermission('edit')) return alert('Bu işlem için yetkiniz yok.');
    document.getElementById('editAppointmentForm').classList.remove('hidden');
    document.getElementById('editAppointmentId').value = apt.id;
    document.getElementById('editPatientName').value = apt.patientName;
    document.getElementById('editDoctorName').value = apt.doctorName || '';
    document.getElementById('editPatientPhone').value = apt.patientPhone;
    document.getElementById('editPatientAddress').value = apt.patientAddress || '';
    document.getElementById('editAppointmentTime').value = new Date(apt.appointmentTime).toISOString().slice(0, 16);
    document.getElementById('editAppointmentNote').value = apt.note || '';
    document.getElementById('editAttachmentUrl').value = apt.attachmentUrl || '';
}
window.editAppointment = editAppointment;

document.getElementById('editAppointmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = Number(document.getElementById('editAppointmentId').value);
    const old = appointments.find(a => a.id === id);
    const appointmentTime = document.getElementById('editAppointmentTime').value;
    const doctorName = document.getElementById('editDoctorName').value.trim();

    if (appointments.some(a => a.id !== id && a.doctorName === doctorName && a.appointmentTime === appointmentTime && a.status !== 'cancelled')) {
        return alert('Çakışma: Bu doktor için aynı saatte başka randevu var.');
    }

    const updated = {
        ...old,
        patientName: document.getElementById('editPatientName').value.trim(),
        doctorName,
        patientPhone: normalizePhone(document.getElementById('editPatientPhone').value),
        patientAddress: document.getElementById('editPatientAddress').value.trim(),
        appointmentTime,
        note: document.getElementById('editAppointmentNote').value.trim(),
        attachmentUrl: document.getElementById('editAttachmentUrl').value.trim()
    };

    await db.collection('appointments').doc(String(id)).update(updated);
    await sendWhatsAppMessage(updated.patientPhone, MESSAGE_TEMPLATES.update(updated));
    this.classList.add('hidden');
    this.reset();
    await renderAppointments();
    await renderPatients();
});

document.getElementById('cancelEdit').addEventListener('click', function () {
    document.getElementById('editAppointmentForm').classList.add('hidden');
    document.getElementById('editAppointmentForm').reset();
});

async function deleteAppointment(id) {
    if (!hasPermission('delete')) return alert('Bu işlem için yetkiniz yok.');
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;
    await db.collection('patients').doc(apt.patientPhone).update({ appointmentIds: firebase.firestore.FieldValue.arrayRemove(id) });
    await db.collection('appointments').doc(String(id)).delete();
    await renderAppointments();
    await renderPatients();
}
window.deleteAppointment = deleteAppointment;

async function sendWhatsAppMessage(phone, message) {
    const response = await fetch('http://localhost:3000/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': window.APP_CONFIG.apiKey || '' },
        body: JSON.stringify({ phone, message })
    });
    const data = await response.json();
    if (!data.success) console.warn(data.error);
}

function renderCalendar() {
    const view = document.getElementById('calendarView').value;
    const now = new Date();
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    const byDay = {};
    appointments.forEach(apt => {
        const key = new Date(apt.appointmentTime).toISOString().slice(0, 10);
        byDay[key] = byDay[key] || [];
        byDay[key].push(apt);
    });

    const dayCount = view === 'day' ? 1 : view === 'week' ? 7 : 30;
    for (let i = 0; i < dayCount; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        const items = (byDay[key] || []).map(a => `<div class="calendar-event">${a.doctorName}: ${a.patientName}</div>`).join('');
        cell.innerHTML = `<strong>${d.toLocaleDateString('tr-TR')}</strong>${items || '<div class="text-gray-400">Boş</div>'}`;
        grid.appendChild(cell);
    }
}

function renderNotifications() {
    const now = new Date();
    const upcoming = appointments.filter(a => new Date(a.appointmentTime) > now && new Date(a.appointmentTime) - now < 24 * 60 * 60 * 1000 && a.status === 'confirmed').length;
    const overduePayment = appointments.filter(a => a.paymentStatus === 'pending' && new Date(a.appointmentTime) < now).length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    document.getElementById('notificationCenter').innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Bildirim Merkezi</h3>
        <ul class="list-disc pl-6">
            <li>24 saat içindeki randevu: <strong>${upcoming}</strong></li>
            <li>Gecikmiş ödeme: <strong>${overduePayment}</strong></li>
            <li>İptal edilen randevu: <strong>${cancelled}</strong></li>
        </ul>
    `;
}

function renderReports() {
    const total = appointments.length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const revenue = appointments.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + Number(a.paymentAmount || 0), 0);
    const cancelRate = total ? ((cancelled / total) * 100).toFixed(1) : 0;

    document.getElementById('reportPanel').innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Rapor Ekranı</h3>
        <div class="grid md:grid-cols-4 gap-2">
            <div class="report-card">Toplam Randevu: ${total}</div>
            <div class="report-card">Tamamlanan: ${completed}</div>
            <div class="report-card">Tahsilat: ${revenue} TL</div>
            <div class="report-card">İptal Oranı: %${cancelRate}</div>
        </div>
    `;
}

document.getElementById('sendTemplateButton').addEventListener('click', async function (e) {
    e.preventDefault();
    const apt = appointments[appointments.length - 1];
    if (!apt) return alert('Randevu bulunamadı.');
    const selected = document.getElementById('messageTemplate').value;
    await sendWhatsAppMessage(apt.patientPhone, MESSAGE_TEMPLATES[selected](apt));
    alert('Şablon mesaj gönderildi.');
});

['patientSearch', 'patientPhoneFilter', 'paymentFilter', 'fromDate'].forEach(id => {
    document.getElementById(id).addEventListener('input', async () => {
        await renderPatients();
        await renderAppointments();
    });
    document.getElementById(id).addEventListener('change', async () => {
        await renderPatients();
        await renderAppointments();
    });
});

document.getElementById('calendarView').addEventListener('change', renderCalendar);
