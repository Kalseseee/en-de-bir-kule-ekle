# Sen de Bir Kule Ekle — v13 / Dünya Mimarları

Klasik ortak kule oyunu + ayrı WORLD BUILDERS modu. Ek paket veya internetten kütüphane indirme gerekmez.

## Çalıştırma

Node.js 22+ kurulu olsun. ZIP'i çıkarıp BASLAT.cmd dosyasını aç. Doğru adres tarayıcıda otomatik açılır; 3000 doluysa boş port seçilir. Sunucu penceresi açık kalmalı. Alternatif: `node server.mjs`.

Güncellemede eski sunucuyu kapat. Koleksiyonu korumak için mevcut `data` klasörünü sakla ve yeni sürümde de aynı klasörü kullan. Mimar kimliği tarayıcıda, kayıtlar sunucunun data/architects.json dosyasında saklanır. Aynı tarayıcı ve adresi kullan. Tarayıcı verilerini silmek veya farklı port/origine geçmek kayıtlı kimliğe erişimi kaybettirebilir; bu sürümde hesap girişi ve cihazlar arası kimlik taşıma yoktur.

## Klasik mod

Ana menüde Oda oluştur veya Tek başına dene kullan. Klasik odalar 2–6 kişi destekler. Mevcut sıra, skor, Space ile bırakma ve taşan parçanın kesilmesi korunur.

- Space / oyun alanına dokunma: Bloğu bırak.
- R: Ortak turu yeniden başlatır; oda ve sohbet korunur.
- Enter: Yalnızca sohbet yazma alanını açar. Mesajı Enter ile gönderince yazma alanı kapanır, sohbet geçmişi solda açık kalır. Boşken Enter veya Escape yazma alanını kapatır.
- Sohbete yazarken R ve Space oyun komutu olarak çalışmaz.
- Her sayfa açılışı karanlık temayla başlar. Güneş/ay düğmesiyle değiştirebilirsin.

Kimin oynadığı ve kısayollar sol üstte, oda kodu/FPS altında görünür. İlk 3,6 saniyede kısa başlangıç ipucu vardır. Tur sonunda kamera bütün kuleyi gösterir.

## Görünüm atölyesi

Üstteki Tema düğmesiyle açılır. Oda oluştururken kule teması, blok yüzeyi ve arka plan doğrudan formdan da seçilebilir. Oda sahibinin seçimleri sunucuda oda ayarı olarak saklanır ve herkese anında uygulanır; sonradan katılan oyuncu da aynı görünümü alır. Diğer oyuncular seçimleri görebilir. Oda sahibi ayrılırsa değiştirme yetkisi yeni oda sahibine geçer. Seçimler turu, sırayı veya skoru sıfırlamaz. Oda dışındaki kişisel tercihler bu cihazda saklanır.

Yüzeylerde yumuşak kenarlar, malzemeye uygun yansımalar ve gölgeler; ortamlarda atmosferik ışık, sis, katmanlı manzara ve su yansımaları kullanılır.

Kule temaları: Orman, Şafak, Buzul, Kumtaşı, Grafit.
Blok yüzeyleri: Seramik, Jel, Kristal, Fırçalı metal, Doğal taş. Yansıma ve parçacık biçimleri ile ses aralıkları yüzeye göre değişir.
Arka planlar: Orman ızgarası, Güneş döngüsü, Şehir ışıkları, Dağ esintisi, Sakin kıyı. Güneş döngüsü kat sayısına göre ilerler. Dünya Mimarları'nda şehrin silüeti otomatik eklenir; varsayılan orman görünümünde ve güneş döngüsünde inşaat baştan sona şafaktan gün batımına gider.

## Dünya Mimarları — World Builders

Ana menüde DÜNYA MİMARLARI veya WORLD BUILDERS düğmesine bas. Yapı seçimi ayrı bir ekrandır; klasik oyun ekranının üzerine bindirilmez.

