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

const SAFETY_STATUS_LABELS = {
    pending: 'Paylaşım kapalı',
    on_the_way: 'Yoldayım',
    arrived: 'Ulaştım',
    checked_out: 'Çıktım'
};

const refs = {
    authTitle: document.getElementById('authTitle'),
    userInfo: document.getElementById('userInfo'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    logoutButton: document.getElementById('logoutButton'),
    toggleAuth: document.getElementById('toggleAuth'),
    contentSection: document.getElementById('contentSection'),
    systemMessage: document.getElementById('systemMessage'),
    appointmentForm: document.getElementById('appointmentForm'),
    appointmentList: document.getElementById('appointmentList'),
    upcomingAppointmentCard: document.getElementById('upcomingAppointmentCard'),
    patientList: document.getElementById('patientList'),
    patientInsight: document.getElementById('patientInsight'),
    patientSearch: document.getElementById('patientSearch'),
    trustedContactForm: document.getElementById('trustedContactForm'),
    trustedContactsList: document.getElementById('trustedContactsList'),
    trustedContactSelect: document.getElementById('trustedContactSelect'),
    paymentForm: document.getElementById('paymentForm'),
    paymentAppointmentId: document.getElementById('paymentAppointmentId'),
    toastContainer: document.getElementById('toastContainer'),
    editAppointmentForm: document.getElementById('editAppointmentForm'),
    cancelEdit: document.getElementById('cancelEdit'),
    metricAppointments: document.getElementById('metricAppointments'),
    metricUpcoming: document.getElementById('metricUpcoming'),
    metricCancelled: document.getElementById('metricCancelled'),
    metricPaid: document.getElementById('metricPaid')
};

let appointments = [];
let patients = [];
let trustedContacts = loadTrustedContacts();
let currentUser = null;

function loadTrustedContacts() {
    try {
        return JSON.parse(localStorage.getItem('trustedContacts') || '[]');
    } catch (error) {
        console.error('Trusted contact verisi okunamadı:', error);
        return [];
    }
}

function persistTrustedContacts() {
    localStorage.setItem('trustedContacts', JSON.stringify(trustedContacts));
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    refs.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3600);
}

function updateSystemMessage(message, variant = 'info') {
    refs.systemMessage.textContent = message;
    refs.systemMessage.dataset.variant = variant;
}

function normalizePhone(phone) {
    if (!phone) {
        return '';
    }

    const trimmed = phone.trim();

    if (trimmed.startsWith('+')) {
        return trimmed;
    }

    return `+${trimmed.replace(/^0/, '')}`;
}

