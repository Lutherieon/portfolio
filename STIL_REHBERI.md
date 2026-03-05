# 🎨 Portfolyo Stil ve Görünüm Rehberi

Bu rehber, sitenizin yazı tiplerini, boyutlarını ve renklerini nasıl özelleştirebileceğinizi adım adım açıklar. Tüm görsel değişiklikler **`style.css`** dosyası üzerinden yapılmaktadır.

---

## 🅰️ Yazı Tipleri (Fonts)

Sitede üç temel yazı tipi ailesi kullanılmaktadır. Bunları `style.css` dosyasının en başında (`:root` kısmında) bulabilirsiniz:

- `--font-headers`: Başlıklar için kullanılır (Montserrat).
- `--font-serif`: El yazısı/İtalik efektli kısımlar için kullanılır (Playfair Display).
- `--font-body`: Genel metinler için kullanılır (Open Sans).

**Değiştirmek için:** Google Fonts'tan yeni bir font beğenip `style.css`'in en üstündeki `@import` satırını güncelleyebilir, ardından bu değişkenleri değiştirebilirsiniz.

---

## 📏 Yazı Boyutlarını (Punto) Artırmak

Boyutları değiştirmek için ilgili sınıftaki `font-size` değerini bulup değiştirmeniz yeterlidir. İşte en çok ihtiyaç duyacağınız yerler:

### 1. Portfolyo Gridindeki Proje İsimleri
`style.css` dosyasında `.card-overlay h3` kısmını bulun:
```css
.card-overlay h3 {
    font-size: 1.4rem; /* Bu değeri artırabilirsiniz (örn: 1.6rem) */
    font-weight: 400;  /* Kalınlık için: 600 veya 700 yapabilirsiniz */
}
```

### 2. Proje Alt Başlıkları (Kategoriler)
`.card-overlay p` kısmını bulun:
```css
.card-overlay p {
    font-size: 1.1rem; /* Örn: 1.2rem yapabilirsiniz */
}
```

### 3. Ana Sayfa Başlıkları
`.page-title` (örn: PORTFOLIO yazısı) veya `.hero h1` (Girişteki isminiz) kısımlarındaki `font-size` değerlerini güncelleyebilirsiniz.

---

## 💡 İpucu: `rem` Nedir?
Sitede boyutlar için `rem` birimi kullanılmıştır. 
- `1rem` genellikle `16px` değerine eşittir.
- `1.5rem` = `24px`
- `2rem` = `32px`
Bu birimi kullanmak, sitenin farklı cihazlarda (mobil/tabet) daha uyumlu görünmesini sağlar.

---

## 🎨 Renkleri Değiştirmek

Sitenin ana vurgu rengi (Teal/Turkuaz) yine `:root` altında tanımlıdır:
- `--accent-teal`: `#40E0D0`

Bu kodu değiştirdiğinizde tüm linkler, butonlar ve parlamalar (glow effect) otomatik olarak yeni renginize bürünecektir.

---

Herhangi bir stil ayarında takılırsanız bana sormaktan çekinmeyin! ✨
