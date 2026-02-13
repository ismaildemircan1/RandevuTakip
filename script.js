const firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

let appointments = [];
let patients = [];
let appointmentFilter = 'all';

function normalizePhoneNumber(phone) {
    if (!phone.startsWith('+')) {
        return `+${phone.replace(/^0/, '')}`;
    }

    return phone;
}

function normalizeTcIdentityNo(tcIdentityNo) {
    return tcIdentityNo.replace(/\D/g, '');
}

function isValidTcIdentityNo(tcIdentityNo) {
    return /^\d{11}$/.test(tcIdentityNo);
}

auth.onAuthStateChanged(user => {
    const contentSection = document.getElementById('contentSection');
    const userInfo = document.getElementById('userInfo');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutButton = document.getElementById('logoutButton');
    const authTitle = document.getElementById('authTitle');
    const toggleAuth = document.getElementById('toggleAuth');

    if (user) {
        userInfo.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        contentSection.classList.remove('hidden');
        userInfo.textContent = `Hoş geldiniz, ${user.email}`;
        authTitle.textContent = 'Hesap';
        toggleAuth.classList.add('hidden');
        renderAppointments();
        renderPatients();
    } else {
        userInfo.classList.add('hidden');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        logoutButton.classList.add('hidden');
        contentSection.classList.add('hidden');
        authTitle.textContent = 'Giriş Yap';
        toggleAuth.classList.remove('hidden');
        toggleAuth.textContent = 'Kayıt Ol';
        document.getElementById('appointmentList').innerHTML = '';
        document.getElementById('patientList').innerHTML = '';
    }
});

document.getElementById('appointmentFilter').addEventListener('change', e => {
    appointmentFilter = e.target.value;
    renderAppointmentList();
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        this.reset();
    } catch (error) {
        alert('Giriş hatası: ' + error.message);
    }
});

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        this.reset();
    } catch (error) {
        alert('Kayıt hatası: ' + error.message);
    }
});

document.getElementById('toggleAuth').addEventListener('click', function (e) {
    e.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');
    const toggleAuth = document.getElementById('toggleAuth');

    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        authTitle.textContent = 'Giriş Yap';
        toggleAuth.textContent = 'Kayıt Ol';
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        authTitle.textContent = 'Kayıt Ol';
        toggleAuth.textContent = 'Giriş Yap';
    }
});

document.getElementById('logoutButton').addEventListener('click', async function () {
    try {
        await auth.signOut();
    } catch (error) {
        alert('Çıkış hatası: ' + error.message);
    }
});

document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const patientName = document.getElementById('patientName').value;
    let patientPhone = document.getElementById('patientPhone').value;
    const patientTc = normalizeTcIdentityNo(document.getElementById('patientTc').value);
    const patientAddress = document.getElementById('patientAddress').value;
    const appointmentTime = document.getElementById('appointmentTime').value;

    patientPhone = normalizePhoneNumber(patientPhone);

    if (!isValidTcIdentityNo(patientTc)) {
        alert('TC Kimlik Numarası 11 haneli olmalıdır.');
        return;
    }

    const appointment = {
        id: Date.now(),
        patientName,
        patientPhone,
        patientAddress,
        patientTc,
        appointmentTime,
        status: 'confirmed',
        paymentStatus: 'pending',
        paymentAmount: 0
    };

    try {
        const patientRef = db.collection('patients').doc(patientPhone);
        const patientDoc = await patientRef.get();
        if (!patientDoc.exists) {
            await patientRef.set({
                name: patientName,
                phone: patientPhone,
                address: patientAddress || '',
                tcIdentityNo: patientTc,
                appointmentIds: [appointment.id]
            });
        } else {
            await patientRef.update({
                name: patientName,
                address: patientAddress || patientDoc.data().address,
                tcIdentityNo: patientTc,
                appointmentIds: firebase.firestore.FieldValue.arrayUnion(appointment.id)
            });
        }

        await db.collection('appointments').doc(appointment.id.toString()).set(appointment);
        await sendWhatsAppMessage(patientPhone, `Merhaba ${patientName}, randevunuz ${appointmentTime} için onaylandı.`);
        renderAppointments();
        renderPatients();
        this.reset();
    } catch (error) {
        alert('Hata: ' + error.message);
    }
});

