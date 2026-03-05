const PROJECTS = [
    {
        id: "zelda",
        title: "The Legend of Zelda: Breath of the Wild",
        category: "UX Analysis",
        thumbnail: "images/pic01.jpg",
        bannerType: "pdf", // This is the TOP background banner
        bannerSrc: "PschologyFinal.pdf",
        metadata: "Lead UX Researcher & Analyst (2026)",
        intro: `Prepared as part of the GAD3024 Psychology for Game Design course led by <b>Asst. Prof. Dr. Çakır Aker</b>, this project presents a User Experience (UX) analysis of <b>The Legend of Zelda: Breath of the Wild</b>. The one-month research process was conducted through regular consultations with the faculty, utilizing the methodology from Celia Hodent’s (2017) <i>"The Gamer’s Brain"</i> to examine player cognitive processes.`,
        mainMedia: { type: "pdf", src: "PschologyFinal.pdf" }, // Fixed typo from Psc
        sections: [
            {
                id: "research",
                title: "RESEARCH & PLANNING",
                blocks: [
                    { type: "text", value: "Detailed analysis of open-world navigation and player feedback loops was conducted over a six-month period." },
                    {
                        type: "media-group",
                        items: [
                            { type: "image", src: "images/pic01.jpg", caption: "Immersion mapping." },
                            { type: "image", src: "images/pic02.jpg", caption: "Feedback loops." },
                            { type: "image", src: "images/pic03.jpg", caption: "Feedback loops." }
                        ]
                    }
                ]
            },
            {
                id: "development",
                title: "ANALYSIS PROCESS",
                blocks: [
                    { type: "text", value: "We mapped out the player journey from the Great Plateau to Ganon's Castle, identifying key friction points." },
                    { type: "video", src: "https://www.youtube.com/embed/zw47_q9wbBE", provider: "youtube" }
                ]
            }
        ]
    },
    {
        id: "task-management",
        title: "Task Management App",
        category: "Vue & Firebase",
        thumbnail: "images/pic02.jpg",
        bannerType: "image",
        bannerSrc: "images/pic02.jpg",
        metadata: "Frontend Developer (2024)",
        intro: "A real-time task management solution built with Vue.js and Firebase for seamless collaboration.",
        sections: [
            {
                id: "development",
                title: "DEVELOPMENT",
                content: "Implemented reactive data binding and real-time updates using Firestore listeners."
            }
        ]
    },
    {
        id: "weather-dashboard",
        title: "Weather Dashboard",
        category: "Vanilla JS & REST API",
        thumbnail: "images/pic03.jpg",
        bannerType: "image",
        bannerSrc: "images/pic03.jpg",
        metadata: "JavaScript Developer (2024)",
        intro: "A sleek weather dashboard providing real-time forecasts using OpenWeatherMap API.",
        sections: [
            {
                id: "api",
                title: "API INTEGRATION",
                content: "Handled complex JSON responses and implemented dynamic background changes based on weather conditions."
            }
        ]
    },
    {
        id: "finance-tracker",
        title: "Finance Tracker",
        category: "Python Django",
        thumbnail: "images/pic04.jpg",
        bannerType: "image",
        bannerSrc: "images/pic04.jpg",
        metadata: "Backend Developer (2023)",
        intro: "A robust personal finance tracker built with Django, featuring automated expense categorization.",
        sections: [
            {
                id: "backend",
                title: "BACKEND ARCHITECTURE",
                content: "Designed a relational database schema to handle multi-currency transactions and user profiles."
            }
        ]
    },
    {
        id: "social-media-api",
        title: "Social Media API",
        category: "Express & MongoDB",
        thumbnail: "images/pic05.jpg",
        bannerType: "image",
        bannerSrc: "images/pic05.jpg",
        metadata: "Full-Stack Developer (2023)",
        intro: "A scalable RESTful API for a social media platform, supporting likes, comments, and following.",
        sections: [
            {
                id: "database",
                title: "DATABASE DESIGN",
                content: "Optimized MongoDB queries and implemented JWT-based authentication for secure access."
            }
        ]
    },
    {
        id: "ai-chatbot",
        title: "AI Chatbot Interface",
        category: "React & Tailwind",
        thumbnail: "images/pic06.jpg",
        bannerType: "image",
        bannerSrc: "images/pic06.jpg",
        metadata: "Frontend Architect (2025)",
        intro: "A modern, responsive chat interface designed for AI interactions with a focus on conversational flow.",
        sections: [
            {
                id: "ui",
                title: "UI/UX DESIGN",
                content: "Created a dark-themed, glassmorphic design using Tailwind CSS for a premium feel."
            }
        ]
    }
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
    },
    {
        id: "mock-project-1",
        title: "E-Commerce Concept",
        category: "UI Design",
        thumbnail: "images/pic01.jpg",
        bannerType: "image",
        bannerSrc: "images/pic01.jpg",
        metadata: "UI Designer (2024)",
        intro: "A conceptual e-commerce interface focusing on smooth transitions.",
        sections: [{ id: "design", title: "DESIGN", content: "Used Figma for initial prototyping." }]
    },
    {
        id: "mock-project-2",
        title: "Mobile Game UI",
        category: "Game Design",
        thumbnail: "images/pic02.jpg",
        bannerType: "image",
        bannerSrc: "images/pic02.jpg",
        metadata: "Game Designer (2025)",
        intro: "Interface design for an upcoming mobile RPG.",
        sections: [{ id: "ui", title: "UI", content: "Focused on dark-themed aesthetics." }]
    },
    {
        id: "mock-project-3",
        title: "Inventory System",
        category: "Full Stack",
        thumbnail: "images/pic03.jpg",
        bannerType: "image",
        bannerSrc: "images/pic03.jpg",
        metadata: "Developer (2023)",
        intro: "A robust inventory management system for small businesses.",
        sections: [{ id: "dev", title: "DEVELOPMENT", content: "Built with Node.js and SQL." }]
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROJECTS;
}
