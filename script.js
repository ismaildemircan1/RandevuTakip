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
let unsubscribeAppointments = null;
let unsubscribePatients = null;

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600', warning: 'bg-yellow-600' };
    const toast = document.createElement('div');
    toast.className = `toast ${colors[type] || colors.info} text-white px-4 py-3 rounded-lg shadow-lg text-sm max-w-xs`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

function statusLabel(s) {
    const map = { confirmed: 'Onaylı', pending: 'Beklemede', completed: 'Tamamlandı', cancelled: 'İptal' };
    return map[s] || s;
}
function statusClass(s) { return 'status-badge status-' + (s || 'pending'); }

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active', 'text-blue-600', 'border-blue-600'); b.classList.add('text-gray-500'); });
        btn.classList.add('active', 'text-blue-600', 'border-blue-600');
        btn.classList.remove('text-gray-500');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
    });
});

auth.onAuthStateChanged(user => {
    const authSection = document.getElementById('authSection');
    const contentSection = document.getElementById('contentSection');
    const headerUser = document.getElementById('headerUser');
    const userInfo = document.getElementById('userInfo');
    if (user) {
        authSection.classList.add('hidden');
        contentSection.classList.remove('hidden');
        headerUser.classList.remove('hidden');
        userInfo.textContent = user.email;
        startRealtimeListeners();
    } else {
        authSection.classList.remove('hidden');
        contentSection.classList.add('hidden');
        headerUser.classList.add('hidden');
        stopRealtimeListeners();
        document.getElementById('appointmentList').innerHTML = '';
        document.getElementById('patientList').innerHTML = '';
    }
});

document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    try {
        await auth.signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value);
        e.target.reset();
        showToast('Giriş başarılı');
    } catch (err) { showToast('Giriş hatası: ' + err.message, 'error'); }
});

document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    try {
        await auth.createUserWithEmailAndPassword(document.getElementById('registerEmail').value, document.getElementById('registerPassword').value);
        e.target.reset();
        showToast('Kayıt başarılı');
    } catch (err) { showToast('Kayıt hatası: ' + err.message, 'error'); }
});

document.getElementById('toggleAuth').addEventListener('click', e => {
    e.preventDefault();
    const login = document.getElementById('loginForm');
    const register = document.getElementById('registerForm');
    const title = document.getElementById('authTitle');
    const toggle = document.getElementById('toggleAuth');
    if (login.classList.contains('hidden')) {
        login.classList.remove('hidden'); register.classList.add('hidden');
        title.textContent = 'Giriş Yap'; toggle.textContent = 'Hesabın yok mu? Kayıt Ol';
    } else {
        login.classList.add('hidden'); register.classList.remove('hidden');
        title.textContent = 'Kayıt Ol'; toggle.textContent = 'Zaten hesabın var mı? Giriş Yap';
    }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    try { await auth.signOut(); showToast('Çıkış yapıldı', 'info'); } catch (err) { showToast(err.message, 'error'); }
});

function startRealtimeListeners() {
    stopRealtimeListeners();
    unsubscribeAppointments = db.collection('appointments').onSnapshot(snap => {
        appointments = [];
        snap.forEach(doc => appointments.push({ ...doc.data(), _docId: doc.id }));
        appointments.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
        renderAppointments(); updateStats(); updatePaymentSelect();
    }, err => showToast('Randevu dinleme hatası: ' + err.message, 'error'));
    unsubscribePatients = db.collection('patients').onSnapshot(snap => {
        patients = [];
        snap.forEach(doc => patients.push(doc.data()));
        renderPatients(); updateStats();
    }, err => showToast('Hasta dinleme hatası: ' + err.message, 'error'));
}

function stopRealtimeListeners() {
    if (unsubscribeAppointments) { unsubscribeAppointments(); unsubscribeAppointments = null; }
    if (unsubscribePatients) { unsubscribePatients(); unsubscribePatients = null; }
}

function updateStats() {
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const todayCount = appointments.filter(a => { const t = new Date(a.appointmentTime); return t >= today && t < tomorrow && a.status !== 'cancelled'; }).length;
    document.getElementById('statToday').textContent = todayCount;
    document.getElementById('statConfirmed').textContent = appointments.filter(a => a.status === 'confirmed').length;
    document.getElementById('statPendingPay').textContent = appointments.filter(a => a.paymentStatus !== 'paid' && a.status !== 'cancelled').length;
    document.getElementById('statPatients').textContent = patients.length;
}