function formatDate(value) {
    if (!value) {
        return 'Belirtilmemiş';
    }

    return new Date(value).toLocaleString('tr-TR', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getTrustedContactById(contactId) {
    return trustedContacts.find((contact) => contact.id === contactId) || null;
}

function sortAppointments(list) {
    return [...list].sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
}

function getUpcomingAppointments() {
    const now = new Date();
    return sortAppointments(
        appointments.filter((appointment) => appointment.status !== 'cancelled' && new Date(appointment.appointmentTime) >= now)
    );
}

function renderTrustedContactOptions() {
    const options = ['<option value="">Paylaşım yok</option>']
        .concat(
            trustedContacts.map((contact) => (
                `<option value="${contact.id}">${escapeHtml(contact.name)} · ${escapeHtml(contact.relation)}</option>`
            ))
        )
        .join('');

    refs.trustedContactSelect.innerHTML = options;
}

function renderTrustedContacts() {
    renderTrustedContactOptions();

    if (!trustedContacts.length) {
        refs.trustedContactsList.innerHTML = '<div class="empty-state">Henüz güvenilir kişi eklenmedi. Partner modu varsayılan kapalıdır.</div>';
        return;
    }

    refs.trustedContactsList.innerHTML = trustedContacts.map((contact) => `
        <article class="trusted-contact-card">
            <div class="trusted-contact-header">
                <div>
                    <strong>${escapeHtml(contact.name)}</strong>
                    <p>${escapeHtml(contact.relation)} · ${escapeHtml(contact.phone)}</p>
                </div>
                <button type="button" class="ghost-btn" onclick="removeTrustedContact('${contact.id}')">Kaldır</button>
            </div>
        </article>
    `).join('');
}

function updateDashboardMetrics() {
    const upcoming = getUpcomingAppointments();
    const cancelled = appointments.filter((appointment) => appointment.status === 'cancelled').length;
    const paid = appointments.filter((appointment) => appointment.paymentStatus === 'paid').length;

    refs.metricAppointments.textContent = appointments.length;
    refs.metricUpcoming.textContent = upcoming.filter((appointment) => {
        const diff = new Date(appointment.appointmentTime) - new Date();
        return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;
    refs.metricCancelled.textContent = cancelled;
    refs.metricPaid.textContent = paid;

    refs.upcomingAppointmentCard.innerHTML = upcoming.length ? createUpcomingAppointmentMarkup(upcoming[0]) : 'Henüz yaklaşan randevu bulunmuyor.';
    renderPaymentAppointmentOptions();
}

function createUpcomingAppointmentMarkup(appointment) {
    const trustedContact = appointment.companionId ? getTrustedContactById(appointment.companionId) : null;

    return `
        <article class="upcoming-card">
            <div class="badge-row">
                <span class="badge">${escapeHtml(appointment.specialty || 'Genel')}</span>
                <span class="status-chip ${appointment.status === 'cancelled' ? 'cancelled' : 'confirmed'}">${appointment.status === 'cancelled' ? 'İptal' : 'Onaylı'}</span>
            </div>
            <h4>${escapeHtml(appointment.doctorName || 'Doktor bilgisi bekleniyor')}</h4>
            <p>${escapeHtml(appointment.clinicName || 'Klinik bilgisi yok')}</p>
            <p>${formatDate(appointment.appointmentTime)}</p>
            <p>${trustedContact ? `Paylaşım: ${escapeHtml(trustedContact.name)}` : 'Paylaşım kapalı'}</p>
        </article>
    `;
}

function createAppointmentCardMarkup(appointment) {
    const isCancelled = appointment.status === 'cancelled';
    const safetyLabel = SAFETY_STATUS_LABELS[appointment.safetyStatus || 'pending'] || SAFETY_STATUS_LABELS.pending;
    const trustedContact = appointment.companionId ? getTrustedContactById(appointment.companionId) : null;

    return `
        <article class="appointment-item">
            <div class="appointment-header">
                <div>
                    <div class="badge-row">
                        <span class="badge">${escapeHtml(appointment.specialty || 'Genel')}</span>
                        <span class="status-chip ${isCancelled ? 'cancelled' : 'confirmed'}">${isCancelled ? 'İptal edildi' : 'Onaylandı'}</span>
                        <span class="safety-chip">${escapeHtml(safetyLabel)}</span>
                    </div>
                    <h4>${escapeHtml(appointment.doctorName || 'Doktor belirtilmemiş')}</h4>
                    <p class="appointment-meta">${escapeHtml(appointment.clinicName || 'Klinik belirtilmemiş')} · ${escapeHtml(appointment.visitType || 'Standart ziyaret')}</p>
                </div>
                <div class="text-right">
                    <strong>${formatDate(appointment.appointmentTime)}</strong>
                    <p class="appointment-meta">${escapeHtml(appointment.patientName)} · ${escapeHtml(appointment.patientPhone)}</p>
                </div>
            </div>

            <div>
                <p><strong>Adres / not:</strong> ${escapeHtml(appointment.patientAddress || 'Belirtilmemiş')}</p>
                <p><strong>Ödeme:</strong> ${appointment.paymentStatus === 'paid' ? `Ödendi (${appointment.paymentAmount} TL)` : 'Bekliyor'}</p>
                <p><strong>Güvenilir kişi:</strong> ${trustedContact ? `${escapeHtml(trustedContact.name)} (${escapeHtml(trustedContact.relation)})` : 'Paylaşım yok'}</p>
            </div>

            <div class="appointment-footer">
                <div class="inline-actions">
                    <button type="button" class="secondary-warning-btn" onclick="editAppointment(${appointment.id})" ${isCancelled ? 'disabled' : ''}>Düzenle</button>
                    <button type="button" class="danger-btn" onclick="cancelAppointment(${appointment.id})" ${isCancelled ? 'disabled' : ''}>İptal Et</button>
                    <button type="button" class="ghost-btn" onclick="deleteAppointment(${appointment.id})">Sil</button>
                </div>
                <div class="inline-actions">
                    <button type="button" class="secondary-btn" onclick="updateSafetyStatus(${appointment.id}, 'on_the_way')" ${isCancelled ? 'disabled' : ''}>Yoldayım</button>
                    <button type="button" class="secondary-btn" onclick="updateSafetyStatus(${appointment.id}, 'arrived')" ${isCancelled ? 'disabled' : ''}>Ulaştım</button>
                    <button type="button" class="secondary-btn" onclick="updateSafetyStatus(${appointment.id}, 'checked_out')" ${isCancelled ? 'disabled' : ''}>Çıktım</button>
                </div>
            </div>
        </article>
    `;
}

function renderPaymentAppointmentOptions() {
    const pendingAppointments = appointments.filter((appointment) => appointment.paymentStatus !== 'paid' && appointment.status !== 'cancelled');
    refs.paymentAppointmentId.innerHTML = ['<option value="">Ödeme bekleyen randevu seçin</option>']
        .concat(
            pendingAppointments.map((appointment) => (
                `<option value="${appointment.id}">${escapeHtml(appointment.patientName)} · ${escapeHtml(appointment.clinicName || 'Klinik')} · ${escapeHtml(formatDate(appointment.appointmentTime))}</option>`
            ))
        )
        .join('');
}

function renderAppointments() {
    if (!appointments.length) {
        refs.appointmentList.innerHTML = '<div class="empty-state">Henüz randevu bulunmuyor. Yukarıdaki formdan ilk kaydı oluşturabilirsiniz.</div>';
        updateDashboardMetrics();
        return;
    }

    refs.appointmentList.innerHTML = sortAppointments(appointments).map(createAppointmentCardMarkup).join('');
    updateDashboardMetrics();
}

function renderPatients(filteredPatients = patients) {
    if (!filteredPatients.length) {
        refs.patientList.innerHTML = '<div class="empty-state">Aramanıza uygun hasta kaydı bulunamadı.</div>';
        return;
    }

    refs.patientList.innerHTML = filteredPatients.map((patient) => `
        <article class="patient-item">
            <div class="patient-header">
                <div>
                    <strong>${escapeHtml(patient.name)}</strong>
                    <p>${escapeHtml(patient.phone)} · ${escapeHtml(patient.address || 'Adres belirtilmemiş')}</p>
                </div>
                <button type="button" class="ghost-btn" onclick="viewPatientDetails('${patient.phone}')">Detay</button>
            </div>
            <p>Toplam randevu: ${patient.appointmentIds?.length || 0}</p>
        </article>
    `).join('');
}

async function fetchAppointments() {
    const snapshot = await db.collection('appointments').get();
    appointments = [];
    snapshot.forEach((doc) => {
        appointments.push(doc.data());
    });
}

async function fetchPatients() {
    const snapshot = await db.collection('patients').get();
    patients = [];
    snapshot.forEach((doc) => {
        patients.push(doc.data());
    });
}

async function refreshDashboard() {
    try {
        await Promise.all([fetchAppointments(), fetchPatients()]);
        renderAppointments();
        renderPatients();
        checkReminders();
    } catch (error) {
        console.error(error);
        showToast(`Veriler yüklenemedi: ${error.message}`, 'error');
    }
}

function resetAuthForms() {
    refs.loginForm.reset();
    refs.registerForm.reset();
}

function updateAuthView(user) {
    currentUser = user;

    if (user) {
        refs.userInfo.classList.remove('hidden');
        refs.userInfo.textContent = `Hoş geldiniz, ${user.email}. Panelden randevu, ödeme ve güvenilir kişi akışlarını yönetebilirsiniz.`;
        refs.loginForm.classList.add('hidden');
        refs.registerForm.classList.add('hidden');
        refs.logoutButton.classList.remove('hidden');
        refs.toggleAuth.classList.add('hidden');
        refs.contentSection.classList.remove('hidden');
        refs.authTitle.textContent = 'Hesap paneli';
        updateSystemMessage('Mahremiyet odaklı panel aktif. Paylaşımlar yalnızca açık seçiminizle ilerler.', 'success');
        renderTrustedContacts();
        refreshDashboard();
        return;
    }

    refs.userInfo.classList.add('hidden');
    refs.loginForm.classList.remove('hidden');
    refs.registerForm.classList.add('hidden');
    refs.logoutButton.classList.add('hidden');
    refs.toggleAuth.classList.remove('hidden');
    refs.toggleAuth.textContent = 'Kayıt Ol';
    refs.contentSection.classList.add('hidden');
    refs.authTitle.textContent = 'Giriş Yap';
    refs.appointmentList.innerHTML = '';
    refs.patientList.innerHTML = '';
    refs.upcomingAppointmentCard.textContent = 'Henüz yaklaşan randevu bulunmuyor.';
    updateSystemMessage('Tıbbi tavsiye sunulmaz. Platform yalnızca keşif, planlama ve koordinasyon amaçlıdır.', 'info');
}

auth.onAuthStateChanged((user) => {
    updateAuthView(user);
});

refs.loginForm.addEventListener('submit', async function handleLogin(event) {
    event.preventDefault();

    try {
        await auth.signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value);
        resetAuthForms();
        showToast('Giriş başarılı.', 'success');
    } catch (error) {
        showToast(`Giriş hatası: ${error.message}`, 'error');
    }
});

refs.registerForm.addEventListener('submit', async function handleRegister(event) {
    event.preventDefault();

    try {
        await auth.createUserWithEmailAndPassword(document.getElementById('registerEmail').value, document.getElementById('registerPassword').value);
        resetAuthForms();
        showToast('Kayıt başarılı. Panel hazırlanıyor.', 'success');
    } catch (error) {
        showToast(`Kayıt hatası: ${error.message}`, 'error');
    }
});

refs.toggleAuth.addEventListener('click', () => {
    const loginHidden = refs.loginForm.classList.contains('hidden');

    if (loginHidden) {
        refs.loginForm.classList.remove('hidden');
        refs.registerForm.classList.add('hidden');
        refs.authTitle.textContent = 'Giriş Yap';
        refs.toggleAuth.textContent = 'Kayıt Ol';
    } else {
        refs.loginForm.classList.add('hidden');
        refs.registerForm.classList.remove('hidden');
        refs.authTitle.textContent = 'Kayıt Ol';
        refs.toggleAuth.textContent = 'Giriş Yap';
    }
});

refs.logoutButton.addEventListener('click', async () => {
    try {
        await auth.signOut();
        showToast('Güvenli çıkış yapıldı.', 'info');
    } catch (error) {
        showToast(`Çıkış hatası: ${error.message}`, 'error');
    }
});

refs.appointmentForm.addEventListener('submit', async function createAppointment(event) {
    event.preventDefault();

    const patientPhone = normalizePhone(document.getElementById('patientPhone').value);
    const selectedCompanionId = refs.trustedContactSelect.value;
    const shareEnabled = document.getElementById('shareWithCompanion').checked;

    const appointment = {
        id: Date.now(),
        patientName: document.getElementById('patientName').value.trim(),
        patientPhone,
        patientAddress: document.getElementById('patientAddress').value.trim(),
        doctorName: document.getElementById('doctorName').value.trim(),
        clinicName: document.getElementById('clinicName').value.trim(),
        specialty: document.getElementById('specialty').value,
        visitType: document.getElementById('visitType').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        status: 'confirmed',
        paymentStatus: 'pending',
        paymentAmount: 0,
        safetyStatus: shareEnabled && selectedCompanionId ? 'on_the_way' : 'pending',
        companionId: shareEnabled && selectedCompanionId ? selectedCompanionId : '',
        shareWithCompanion: Boolean(shareEnabled && selectedCompanionId),
        createdBy: currentUser?.email || 'anonymous'
    };

    if (!appointment.patientName || !appointment.patientPhone || !appointment.doctorName || !appointment.clinicName || !appointment.specialty || !appointment.appointmentTime) {
        showToast('Lütfen zorunlu alanları doldurun.', 'error');
        return;
    }

    try {
        const patientRef = db.collection('patients').doc(patientPhone);
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
        await sendWhatsAppMessage(appointment.patientPhone, `Merhaba ${appointment.patientName}, ${appointment.clinicName} randevunuz ${formatDate(appointment.appointmentTime)} için planlandı.`);

        if (appointment.shareWithCompanion) {
            const trustedContact = getTrustedContactById(appointment.companionId);
            showToast(`Randevu özeti ${trustedContact?.name || 'seçili kişi'} ile paylaşım için hazırlandı.`, 'success');
        } else {
            showToast('Randevu başarıyla oluşturuldu.', 'success');
        }

        this.reset();
        renderTrustedContactOptions();
        await refreshDashboard();
    } catch (error) {
        showToast(`Randevu kaydedilemedi: ${error.message}`, 'error');
    }
});

refs.paymentForm.addEventListener('submit', async function handlePayment(event) {
    event.preventDefault();

    const cardNumber = document.getElementById('cardNumber').value.trim();
    const paymentAmount = Number(document.getElementById('paymentAmount').value);
    const appointmentId = refs.paymentAppointmentId.value;

    if (!appointmentId || !paymentAmount) {
        showToast('Ödeme için randevu ve tutar seçmelisiniz.', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: paymentAmount * 100, cardNumber })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Ödeme başarısız');
        }

        await db.collection('appointments').doc(String(appointmentId)).update({
            paymentStatus: 'paid',
            paymentAmount
        });

        this.reset();
        showToast(`Ödeme başarıyla alındı: ${paymentAmount} TL`, 'success');
        await refreshDashboard();
    } catch (error) {
        showToast(`Ödeme hatası: ${error.message}`, 'error');
    }
});

refs.patientSearch.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim().toLowerCase();
    const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchTerm));
    renderPatients(filteredPatients);
});

