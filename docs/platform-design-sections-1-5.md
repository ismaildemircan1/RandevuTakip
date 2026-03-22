# Türkiye Odaklı Sağlık Randevu ve Güvenli Partner Web Platformu — Ürün Tasarımı (Bölüm 1–5)

## Bölüm 1 — Ürün Vizyonu

### Platformun kısa açıklaması
Bu platform, Türkiye'de kullanıcıların konum bazlı şekilde doktor ve klinik keşfi yapabildiği, uygun saatleri görebildiği, randevu planlayabildiği ve isterse seçili bir güvenilir kişiyle randevu koordinasyonunu kontrollü biçimde paylaşabildiği responsive bir web sağlık planlama platformudur. Ürün, tıbbi tavsiye değil; keşif, planlama, koordinasyon ve güvenli bilgilendirme sağlar.

### Hedef kullanıcı kitlesi
- Hızlı biçimde yakındaki uzman doktoru veya kliniği bulmak isteyen çalışan yetişkinler.
- Çocuğu için uygun branş ve saat arayan ebeveynler.
- Yaşlı aile bireylerinin sağlık randevularını organize eden yakınlar.
- Düzenli kontrol, takip veya periyodik muayene ihtiyacı olan kullanıcılar.
- Randevu günü yalnız gitmek istemeyen veya güvenli koordinasyon desteği arayan kişiler.

### Neden dikkat çekeceği
- Türkiye'de sağlık hizmeti arama deneyimini yalnızca “listeleme” seviyesinde bırakmaz; planlama ve koordinasyon adımını da sadeleştirir.
- Arama, filtreleme, müsait saat görüntüleme ve randevu akışını tek web deneyiminde birleştirir.
- “Sağlık partneri / randevu arkadaşı” özelliği ile özellikle hassas randevularda güvenli destek akışı sunar.
- Veri minimizasyonu ve kontrollü paylaşım yaklaşımı ile güven hissi yaratır.
- Mobil uygulama zorunluluğu olmadan, responsive web üzerinden hızlı erişim sağlar.

### Pazardaki farkı
Bu ürünün farkı, klasik doktor/klinik keşif platformlarını güvenli randevu koordinasyonu ile birleştirmesidir. Sadece “hangi doktor?” sorusunu değil, “randevuyu nasıl planlarım, nasıl takip ederim ve istersem seçili kişiyi nasıl kontrollü dahil ederim?” sorusunu da çözer. Türkiye odaklı şehir/ilçe/branş arama kurgusu, veri minimizasyonu, izin tabanlı paylaşım ve partner modu varsayılan kapalı yaklaşımı ürünün belirgin ayrıştırıcılarıdır.

### Tek cümlelik güçlü değer önerisi
**Yakınınızdaki doğru doktoru bulun, randevunuzu dakikalar içinde planlayın ve isterseniz sadece gerekli bilgileri seçtiğiniz güvenilir kişiyle güvenli biçimde paylaşın.**

### Landing page hero metni
**Başlık:** Türkiye'de doktor ve klinik randevusu bulmanın daha güvenli ve düzenli yolu.

**Alt başlık:** Konumunuza ve branş ihtiyacınıza göre uygun sağlık hizmetlerini keşfedin, müsait saatleri görün, randevunuzu planlayın ve isterseniz seçtiğiniz güvenilir kişiyle sadece gerekli detayları paylaşın.

**Birincil CTA:** Doktor veya klinik ara

**İkincil CTA:** Nasıl çalıştığını gör

**Güven etiketleri / microcopy:**
- Tıbbi tavsiye vermez
- Kontrollü bilgi paylaşımı
- Responsive ve hızlı web deneyimi
- Partner modu varsayılan kapalı

### Marka tonu ve ürün hissi
- **Ton:** sakin, açıklayıcı, güven veren, resmi ama soğuk olmayan.
- **Hissiyat:** temiz, modern, kurumsal, destekleyici, panik yaratmayan.
- **Yazım dili:** yalın Türkçe, tıbbi jargon yerine kullanıcı dostu dil.
- **Tasarım karakteri:** açık zemin, net tipografi, düşük bilişsel yük, belirgin CTA'lar, erişilebilir kontrast oranları.
- **Ürün hissi:** “hızlıca işimi hallederim, kontrol bendedir, platform beni yönlendirir ama aşırı müdahale etmez.”

---

## Bölüm 2 — Platformun Sınırları

### Bu platform ne yapar
- Doktor ve klinik keşfi sunar.
- Konuma, branşa ve filtrelere göre arama sağlar.
- Müsait slot veya örnek uygunluk bilgisi gösterir.
- Randevu oluşturma, görüntüleme, iptal ve yeniden planlama akışlarını sunar.
- Favori doktor kaydetme, yaklaşan randevu görüntüleme ve hatırlatma akışları sağlar.
- İsteğe bağlı olarak güvenilir kişi ekleme ve seçili randevuyu minimum veriyle paylaşma imkânı verir.
- Basit check-in durumlarıyla randevu günü koordinasyon desteği sağlar.