function getFilteredAppointments() {
    let list = [...appointments];
    const status = document.getElementById('filterStatus').value;
    const payment = document.getElementById('filterPayment').value;
    const from = document.getElementById('filterDateFrom').value;
    const to = document.getElementById('filterDateTo').value;
    if (status !== 'all') list = list.filter(a => a.status === status);
    if (payment !== 'all') list = list.filter(a => a.paymentStatus === payment);
    if (from) list = list.filter(a => new Date(a.appointmentTime) >= new Date(from));
    if (to) { const toDate = new Date(to); toDate.setHours(23,59,59); list = list.filter(a => new Date(a.appointmentTime) <= toDate); }
    return list;
}

['filterStatus','filterPayment','filterDateFrom','filterDateTo'].forEach(id => {
    document.getElementById(id).addEventListener('change', renderAppointments);
});
document.getElementById('clearFilters').addEventListener('click', () => {
    document.getElementById('filterStatus').value = 'all';
    document.getElementById('filterPayment').value = 'all';
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    renderAppointments();
});

function renderAppointments() {
    const list = document.getElementById('appointmentList');
    const empty = document.getElementById('noAppointments');
    const filtered = getFilteredAppointments();
    list.innerHTML = '';
    if (filtered.length === 0) { empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');
    filtered.forEach(apt => {
        const card = document.createElement('div');
        card.className = 'appointment-card bg-white rounded-xl shadow-sm p-4 border border-gray-100 transition';
        const notesHtml = apt.notes ? `<p class="text-sm text-gray-500 mt-1"><i class="fas fa-sticky-note mr-1"></i>${escapeHtml(apt.notes)}</p>` : '';
        card.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div class="flex-1">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                        <span class="font-semibold text-gray-800">${escapeHtml(apt.patientName)}</span>
                        <span class="${statusClass(apt.status)}">${statusLabel(apt.status)}</span>
                        <span class="text-xs ${apt.paymentStatus === 'paid' ? 'payment-paid' : 'payment-pending'}">
                            ${apt.paymentStatus === 'paid' ? '✓ Ödendi (' + apt.paymentAmount + ' TL)' : '○ Ödeme bekliyor'}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600">
                        <i class="fas fa-phone text-gray-400 mr-1"></i>${escapeHtml(apt.patientPhone)}
                        ${apt.patientAddress ? ' · <i class="fas fa-map-marker-alt text-gray-400 mr-1"></i>' + escapeHtml(apt.patientAddress) : ''}
                    </p>
                    <p class="text-sm text-gray-600 mt-0.5">
                        <i class="fas fa-clock text-gray-400 mr-1"></i>${formatDate(apt.appointmentTime)}
                    </p>
                    ${notesHtml}
                </div>
                <div class="flex flex-wrap gap-2">
                    ${apt.status !== 'completed' && apt.status !== 'cancelled' ? `
                        <button onclick="completeAppointment(${apt.id})" class="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg" title="Tamamlandı">
                            <i class="fas fa-check"></i>
                        </button>` : ''}
                    ${apt.status !== 'cancelled' ? `
                        <button onclick="editAppointment(${apt.id})" class="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded-lg">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="cancelAppointment(${apt.id})" class="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg">
                            <i class="fas fa-ban"></i>
                        </button>` : ''}
                    <button onclick="deleteAppointment(${apt.id})" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
        list.appendChild(card);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}
function formatDate(iso) {
    try { return new Date(iso).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return iso; }
}

function renderPatients(filterTerm = '') {
    const list = document.getElementById('patientList');
    const empty = document.getElementById('noPatients');
    list.innerHTML = '';
    const term = filterTerm.toLowerCase();
    const filtered = patients.filter(p => !term || (p.name && p.name.toLowerCase().includes(term)) || (p.phone && p.phone.includes(term)));
    if (filtered.length === 0) { empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm p-4 border border-gray-100';
        card.innerHTML = `
            <div class="font-semibold text-gray-800">${escapeHtml(p.name)}</div>
            <div class="text-sm text-gray-500 mt-1"><i class="fas fa-phone mr-1"></i>${escapeHtml(p.phone)}</div>
            ${p.address ? `<div class="text-sm text-gray-500"><i class="fas fa-map-marker-alt mr-1"></i>${escapeHtml(p.address)}</div>` : ''}
            <div class="text-xs text-gray-400 mt-2">${(p.appointmentIds || []).length} randevu</div>
            <button onclick="viewPatientDetails('${p.phone}')" class="mt-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg">
                <i class="fas fa-id-card mr-1"></i>Detay
            </button>`;
        list.appendChild(card);
    });
}

document.getElementById('patientSearch').addEventListener('input', e => renderPatients(e.target.value));

document.getElementById('appointmentForm').addEventListener('submit', async e => {
    e.preventDefault();
    let phone = document.getElementById('patientPhone').value.trim();
    if (!phone.startsWith('+')) phone = '+' + phone.replace(/^0/, '');
    const appointment = {
        id: Date.now(),
        patientName: document.getElementById('patientName').value.trim(),
        patientPhone: phone,
        patientAddress: document.getElementById('patientAddress').value.trim(),
        appointmentTime: document.getElementById('appointmentTime').value,
        notes: document.getElementById('appointmentNotes').value.trim(),
        status: document.getElementById('appointmentStatus').value,
        paymentStatus: 'pending',
        paymentAmount: 0,
        createdAt: new Date().toISOString()
    };
    try {
        const patientRef = db.collection('patients').doc(phone);
        const patientDoc = await patientRef.get();
        if (!patientDoc.exists) {
            await patientRef.set({ name: appointment.patientName, phone, address: appointment.patientAddress || '', appointmentIds: [appointment.id] });
        } else {
            await patientRef.update({ name: appointment.patientName, address: appointment.patientAddress || patientDoc.data().address || '', appointmentIds: firebase.firestore.FieldValue.arrayUnion(appointment.id) });
        }
        await db.collection('appointments').doc(String(appointment.id)).set(appointment);
        await sendWhatsAppMessage(phone, `Merhaba ${appointment.patientName}, randevunuz ${formatDate(appointment.appointmentTime)} için ${statusLabel(appointment.status)} olarak kaydedildi.`);
        e.target.reset();
        showToast('Randevu oluşturuldu');
        document.querySelector('[data-tab="appointments"]').click();
    } catch (err) { showToast('Hata: ' + err.message, 'error'); }
});

window.editAppointment = function(id) {
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;
    document.getElementById('editAppointmentId').value = apt.id;
    document.getElementById('editPatientName').value = apt.patientName || '';
    document.getElementById('editPatientPhone').value = apt.patientPhone || '';
    document.getElementById('editPatientAddress').value = apt.patientAddress || '';
    try { document.getElementById('editAppointmentTime').value = new Date(apt.appointmentTime).toISOString().slice(0, 16); } catch { document.getElementById('editAppointmentTime').value = ''; }
    document.getElementById('editAppointmentStatus').value = apt.status || 'confirmed';
    document.getElementById('editAppointmentNotes').value = apt.notes || '';
    document.getElementById('editModal').classList.remove('hidden');
};

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editAppointmentForm').reset();
}
document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
document.getElementById('cancelEdit').addEventListener('click', closeEditModal);

document.getElementById('editAppointmentForm').addEventListener('submit', async e => {
    e.preventDefault();
    const id = parseInt(document.getElementById('editAppointmentId').value);
    let phone = document.getElementById('editPatientPhone').value.trim();
    if (!phone.startsWith('+')) phone = '+' + phone.replace(/^0/, '');
    const existing = appointments.find(a => a.id === id) || {};
    const updated = {
        id, patientName: document.getElementById('editPatientName').value.trim(), patientPhone: phone,
        patientAddress: document.getElementById('editPatientAddress').value.trim(),
        appointmentTime: document.getElementById('editAppointmentTime').value,
        status: document.getElementById('editAppointmentStatus').value,
        notes: document.getElementById('editAppointmentNotes').value.trim(),
        paymentStatus: existing.paymentStatus || 'pending', paymentAmount: existing.paymentAmount || 0
    };
    try {
        await db.collection('appointments').doc(String(id)).update(updated);
        const patientRef = db.collection('patients').doc(phone);
        const pDoc = await patientRef.get();
        if (pDoc.exists) await patientRef.update({ name: updated.patientName, address: updated.patientAddress || pDoc.data().address });
        await sendWhatsAppMessage(phone, `Merhaba ${updated.patientName}, randevunuz güncellendi: ${formatDate(updated.appointmentTime)}`);
        closeEditModal(); showToast('Randevu güncellendi');
    } catch (err) { showToast('Hata: ' + err.message, 'error'); }
});

window.completeAppointment = async function(id) {
    try {
        await db.collection('appointments').doc(String(id)).update({ status: 'completed' });
        const apt = appointments.find(a => a.id === id);
        if (apt) await sendWhatsAppMessage(apt.patientPhone, `Merhaba ${apt.patientName}, randevunuz tamamlandı olarak işaretlendi. Teşekkürler.`);
        showToast('Randevu tamamlandı olarak işaretlendi');
    } catch (err) { showToast(err.message, 'error'); }
};

window.cancelAppointment = async function(id) {
    if (!confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) return;
    try {
        await db.collection('appointments').doc(String(id)).update({ status: 'cancelled' });
        const apt = appointments.find(a => a.id === id);
        if (apt) await sendWhatsAppMessage(apt.patientPhone, `Merhaba ${apt.patientName}, ${formatDate(apt.appointmentTime)} tarihli randevunuz iptal edildi.`);
        showToast('Randevu iptal edildi', 'warning');
    } catch (err) { showToast(err.message, 'error'); }
};

window.deleteAppointment = async function(id) {
    if (!confirm('Bu randevuyu kalıcı olarak silmek istediğinize emin misiniz?')) return;
    try {
        const apt = appointments.find(a => a.id === id);
        if (apt) {
            try { await db.collection('patients').doc(apt.patientPhone).update({ appointmentIds: firebase.firestore.FieldValue.arrayRemove(id) }); } catch (_) {}
            await sendWhatsAppMessage(apt.patientPhone, `Merhaba ${apt.patientName}, ${formatDate(apt.appointmentTime)} tarihli randevunuz silindi.`);
        }
        await db.collection('appointments').doc(String(id)).delete();
        showToast('Randevu silindi', 'info');
    } catch (err) { showToast(err.message, 'error'); }
};

window.viewPatientDetails = async function(phone) {
    try {
        const patientDoc = await db.collection('patients').doc(phone).get();
        if (!patientDoc.exists) { showToast('Hasta bulunamadı', 'error'); return; }
        const patient = patientDoc.data();
        const patientApts = appointments.filter(a => a.patientPhone === phone);
        let aptHtml = patientApts.length ? patientApts.map(a => `
            <div class="border-l-2 border-gray-200 pl-3 py-2 text-sm">
                <div class="font-medium">${formatDate(a.appointmentTime)}</div>
                <div class="flex gap-2 mt-0.5">
                    <span class="${statusClass(a.status)}">${statusLabel(a.status)}</span>
                    <span class="text-xs ${a.paymentStatus === 'paid' ? 'payment-paid' : 'payment-pending'}">${a.paymentStatus === 'paid' ? 'Ödendi' : 'Bekliyor'}</span>
                </div>
                ${a.notes ? `<div class="text-gray-500 text-xs mt-1">${escapeHtml(a.notes)}</div>` : ''}
            </div>`).join('') : '<p class="text-gray-400 text-sm">Randevu yok</p>';
        document.getElementById('patientModalBody').innerHTML = `
            <div class="space-y-3">
                <div><div class="text-xs text-gray-400 uppercase">Ad</div><div class="font-semibold text-lg">${escapeHtml(patient.name)}</div></div>
                <div><div class="text-xs text-gray-400 uppercase">Telefon</div><div>${escapeHtml(patient.phone)}</div></div>
                ${patient.address ? `<div><div class="text-xs text-gray-400 uppercase">Adres</div><div>${escapeHtml(patient.address)}</div></div>` : ''}
                <div><div class="text-xs text-gray-400 uppercase mb-2">Randevu Geçmişi (${patientApts.length})</div>
                <div class="space-y-1 max-h-60 overflow-y-auto">${aptHtml}</div></div>
            </div>`;
        document.getElementById('patientModal').classList.remove('hidden');
    } catch (err) { showToast(err.message, 'error'); }
};
document.getElementById('closePatientModal').addEventListener('click', () => document.getElementById('patientModal').classList.add('hidden'));

function updatePaymentSelect() {
    const sel = document.getElementById('paymentAppointmentId');
    const current = sel.value;
    sel.innerHTML = '<option value="">— Randevu seçin —</option>';
    appointments.filter(a => a.paymentStatus !== 'paid' && a.status !== 'cancelled').forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = `${a.patientName} – ${formatDate(a.appointmentTime)}`;
        sel.appendChild(opt);
    });
    if (current) sel.value = current;
}