İlk yalnızca Pisa Kulesi açıktır. Bir yapı seçip Bu yapıyı inşa et ile iki kişilik oda oluştur. Arkadaşını kodla davet et. Oda sahibi seçili yapıyı değiştirebilir. Diğer oyuncu açık yapıları önerebilir; ikisi aynı yapıyı seçerse öneri kabul edilir. İleri bir yapıya sahibi tarafından davet edilen oyuncu, kendi koleksiyonunda yapı kilitli olsa da ortak inşaata katılabilir.

| Yapı | Kat | İlk açılış / gereksinim |
| --- | --- | --- |
| Pisa Kulesi | 24 | Açık |
| Eyfel Kulesi | 48 | Pisa Kulesi |
| Big Ben | 36 | Eyfel Kulesi |
| Tokyo Tower | 44 | Big Ben |
| Tac Mahal | 32 | Tokyo Tower |
| CN Tower | 50 | Tac Mahal |
| Empire State Building | 56 | CN Tower |
| Burj Khalifa | 72 | Empire State Building |
| Shanghai Tower | 64 | Burj Khalifa |
| Özgürlük Heykeli | 40 | Shanghai Tower |

Kat sayıları oyun için tasarlanmış hedeflerdir; gerçek binaların kat sayılarını temsil etmez. Çizimler mimari eserlerin stilize, izometrik yorumlarıdır.

Aynı sunucu ve Stack motoru kullanılır. Kademeli daralma, silindirler, kafes ayaklar, kubbe/minare, saat ve zirve detayları yapıya göre değişir. Planlanan daralma uygulanırken taşan parçalar gerçek örtüşme hesabıyla kesilir. Klasik modun eşit boyutlu blok davranışı değişmez.

Üstte ortak kat sayısı; solda yapı aşaması, yüzde, iki oyuncunun blok ve perfect katkıları görünür. Aşama değişimlerinde küçük bildirim çıkar. Her iki oyuncu sırayla aynı yapıyı tamamlar. Tamamlanınca kamera eserin tümünü gösterir; şehir, iki isim, süre, ortak skor, katkılar ve tamamlama rozeti görünür. Yeni yapı seçimini oda sahibi başlatır. Aynı yapıyı R ile tekrar oynayabilirsiniz.

## Koleksiyon ve kalıcı kayıt

Yapılar sekmesindeki Koleksiyon alanında tamamlanan eserler, ilerlemeler, kilitler, ortak rekorlar ve rozetler vardır. Başarılı her blok en iyi ilerlemeyi günceller; tamamlanma sunucuda doğrulanır. Her iki mimarın koleksiyonuna ve o ikilinin ortak kaydına yazılır. Yeni yapılar tamamlamalarla açılır. Sayfa yenileme veya normal sunucu yeniden başlatma kayıtları silmez.

Aynı tarayıcıdaki iki sekme aynı mimar kimliğini paylaşabilir; oda oyuncuları ve katkıları ayrı kalır. Gerçek iki cihazda iki ayrı mimar profili vardır.

Çıkış düğmesi devam eden turu bitirir; mevcut oda sahipliği sonraki oyuncuya geçer. Sekmeyi doğrudan kapatan oyuncu otomatik çıkarılmaz. Aktif odalar son işlemden 24 saat sonra sona erer; kalıcı mimar koleksiyonu bu süreden bağımsızdır.

## Ağ ve sunucu

Aynı bilgisayarda iki sekmeyle deneyebilirsin. Aynı Wi-Fi'daki diğer cihazlar localhost yerine sunucunun yerel IP adresini ve seçilen portu kullanmalı. Farklı internet bağlantıları için Node.js sunucusuna dağıtım gerekir. Bu ZIP internete yayımlanmış bir hizmet değildir.

render.yaml dağıtım ayarlarını içerir. Başlatma komutu `node server.mjs`, sağlık yolu `/health`. Tek sunucu örneği kullan. SSE bağlantılarını aracı sunucuda tamponlama. Veri dosyaları data/rooms.json ve data/architects.json'dur. Kalıcı barındırma diski DATA_DIR ile tanımlanabilir. Geçici diskli hizmetlerde yeniden dağıtım kayıtları silebilir. Çoklu sunucu için ortak veri deposu gerekir. Kayıtlar en geç saniyede bir ve normal kapanışta yazılır; ani kapanmada son saniye kaybolabilir.

