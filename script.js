
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
  
  auth.onAuthStateChanged(user => {
      const authSection = document.getElementById('authSection');
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
  
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
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
  
  document.getElementById('registerForm').addEventListener('submit', async function(e) {
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
  
  document.getElementById('toggleAuth').addEventListener('click', function(e) {
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
  
  document.getElementById('logoutButton').addEventListener('click', async function() {
      try {
          await auth.signOut();
      } catch (error) {
          alert('Çıkış hatası: ' + error.message);
      }
  });
  
  document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const patientName = document.getElementById('patientName').value;
      let patientPhone = document.getElementById('patientPhone').value;
      const patientAddress = document.getElementById('patientAddress').value;
      const appointmentTime = document.getElementById('appointmentTime').value;
  
      if (!patientPhone.startsWith('+')) {
          patientPhone = `+${patientPhone.replace(/^0/, '')}`;
      }
  
      const appointment = {
          id: Date.now(),
          patientName,
          patientPhone,
          patientAddress,
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
                  appointmentIds: [appointment.id]
              });
          } else {
              await patientRef.update({
                  name: patientName,
                  address: patientAddress || patientDoc.data().address,
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
  
  document.getElementById('paymentForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const cardNumber = document.getElementById('cardNumber').value;
      const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);
  
      try {
          const response = await fetch('http://localhost:3000/create-payment-intent', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: paymentAmount * 100, cardNumber })
          });
          const data = await response.json();
          if (data.success) {
              alert('Ödeme alındı! (Demo: Kart ' + cardNumber + ', Tutar: ' + paymentAmount + ' TL)');
              const lastAppointment = appointments[appointments.length - 1];
              if (lastAppointment) {
                  await db.collection('appointments').doc(lastAppointment.id.toString()).update({
                      paymentStatus: 'paid',
                      paymentAmount: paymentAmount
                  });
                  renderAppointments();
              }
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
  
          appointments.forEach(apt => {
              const div = document.createElement('div');
              div.className = 'appointment-item';
              div.innerHTML = `
                  <p><strong>Hasta:</strong> ${apt.patientName}</p>
                  <p><strong>Telefon:</strong> ${apt.patientPhone}</p>
                  <p><strong>Adres:</strong> ${apt.patientAddress || 'Belirtilmemiş'}</p>
                  <p><strong>Zaman:</strong> ${new Date(apt.appointmentTime).toLocaleString('tr-TR')}</p>
                  <p><strong>Durum:</strong> ${apt.status === 'confirmed' ? 'Onaylandı' : 'İptal Edildi'}</p>
                  <p><strong>Ödeme:</strong> ${apt.paymentStatus === 'paid' ? `Ödendi (${apt.paymentAmount} TL)` : 'Bekliyor'}</p>
                  <button class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2" onclick="editAppointment(${apt.id})">Düzenle</button>
                  <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2" onclick="cancelAppointment(${apt.id})">İptal Et</button>
                  <button class="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800" onclick="deleteAppointment(${apt.id})">Sil</button>
              `;
              list.appendChild(div);
          });
  
          checkReminders();
      } catch (error) {
          alert('Hata: ' + error.message);
      }
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
              const appointments = [];
              const snapshot = await db.collection('appointments').where('patientPhone', '==', phone).get();
              snapshot.forEach(doc => {
                  appointments.push(doc.data());
              });
  
              let appointmentDetails = appointments.map(apt => `
                  <p>Zaman: ${new Date(apt.appointmentTime).toLocaleString('tr-TR')}, 
                     Durum: ${apt.status === 'confirmed' ? 'Onaylandı' : 'İptal Edildi'}, 
                     Ödeme: ${apt.paymentStatus === 'paid' ? `Ödendi (${apt.paymentAmount} TL)` : 'Bekliyor'}</p>
              `).join('');
  
              alert(`
                  Hasta Kayıt Kartı:
                  Ad: ${patient.name}
                  Telefon: ${patient.phone}
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
  
  let searchTimeout;
  document.getElementById('patientSearch').addEventListener('input', function(e) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
          const searchTerm = e.target.value.toLowerCase();
          const list = document.getElementById('patientList');
          list.innerHTML = '';
          patients = [];

          try {
              // ⚡ Bolt: Debouncing search prevents fetching all patients from DB on every keystroke, reducing DB reads and UI blocking
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
                      <p><strong>Randevular:</strong> ${patient.appointmentIds.length} adet</p>
                      <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onclick="viewPatientDetails('${patient.phone}')">Detayları Gör</button>
                  `;
                  list.appendChild(div);
              });
          } catch (error) {
              alert('Hata: ' + error.message);
          }
      }, 300);
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
          document.getElementById('editPatientAddress').value = apt.patientAddress || '';
          const date = new Date(apt.appointmentTime);
          const formattedDate = date.toISOString().slice(0, 16);
          document.getElementById('editAppointmentTime').value = formattedDate;
      }
  }
  
  document.getElementById('editAppointmentForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const id = document.getElementById('editAppointmentId').value;
      const patientName = document.getElementById('editPatientName').value;
      let patientPhone = document.getElementById('editPatientPhone').value;
      const patientAddress = document.getElementById('editPatientAddress').value;
      const appointmentTime = document.getElementById('editAppointmentTime').value;
  
      if (!patientPhone.startsWith('+')) {
          patientPhone = `+${patientPhone.replace(/^0/, '')}`;
      }
  
      const updatedAppointment = {
          id: parseInt(id),
          patientName,
          patientPhone,
          patientAddress,
          appointmentTime,
          status: 'confirmed',
          paymentStatus: appointments.find(a => a.id === parseInt(id)).paymentStatus,
          paymentAmount: appointments.find(a => a.id === parseInt(id)).paymentAmount
      };
  
      try {
          const patientRef = db.collection('patients').doc(patientPhone);
          const patientDoc = await patientRef.get();
          if (patientDoc.exists) {
              await patientRef.update({
                  name: patientName,
                  address: patientAddress || patientDoc.data().address
              });
          } else {
              await patientRef.set({
                  name: patientName,
                  phone: patientPhone,
                  address: patientAddress || '',
                  appointmentIds: [parseInt(id)]
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
  
  document.getElementById('cancelEdit').addEventListener('click', function() {
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