### Ne yapmaz
- Teşhis koymaz.
- Tedavi önermez.
- İlaç önerisinde bulunmaz.
- Acil durum yönlendirme merkezi gibi davranmaz.
- Kullanıcının sürekli canlı konum takibini varsayılan şekilde yapmaz.
- Partner kişiye tüm sağlık geçmişi veya tüm randevu geçmişi erişimi vermez.
- Klinik bilgi sisteminin tam yerine geçmez; MVP aşamasında planlama/koordinasyon katmanı olarak konumlanır.

### Tıbbi tavsiye vermez sınırı
Platformdaki arama, içerik, doktor kartları, branş açıklamaları ve yardım içerikleri yalnızca bilgilendirme ve navigasyon amaçlıdır. Ürün hiçbir akışta “şu semptom için şu doktora gitmelisin” seviyesinde tıbbi yönlendirme tavsiyesi üretmemelidir. Kullanıcıya semptom bazlı karar motoru, teşhis skoru veya tedavi planı sunulmamalıdır.

### Tanı / tedavi önerisi vermez sınırı
Doktor detay sayfası, uygunluk bilgisi ve randevu oluşturma akışı; uzmanlık alanı, lokasyon, müsaitlik ve operasyonel açıklamalarla sınırlı olmalıdır. Klinik karar destek sistemi, AI triage, reçete önerisi, tedavi karşılaştırması veya sonuç garantisi gibi özellikler kapsam dışıdır.

### Sağlık partneri özelliğinin sınırları
- Varsayılan olarak kapalıdır.
- Kullanıcı açıkça etkinleştirmeden hiçbir partner ilişkisi oluşturulmaz.
- Paylaşım randevu bazlı veya açık izinli sınırlı kapsamda olur.
- Partner kişi kullanıcı hesabı üzerinde işlem yapmaz; yalnızca izin verilen bilgileri görür.
- Partner modu acil durum izleme sistemi değildir.
- Partner, kullanıcı adına tıbbi karar verici olarak kurgulanmaz.

### Konum paylaşımının sınırları
- Varsayılan durumda konum paylaşımı yoktur.
- Kullanıcı yalnızca arama için yaklaşık konum kullanabilir veya manuel konum girebilir.
- Partner ile sürekli canlı konum yerine mümkünse durum bazlı paylaşım tercih edilir: “yoldayım”, “ulaştım”, “çıktım”.
- Eğer konum sinyali paylaşılacaksa bu, süreli, randevuya özel ve açık onaylı olmalıdır.

### Veri minimizasyonu ilkesi
- Randevu oluşturmak için gerekli olmayan veri toplanmamalıdır.
- Partner paylaşımında yalnızca randevu koordinasyonu için gerekli alanlar açılmalıdır.
- Arama geçmişi ve favoriler kullanıcıya yönetilebilir olmalıdır.
- Sağlık geçmişi, notlar veya ek belgeler MVP'de toplanmamalıdır.
- Log ve analitik katmanlarında kişisel sağlık bilgisi tutulmamalıdır.

### Kullanıcı izni mantığı
- Her hassas paylaşım aksiyonu açık kullanıcı onayı gerektirir.
- İzinler amaç bazlı ve anlaşılır metinlerle sunulmalıdır.
- Kullanıcı dilediğinde paylaşımı geri çekebilmelidir.
- Partner ekleme, randevu paylaşma ve bildirim izinleri birbirinden bağımsız olmalıdır.
- “Önceden işaretli kutu” yaklaşımı kullanılmamalıdır.

### Hassas veri görünürlüğü sınırı
- Partnere varsayılan olarak doktor uzmanlığı, tarih/saat, klinik adı ve gerekiyorsa genel buluşma koordinasyonu gösterilir.
- Detaylı sağlık nedeni, notlar, geçmiş randevular veya ödeme detayları paylaşılmaz.
- Bildirimlerde hassas bilgi minimum seviyede tutulur.
- Yönetim paneli ve destek ekranlarında veri erişimi rol bazlı ve maskeleme destekli olmalıdır.

---

## Bölüm 3 — Kullanıcı Persona'ları

### 1. Genç çalışan — “Ayşe, 29”
- **Hedef:** İş yoğunluğu arasında yakınındaki uygun saatli doktoru hızlıca bulmak.
- **Sorun:** Telefonla arayarak randevu ayarlamak zaman kaybettiriyor.
- **İhtiyaç:** Hızlı arama, akşam saatlerine uygun slotlar, favorilere ekleme, kısa booking akışı.
- **Platformdan beklediği değer:** 2–3 dakikada uygun seçenek bulup randevu oluşturmak.
- **Kullanım sıklığı:** Düşük-orta; ihtiyaç anında yoğun kullanım.
- **Risk ve hassasiyetler:** İşveren veya çevresiyle sağlık bilgisini paylaşmak istemez; bildirimlerin sade ve gizli olmasını ister.

### 2. Ebeveyn — “Mert, 37”
- **Hedef:** Çocuğu için doğru branşta, eve yakın ve saat olarak uygun kliniği bulmak.
- **Sorun:** Branş, çocuk uygunluğu ve saat koordinasyonunu tek yerde görememek.
- **İhtiyaç:** Konum filtreleme, branş seçimi, hızlı yeniden planlama, güvenilir kayıt yönetimi.
- **Platformdan beklediği değer:** Çocuğa uygun randevuyu minimum sürtünmeyle planlamak.
- **Kullanım sıklığı:** Orta; dönemsel sağlık ihtiyaçlarında artar.
- **Risk ve hassasiyetler:** Çocukla ilgili bilgilerin fazla görünür olmasını istemez; aile adına işlem yaparken net izin ve rol modeline ihtiyaç duyar.

