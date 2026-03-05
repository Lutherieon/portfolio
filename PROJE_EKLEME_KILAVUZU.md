# 🚀 Modüler Portfolyo Yönetim Kılavuzu

Bu portfolyo, projelerinizi tek bir dosyadan kolayca yönetebilmeniz için **veri odaklı (data-driven)** bir yapıya dönüştürülmüştür. Yeni bir proje eklemek için HTML kopyalamanıza gerek yoktur.

---

## 📂 Temel Dosya Yapısı
- `projects-data.js`: Tüm projelerinizin bilgilerinin tutulduğu ana dosya. **Düzenleme yapacağınız yer burasıdır.**
- `portfolio.html`: Proje kartlarını otomatik olarak oluşturur.
- `project-detail.html`: Tüm projeler için ortak kullanılan dinamik şablon sayfasıdır.

---

## ➕ Yeni Proje Nasıl Eklenir?

`projects-data.js` dosyasını açın ve `PROJECTS` dizisinin içine yeni bir obje ekleyin:

```javascript
{
    id: "proje-kimligi", // Benzersiz bir isim (boşluksuz)
    title: "Projenin Tam Adı",
    category: "Kategori (örn: React & Node)",
    thumbnail: "images/onizleme.jpg", // Ana sayfadaki küçük resim
    bannerType: "image", // "image" veya "pdf"
    bannerSrc: "images/buyuk-banner.jpg", // Resim yolu veya PDF adı
    metadata: "Göreviniz (2026)",
    intro: "Projenin kısa özeti...",
    sections: [
        {
            id: "bolum-1",
            title: "BÖLÜM BAŞLIĞI",
            content: "Bu bölüme gelecek detaylı açıklama metni."
        }
    ]
}
```

---

## 🖼️ Banner Tipleri

### 1. Resim Kullanmak
Eğer projenin başında sadece bir resim görülsün istiyorsanız:
- `bannerType: "image"` ayarlayın.
- `bannerSrc` kısmına resmin yolunu yazın (örn: `images/banner.jpg`).

### 2. PDF Kullanmak (Zelda Projesindeki gibi)
Eğer projenin başında kaydırılabilir bir PDF dosyası olsun istiyorsanız:
- `bannerType: "pdf"` ayarlayın.
- `bannerSrc` kısmına PDF dosyasının adını yazın (örn: `DosyaAdi.pdf`).
- **Önemli:** PDF dosyasını `portfolio` klasörünün içine atmayı unutmayın.

---

## 💡 İpuçları
- **Sıralama:** `PROJECTS` dizisindeki projelerin sırası, ana sayfadaki görünüm sırasını belirler.
- **Bölümler:** `sections` kısmına istediğiniz kadar blok ekleyebilirsiniz; şablon bunları otomatik olarak alt alta dizecektir.
- **Görseller:** Resimlerinizi `images/` klasörü altında toplamak düzenli kalmanızı sağlar.

---

Bu yapı sayesinde artık projeniz sınırsız genişleyebilir! 🌟
