# 🚀 Kapsamlı İçerik Yönetim Kılavuzu

## Güncel işlevler

Özgün görsel tasarım ve sayfa yerleşimleri korunmaktadır. Düzeltmeler içerik, bağlantı, erişilebilirlik ve mobil taşma alanlarıyla sınırlıdır.

- `drafts-data.js` eksik proje ve örnek Featured kayıtlarının arşividir; sayfalarda yüklenmez.
- Tüm projeler `project-library.js` içinde tutulur. `window.PROJECTS` bu kaynaktan yalnızca `published: true` olan kayıtları alır. Kategori filtreleri görünür projelerden otomatik türetilir.
- `featured.html` özgün Featured düzenini kullanır. Gerçek yayın/konuşma kaydı eklenene kadar portfolyoya yönlendiren bir açıklama gösterir.
- Resume sayfasında yalnızca `window.RESUME_DATA.experience` içindeki iş deneyimi gösterilir. Güncel CV PDF indirme bağlantısından erişilebilir.
- Projeleri bilgisayarında düzenlemek için `EDITORU_AC.cmd` dosyasını aç. `admin.html` editörü seçtiğin site klasöründeki `project-library.js` dosyasına doğrudan kayıt yapar. Kullanım: [ADMIN_KURULUM.md](ADMIN_KURULUM.md). Home, Resume ve Featured bilgileri `projects-data.js` içinde kalır. Aşağıdaki eski proje veri örnekleri alanları tanımak içindir.
- PDF proje bannerı, sayfa okları ve noktalı gezinme korunur. Ana sayfadaki Background bölümü yalnızca metin içerir; Philosophy bölümü kaldırılmıştır. PDF önizlemesi yüklenmezse doğrudan belge bağlantısı sunulur.
- Sayfa bağlantıları yerel önizleme ve statik barındırma için `.html` uzantısı kullanır. Proje adresi: `project-detail.html?id=proje-kimligi`.


Site içerikleri veri dosyalarından okunur. Projeleri yerel editörde, Home / Resume / Featured içeriklerini `projects-data.js` içinde düzenleyebilirsiniz.

Bu kılavuz, sitedeki farklı bölümlerin içeriklerini nasıl değiştireceğinizi adım adım anlatır.

---

## 📂 Dosya Yapısı ve Mantığı

- `project-library.js`: Görünür ve gizli projelerin kaynağıdır. Yerel editör bu dosyaya kayıt yapar.
- `projects-data.js`: Home, Resume ve Featured içerikleri ile görünür proje listesini oluşturur.
- `index.html`, `featured.html`, `resume.html`, `project-detail.html`: Sadece verileri okuyup ekrana çizen "motor" (şablon) dosyalarıdır. Dokunmanıza gerek yoktur.
- `script.js`: Sayfaların düzgün kaymasını (scroll) ve animasyonlarını yönetir.

Proje düzenlemek için **`EDITORU_AC.cmd`** dosyasını açın. Diğer sayfa içerikleri için aşağıdaki veri örneklerini kullanabilirsiniz.

---

## 1️⃣ Ana Sayfayı (HOME) Düzenlemek

Ana sayfadaki resimli ve yazılı uzun kaydırma bölümlerini `window.HOME_SECTIONS` objesinden yönetirsiniz.

```javascript
window.HOME_SECTIONS = [
    {
        id: "yeni-bolum",           // Sayfadaki link (ör: #yeni-bolum). Türkçe karakter ve boşluk kullanmayın!
        title: "Bölüm Başlığı",     // Ekranda görünen büyük başlık
        image: "images/resim1.jpg", // İsteğe bağlı; görselsiz bölüm için bu alanı kaldırın.
        text: [
            "İlk paragraf metni buraya gelecek.",
            "İkinci paragraf metni buraya gelecek. İlk paragraftan sonra virgül koymayı unutmayın."
        ]
    }
];
```

**İpucu:** Yeni bir bölüm eklediğinizde, sayfanın sağındaki noktalı menüye (dot-nav) otomatik olarak animasyonlu bir şekilde eklenecektir. Resimler sırayla bir sağda bir solda otomatik hizalanır.

---

## 2️⃣ Öne Çıkanlar (FEATURED) Sayfasını Düzenlemek

Konuşmalar, makaleler veya açık kaynak katkılarınızı `window.FEATURED_DATA` üzerinden yıllara göre gruplayarak ekleyebilirsiniz.

