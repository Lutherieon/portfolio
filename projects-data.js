window.PORTFOLIO_CATEGORIES = [
    "All",
    "UI",
    "UX",
    "VIDEO GAMES",
    "VIDEOS",
    "VFX",
    "WEB"
];

window.PROJECTS = [
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
                title: "RESEARCH METHODOLOGY",
                blocks: [
                    { type: "text", value: "This case study utilizes <b>Celia Hodent’s Game UX Framework</b> to evaluate the player experience of <b>The Legend of Zelda: Breath of the Wild</b>. This methodology bridges cognitive science with game design, focusing on the brain's capabilities and limitations regarding perception, attention, and memory.\n\nThe analysis is structured around two primary pillars: <b>Usability</b> and <b>Engage-ability</b>." },
                    { type: "text", value: "*The goal of this research was to identify where the systemic freedom of BotW conflicts with traditional UX heuristics, particularly in workload management." },
                    { type: "image", src: "images/ZBotWResearchPic1.png", caption: "Usability & Engage-ability" },
                    { type: "text", value: "<b>1. Heuristic Evaluation (Usability)</b><br>The usability of the game was assessed using seven core pillars to ensure the interface and systems do not hinder the player's intentions:<br><br><b>Signs & Feedback:</b> Analyzing visual and auditory cues, such as weapon durability warnings, that guide player actions.<br><br><b>Clarity:</b> Evaluating the legibility of UI elements and icons to minimize cognitive load.<br><br><b>Form Follows Function:</b> Examining if the visual design of objects (e.g., elemental elixirs or interactive logs) accurately conveys their mechanical purpose.<br><br><b>Consistency:</b> Identifying systemic continuity or contradictions, such as elemental weapon interactions with different environmental materials.<br><br><b>Minimum Workload:</b> Assessing the cognitive and physical effort required for repetitive tasks, specifically within the cooking and inventory management systems.<br><br><b>Error Prevention & Recovery:</b> Critiquing the save system and equipment UI for their ability to prevent or mitigate accidental player errors.<br><br><b>Flexibility:</b> Observing HUD modes and customization options that allow players to tailor the experience to their preferences.<br><br><b>2. Engage-ability Analysis</b><br>Beyond ease of use, the game’s ability to remain immersive and motivating was analyzed through three lenses:<br><br><b>Motivation:</b> Evaluated through <b>Self-Determination Theory (SDT)</b>, focusing on how the game satisfies the needs for Competence (traversal progression), Autonomy (freedom of exploration), and Relatedness (NPC interactions).<br><br><b>Emotion & Game Feel:</b> Analyzing how camera dynamics, responsive controls, and physical presence (motion sensors) create an emotional connection with the world.<br><br><b>Game Flow:</b> Reviewing the difficulty curve, pacing, and the \"Guided Discovery\" approach used in the Great Plateau tutorial to maintain the player's state of flow." },
                ]
            },
            {
                id: "development",
                title: "ANALYSIS PROCESS",
                blocks: [
                    { type: "text", value: "The findings are based on a qualitative analysis of specific gameplay interactions . Every observation was cross-referenced with cognitive psychology principles to determine its impact on the overall player experience." },
                ]
            }
        ]
    },
    {
        id: "No-Prayer-in-Seaside",
        title: "No Prayer in Seaside",
        category: "Video Games",
        thumbnail: "images/NoPrayerInSeasideThumbnail.png",
        thumbnailSubtitle: "PC - Unreal Engine 5 <br> Game Developer & Technical Artist",
        bannerType: "video",
        bannerSrc: "https://www.youtube.com/embed/Scq4HqBrQ3w?si=zWmdKJ5pz1OW1WdN", // IMPORTANT: Must be /embed/ format

        metadata: "Game Developer & Technical Artist (2026)",
        intro: "<b>No Prayer in Seaside</b> is an fast-paced top-down shooter project developed as the final for the GAD 2003 <b>Advanced Game Development II</b> course. Collaborating with <b><a href='https://www.linkedin.com/in/kaan-guzeloglu/' target='_blank'>Kaan Güzeloğlu</a></b>, we completed the game within a rigorous one-month development cycle using <b>Unreal Engine 5</b>. As a Digital Game Design student, my primary roles involved <b>Gameplay Programming</b> and <b>Technical Art</b>, where I focused on bridging core mechanics with seamless visual implementation.",
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
        sections: [
            {
                id: "design",
                title: "DESIGN AND PLANNING",
                blocks: [
                    { type: "text", value: "This is a demonstration of interleaving text and images. We started by researching modern e-commerce trends and establishing a baseline for the user flow." },
                    { type: "image", src: "images/pic02.jpg", caption: "Initial Low-Fidelity Wireframes" },
                    { type: "text", value: "As seen above, the wireframes focused heavily on large imagery and ample breathing room. After user testing, we moved into high-fidelity designs, introducing our core accent colors." },
                    {
                        type: "media-group",
                        items: [
                            { type: "image", src: "images/pic03.jpg", caption: "Product Grid View" },
                            { type: "image", src: "images/pic04.jpg", caption: "Checkout Flow" }
                        ]
                    },
                    { type: "text", value: "The grid system allowed us to surface more products simultaneously without overwhelming the cognitive load of our demographic. The project concluded with a seamless handoff via Figma to the developers." }
                ]
            }
        ]
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

window.HOME_SECTIONS = [
    {
        id: "background",
        title: "Background",
        image: "images/bgPhoto.jpg",
        text: [
            "I am a Digital Game Designer who focuses on the balance between creative vision and technical implementation. I approach game design as a holistic process, where compelling mechanics meet optimized technical workflows and a deep understanding of player psychology.",
            "Currently a student of Digital Game Design, I have spent my academic journey mastering Unreal Engine 5 and exploring the structural foundations of successful game titles. My work ranges from developing VR prototypes and complex enemy AI systems to conducting in-depth UX and cognitive research."
        ]
    },
    {
        id: "philosophy",
        title: "Philosophy",
        image: "images/pic01.jpg",
        text: [
            "My design philosophy lies at the intersection of technical precision and cognitive psychology. To me, game design is not just about building mechanics; it is about crafting systems that manage player attention, memory, and motivation."
        ]
    }
];

window.FEATURED_DATA = {
    title: "FEATURED",
    subtitle: "Speaking Engagements | Publications | Open Source Contributions",
    groups: [
        {
            year: "2026",
            id: "year-2026",
            image: "images/pic01.jpg",
            floatClass: "float-1",
            entries: [
                {
                    title: '"Advanced Architectures in Modern Web Applications"',
                    link: "#",
                    location: "Global Developer Conference (GDC)",
                    description: "A deep dive into micro-frontends and scalable backend design for enterprise solutions."
                },
                {
                    title: 'Medium Publication: "Mastering State Management"',
                    link: "#",
                    location: "Front-End Focus Journal",
                    description: "A comprehensive guide on when to use Context API versus Redux in large React codebases."
                }
            ]
        },
        {
            year: "2024",
            id: "year-2024",
            image: "images/pic02.jpg",
            floatClass: "float-2",
            entries: [
                {
                    title: 'Tech Solutions Podcast, "The Future of Full Stack"',
                    link: "#",
                    location: "Guest Speaker",
                    description: "Discussing the blurring lines between frontend and backend technologies with the rise of meta-frameworks like Next.js."
                }
            ]
        }
    ]
};

window.RESUME_DATA = {
    title: "RESUME",
    downloadLink: "https://drive.google.com/file/d/1-2jL3Sj7bj4fki3bDNA3SpRg598oh3Fk/view?usp=drive_link",
    downloadLabel: "RESUME 2026",
    experience: [
        {
            /*id: "job-1",
            role: "Software Developer",
            company: "Tech Innovators Inc.",
            dates: "August 2023 - Present",
            description: "I am responsible for designing intuitive APIs, creating robust backend services, and helping with the direction of the core products. I work on both server-side logic and client-side integration to deliver seamless full-stack web applications.",
            logo: "images/pic01.jpg"*/
        },
        {
            /*id: "job-2",
            role: "Junior Frontend Engineer",
            company: "Creative Web Solutions",
            dates: "Jan 2021 - July 2023",
            description: "I worked as a bridge between the Design and Engineering teams. My role involved creating the UI, UX, and Interaction Design for client-facing applications using modern Javascript frameworks like React and Vue.",
            logo: "images/pic02.jpg"*/
        },
        {
            /*id: "job-3",
            role: "Web Development Intern",
            company: "Startup Launchpad",
            dates: "Summer 2020",
            description: "I assisted in building MVP web applications for early-stage startups, focusing on responsive HTML/CSS layouts and basic JavaScript interactivity.",
            logo: "" // Optional*/
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PROJECTS, HOME_SECTIONS, FEATURED_DATA, RESUME_DATA };
}