### 3. Yaşlı yakını için işlem yapan kişi — “Selin, 44”
- **Hedef:** Annesi/babası adına uygun hastane, klinik veya doktor bulup randevuyu yönetmek.
- **Sorun:** Farklı kanallarda bilgi dağınık; randevu saatleri ve ulaşım koordinasyonu zor.
- **İhtiyaç:** Yaklaşan randevu görünümü, güvenilir kişi koordinasyonu, yeniden planlama, açık adres bilgisi.
- **Platformdan beklediği değer:** Randevu gününü tek panelden takip etmek ve gerektiğinde başka bir aile bireyiyle paylaşmak.
- **Kullanım sıklığı:** Orta-yüksek.
- **Risk ve hassasiyetler:** Yaşlı bireyin mahremiyetini ihlal etmeden destek olmak ister; yanlış kişiyle bilgi paylaşımı en büyük kaygıdır.

### 4. Düzenli kontrol yaptıran kullanıcı — “Emre, 41”
- **Hedef:** Düzenli kontrollerini aksatmadan aynı veya benzer uzmanlarla planlı şekilde yürütmek.
- **Sorun:** Aynı doktoru tekrar bulmak, eski aramaları ve favorileri yönetmek zaman alıyor.
- **İhtiyaç:** Favoriler, arama geçmişi, yaklaşan randevular, tekrar rezervasyon kolaylığı.
- **Platformdan beklediği değer:** Tekrarlayan randevular için sürtünmesiz planlama akışı.
- **Kullanım sıklığı:** Düzenli ve öngörülebilir.
- **Risk ve hassasiyetler:** Sürekli sağlık etkileşimi nedeniyle geçmişinin gereksiz görünür olmasını istemez; bildirim kontrolü önemlidir.

### 5. Yalnız yaşayan kullanıcı — “Deniz, 33”
- **Hedef:** Gerekirse bir güvenilir kişiyle randevu koordinasyonunu paylaşmak ama kontrolü elinde tutmak.
- **Sorun:** Hastane/klinik ziyaretlerinde yalnız hissetmek ve gecikme durumunda haber verememek.
- **İhtiyaç:** Güvenli partner modu, tek seferlik paylaşım, check-in durumları, minimum veri paylaşımı.
- **Platformdan beklediği değer:** Kendi mahremiyetini koruyarak destek alabilmek.
- **Kullanım sıklığı:** Düşük-orta fakat yüksek güven beklentili.
- **Risk ve hassasiyetler:** Partner özelliğinin kötüye kullanılması, kalıcı erişim verilmesi veya konumun gereğinden fazla paylaşılması.

---

## Bölüm 4 — Kullanıcı Senaryoları

Aşağıdaki akışlar MVP odağında fakat üretime yakın state ve hata mantığıyla tasarlanmıştır.

### 1. Kullanıcı siteye ilk kez gelir
- **Kullanıcı hedefi:** Platformun ne sunduğunu anlamak ve aramaya hızlı başlamak.
- **Sayfa geçişleri:** `LandingPage` → isteğe bağlı `RegisterPage` / `HomePage` / `SearchResultsPage`.
- **State değişimleri:** `visitorSession` oluşturulur, cookie consent veya temel preference state'i yüklenir, lokasyon izni henüz verilmemiştir.
- **Hata senaryoları:** Landing içerikleri yüklenemezse skeleton + retry; kişiselleştirme servisleri başarısızsa generic deneyim gösterilir.
- **Boş veri senaryoları:** Şehir bazlı popüler kategoriler yoksa statik branş kartları gösterilir.
- **Teknik notlar:** Landing SSR veya statik render ile hızlı açılmalı; CTA'lar auth zorunlu olmayan keşif akışına bağlanmalıdır.

### 2. Konum seçer veya manuel konum girer
- **Kullanıcı hedefi:** Yakın sonuçları görmek.
- **Sayfa geçişleri:** `HomePage` üzerinde modal/sheet → `SearchResultsPage`.
- **State değişimleri:** `locationMode = gps | manual`, `selectedCity`, `selectedDistrict`, `coordinates`, `locationPermissionStatus` güncellenir.
- **Hata senaryoları:** GPS reddedildi, tarayıcı desteklemiyor, geocoding başarısız, şehir-ilçe eşleşmesi bulunamadı.
- **Boş veri senaryoları:** Kullanıcı konum girmezse varsayılan şehir seçimi ve manuel giriş teşviki sunulur.
- **Teknik notlar:** Hassas koordinat saklama zorunlu değil; yaklaşık koordinat veya geohash yeterli olabilir.