document.getElementById('paymentForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const cardNumber = document.getElementById('cardNumber').value;
    const amount = parseFloat(document.getElementById('paymentAmount').value);

    if (cardNumber.length < 16 || isNaN(amount) || amount <= 0) {
        alert('Geçerli kart numarası (en az 16 hane) ve ödeme tutarı girin!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount * 100, cardNumber })
        });
        const data = await response.json();

        if (data.success && appointments.length > 0) {
            const latestAppointment = appointments[appointments.length - 1];
            latestAppointment.paymentStatus = 'paid';
            latestAppointment.paymentAmount = amount;
            await db.collection('appointments').doc(latestAppointment.id.toString()).update({
                paymentStatus: 'paid',
                paymentAmount: amount
            });
            alert(`Ödeme başarılı (Demo): ${amount} TL`);
            renderAppointments();
            this.reset();
        } else {
            alert('Ödeme başarısız: ' + data.error);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
});

async function renderAppointments() {
    const list = document.getElementById('appointmentList');
    list.innerHTML = '';
    appointments = [];

    try {
        const snapshot = await db.collection('appointments').get();
        snapshot.forEach(doc => {
            appointments.push(doc.data());
        });

        appointments.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
        updateAppointmentStats();
        renderAppointmentList();
        checkReminders();
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

function isSameDay(dateA, dateB) {
    return dateA.getFullYear() === dateB.getFullYear()
        && dateA.getMonth() === dateB.getMonth()
        && dateA.getDate() === dateB.getDate();
}

function getFilteredAppointments() {
    const today = new Date();

    if (appointmentFilter === 'confirmed') {
        return appointments.filter(apt => apt.status === 'confirmed');
    }

    if (appointmentFilter === 'cancelled') {
        return appointments.filter(apt => apt.status === 'cancelled');
    }

    if (appointmentFilter === 'today') {
        return appointments.filter(apt => isSameDay(new Date(apt.appointmentTime), today));
    }

    return appointments;
}

function renderAppointmentList() {
    const list = document.getElementById('appointmentList');
    list.innerHTML = '';
    const filteredAppointments = getFilteredAppointments();

    if (filteredAppointments.length === 0) {
        list.innerHTML = '<p class="text-sm text-gray-500">Filtreye uygun randevu bulunamadı.</p>';
        return;
    }

    filteredAppointments.forEach(apt => {
        const div = document.createElement('div');
        div.className = 'appointment-item';
        div.innerHTML = `
            <p><strong>Hasta:</strong> ${apt.patientName}</p>
            <p><strong>Telefon:</strong> ${apt.patientPhone}</p>
            <p><strong>Adres:</strong> ${apt.patientAddress || 'Belirtilmemiş'}</p>
            <p><strong>TC Kimlik:</strong> ${apt.patientTc || 'Belirtilmemiş'}</p>
            <p><strong>Zaman:</strong> ${new Date(apt.appointmentTime).toLocaleString('tr-TR')}</p>
            <p><strong>Durum:</strong> ${apt.status === 'confirmed' ? 'Onaylandı' : 'İptal Edildi'}</p>
            <p><strong>Ödeme:</strong> ${apt.paymentStatus === 'paid' ? `Ödendi (${apt.paymentAmount} TL)` : 'Bekliyor'}</p>
            <button class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2" onclick="editAppointment(${apt.id})">Düzenle</button>
            <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2" onclick="cancelAppointment(${apt.id})">İptal Et</button>
            <button class="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800" onclick="deleteAppointment(${apt.id})">Sil</button>
        `;
        list.appendChild(div);
    });
}

function updateAppointmentStats() {
    const today = new Date();
    const total = appointments.length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;
    const todayCount = appointments.filter(apt => isSameDay(new Date(apt.appointmentTime), today)).length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statToday').textContent = todayCount;
    document.getElementById('statConfirmed').textContent = confirmed;
    document.getElementById('statCancelled').textContent = cancelled;
}

async function renderPatients() {
    const list = document.getElementById('patientList');
    list.innerHTML = '';
    patients = [];

    try {
        const snapshot = await db.collection('patients').get();
        snapshot.forEach(doc => {
            patients.push(doc.data());
        });

        patients.forEach(patient => {
            const div = document.createElement('div');
            div.className = 'patient-item';
            div.innerHTML = `
                <p><strong>Ad:</strong> ${patient.name}</p>
                <p><strong>Telefon:</strong> ${patient.phone}</p>
                <p><strong>Adres:</strong> ${patient.address || 'Belirtilmemiş'}</p>
                <p><strong>TC Kimlik:</strong> ${patient.tcIdentityNo || 'Belirtilmemiş'}</p>
                <p><strong>Randevular:</strong> ${patient.appointmentIds.length} adet</p>
                <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onclick="viewPatientDetails('${patient.phone}')">Detayları Gör</button>
            `;
            list.appendChild(div);
        });
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

async function viewPatientDetails(phone) {
    try {
        const patientDoc = await db.collection('patients').doc(phone).get();
        if (patientDoc.exists) {
            const patient = patientDoc.data();
            const patientAppointments = [];
            const snapshot = await db.collection('appointments').where('patientPhone', '==', phone).get();
            snapshot.forEach(doc => {
                patientAppointments.push(doc.data());
            });

            const appointmentDetails = patientAppointments.map(apt => `
                <p>Zaman: ${new Date(apt.appointmentTime).toLocaleString('tr-TR')}, 
                   Durum: ${apt.status === 'confirmed' ? 'Onaylandı' : 'İptal Edildi'}, 
                   Ödeme: ${apt.paymentStatus === 'paid' ? `Ödendi (${apt.paymentAmount} TL)` : 'Bekliyor'}</p>
            `).join('');

            alert(`
                Hasta Kayıt Kartı:
                Ad: ${patient.name}
                Telefon: ${patient.phone}
                TC Kimlik: ${patient.tcIdentityNo || 'Belirtilmemiş'}
                Adres: ${patient.address || 'Belirtilmemiş'}
                Randevu Sayısı: ${patient.appointmentIds.length}
                Randevular:
                ${appointmentDetails || 'Randevu yok'}
            `);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

document.getElementById('patientSearch').addEventListener('input', async function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const list = document.getElementById('patientList');
    list.innerHTML = '';
    patients = [];

    try {
        const snapshot = await db.collection('patients').get();
        snapshot.forEach(doc => {
            const patient = doc.data();
            if (patient.name.toLowerCase().includes(searchTerm)) {
                patients.push(patient);
            }
        });

        patients.forEach(patient => {
            const div = document.createElement('div');
            div.className = 'patient-item';
            div.innerHTML = `
                <p><strong>Ad:</strong> ${patient.name}</p>
                <p><strong>Telefon:</strong> ${patient.phone}</p>
                <p><strong>Adres:</strong> ${patient.address || 'Belirtilmemiş'}</p>
                <p><strong>TC Kimlik:</strong> ${patient.tcIdentityNo || 'Belirtilmemiş'}</p>
                <p><strong>Randevular:</strong> ${patient.appointmentIds.length} adet</p>
                <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onclick="viewPatientDetails('${patient.phone}')">Detayları Gör</button>
            `;
            list.appendChild(div);
        });
    } catch (error) {
        alert('Hata: ' + error.message);
    }
});

async function cancelAppointment(id) {
    try {
        const apt = appointments.find(a => a.id === id);
        if (apt && apt.status !== 'cancelled') {
            apt.status = 'cancelled';
            await db.collection('appointments').doc(id.toString()).update({ status: 'cancelled' });
            await sendWhatsAppMessage(apt.patientPhone, `Merhaba ${apt.patientName}, ${apt.appointmentTime} tarihindeki randevunuz iptal edildi.`);
            renderAppointments();
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

function editAppointment(id) {
    const apt = appointments.find(a => a.id === id);
    if (apt && apt.status !== 'cancelled') {
        document.getElementById('editAppointmentForm').classList.remove('hidden');
        document.getElementById('editAppointmentId').value = apt.id;
        document.getElementById('editPatientName').value = apt.patientName;
        document.getElementById('editPatientPhone').value = apt.patientPhone;
        document.getElementById('editPatientTc').value = apt.patientTc || '';
        document.getElementById('editPatientAddress').value = apt.patientAddress || '';
        const date = new Date(apt.appointmentTime);
        const formattedDate = date.toISOString().slice(0, 16);
        document.getElementById('editAppointmentTime').value = formattedDate;
    }
}

document.getElementById('editAppointmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('editAppointmentId').value;
    const patientName = document.getElementById('editPatientName').value;
    let patientPhone = document.getElementById('editPatientPhone').value;
    const patientTc = normalizeTcIdentityNo(document.getElementById('editPatientTc').value);
    const patientAddress = document.getElementById('editPatientAddress').value;
    const appointmentTime = document.getElementById('editAppointmentTime').value;

    patientPhone = normalizePhoneNumber(patientPhone);

    if (!isValidTcIdentityNo(patientTc)) {
        alert('TC Kimlik Numarası 11 haneli olmalıdır.');
        return;
    }

    const currentAppointment = appointments.find(a => a.id === parseInt(id, 10));
    const updatedAppointment = {
        id: parseInt(id, 10),
        patientName,
        patientPhone,
        patientAddress,
        patientTc,
        appointmentTime,
        status: 'confirmed',
        paymentStatus: currentAppointment.paymentStatus,
        paymentAmount: currentAppointment.paymentAmount
    };

    try {
        const patientRef = db.collection('patients').doc(patientPhone);
        const patientDoc = await patientRef.get();
        if (patientDoc.exists) {
            await patientRef.update({
                name: patientName,
                address: patientAddress || patientDoc.data().address,
                tcIdentityNo: patientTc
            });
        } else {
            await patientRef.set({
                name: patientName,
                phone: patientPhone,
                address: patientAddress || '',
                tcIdentityNo: patientTc,
                appointmentIds: [parseInt(id, 10)]
            });
        }

        await db.collection('appointments').doc(id).update(updatedAppointment);
        await sendWhatsAppMessage(patientPhone, `Merhaba ${patientName}, randevunuz ${appointmentTime} olarak güncellendi.`);
        renderAppointments();
        renderPatients();
        document.getElementById('editAppointmentForm').classList.add('hidden');
        this.reset();
    } catch (error) {
        alert('Hata: ' + error.message);
    }
});

document.getElementById('cancelEdit').addEventListener('click', function () {
    document.getElementById('editAppointmentForm').classList.add('hidden');
    document.getElementById('editAppointmentForm').reset();
});

async function deleteAppointment(id) {
    try {
        const apt = appointments.find(a => a.id === id);
        if (apt) {
            const patientRef = db.collection('patients').doc(apt.patientPhone);
            await patientRef.update({
                appointmentIds: firebase.firestore.FieldValue.arrayRemove(id)
            });
            await db.collection('appointments').doc(id.toString()).delete();
            await sendWhatsAppMessage(apt.patientPhone, `Merhaba ${apt.patientName}, ${apt.appointmentTime} tarihindeki randevunuz silindi.`);
            renderAppointments();
            renderPatients();
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

async function sendWhatsAppMessage(phone, message) {
    try {
        const response = await fetch('http://localhost:3000/send-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, message })
        });
        const data = await response.json();
        if (data.success) {
            alert(`WhatsApp mesajı gönderildi (Demo): ${message}`);
        } else {
            alert('Mesaj gönderilemedi: ' + data.error);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

async function checkReminders() {
    try {
        const snapshot = await db.collection('appointments').where('status', '==', 'confirmed').get();
        const now = new Date();
        snapshot.forEach(doc => {
            const apt = doc.data();
            const aptTime = new Date(apt.appointmentTime);
            const timeDiff = aptTime - now;
            const oneDay = 24 * 60 * 60 * 1000;

            if (timeDiff > 0 && timeDiff <= oneDay) {
                sendWhatsAppMessage(apt.patientPhone, `Merhaba ${apt.patientName}, hatırlatma: Randevunuz ${apt.appointmentTime} tarihinde.`);
            }
        });
    } catch (error) {
        console.error('Hatırlatma hatası:', error);
    }
}