refs.trustedContactForm.addEventListener('submit', function handleTrustedContact(event) {
    event.preventDefault();

    const name = document.getElementById('trustedContactName').value.trim();
    const relation = document.getElementById('trustedContactRelation').value;
    const phone = normalizePhone(document.getElementById('trustedContactPhone').value);

    if (!name || !phone) {
        showToast('Güvenilir kişi için ad ve telefon zorunludur.', 'error');
        return;
    }

    trustedContacts.unshift({
        id: String(Date.now()),
        name,
        relation,
        phone
    });

    persistTrustedContacts();
    renderTrustedContacts();
    this.reset();
    showToast('Güvenilir kişi kaydedildi.', 'success');
});

refs.editAppointmentForm.addEventListener('submit', async function handleEdit(event) {
    event.preventDefault();

    const id = document.getElementById('editAppointmentId').value;
    const currentAppointment = appointments.find((appointment) => String(appointment.id) === String(id));
    const patientPhone = normalizePhone(document.getElementById('editPatientPhone').value);

    if (!currentAppointment) {
        showToast('Düzenlenecek randevu bulunamadı.', 'error');
        return;
    }

    const updatedAppointment = {
        ...currentAppointment,
        patientName: document.getElementById('editPatientName').value.trim(),
        patientPhone,
        patientAddress: document.getElementById('editPatientAddress').value.trim(),
        doctorName: document.getElementById('editDoctorName').value.trim(),
        clinicName: document.getElementById('editClinicName').value.trim(),
        specialty: document.getElementById('editSpecialty').value,
        visitType: document.getElementById('editVisitType').value,
        appointmentTime: document.getElementById('editAppointmentTime').value,
        status: 'confirmed'
    };

    try {
        const patientRef = db.collection('patients').doc(patientPhone);
        const patientDoc = await patientRef.get();

        if (patientDoc.exists) {
            await patientRef.update({
                name: updatedAppointment.patientName,
                address: updatedAppointment.patientAddress || patientDoc.data().address
            });
        } else {
            await patientRef.set({
                name: updatedAppointment.patientName,
                phone: updatedAppointment.patientPhone,
                address: updatedAppointment.patientAddress || '',
                appointmentIds: [Number(id)]
            });
        }

        await db.collection('appointments').doc(String(id)).update(updatedAppointment);
        refs.editAppointmentForm.classList.add('hidden');
        this.reset();
        showToast('Randevu güncellendi.', 'success');
        await refreshDashboard();
    } catch (error) {
        showToast(`Güncelleme hatası: ${error.message}`, 'error');
    }
});