### 3. Branş arar
- **Kullanıcı hedefi:** İlgili uzmanlık alanındaki doktorları/klinikleri bulmak.
- **Sayfa geçişleri:** `HomePage` → `SearchResultsPage`.
- **State değişimleri:** `searchQuery`, `selectedSpecialty`, `searchSessionId`, analytics event.
- **Hata senaryoları:** Geçersiz branş slug'ı, arama servisi timeout, filtre parametresi parse hatası.
- **Boş veri senaryoları:** Sonuç yoksa yakın branş önerileri ve filtre temizleme CTA'sı.
- **Teknik notlar:** Branş listesi canonical taxonomy ile yönetilmeli; URL query param üzerinden paylaşılabilir olmalı.

### 4. Filtre uygular
- **Kullanıcı hedefi:** Sonuçları mesafe, müsaitlik, klinik tipi veya ücret aralığı gibi kriterlerle daraltmak.
- **Sayfa geçişleri:** Aynı sayfada filtre paneli veya drawer.
- **State değişimleri:** URL query params güncellenir, local filter state debounced şekilde sync edilir, sonuç sorgusu invalidation alır.
- **Hata senaryoları:** Geçersiz parametre kombinasyonu, backend filtre limitine takılma.
- **Boş veri senaryoları:** Tüm filtreler sonucu sıfırlarsa “filtreleri gevşet” önerisi.
- **Teknik notlar:** Filtre state'i shareable URL olmalı; SSR başlangıç yükü + client refinements kombinasyonu uygun olur.

### 5. Haritada sonuçları görüntüler
- **Kullanıcı hedefi:** Doktor/klinikleri coğrafi yakınlığa göre anlamak.
- **Sayfa geçişleri:** `SearchResultsPage` ↔ `MapExplorePage` veya split view.
- **State değişimleri:** `mapViewport`, `selectedPinId`, `visibleBounds`, `listHoveredItemId`.
- **Hata senaryoları:** Map SDK yüklenmedi, API key sınırı, rate limit, viewport verisi bozuldu.
- **Boş veri senaryoları:** Haritada görünür alanda sonuç yoksa daha geniş alan önerisi.
- **Teknik notlar:** Çok sayıda sonuçta clustering gerekir; map state URL'de kısmen tutulabilir ama aşırı detay tutulmamalıdır.

### 6. Doktor detayına gider
- **Kullanıcı hedefi:** Doktorun uzmanlığını, klinik bilgisini ve uygunluk özetini görmek.
- **Sayfa geçişleri:** `SearchResultsPage` / `MapExplorePage` → `DoctorDetailPage`.
- **State değişimleri:** `selectedDoctorId`, detail fetch lifecycle, favorite state hydrate edilir.
- **Hata senaryoları:** Doktor kaydı kaldırılmış, slug değişmiş, availability servisi kısmi hata veriyor.
- **Boş veri senaryoları:** Detay var ama yakın slot yoksa ilk uygun gün önerisi ve benzer doktorlar.
- **Teknik notlar:** SEO için doktor detay sayfaları SSR edilmeli; hassas veriden arındırılmış schema markup düşünülebilir.

### 7. Uygun saat seçer
- **Kullanıcı hedefi:** Uygun bir tarih ve slot belirlemek.
- **Sayfa geçişleri:** `DoctorDetailPage` → `AvailabilityPage` veya inline widget.
- **State değişimleri:** `selectedDate`, `selectedSlot`, `slotHoldState = idle | holding | held | expired`.
- **Hata senaryoları:** Slot bu sırada doldu, takvim servisi cevap vermedi, timezone parse hatası.
- **Boş veri senaryoları:** Seçili gün boşsa sonraki müsait günler önerilir.
- **Teknik notlar:** Görüntüleme ile rezervasyon ayrı düşünülmeli; kesin ayırma booking confirmation aşamasında yapılmalı.

### 8. Randevu oluşturur
- **Kullanıcı hedefi:** Seçilen slotu kendi hesabına kaydetmek.
- **Sayfa geçişleri:** `AvailabilityPage` → `BookingPage` → `BookingConfirmationPage`.
- **State değişimleri:** form validation, slot recheck, booking request, success/failure states, reminder schedule job creation.
- **Hata senaryoları:** Oturum süresi doldu, slot hold süresi bitti, backend validation failed.
- **Boş veri senaryoları:** Gerekli profil bilgisi eksikse minimal profil tamamlama akışı açılır.
- **Teknik notlar:** Booking işlemi idempotent olmalı; `bookingIntentId` gibi bir izleme anahtarı kullanılabilir.

### 9. Randevuyu iptal eder / yeniden planlar
- **Kullanıcı hedefi:** Plan değişikliğini hızlıca yönetmek.
- **Sayfa geçişleri:** `MyAppointmentsPage` → `AppointmentDetailPage` → `AvailabilityPage` / iptal modalı.
- **State değişimleri:** `appointmentStatus`, audit event, notification job update/cancel.
- **Hata senaryoları:** Klinik iptal penceresi dolmuş, randevu zaten iptal edilmiş, reschedule slot unavailable.
- **Boş veri senaryoları:** Uygun yeniden planlama slotu yoksa bekleme listesi benzeri “daha sonra tekrar dene” mesajı.
- **Teknik notlar:** İptal ve yeniden planlama kuralları provider bazında değişebilir; rule engine katmanı ileride eklenebilir.

