# Bilgisayarında proje düzenleme

1. **EDITORU_AC.cmd** dosyasına çift tıkla. Editör bilgisayarındaki Chrome veya Edge'de açılır.
2. **Site klasörünü seç** düğmesine bas ve **Portfolio_site** klasörünü seç. Tarayıcı klasöre yazma izni istediğinde onayla.
3. Soldan bir proje seç veya **+ Yeni** ile oluştur. Gizli projeler de listede bulunur.
4. Metinleri ve görselleri düzenle. **Önizle** ile mevcut detay sayfası tasarımında kontrol et.
5. **Kaydet** düğmesine bas. Bilgiler doğrudan bilgisayarındaki `project-library.js` dosyasına yazılır.

**Başlık** ve **Kart açıklaması** alanlarında Enter ile alt satıra geçebilirsin. Satır kırılımları sitede de korunur. Uzun başlıkları örneğin `The Kingkiller Chronicle` ve alt satırda `Chapter 50: Negotiation` şeklinde yazabilirsin; dar ekranlarda satırlar gerekirse ayrıca sığacak şekilde bölünür.

Her açılışta klasörü seçmen yeterli. Hesap, e-posta, veritabanı kurulumu veya anahtar gerekmiyor. Chrome/Edge klasör erişimi sayesinde editör site dosyalarını doğrudan okuyup yazabilir. [Tarayıcı dosya erişimi](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access).

## Projeleri gösterme ve gizleme

- **Portfolyoda göster** kapalıysa proje gizlidir. Portfolyo kartlarında ve ana sayfada görünmez, doğrudan detay adresi de açılmaz.
- **Ana sayfada öne çıkar** seçiliyse görünür proje Home'daki seçili çalışmalar alanına eklenir.
- Yeni projeler ilk başta gizlidir.
- Başlık, ID, kategori, katkılar, etiketler, kart görseli, üst görsel/video/PDF, giriş metni, kısa bilgiler ve bağlantılar düzenlenebilir.
- Detay bölümlerine metin, görsel, video ve PDF ekleyebilir; bölümlerin ve içeriklerin sırasını değiştirebilirsin.

## Görsel ekleme

**Yükle** ile bilgisayarından JPEG, PNG, WebP, GIF veya PDF seç. Dosya site klasöründeki `images` dizinine benzersiz isimle kopyalanır. Sonra **Kaydet** ile proje bağlantısını kaydet.

## Kayıt ve yedek

Her kayıttan önce `project-library.js` dosyasının önceki sürümü `.editor-backups` klasörüne yedeklenir. Bu klasör Git'e eklenmez.

Dosyayı aynı anda başka bir editörde değiştirdiysen Kaydet eski verinin üzerine yazmaz. Değiştirdiğin metni kopyala, **Dosyadan yeniden yükle** düğmesine bas ve değişikliğini tekrar uygula.

Geri dönmek istersen editörü kapat, istediğin yedeği `project-library.js` adıyla site klasörüne kopyala ve siteyi yenile.

## Siteyi kontrol etme

Kayıttan sonra **Siteyi aç** ile bilgisayarındaki portfolyoyu aç veya açık sayfayı yenile. Kaydetme bilgisayarındaki dosyaları günceller; internetteki siteyi ayrıca mevcut GitHub Pages yayın yönteminle güncellemelisin.

Dosyalar VS Code Live Server gibi bir yerel HTTP sunucusunda da çalışır. Editör yalnızca `file://` veya localhost adreslerinde klasöre bağlanır. İnternetteki admin sayfası bilgisayarına yazma modunu açmaz.

`project-library.js`, görünür ve gizli projelerin ortak kaynağıdır. `projects-data.js` Home, Resume ve Featured içeriğini korur. `drafts-data.js` eski arşiv olarak tutulur; editör güncel gizli projeleri `project-library.js` dosyasından okur. Gizli seçeneği sitede görünürlüğü belirler, kaynak dosyaları için gizlilik koruması sağlamaz.
