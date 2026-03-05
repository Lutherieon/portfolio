const PROJECTS = [
    {
        id: "zelda",
        title: "The Legend of Zelda: Breath of the Wild",
        category: "UX Analysis",
        thumbnail: "images/pic01.jpg",
        bannerType: "pdf",
        bannerSrc: "PschologyFinal.pdf",
        metadata: "Lead UX Researcher & Analyst (2025)",
        intro: "This project explores the intricate UX design patterns of Breath of the Wild, focusing on player immersion and interface minimalism.",
        sections: [
            {
                id: "research",
                title: "RESEARCH & PLANNING",
                content: "Detailed analysis of open-world navigation and player feedback loops was conducted over a six-month period."
            },
            {
                id: "development",
                title: "ANALYSIS PROCESS",
                content: "We mapped out the player journey from the Great Plateau to Ganon's Castle, identifying key friction points."
            }
        ]
    }
    /* 
    Yeni proje eklemek için aşağıdaki taslağı kopyalayıp yukarıdaki parantezin sonuna ekleyin:
    ,
    {
        id: "yeni-proje",
        title: "Proje Başlığı",
        category: "Kategori",
        thumbnail: "images/onizleme.jpg",
        bannerType: "image", // veya "pdf"
        bannerSrc: "images/banner.jpg",
        metadata: "Rolünüz (2026)",
        intro: "Kısa tanıtım metni...",
        sections: [
            { id: "bolum1", title: "BÖLÜM 1", content: "İçerik..." }
        ]
    }
    */
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROJECTS;
}