### 10. Favoriye ekler
- **Kullanıcı hedefi:** Aynı doktoru tekrar kolay bulmak.
- **Sayfa geçişleri:** Doktor kartı veya detay sayfası üzerinde inline aksiyon.
- **State değişimleri:** optimistic update ile favorite toggle, background sync.
- **Hata senaryoları:** Kullanıcı giriş yapmamış, favori limiti, duplicate insert.
- **Boş veri senaryoları:** Favoriler boşsa önerilen uzmanlar listelenir.
- **Teknik notlar:** Favorite toggle lightweight API olmalı; optimistic UI faydalıdır.

### 11. Yaklaşan randevu bildirimi alır
- **Kullanıcı hedefi:** Randevuyu kaçırmamak.
- **Sayfa geçişleri:** Sayfa dışı email/SMS/browser notification → `AppointmentDetailPage`.
- **State değişimleri:** `notificationSent`, `delivered`, `read` gibi event state'leri opsiyonel izlenir.
- **Hata senaryoları:** Provider teslim edemedi, kullanıcı ilgili kanalı kapattı.
- **Boş veri senaryoları:** Tercih yoksa sadece uygulama içi pasif hatırlatma gösterilir.
- **Teknik notlar:** Bildirim içeriği hassas olmayan minimum veri içermeli.

### 12. Sağlık partneri ekler
- **Kullanıcı hedefi:** Güvenilir bir kişiyi gerektiğinde paylaşım için hazırlamak.
- **Sayfa geçişleri:** `ProfilePage` / `PartnerModePage` → `TrustedContactsPage` → ekleme modalı.
- **State değişimleri:** `partnerModeEnabled`, `trustedContacts[]`, verification/request state.
- **Hata senaryoları:** Geçersiz e-posta/telefon, aynı kişi tekrar eklendi, doğrulama linki süresi doldu.
- **Boş veri senaryoları:** Kayıtlı kişi yoksa eğitimsel açıklama ve “Partner modu varsayılan kapalıdır” vurgusu.
- **Teknik notlar:** Trusted contact eklemek ile erişim vermek ayrılmalıdır.

### 13. Randevu bilgisini paylaşır
- **Kullanıcı hedefi:** Belirli bir randevu için destek kişisine sınırlı bilgi iletmek.
- **Sayfa geçişleri:** `AppointmentDetailPage` → `ShareAppointmentPage`.
- **State değişimleri:** `selectedTrustedContactId`, `shareScope`, `shareExpiry`, consent checkbox.
- **Hata senaryoları:** Partner doğrulanmamış, paylaşım kaydı oluşturulamadı, bildirim gönderilemedi.
- **Boş veri senaryoları:** Kayıtlı güvenilir kişi yoksa önce ekleme akışına yönlendirme.
- **Teknik notlar:** Randevu paylaşımı explicit consent log'u üretmelidir.

### 14. Check-in akışını kullanır
- **Kullanıcı hedefi:** Randevu günü durum bilgisini hızlıca iletmek.
- **Sayfa geçişleri:** `AppointmentDetailPage` → `SafetyCheckInPage`.
- **State değişimleri:** `safetyStatus = on_the_way | arrived | checked_out`, timestamp, optional note.
- **Hata senaryoları:** Ağ kesildi, state update başarısız, paylaşım izni artık aktif değil.
- **Boş veri senaryoları:** Partner paylaşımı yoksa durum sadece kullanıcı panelinde tutulur veya paylaşım önerilmez.
- **Teknik notlar:** Bu akış hafif, tek tık ve mobil web'de kolay kullanılabilir olmalıdır.

### 15. Giriş yapmadan gezinen kullanıcı akışı
- **Kullanıcı hedefi:** Ürünü denemek ve seçenekleri görmek.
- **Sayfa geçişleri:** `LandingPage` → `HomePage` → `SearchResultsPage` → `DoctorDetailPage`.
- **State değişimleri:** anonim arama session'ı, ephemeral preferences.
- **Hata senaryoları:** Rate limit, guest search kota limiti.
- **Boş veri senaryoları:** Sonuç azsa öneri kartları.
- **Teknik notlar:** Booking, favori ve partner modunda auth gate gerekir; keşif mümkün olduğunca açık tutulabilir.

### 16. İnternet veya backend sorunu olduğunda akış
- **Kullanıcı hedefi:** Ne olduğunu anlamak ve mümkünse işlemi tekrar denemek.
- **Sayfa geçişleri:** Aynı sayfada inline error, toast, fallback card veya global error boundary.
- **State değişimleri:** `requestState = error`, retry token, stale cached data fallback.
- **Hata senaryoları:** 5xx, timeout, offline, partial API failure.
- **Boş veri senaryoları:** Canlı veri gelmezse son bilinen güvenli veri veya boş durum mesajı.
- **Teknik notlar:** Search ve detail için cache fallback mümkündür; booking işlemi için asla varsayımsal başarı gösterilmemelidir.

---

## Bölüm 5 — Sayfa ve UX Yapısı

