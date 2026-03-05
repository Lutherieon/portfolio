# 🚀 Modüler Portfolyo Yönetim Kılavuzu

Bu portfolyo, projelerinizi tek bir dosyadan kolayca yönetebilmeniz için **veri odaklı (data-driven)** ve **modüler** bir yapıya dönüştürülmüştür.

---

## 📂 Temel Dosya Yapısı
- `projects-data.js`: Tüm projelerinizin bilgilerinin tutulduğu ana dosya. **Düzenleme yapacağınız yer burasıdır.**
- `portfolio.html`: Proje kartlarını otomatik olarak oluşturur (sayfa başına 6 proje).
- `project-detail.html`: Dinamik şablon sayfasıdır. Artık her bölüm için fotoğraf, video veya PDF eklemeyi destekler.

---

## ➕ Yeni Proje Nasıl Eklenir?

`projects-data.js` dosyasını açın ve `PROJECTS` dizisinin içine yeni bir proje [objesi] ekleyin. İşte en güncel şablon:

```javascript
{
    id: "proje-kimligi", // Benzersiz bir isim (boşluksuz)
    title: "Projenin Tam Adı",
    category: "Kategori",
    thumbnail: "images/onizleme.jpg", // Kart resmi
    bannerType: "image", // "image" veya "pdf" (Sayfa başındaki arka plan)
    bannerSrc: "images/banner.jpg",
    metadata: "Göreviniz (2025)",
    intro: "Projenin kısa özeti...",
    
    // 📸 GİRİŞİN ALTINDAKİ ANA MEDYA (Opsiyonel)
    mainMedia: { type: "image", src: "images/ana-gorsel.jpg", caption: "Açıklama" },
    
    sections: [
        {
            id: "bolum-1",
            title: "BÖLÜM BAŞLIĞI",
            blocks: [
                { type: "text", value: "Buraya metin gelecek." },
                { type: "image", src: "images/resim1.jpg", caption: "Resim altı yazısı" },
                { type: "video", src: "https://www.youtube.com/embed/VIDEO_ID", provider: "youtube" },
                { type: "pdf", src: "dosya.pdf" }
            ]
        }
    ]
}
```

---

## 🛠️ Modüler Blok Tipleri

Her `sections` içindeki `blocks` dizisinde şu tipleri kullanabilirsiniz:

1.  **Metin (`text`):** `{ type: "text", value: "Metniniz..." }`
2.  **Resim (`image`):** `{ type: "image", src: "yol/resim.jpg", caption: "Opsiyonel başlık" }`
3.  **Video (`video`):**
    - YouTube: `{ type: "video", src: "https://www.youtube.com/embed/ID", provider: "youtube" }`
    - Yerel: `{ type: "video", src: "video.mp4" }`
4.  **PDF (`pdf`):** `{ type: "pdf", src: "dosya.pdf" }`
5.  **Yan Yana Medya (`media-group`):** Birden fazla resmi yan yana koymak için kullanılır:
    ```javascript
    {
        type: "media-group",
        items: [
            { type: "image", src: "resim1.jpg", caption: "Sol" },
            { type: "image", src: "resim2.jpg", caption: "Sağ" }
        ]
    }
    ```

---

## 💡 İpucu
- İstediğiniz sırada ve istediğiniz kadar blok ekleyebilirsiniz.
- **Yan Yana Resimler:** Eğer `media-group` içine 2 resim eklerseniz, bunlar otomatik olarak yan yana dizilir ve ekrana sığacak şekilde ölçeklenir. Mobil cihazlarda ise otomatik olarak alt alta gelir.
- **Metin Vurgulama (Bold/İtalik):** `intro` veya `text` bloklarında `<b>vurgulu</b>` veya `<i>italik</i>` gibi HTML etiketleri kullanabilirsiniz.
- **Kesme İşareti/Tırnak:** Metni tırnak işareti (`" "`) yerine backtick (`` ` ``) içine alırsanız, içindeki tırnak işaretlerini kaçış karakteri kullanmadan rahatça yazabilirsiniz.
- Sayfa başındaki `bannerType: "pdf"` ayarı, projenin en üstündeki hero alanını PDF yaparken, `blocks` içindeki PDF'ler sayfanın akışında görünür.

---

Bu esnek yapı sayesinde projelerinizi dilediğiniz gibi süsleyebilirsiniz! 🌟