refs.cancelEdit.addEventListener('click', () => {
    refs.editAppointmentForm.classList.add('hidden');
    refs.editAppointmentForm.reset();
});

async function sendWhatsAppMessage(phone, message) {
    try {
        const response = await fetch('http://localhost:3000/send-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, message })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Mesaj gönderimi başarısız');
        }
    } catch (error) {
        console.error('Mesaj gönderim hatası:', error);
        showToast(`Bildirim gönderilemedi: ${error.message}`, 'error');
    }
}

async function checkReminders() {
    try {
        const now = new Date();
        appointments.forEach((appointment) => {
            if (appointment.status === 'cancelled') {
                return;
            }

            const appointmentTime = new Date(appointment.appointmentTime);
            const timeDiff = appointmentTime - now;
            const oneDay = 24 * 60 * 60 * 1000;

            if (timeDiff > 0 && timeDiff <= oneDay) {
                updateSystemMessage(`Yaklaşan randevu hatırlatması: ${appointment.patientName} için ${formatDate(appointment.appointmentTime)} ziyaretiniz bulunuyor.`, 'info');
            }
        });
    } catch (error) {
        console.error('Hatırlatma hatası:', error);
    }
}

async function viewPatientDetails(phone) {
    try {
        const patientDoc = await db.collection('patients').doc(phone).get();

        if (!patientDoc.exists) {
            showToast('Hasta kaydı bulunamadı.', 'error');
            return;
        }

        const patient = patientDoc.data();
        const relatedAppointments = appointments.filter((appointment) => appointment.patientPhone === phone);

        refs.patientInsight.innerHTML = `
            <strong>${escapeHtml(patient.name)}</strong>
            <p>${escapeHtml(patient.phone)} · ${escapeHtml(patient.address || 'Adres belirtilmemiş')}</p>
            <p>Toplam randevu: ${relatedAppointments.length}</p>
            <p>Son durum: ${relatedAppointments.length ? escapeHtml(formatDate(sortAppointments(relatedAppointments).slice(-1)[0].appointmentTime)) : 'Randevu yok'}</p>
        `;
    } catch (error) {
        showToast(`Hasta detayı alınamadı: ${error.message}`, 'error');
    }
}