### LandingPage
- **Amacı:** Güven vermek, ürün değerini anlatmak ve kullanıcıyı arama akışına sokmak.
- **Bileşenleri:** Hero, arama kısa yolu, popüler branş kartları, nasıl çalışır bölümü, partner modu açıklaması, güvenlik/mahremiyet bölümü, SSS teaser, footer.
- **Kullanıcı aksiyonları:** Arama başlat, konum seç, kayıt ol, giriş yap, nasıl çalışır incele.
- **Loading / error / empty state:** Statik/SSR olduğu için minimal loading; kişiselleştirilmiş şehir önerisi gelmezse generic içerik.
- **Responsive davranışı:** Desktop'ta iki kolon hero, mobilde tek kolon ve sticky CTA.
- **Erişilebilirlik notları:** Klavye ile erişilebilir CTA, yeterli kontrast, heading hiyerarşisi.
- **SEO notu:** Kritik SEO sayfasıdır; title, meta description, open graph, structured content gerekir.

### LoginPage
- **Amacı:** Güvenli kullanıcı girişi sağlamak.
- **Bileşenleri:** Email/password formu, magic link opsiyonu (ileride), şifre göster/gizle, forgot password linki, güven mesajları.
- **Kullanıcı aksiyonları:** Giriş yap, şifre sıfırla, kayıt sayfasına git.
- **Loading / error / empty state:** Submit loading, yanlış kimlik bilgisi hatası, rate limit mesajı.
- **Responsive davranışı:** Ortalanmış kart; mobilde tam genişlik ve kolay dokunma alanı.
- **Erişilebilirlik notları:** Input-label ilişkisi, hata mesajı `aria-live`, klavye focus ring.
- **SEO notu:** Indexlenmesi gerekmez; `noindex` önerilir.

### RegisterPage
- **Amacı:** Yeni kullanıcı oluşturmak ve ilk güven ilişkisini kurmak.
- **Bileşenleri:** Kayıt formu, KVKK/gizlilik onayı metni, email doğrulama bilgisi, minimal profil alanları.
- **Kullanıcı aksiyonları:** Hesap oluştur, giriş sayfasına dön.
- **Loading / error / empty state:** E-posta kullanımda, zayıf parola, rate limit hataları.
- **Responsive davranışı:** Mobil öncelikli form düzeni.
- **Erişilebilirlik notları:** Form hata özetleri, parola gereksinimlerinin metinsel anlatımı.
- **SEO notu:** `noindex`.

### OnboardingPage
- **Amacı:** Kullanıcıdan minimum gerekli tercihleri alıp arama deneyimini kişiselleştirmek.
- **Bileşenleri:** Şehir seçimi, branş ilgi alanları (opsiyonel), bildirim tercihleri, partner modu bilgilendirmesi.
- **Kullanıcı aksiyonları:** Konum seç, tercihlerimi kaydet, sonra yap.
- **Loading / error / empty state:** Konum API hatası, skip imkânı.
- **Responsive davranışı:** Stepper desktop'ta yatay, mobilde dikey.
- **Erişilebilirlik notları:** Step ilerlemesi screen reader ile anlaşılır olmalı.
- **SEO notu:** `noindex`.

### HomePage
- **Amacı:** Aramayı başlatmak için merkezi dashboard benzeri giriş sunmak.
- **Bileşenleri:** Arama çubuğu, branş quick chips, konum seçici, yakın randevular kartı, favori doktor kısa listesi.
- **Kullanıcı aksiyonları:** Branş ara, konum değiştir, yaklaşan randevuya git.
- **Loading / error / empty state:** Kullanıcı verileri yüklenirken skeleton; yaklaşan randevu yoksa empty card.
- **Responsive davranışı:** Desktop'ta grid dashboard, mobilde dikey kart akışı.
- **Erişilebilirlik notları:** Arama inputu ve filtre chip'leri klavyeyle yönetilebilir.
- **SEO notu:** Auth'lu kişisel sayfa olduğu için `noindex`.

### SearchResultsPage
- **Amacı:** Liste bazlı arama sonuçlarını sunmak.
- **Bileşenleri:** Filtre paneli, sonuç listesi, sıralama dropdown, harita toggle, aktif filtre etiketleri.
- **Kullanıcı aksiyonları:** Filtre uygula, sırala, detaya git, favoriye ekle.
- **Loading / error / empty state:** Results skeleton, sonuç bulunamadı kartı, filtre temizle CTA.
- **Responsive davranışı:** Desktop'ta yan panel + liste; mobilde filtre drawer.
- **Erişilebilirlik notları:** Sonuç sayısı `aria-live` ile duyurulabilir.
- **SEO notu:** Public arama sayfaları için kontrollü index stratejisi; aşırı kombinasyonlar canonical ile sınırlandırılmalı.

### MapExplorePage
- **Amacı:** Sonuçları harita üzerinden görsel olarak keşfetmek.
- **Bileşenleri:** Harita canvas, sonuç alt kartı, pin tooltip, görünür alanda ara butonu.
- **Kullanıcı aksiyonları:** Pin seç, viewport değiştir, listeye dön.
- **Loading / error / empty state:** Harita yüklenemezse liste fallback; görünür alan boşsa mesaj.
- **Responsive davranışı:** Desktop split view; mobil tam ekran harita + bottom sheet.
- **Erişilebilirlik notları:** Harita dışı alternatif liste erişimi her zaman sunulmalı.
- **SEO notu:** Harita görünümü kendi başına SEO odaklı değildir.