```javascript
window.FEATURED_DATA = {
    title: "FEATURED",
    subtitle: "Konuşmalar | Yayınlar | Açık Kaynak",
    groups: [
        {
            year: "2026",
            id: "yil-2026", 
            image: "images/etkinlik.jpg", // Yılın arka planında yüzen görsel
            floatClass: "float-high",     // Görselin konumu ("float-high", "float-low", "float-mid")
            entries: [
                {
                    title: "GDC 2026 Panel Konuşması",
                    link: "https://youtube.com/...",    // Tıklanabilir link
                    location: "San Francisco, CA",
                    description: "Sistem tasarımı üzerine detaylı bir sunum."
                }
            ]
        }
    ]
};
```

---

## 3️⃣ Özgeçmiş (RESUME) Sayfasını Düzenlemek

Kariyer geçmişiniz, çalıştığınız yerler ve rolleri `window.RESUME_DATA` içinden değiştirilir.

```javascript
window.RESUME_DATA = {
    title: "RESUME",
    downloadLink: "dosyalar/cv.pdf", // Özgeçmişinizin PDF linki (klasöre eklemelisiniz)
    downloadLabel: "RESUME 2026",    // Butondaki yazı
    experience: [
        {
            id: "job-1", // Nokta navigasyonu için benzersiz kimlik (boşluksuz)
            role: "Kıdemli Oyun Tasarımcısı",
            company: "Firma Adı",
            dates: "Ocak 2023 - Günümüz",
            description: "Şirketteki görev tanımınız ve başardıklarınız.",
            logo: "images/firma-logo.png" // Şirket logosu (zorunlu değil)
        }
    ]
};
```

---

## 4️⃣ Proje (PORTFOLIO) Eklemek

Yerel editörde **+ Yeni** ile proje oluşturun, bilgilerini doldurun ve **Kaydet** düğmesine basın. Proje `project-library.js` dosyasına eklenir. **Portfolyoda göster** seçiliyse portfolyoda, **Ana sayfada öne çıkar** da seçiliyse Home'da görünür.

### Kategori (Filtre) Eklemek veya Değiştirmek
Editörde **Kategori** alanına istediğiniz başlığı yazın. Portfolyo filtreleri görünür projelerin kategorilerinden otomatik oluşur; ayrı bir liste düzenlemeniz gerekmez.

```javascript
window.PORTFOLIO_CATEGORIES = ["All", ...new Set(window.PROJECTS.map(project => project.category))];
```

### Projeyi Eklemek ve Kategoriye Atamak
Kategori adları tam eşleşir. Aynı kategoride görmek istediğiniz projelere aynı adı yazın. Aşağıdaki örnek, alanları anlatmak içindir; kayıt için editörü kullanın. `project-library.js` yalnızca JSON biçimindeki verileri kabul eder; bu açıklamalı JavaScript örneğini doğrudan dosyaya yapıştırmayın.

```javascript
window.PROJECT_LIBRARY = [
    {
        id: "projemin-adi",                 // URL'de görünecek id (ör: ?id=projemin-adi)
        published: true,                   // Portfolyoda göster
        showcase: false,                   // Ana sayfada öne çıkar
        title: "Oyunun/Projenin Tam Adı",
        category: "Kategori (Sistem Tasarımı vs.)",
        thumbnailDescription: "Projenin kısa 1-2 cümlelik kapağa eklenecek yazısı.", // Yeni: Kartın ortasındaki açıklama
        tags: ["ue4", "c++", "gamedev", "university"],      // Yeni: Kullanılan diller veya özellikler (renkli etiketler)
        contributions: ["UI Programming", "Level Design"],  // Yeni: "My contributions" altındaki onay işaretli maddeler
        thumbnail: "images/kart-resmi.jpg", // Liste (grid) sayfasındaki büyük yatay dikdörtgen/kare resim
        
        // --- PROJE DETAY SAYFASI ---
        bannerType: "image", // Veya "pdf", "video" (YouTube için) - Proje içine girince çıkan en tepe görsel
        bannerSrc: "images/banner.jpg", // Eğer "video" seçtiyseniz buraya YouTube "embed" linkini koyun (https://www.youtube.com/embed/...)
        metadata: "10 Hafta | Lider Tasarımcı | 2024",
        intro: "Projenin kısa özeti ve genel amacı...",
        
        // Ana Giriş Medyası (Opsiyonel)
        mainMedia: { type: "image", src: "images/ana-gorsel.jpg" },
        
        // Projenin İçerik Bölümleri (Aşağı doğru kaydıkça okunacak bloklar)
        sections: [
            {
                id: "sistem-detaylari", // Noktalı menü için
                title: "Sistem Detayları",
                blocks: [
                    { type: "text", value: "İşte bu sistemi böyle tasarladım..." },
                    { type: "image", src: "images/detay.jpg", caption: "Sistem mimarisi" },
                    { type: "video", src: "https://www.youtube.com/embed/...", provider: "youtube" }
                ]
            }
        ]
    }
];
```

