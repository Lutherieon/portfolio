# 🚀 Kapsamlı İçerik Yönetim Kılavuzu

Sitenin tamamı artık **modüler ve veri odaklı** çalışmaktadır. Yani HTML veya CSS kodlarına hiç dokunmadan, sadece `projects-data.js` dosyasını düzenleyerek tüm siteyi güncelleyebilirsiniz!

Bu kılavuz, sitedeki farklı bölümlerin içeriklerini nasıl değiştireceğinizi adım adım anlatır.

---

## 📂 Dosya Yapısı ve Mantığı

- `projects-data.js`: **BÜTÜN İÇERİĞİN** bulunduğu yer burasıdır. Tüm düzenlemelerinizi buradan yapacaksınız.
- `index.html`, `featured.html`, `resume.html`, `project-detail.html`: Sadece verileri okuyup ekrana çizen "motor" (şablon) dosyalarıdır. Dokunmanıza gerek yoktur.
- `script.js`: Sayfaların düzgün kaymasını (scroll) ve animasyonlarını yönetir.

Bütün düzenlemeleriniz için sadece **`projects-data.js`** dosyasını açmanız yeterlidir.

---

## 1️⃣ Ana Sayfayı (HOME) Düzenlemek

Ana sayfadaki resimli ve yazılı uzun kaydırma bölümlerini `window.HOME_SECTIONS` objesinden yönetirsiniz.

```javascript
window.HOME_SECTIONS = [
    {
        id: "yeni-bolum",           // Sayfadaki link (ör: #yeni-bolum). Türkçe karakter ve boşluk kullanmayın!
        title: "Bölüm Başlığı",     // Ekranda görünen büyük başlık
        image: "images/resim1.jpg", // Yan taraftaki fotoğraf
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

`window.PROJECTS` dizini portfolyonuzun belkemiğidir. Portfolyo sayfanızda (ızgara yapıdaki) sergilenecek her proje bu dizine bir obje olarak eklenir.

```javascript
window.PROJECTS = [
    {
        id: "projemin-adi",                 // URL'de görünecek id (ör: ?id=projemin-adi)
        title: "Oyunun/Projenin Tam Adı",
        category: "Kategori (Sistem Tasarımı vs.)",
        thumbnail: "images/kart-resmi.jpg", // Liste (grid) sayfasındaki küçük kare resim
        
        // --- PROJE DETAY SAYFASI ---
        bannerType: "image", // Veya "pdf" - Proje içine girince çıkan en tepe görsel
        bannerSrc: "images/banner.jpg",
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