### DoctorDetailPage
- **Amacı:** Doktorun profilini ve randevuya uygunluğunu anlatmak.
- **Bileşenleri:** Profil özeti, branş etiketi, klinik bilgisi, kısa bio, uygunluk önizlemesi, favori butonu, güven açıklaması.
- **Kullanıcı aksiyonları:** Slot gör, favoriye ekle, kliniğe git.
- **Loading / error / empty state:** Skeleton, 404, uygun saat yok kartı.
- **Responsive davranışı:** Desktop'ta sticky booking card; mobilde sabit alt CTA.
- **Erişilebilirlik notları:** CTA'lar büyük dokunma alanına sahip olmalı.
- **SEO notu:** Önemli landing sayfası olabilir; metadata ve structured data dikkatli kullanılmalı.

### ClinicDetailPage
- **Amacı:** Kliniğin lokasyonunu, hizmet alanlarını ve ilişkili doktorları göstermek.
- **Bileşenleri:** Klinik header, adres/ulaşım, harita mini görünüm, branşlar, doktor listesi.
- **Kullanıcı aksiyonları:** İlişkili doktoru görüntüle, haritada aç.
- **Loading / error / empty state:** Klinik bulunamadı, doktor listesi boş.
- **Responsive davranışı:** Mobilde harita özet ve doktor kartları alt alta.
- **Erişilebilirlik notları:** Adres kopyalama ve yol tarifi linkleri erişilebilir olmalı.
- **SEO notu:** Yerel SEO için önemli olabilir.

### AvailabilityPage
- **Amacı:** Uygun tarih/saatleri net şekilde sunmak.
- **Bileşenleri:** Tarih seçici, slot grid'i, timezone notu, yeniden yükle butonu.
- **Kullanıcı aksiyonları:** Tarih değiştir, slot seç, booking'e ilerle.
- **Loading / error / empty state:** Slot skeleton, “uygun saat yok”, stale data uyarısı.
- **Responsive davranışı:** Mobilde yatay tarih şeridi + alt alta slot butonları.
- **Erişilebilirlik notları:** Seçili slot durumları screen reader dostu olmalı.
- **SEO notu:** `noindex` tercih edilebilir.

### BookingPage
- **Amacı:** Randevuyu doğrulamak ve oluşturmak.
- **Bileşenleri:** Booking summary, minimal form, gizlilik notu, partner paylaşımını daha sonra yap seçeneği.
- **Kullanıcı aksiyonları:** Onayla, geri dön, bilgileri güncelle.
- **Loading / error / empty state:** Submit pending, slot expired, validation hatası.
- **Responsive davranışı:** Tek kolon checkout benzeri akış.
- **Erişilebilirlik notları:** Form hata özeti ve submit durumları duyurulmalı.
- **SEO notu:** `noindex`.

### BookingConfirmationPage
- **Amacı:** Başarı durumunu teyit etmek ve sonraki adımları göstermek.
- **Bileşenleri:** Başarı mesajı, randevu özeti, takvime ekle (ileri sürüm), paylaşım CTA'sı, randevularım linki.
- **Kullanıcı aksiyonları:** Randevuya git, partnerle paylaş, ana sayfaya dön.
- **Loading / error / empty state:** Booking status doğrulama sırasında loading.
- **Responsive davranışı:** Mobilde tek kart, net aksiyon butonları.
- **Erişilebilirlik notları:** Başarı mesajı `role=status` ile duyurulabilir.
- **SEO notu:** `noindex`.

### MyAppointmentsPage
- **Amacı:** Tüm randevuları listelemek.
- **Bileşenleri:** Yaklaşan/geçmiş sekmeleri, appointment cards, filtreler.
- **Kullanıcı aksiyonları:** Detaya git, iptal et, yeniden planla.
- **Loading / error / empty state:** Liste skeleton, boş durum illüstrasyonu.
- **Responsive davranışı:** Mobilde kart listesi; desktop'ta sekmeli panel.
- **Erişilebilirlik notları:** Sekmeler erişilebilir olmalı.
- **SEO notu:** `noindex`.

### AppointmentDetailPage
- **Amacı:** Seçili randevunun operasyonel detaylarını göstermek.
- **Bileşenleri:** Tarih-saat, klinik adresi, durum etiketi, iptal/reschedule butonları, partner paylaşım özeti.
- **Kullanıcı aksiyonları:** Paylaş, check-in yap, iptal et.
- **Loading / error / empty state:** Bulunamadı, yetki yok hatası.
- **Responsive davranışı:** Mobilde aksiyonlar sticky bottom bar olabilir.
- **Erişilebilirlik notları:** Durum değişimleri açık metinle sunulmalı.
- **SEO notu:** `noindex`.

### FavoritesPage
- **Amacı:** Kaydedilen doktorları listelemek.
- **Bileşenleri:** Favori kartları, quick booking CTA, boş durum önerileri.
- **Kullanıcı aksiyonları:** Favoriden çıkar, doktor detayına git.
- **Loading / error / empty state:** Boş favori ekranı çok önemlidir.
- **Responsive davranışı:** Grid → mobilde kart listesi.
- **Erişilebilirlik notları:** Favori toggle açıklayıcı label içermeli.
- **SEO notu:** `noindex`.