### Etiket (Tag) Renklerini Ayarlamak
`tags` dizisine yazdığınız kelimeler (`["ue4", "C++"]`), otomatik olarak dönüştürülüp `style.css` içerisinde renk arar. Sistem, yazdığınız kelimedeki harfleri küçültüp sembolleri atarak sınıf adını bulur.

**Örnek:** `"C++"` yazdığınızda tagin rengi `.tag-c` CSS sınıfından okunur. `"Game Dev"` için `.tag-gamedev` sınıfı kullanılır.
Koyu gri (`#333`) olan standart renk yerine kendi renginizi eklemek için `style.css` dosyasına şunu yazmanız yeterlidir:

```css
/* Yeni bir etiket rengi atamak: Tasarım */
.tag-tasarim { background-color: #ff9900; }
```

### Projelerde Desteklenen İçerik (Block) Tipleri
- **Metin (`text`):** `{ type: "text", value: "Paragraf..." }`
- **Resim (`image`):** `{ type: "image", src: "url", caption: "Alt yazı" }`
- **YouTube Video (`video`):** `{ type: "video", src: "https://www.youtube.com/embed/A" }` (*YouTube normal linki DEĞİL, "embed" şeklinde koyulmalı*)
- **Yerel Video (`video`):** `{ type: "video", src: "video.mp4" }`
- **PDF (`pdf`):** `{ type: "pdf", src: "dosya.pdf" }` (Sayfa içine gömülür)
- **Yan Yana Medya (`media-group`):** Masaüstünde 2 veya daha fazla resmi/videoyu yan yana grid olarak koymak için:
  ```javascript
  {
      type: "media-group",
      items: [
          { type: "image", src: "sol.jpg", caption: "Sol Görsel" },
          { type: "image", src: "sag.jpg", caption: "Sağ Görsel" }
      ]
  }
  ```

### Metin, Resim ve Grid'leri Birleştirmek (Interleaving)
Yukarıdaki veri tiplerini `blocks` listesi (`[ ]`) içine istediğiniz sırayla alt alta ekleyebilirsiniz. Önce bir metin, sonra dev bir fotoğraf, ardından tekrar metin ve son olarak ikili bir fotoğraf ızgarası (grid) eklemek tamamen mümkündür:

```javascript
blocks: [
    { type: "text", value: "Buraya detaylı araştırma metni gelir." },
    { type: "image", src: "images/astronot.jpg", caption: "Karakter konsepti." },
    { type: "text", value: "Yukarıdaki görselde olduğu gibi bazı değişiklikler yaptık." },
    {
        type: "media-group", // 2 fotoğrafı yan yana koyar
        items: [
            { type: "image", src: "images/detay-1.jpg", caption: "Detay 1" },
            { type: "image", src: "images/detay-2.jpg", caption: "Detay 2" }
        ]
    }
]
```

---

## 💡 Hayati İpuçları

1. **Virgül (`,`) Kontrolü:** JavaScript yapıları (süslü parantezler `{}` ve köşeli parantezler `[]`) arasına mutlaka virgül koymalısınız. Yoksa sistem çöker.
2. **Karakterler:** Paragraflarda kesme işareti (' veya ") kullanıyorsanız, metni `backtick` dediğimiz (Tab tuşunun üstündeki) `` ` `` işareti içine (`` `Ali'nin kalemi` ``) almak kodun bozulmasını engeller.
3. **Mükemmel Senkronizasyon:** HTML ve CSS kodlarına dokunmadığınız sürece site asla bozulmaz. Sistemi olabildiğince esnek tasarladık. Yeni eklediğiniz her şey (animasyonlar, menüler, yönlendirmeler) otomatik ve mükemmel hesaplamalarla çalışacaktır.

Tebrikler, teknolojik olarak son derece sağlam ve yönetimi kolay bir portfolyoya sahipsiniz! 🚀
