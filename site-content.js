window.SITE_CONTENT = {
    "HOME_SECTIONS":  [
                          {
                              "id":  "background",
                              "title":  "Background",
                              "text":  [
                                           "I am a Digital Game Designer who focuses on the balance between creative vision and technical implementation. I approach game design as a holistic process, where compelling mechanics meet optimized technical workflows and a deep understanding of player psychology.",
                                           "Currently studying Digital Game Design at Bahçeşehir University, I have spent my academic journey mastering Unreal Engine 5 and exploring the structural foundations of successful game titles. My work ranges from developing VR prototypes and complex enemy AI systems to conducting in-depth UX and cognitive research."
                                       ],
                              "image":  ""
                          }
                      ],
    "RESUME_DATA":  {
                        "title":  "RESUME",
                        "downloadLink":  "DEMIRCIYEKTA_CV_2026_October.pdf",
                        "downloadLabel":  "Download CV (PDF)",
                        "experience":  [
                                           {
                                               "id":  "garage-atlas",
                                               "role":  "Technical Artist \u0026 Designer Intern",
                                               "company":  "Garage Atlas",
                                               "dates":  "Apr 2026 – Jul 2026",
                                               "bullets":  [
                                                               "Designed and simulated digital garments in \u003cb\u003eMarvelous Designer\u003c/b\u003e using custom patterns and draping techniques, preparing character clothing meshes for retopology and deformation.",
                                                               "Collaborated on \u003cb\u003e35 motion capture recordings across 7 project teams\u003c/b\u003e using \u003cb\u003eXsens motion capture suits, MANUS gloves, Xsens Animate, and MANUS Core\u003c/b\u003e to capture full-body and finger movements.",
                                                               "Developed \u003cb\u003eRepoTool\u003c/b\u003e, a custom Houdini tool that automates the wrapping of AI-generated and handcrafted character meshes onto MetaHuman-compatible or custom target topologies, reducing manual retopology work.",
                                                               "Reduced level draw calls from \u003cb\u003eapproximately 3,500 to 700\u003c/b\u003e by restructuring environment assets using Hierarchical Instanced Static Meshes (HISM), Packed Level Actors, and Blueprint-based instancing workflows.",
                                                               "Diagnosed \u003cb\u003eLumen global illumination issues\u003c/b\u003e using probe visualization tools and implemented Per Instance Custom Data for material variations across instanced environment assets."
                                                           ]
                                           }
                                       ]
                    },
    "FEATURED_DATA":  {
                          "title":  "FEATURED",
                          "subtitle":  "Publications \u0026 talks",
                          "groups":  [

                                     ]
                      },
    "SETTINGS":  {
                     "theme":  {
                                   "background":  "#000000",
                                   "text":  "#ffffff",
                                   "accent":  "#40e0d0",
                                   "bodyFont":  "Open Sans",
                                   "headingFont":  "Montserrat",
                                   "sectionSpacing":  100
                               },
                     "portfolio":  {
                                       "pageSize":  9,
                                       "columns":  3,
                                       "gap":  40,
                                       "ratio":  0.8889
                                   },
                     "homeSections":  [
                                          {
                                              "id":  "top",
                                              "visible":  true
                                          },
                                          {
                                              "id":  "showcase",
                                              "visible":  true
                                          },
                                          {
                                              "id":  "background",
                                              "visible":  true
                                          },
                                          {
                                              "id":  "contact",
                                              "visible":  true
                                          }
                                      ],
                     "shared":  {
                                    "enabled":  false,
                                    "logo":  "images/LOGO.png",
                                    "copyright":  "© 2026 by Yekta Demirci",
                                    "menu":  [
                                                 {
                                                     "link":  "index.html",
                                                     "title":  "HOME"
                                                 },
                                                 {
                                                     "link":  "portfolio.html",
                                                     "title":  "PORTFOLIO"
                                                 },
                                                 {
                                                     "link":  "resume.html",
                                                     "title":  "RESUME"
                                                 },
                                                 {
                                                     "link":  "featured.html",
                                                     "title":  "FEATURED"
                                                 },
                                                 {
                                                     "link":  "index.html#contact",
                                                     "title":  "CONTACT"
                                                 }
                                             ],
                                    "social":  [
                                                   {
                                                       "title":  "LinkedIn",
                                                       "link":  "https://www.linkedin.com/in/yekta-demirci",
                                                       "icon":  "linkedin-in"
                                                   },
                                                   {
                                                       "title":  "Itch.io",
                                                       "link":  "https://yekta-demirci.itch.io/",
                                                       "icon":  "itch-io"
                                                   },
                                                   {
                                                       "title":  "GitHub",
                                                       "link":  "https://github.com/Lutherieon",
                                                       "icon":  "github"
                                                   },
                                                   {
                                                       "title":  "ArtStation",
                                                       "link":  "https://www.artstation.com/devletsanatcisi",
                                                       "icon":  "artstation"
                                                   }
                                               ]
                                },
                     "messages":  {
                                      "contributions":  "My contributions:",
                                      "emptyCategory":  "No projects in this category. Choose All to browse the portfolio.",
                                      "pdfUnavailable":  "The preview is unavailable. ",
                                      "pdfLink":  "Open the analysis (PDF)"
                                  }
                 }
};
Object.assign(window, window.SITE_CONTENT);