### PartnerModePage
- **Amacı:** Partner modunun ne olduğunu açıklamak ve kontrollü etkinleştirme sağlamak.
- **Bileşenleri:** Bilgilendirme modülü, güvenlik ilkeleri, enable switch, ilgili ayar linkleri.
- **Kullanıcı aksiyonları:** Partner modunu aç/kapat, trusted contacts sayfasına git.
- **Loading / error / empty state:** Varsayılan kapalı empty education state.
- **Responsive davranışı:** Bilgi kartları mobilde alt alta.
- **Erişilebilirlik notları:** Toggle tek başına değil açıklama metniyle sunulmalı.
- **SEO notu:** `noindex`.

### TrustedContactsPage
- **Amacı:** Güvenilir kişileri yönetmek.
- **Bileşenleri:** Contact list, add form/modal, verification status badge, remove action.
- **Kullanıcı aksiyonları:** Kişi ekle, doğrulama tekrar gönder, sil.
- **Loading / error / empty state:** Henüz kişi yok ekranı; verification pending state.
- **Responsive davranışı:** Mobilde kart tabanlı yönetim.
- **Erişilebilirlik notları:** Her aksiyonun sonucu `aria-live` ile iletilebilir.
- **SEO notu:** `noindex`.

### ShareAppointmentPage
- **Amacı:** Randevu bazlı, minimum veriyle paylaşım oluşturmak.
- **Bileşenleri:** Share scope seçenekleri, contact selector, expiry selector, consent checkbox, preview panel.
- **Kullanıcı aksiyonları:** Paylaşımı onayla, scope değiştir, vazgeç.
- **Loading / error / empty state:** Kişi yoksa trusted contacts yönlendirmesi.
- **Responsive davranışı:** Mobilde adım adım sade form akışı.
- **Erişilebilirlik notları:** Paylaşım kapsamı net metinlerle açıklanmalı.
- **SEO notu:** `noindex`.

### SafetyCheckInPage
- **Amacı:** Hızlı durum güncellemesi sunmak.
- **Bileşenleri:** Durum butonları, son durum zaman damgası, opsiyonel kısa not alanı.
- **Kullanıcı aksiyonları:** Yoldayım, ulaştım, çıktım bildir.
- **Loading / error / empty state:** Offline ise local pending state + tekrar dene.
- **Responsive davranışı:** Büyük, thumb-friendly butonlar.
- **Erişilebilirlik notları:** Renk tek ayırt edici unsur olmamalı; ikon + metin kullanılmalı.
- **SEO notu:** `noindex`.

### NotificationsPage
- **Amacı:** Bildirim tercihlerini yönetmek.
- **Bileşenleri:** Email/SMS/browser toggles, randevu hatırlatma seçenekleri, sessize alma zaman aralığı.
- **Kullanıcı aksiyonları:** Kanal aç/kapat, zaman seç, test bildirimi gönder.
- **Loading / error / empty state:** Browser permission reddi açıklaması.
- **Responsive davranışı:** Form listesi mobilde dikey akmalı.
- **Erişilebilirlik notları:** Toggle + açıklama eşleşmesi önemli.
- **SEO notu:** `noindex`.

### ProfilePage
- **Amacı:** Kullanıcı profilinin minimum yönetimini sağlamak.
- **Bileşenleri:** Temel hesap bilgileri, konum tercihleri, favoriler özeti, partner durumu.
- **Kullanıcı aksiyonları:** Profil güncelle, ayarlara git.
- **Loading / error / empty state:** Veri yüklenmezse retry.
- **Responsive davranışı:** Mobilde basit section listesi.
- **Erişilebilirlik notları:** Düzenlenebilir ve salt okunur alanlar net ayrılmalı.
- **SEO notu:** `noindex`.

### SettingsPage
- **Amacı:** Güvenlik, gizlilik ve hesap ayarlarını yönetmek.
- **Bileşenleri:** Oturumlar, parola, veri izinleri, paylaşım kayıtları, hesap kapatma.
- **Kullanıcı aksiyonları:** Şifre değiştir, izinleri geri çek, hesabı devre dışı bırak.
- **Loading / error / empty state:** Hassas işlemlerde re-auth isteği.
- **Responsive davranışı:** Accordion tabanlı mobil deneyim uygun olur.
- **Erişilebilirlik notları:** Tehlikeli aksiyonlar çift onaylı olmalı.
- **SEO notu:** `noindex`.

### HelpPage
- **Amacı:** Kullanıcı destek içerikleri ve SSS sunmak.
- **Bileşenleri:** FAQ accordion, arama, iletişim formu, kriz/acil durum uyarı notu.
- **Kullanıcı aksiyonları:** SSS incele, destek talebi oluştur.
- **Loading / error / empty state:** İçerik yüklenemezse fallback iletişim bilgisi.
- **Responsive davranışı:** Mobilde accordion first yaklaşım.
- **Erişilebilirlik notları:** SSS yapısı semantik button/region ile kurulmalı.
- **SEO notu:** Public destek içeriği olduğu için indexlenebilir; ancak sağlık tavsiyesi algısı oluşturmayacak net sınırlara sahip olmalı.