document.getElementById('paymentForm').addEventListener('submit', async e => {
    e.preventDefault();
    const aptId = document.getElementById('paymentAppointmentId').value;
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const card = document.getElementById('cardNumber').value;
    if (!aptId) { showToast('Lütfen bir randevu seçin', 'warning'); return; }
    try {
        const res = await fetch('http://localhost:3000/create-payment-intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: amount * 100, cardNumber: card }) });
        const data = await res.json();
        if (data.success) {
            await db.collection('appointments').doc(String(aptId)).update({ paymentStatus: 'paid', paymentAmount: amount });
            showToast(`Ödeme kaydedildi: ${amount} TL`); e.target.reset();
        } else showToast('Ödeme başarısız: ' + (data.error || ''), 'error');
    } catch (err) {
        await db.collection('appointments').doc(String(aptId)).update({ paymentStatus: 'paid', paymentAmount: amount });
        showToast(`Ödeme kaydedildi (demo): ${amount} TL`); e.target.reset();
    }
});

async function sendWhatsAppMessage(phone, message) {
    try {
        const res = await fetch('http://localhost:3000/send-whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, message }) });
        const data = await res.json();
        if (data.success) showToast('WhatsApp bildirimi gönderildi (demo)', 'info');
    } catch { console.log('WhatsApp demo:', phone, message); }
}

document.getElementById('editModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeEditModal(); });
document.getElementById('patientModal').addEventListener('click', e => { if (e.target === e.currentTarget) document.getElementById('patientModal').classList.add('hidden'); });