## Test ve mimari

`node --test test.mjs`

22 test: ortak görünümün iki SSE bağlantısında güncellenmesi, oda sahibine özel yetki, geçersiz seçimlerin reddi, tur ve sıra korunması, yeniden başlatmada görünümün korunması; klasik modun sıra/fizik/skor testleri, SSE ve sohbet, port çakışması, tam kule kamerası, R sıfırlaması, on yapının tamamlanması, iki kişilik oda seçimi, ortak ödül, kilit açma ve sunucu yeniden başlatılınca kalıcı kayıt kontrolleri vardır.

- public/game.mjs: ortak hareket, örtüşme, skor, sıra ve kamera hesabı.
- public/worlds.mjs: yapı kataloğu, planlanan geometri, aşamalar ve kart illüstrasyonları.
- public/renderer.mjs: izometrik çizim, yüzeyler, kesilen parçalar ve efektler.
- public/appearance.mjs: ortak görünüm doğrulaması ve yüzey önizlemeleri.
- public/environment.mjs: önbellekli şehir/ızgara/güneş ortamları.
- public/world-ui.mjs: ayrı yapı galerisi, koleksiyon ve atölye.
- server.mjs: oda, hamle doğrulama ve anlık SSE dağıtımı.
- world-store.mjs: mimar ve ortak koleksiyonların sunucu kayıtları.

requestAnimationFrame ekran yenilemesine uyum sağlar. Izgara ve ortam kat değişimlerinde önbelleğe alınır; oyun sırasında ekran dışındaki alt katlar çizilmez. Efekt sayıları ve piksel oranı sınırlıdır. FPS cihaz ve seçilen yüzeye göre değişir; sabit FPS garantisi verilmez.

## v6 görünüm güncellemesi

Ortak kule sayacı başında sıfır olmadan gösterilir (7, 07 yerine). Başlangıç ve oyun arayüzünde bakır / koyu turuncu buton, başlık ve seçim vurguları kullanılır. Orman arka planları ve oyuncuların ortak görünüm seçimleri korunur.

## v7 toparlanma

Mükemmel bildirimindeki alt yazı kaldırıldı. Bakır vurgular loş ve saydam hale getirildi. Art arda her 3 mükemmel hamlede (3, 6, 9...), en son kesilerek kaybedilen bir parçanın genişliği yeni bloğa geri eklenir. Kaybın ekseni korunur; başlangıç genişliği ve World Builders mimari sınırı aşılmaz. Hatalı yerleştirme mükemmel serisini sıfırlar. Kasıtlı mimari daralmalar kayıp sayılmaz. Ortak seri ve geri kazanım iki oyuncuda aynı şekilde hesaplanır.

## v8 oyun atmosferleri

Her sayfa açılışında ve her yeni turda 8 sakin renk dünyasından biri seçilir: adaçayı, petrol, gece mavisi, füme erik, sıcak taş, zeytin, gül kurusu ve alacakaranlık. Yeni turda önceki renk tekrarlanmaz. Oda atmosferi sunucuda saklanır ve tüm oyunculara aynı gönderilir; hamle, sohbet ve tema seçimleri rengi yeniden seçmez. R ile yeni turda renk değişir. Seçilen manzara, blok yüzeyi ve kule teması korunur.

## v9 blok birleşimleri ve kat renkleri

Yuvarlatılmış yüzeyler arasında arka planın göründüğü köşe ve dip boşlukları, kesintisiz dolu blok gövdesiyle kapatıldı. Kristal görünümü de dolu gövde üzerinde parlak yüzey ve kırılma çizgileriyle çizilir. Kule yükseldikçe her katın renk tonu ve açıklığı yumuşak bir akışla değişir. Hareket eden ve yerine oturan aynı katın temel rengi korunur; yerleştirmede ani renk atlaması olmaz.

## v10 odadan ayrılmadan mod değiştirme

