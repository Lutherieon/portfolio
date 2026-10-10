window.PROJECTS = (window.PROJECT_LIBRARY || []).filter(project => project.published === true);

window.PORTFOLIO_CATEGORIES = ["All", ...new Set(window.PROJECTS.map(project => project.category))];

window.HOME_SECTIONS = [
    {
        id: "background",
        title: "Background",
        text: [
            "I am a Digital Game Designer who focuses on the balance between creative vision and technical implementation. I approach game design as a holistic process, where compelling mechanics meet optimized technical workflows and a deep understanding of player psychology.",
            "Currently studying Digital Game Design at Bahçeşehir University, I have spent my academic journey mastering Unreal Engine 5 and exploring the structural foundations of successful game titles. My work ranges from developing VR prototypes and complex enemy AI systems to conducting in-depth UX and cognitive research."
        ]
    }
];

window.FEATURED_DATA = { title: "FEATURED", subtitle: "Publications & talks", groups: [] };

window.RESUME_DATA = {
    title: "RESUME",
    downloadLink: "DEMIRCIYEKTA_CV_2026_October.pdf",
    downloadLabel: "Download CV (PDF)",
    experience: [
        {
            id: "garage-atlas",
            role: "Technical Artist & Designer Intern",
            company: "Garage Atlas",
            dates: "Apr 2026 – Jul 2026",
            bullets: [
                "Designed and simulated digital garments in <b>Marvelous Designer</b> using custom patterns and draping techniques, preparing character clothing meshes for retopology and deformation.",
                "Collaborated on <b>35 motion capture recordings across 7 project teams</b> using <b>Xsens motion capture suits, MANUS gloves, Xsens Animate, and MANUS Core</b> to capture full-body and finger movements.",
                "Developed <b>RepoTool</b>, a custom Houdini tool that automates the wrapping of AI-generated and handcrafted character meshes onto MetaHuman-compatible or custom target topologies, reducing manual retopology work.",
                "Reduced level draw calls from <b>approximately 3,500 to 700</b> by restructuring environment assets using Hierarchical Instanced Static Meshes (HISM), Packed Level Actors, and Blueprint-based instancing workflows.",
                "Diagnosed <b>Lumen global illumination issues</b> using probe visualization tools and implemented Per Instance Custom Data for material variations across instanced environment assets."
            ]
        }
    ]
};
