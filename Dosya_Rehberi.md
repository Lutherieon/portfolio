# İçerik yönetimi

Tüm düzenlemeler için **Siteyi_Duzenle.cmd** dosyasını açıp site klasörünü seç. Ayrıntılı kullanım: [Editör kılavuzu](Kullanim_Kilavuzu.md).

- **Projeler:** Proje ekle, görünürlüğünü değiştir, metin ve medya bölümlerini düzenle. Bölüm ekleme düğmesi listenin üstünde ve altında bulunur.
- **Tüm site:** Ana sayfa, özgeçmiş, featured ve diğer sayfaları bölüm bölüm düzenle. Hakkımda, deneyim ve yayın kayıtlarını ekleyebilir, kaldırabilir ve sıralayabilirsin.
- Metin araçlarında kalın, italik, altı çizili, yazı tipi, boyut, renk, vurgu, hizalama ve listeler bulunur. Aktif biçime tekrar tıklayarak kapat. Geri al/yinele araçları da kullanılabilir.
- **Kaydet** yerel dosyaları günceller; önceki sürüm `.editor-backups` klasörüne alınır. Canlı siteyi güncellemek için değişen dosyaları ayrıca yayınla.

## İçerik dosyaları

| Dosya | Görevi |
| --- | --- |
| `project-library.js` | Görünür ve gizli projeler |
| `projects-data.js` | Görünür proje listesi ve kategori filtreleri |
| `site-content.js` | Hakkımda, özgeçmiş ve featured içerikleri |
| `images/` | Görseller, animasyonlar ve videolar |

`index.html`, `portfolio.html`, `project-detail.html`, `resume.html` ve `featured.html` ziyaretçi sayfalarıdır. `admin.html` yerel editördür. `style.css` site görünümünü, `admin.css` editör görünümünü belirler.