async function cancelAppointment(id) {
    try {
        const appointment = appointments.find((item) => item.id === id);

        if (!appointment || appointment.status === 'cancelled') {
            return;
        }

        await db.collection('appointments').doc(String(id)).update({ status: 'cancelled' });
        await sendWhatsAppMessage(appointment.patientPhone, `Merhaba ${appointment.patientName}, ${formatDate(appointment.appointmentTime)} tarihli randevunuz iptal edildi.`);
        showToast('Randevu iptal edildi.', 'info');
        await refreshDashboard();
    } catch (error) {
        showToast(`İptal hatası: ${error.message}`, 'error');
    }
}

function editAppointment(id) {
    const appointment = appointments.find((item) => item.id === id);

    if (!appointment || appointment.status === 'cancelled') {
        return;
    }

    refs.editAppointmentForm.classList.remove('hidden');
    document.getElementById('editAppointmentId').value = appointment.id;
    document.getElementById('editPatientName').value = appointment.patientName;
    document.getElementById('editPatientPhone').value = appointment.patientPhone;
    document.getElementById('editPatientAddress').value = appointment.patientAddress || '';
    document.getElementById('editDoctorName').value = appointment.doctorName || '';
    document.getElementById('editClinicName').value = appointment.clinicName || '';
    document.getElementById('editSpecialty').value = appointment.specialty || 'Kardiyoloji';
    document.getElementById('editVisitType').value = appointment.visitType || 'İlk muayene';
    document.getElementById('editAppointmentTime').value = new Date(appointment.appointmentTime).toISOString().slice(0, 16);
    refs.editAppointmentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function deleteAppointment(id) {
    try {
        const appointment = appointments.find((item) => item.id === id);

        if (!appointment) {
            return;
        }

        await db.collection('patients').doc(appointment.patientPhone).update({
            appointmentIds: firebase.firestore.FieldValue.arrayRemove(id)
        });
        await db.collection('appointments').doc(String(id)).delete();
        showToast('Randevu kaydı silindi.', 'info');
        await refreshDashboard();
    } catch (error) {
        showToast(`Silme hatası: ${error.message}`, 'error');
    }
}

async function updateSafetyStatus(id, safetyStatus) {
    try {
        const appointment = appointments.find((item) => item.id === id);

        if (!appointment || appointment.status === 'cancelled') {
            return;
        }

        await db.collection('appointments').doc(String(id)).update({ safetyStatus });

        if (appointment.shareWithCompanion && appointment.companionId) {
            const trustedContact = getTrustedContactById(appointment.companionId);
            showToast(`${SAFETY_STATUS_LABELS[safetyStatus]} durumu ${trustedContact?.name || 'güvenilir kişi'} için güncellendi.`, 'success');
        } else {
            showToast(`Durum güncellendi: ${SAFETY_STATUS_LABELS[safetyStatus]}.`, 'success');
        }

        await refreshDashboard();
    } catch (error) {
        showToast(`Check-in güncellenemedi: ${error.message}`, 'error');
    }
}

function removeTrustedContact(contactId) {
    trustedContacts = trustedContacts.filter((contact) => contact.id !== contactId);
    persistTrustedContacts();
    renderTrustedContacts();
    showToast('Güvenilir kişi kaldırıldı.', 'info');
}

window.viewPatientDetails = viewPatientDetails;
window.cancelAppointment = cancelAppointment;
window.editAppointment = editAppointment;
window.deleteAppointment = deleteAppointment;
window.updateSafetyStatus = updateSafetyStatus;
window.removeTrustedContact = removeTrustedContact;

renderTrustedContacts();
renderPaymentAppointmentOptions();