Oyun ekranındaki Geri dön düğmesi tüm oyuncuları aynı bekleme odasına getirir; mevcut tur biter, oda kodu, oyuncu oturumları, tema ve sohbet korunur. Dünya Mimarları düğmesinden yapı seçilir; oda sahibi aynı odayı iki kişilik mimari moduna geçirir ve Oyunu başlat ile iki oyuncu birlikte devam eder. İkiden fazla oyuncu varsa kimse otomatik çıkarılmaz; Dünya Mimarları geçişi engellenir. Bekleme odasından Klasik kuleye geç ile tekrar klasik mod seçilebilir. Odadan ayrıl düğmesi ayrıca durur.

## v11 mimar oturumu onarımı

Eski sunucuya ait ve artık doğrulanamayan mimar kimliği, tek seferlik yeni oturumla otomatik yenilenir. Oda kodu, oyuncu kimliği ve sohbet korunur. Eksik mimar kaydı mevcut oda oyuncusuna kendi oda anahtarı doğrulanarak bağlanır; mevcut geçerli profilin sahipliği değiştirilmez. Geçerli koleksiyonlar korunur. Eski data/architects.json taşınmadıysa eski koleksiyon yeni oturuma otomatik geri getirilemez; güncellemede data klasörünü koruyun. Ağ ve sunucu hataları profil sıfırlaması başlatmaz.

## v12 arayüz tasarım sistemi

Başlangıç, oda formu, bekleme odası, yapı galerisi, koleksiyon, görünüm atölyesi, yardım ve oyun göstergeleri aynı tipografi, aralık ve buton sistemiyle düzenlendi. Loş bakır renk ve tur atmosferleri korunur. Metinler büyütüldü; odak çizgileri, seçili kart işaretleri ve ses düğmesinin açık/kapalı durumu belirginleştirildi. Önizleme altındaki tempo bilgileri kule görüntüsünden ayrıldı.

Oyun sırasında skor, sıra, oda ve sohbet sabit bölgelerdedir; kuleye merkezde alan ayrılır. Dar ekranda kule kameranın dikey konumuyla sohbetten ayrılır; büyük başlangıç düğmesi yerine kısa başlangıç ipucu gösterilir ve oyun alanına dokunarak yerleştirme devam eder. 390 px genişlikte başlangıç, oda formu, yapı seçimi ve oyun ekranı kontrol edildi. Mobil üst menüde Çık düğmesi Odadan ayrıl ile aynı işlevdedir. Azaltılmış hareket sistem tercihi desteklenir.

Arayüz stili public/ui.css dosyasındadır; public/style.css temel bileşenleri içerir. Ek bağımlılık yoktur. Tasarım referansı: https://www.kimi.ai/tr/resources/game-user-interface-design (okunabilirlik, görsel hiyerarşi, tutarlılık, geri bildirim ve platforma uyum).

## v13 son tasarım ve sırayla eser açma

Arayüzün çerçeveleri ve panel dolguları hafifletildi. Kat sayısı ve skor kalın yazıyla, ikincil bilgiler daha sakin biçimde gösterilir. XP kazanma ve XP gösterimleri kaldırıldı; önceki profillerin eski XP alanı yalnızca veri uyumluluğu için korunur, hiçbir kilidi etkilemez. Yeni oyuncuda yalnızca Pisa açıktır. Sıra: Pisa → Eyfel → Big Ben → Tokyo Tower → Tac Mahal → CN Tower → Empire State → Burj Khalifa → Shanghai Tower → Özgürlük Heykeli. Bir eser tamamlanınca sıradaki iki oyuncu için açılır. Önceden tamamlanmış eserler tekrar oynanabilir.

## Canlı yayın planı

Kullanıcı ücretsiz Render yayını istedi. render.yaml ücretsiz tek Node servisini tanımlar. Kalıcı disk yoktur: yeniden başlatma, uyku veya yeni yayın sonrası sunucu dosyaları ve eser ilerlemesi kaybolabilir. Aktif online odalar ve sırayla oynama desteklenir. Kaynak kodu GitHub deposuna gönderilirken data klasörü dahil edilmez.
