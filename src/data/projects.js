// Standardized Category Tags - Keep these consistent across all projects
export const CATEGORY_TAGS = {
  ART_DIRECTION: 'Art Direction',
  STRATEGY_CONCEPT: 'Strategy & Concept', 
  UI_UX: 'UI/UX',
  MOTION_AV: 'Motion / AV',
  CREATIVE_TECHNOLOGY: 'Creative Technology',
  IMMERSIVE_INSTALLATION: 'Immersive Installation',
  BRANDING: 'Branding'
};

export const projects = [
  {
    id: 'forum-archive-reverie',
    title: 'Forum – Archive Reverie',
    categories: [CATEGORY_TAGS.ART_DIRECTION, CATEGORY_TAGS.CREATIVE_TECHNOLOGY, CATEGORY_TAGS.MOTION_AV],
    year: '2025',
    images: {
      cover: '/projects/forum/cover.png',
    },
    content: [
      {
        type: 'overview',
        text: 'Forum – Archive Reverie is an immersive, interactive, cross-media ecosystem designed to celebrate the 55th anniversary of the iconic Forum Studios. At its core lies a dynamic archive, continuously evolving into new narratives, adaptable across diverse contexts and modes of exploration.'
      },
      {
        type: 'mainVideo',
        videoUrl: '/projects/forum/intro.mp4',
      },
      {
        type: 'heading',
        text: 'My Role'
      },
      {
        type: 'details',
        text: 'Art Direction, Creative Technology, Motion / AV, and Interactive Development.'
      },
      {
        type: 'heading',
        text: 'Context & Brief'
      },
      {
        type: 'details',
        text: 'Forum Studios, an iconic pillar of Italian cinema and music, sought to reinterpret its rich 55-year audiovisual legacy through an interactive and immersive experience.<br/><br/><b>Challenge:</b><br/>Transform a vast archive of films, music, and cultural fragments into a coherent, emotionally resonant digital ecosystem—flexible enough to adapt dynamically across different spaces and modes of exploration.<br/><br/><b>Solution:</b><br/>I designed a dynamic archive ecosystem that evolves through user interaction, generating new narratives, revealing hidden connections, and creating an immersive journey through memory and emotion.'
      },
      {
        type: 'videoGrid',
        columns: 1,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/forum/intro2.mp4',
        ]
      },
      {
        type: 'heading',
        text: 'Interactive Archive'
      },
      {
        type: 'details',
        text: 'I reimagined the archive as a responsive, three-dimensional space, inviting intuitive and personal exploration.<br/><br/><b>A Living Landscape</b><br/>Rejecting linear navigation, I created a reactive 3D environment hosting over 500 audiovisual items—films, images, and sounds—that dynamically rearrange to reveal unexpected connections as users navigate.<br/><br/><b>Immersive Audioplayer</b><br/>Activating content triggers related audio tracks, visualized through a real-time animated waveform inspired by the Forum logo. The archive generates a dynamic sonic environment, constantly adapting to user position and interactions.'
      },
      {
        type: 'videoGrid',
        columns: 1,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/forum/interaction.mp4',
        ]
      },
      {
        type: 'videoGrid',
        columns: 1,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/forum/archive-grid.mp4',
        ]
      },
      {
        type: 'videoGrid',
        columns: 1,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/forum/archive-row.mp4',
        ]
      },
      {
        type: 'heading',
        text: 'Smartphone Controller'
      },
      {
        type: 'details',
        text: 'Visitors scan a QR code, accessing a tactile, custom-designed controller. I designed the interface emphasizing intuitive navigation without visual distraction, enabling effortless control of large-scale installations.'
      },
      {
        type: 'videoGrid',
        columns: 1,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/forum/controller.mp4',
        ]
      },
      {
        type: 'heading',
        text: 'Process & Technical Approach'
      },
      {
        type: 'details',
        text: 'To ensure narrative and visual coherence across multiple interactive and immersive experiences, I developed a unified technological ecosystem built around the central archive.<br/><br/><b>Visual Production Tool: The Archive as Generative Engine</b><br/>At the core lies a flexible technological architecture, turning the interactive archive itself into a generative visual-production tool. This custom-built system enabled coherent reuse of assets, consistent visual language, and creative flexibility across different outputs.'
      },
      {
        type: 'videoGrid',
        columns: 2,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/forum/demo1.mp4',
          '/projects/forum/demo2.mp4',
        ]
      },
      {
        type: 'details',
        text: '<b>Custom Visual Tool Interface</b><br/>To streamline creative production, I developed an intuitive custom-designed UI within the visual tool. It enabled precise, real-time management of animations, spatial layouts, camera movements, and narrative elements.'
      },
      {
        type: 'videoGrid',
        columns: 1,
        aspectRatio: 'auto',
        videos: [
            '/projects/forum/tool1.mp4',
        ]
      },
      {
        type: 'videoGrid',
        columns: 1,
        aspectRatio: 'auto',
        videos: [
            '/projects/forum/tool2.mp4',
        ]
      },
      {
        type: 'details',
        text: '<b>MIDI Integration and Real-Time Control</b><br/>To enhance dynamic creative processes and live performances, I integrated MIDI control directly into the visual tool. This allowed real-time manipulation of visuals during production and performance, adding expressive depth and creative immediacy.'
      },
       {
        type: 'videoGrid',
        columns: 1,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/forum/midi.mp4',
        ]
      },
      {
        type: 'details',
        text: '<b>High-Resolution Visual Exports</b><br/>The visual tool supported exports up to 9600×1080 px, essential for large-scale immersive experiences. Captured MIDI interactions allowed precise dynamic visual outputs closely aligned with narrative intentions.'
      },
      {
        type: 'videoGrid',
        columns: 2,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/forum/export.mp4',
          '/projects/forum/export2.mp4',
        ]
      },
      {
        type: 'heading',
        text: 'Hybrid Video Production'
      },
      {
        type: 'details',
        text: 'The final immersive installation combined real-time generative visuals with a sophisticated hybrid workflow. Exports from the tool were enhanced using original video footage and additional animations created in After Effects and TouchDesigner, blending real-time visuals and post-production effects seamlessly.<br/><br/>I refined, manipulated, and layered exported visuals within After Effects, integrating advanced effects, transitions, and animations to heighten the overall visual and narrative impact.'
      },
      {
        type: 'videoGrid',
        columns: 2,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/forum/video1.mp4',
          '/projects/forum/video4.mp4',
          '/projects/forum/video3.mp4',
          '/projects/forum/video2.mp4',
        ]
      },
    ]
  },
  {
    id: 'ebay-app-promo',
    title: 'eBay App Promotion',
    categories: [CATEGORY_TAGS.MOTION_AV, CATEGORY_TAGS.STRATEGY_CONCEPT],
    year: '2025',
    images: {
      cover: '/projects/ebay-app-promo/cover.png',
    },
    content: [
      {
        type: 'overview',
        text: 'A strategic campaign to promote the eBay app in Italy. The goal was to refresh its brand communication and connect with a younger demographic through dynamic motion graphics and a revitalized visual language for social media.'
      },
      {
        type: 'mainVideo',
        videoUrl: '/projects/ebay-app-promo/ebay-spot.mp4',
      },
      {
        type: 'heading',
        text: 'Concept &mdash; "More Than Just Objects"'
      },
      {
        type: 'details',
        text: 'This spot reimagines eBay as more than a marketplace &mdash; as a <b>dynamic space where people, passions, and stories connect</b> through the objects they choose to exchange.<br/><br/>Inspired by the <b>emotional value</b> behind everyday items, the concept blends real, spontaneous moments with elements of eBay&rsquo;s user interface, creating a narrative <b>cyberspace</b> that is both human and digital. Each object becomes a starting point &mdash; a spark for new stories, new choices, new connections.<br/><br/>The tone balances personal storytelling with the reliability and variety that define eBay. It positions buying or selling not as a transaction, but as a <b>meaningful handoff</b> between lives.<br/>Designed as a <b>modular format</b>, the spot can adapt to multiple products and voices, with key phrases that turn each item into an experience.<br/><br/><b>An open narrative</b> &mdash; always ready to welcome new objects, new stories, and new protagonists.'
      },
      {
        type: 'imageGrid',
        columns: 2,
        aspectRatio: 'auto',
        images: [
          '/projects/ebay-app-promo/concept1.png',
          '/projects/ebay-app-promo/concept2.png',
          '/projects/ebay-app-promo/concept3.png',
          '/projects/ebay-app-promo/concept4.png',
        ]
      },
      {
        type: 'heading',
        text: 'Adaptations'
      },
      {
        type: 'details',
        text: 'The concept was extended across <b>multiple touchpoints</b>. In addition to the main spot, the campaign was adapted for social media posts, a vertical reel format, and out-of-home posters. Each adaptation works as a standalone "pill" &mdash; spotlighting a single object or encapsulating the essence of the campaign in a concise, impactful format.',
      },
      {
        type: 'mediaRow',
        items: [
          {
            type: 'image',
            url: '/projects/ebay-app-promo/social1.png',
            caption: 'social media post',
            aspectRatio: '4:5'
          },
          {
            type: 'image',
            url: '/projects/ebay-app-promo/social2.png',
            aspectRatio: '4:5'
          },
          {
            type: 'image',
            url: '/projects/ebay-app-promo/social3.png',
            aspectRatio: '4:5'
          },

        ]
      },
      {
        type: 'heading',
        text: 'Endless Scroll'
      },
      {
        type: 'details',
        text: 'The spot uses two types of scrolling to reflect eBay&rsquo;s richness:<br/><br/><b>Vertical scrolling</b> mirrors the natural app experience, emphasizing the breadth and variety of products.<br/><b>Horizontal scrolling</b> shifts the focus to people and stories, using a more narrative and cinematic approach to highlight the human side of the platform.<br/><br/>This dual structure balances <b>product exploration with emotional storytelling</b>.'
      },
      {
        type: 'videoGrid',
        columns: 2,
        aspectRatio: '16 / 9',
        videos: [
          '/projects/ebay-app-promo/vertical-scroll.mp4',
          '/projects/ebay-app-promo/horizontal-scroll.mp4',
        ]
      },
      {
        type: 'heading',
        text: 'Motion Behaviours'
      },
      {
        type: 'videoGrid',
        columns: 2,
        aspectRatio: '4 / 3',
        videos: [
          '/projects/ebay-app-promo/testo.mp4',
          '/projects/ebay-app-promo/searchbar.mp4',
          '/projects/ebay-app-promo/motion.mp4',
          '/projects/ebay-app-promo/motion2.mp4',
        ]
      }
    ]
  },
  {
    id: 'kollateral',
    title: 'KOLLATERAL',
    categories: [CATEGORY_TAGS.IMMERSIVE_INSTALLATION, CATEGORY_TAGS.MOTION_AV, CATEGORY_TAGS.ART_DIRECTION],
    year: '2025',
    images: {
      cover: '/projects/kollateral/cover.png',
    },
    content: [
      {
        type: 'details',
        text: 'A body in motion — through its scars, light emerges.'
      },
      {
        type: 'mainVideo',
        videoUrl: '/projects/kollateral/kollateral.mp4',
      },
      {
        type: 'heading',
        text: 'Synopsis'
      },
      {
        type: 'details',
        text: 'A suspended fabric bears deliberate burns and tears, each acting as a portal for light. Rather than weakening the material, these wounds allow illumination to pass through, creating a mesmerizing interplay of shadow and radiance.'
      },
      {
        type: 'imageGrid',
        columns: 1,
        aspectRatio: 'auto',
        images: [
          '/projects/kollateral/pic1.png',
        ]
      },
      {
        type: 'heading',
        text: 'Concept'
      },
      {
        type: 'details',
        text: 'Kollateral investigates themes of resilience and rebirth, combining physical sculpture with digitally controlled audiovisual elements. The installation transforms physical damage into dynamic visual poetry: the suspended fabric breathes and moves, animated by sound-driven airflow and synchronized lighting.<br/><br/>This contemplative space invites the audience to perceive trauma not as an ending, but as a transformative beginning.'
      },
      {
        type: 'imageGrid',
        columns: 1,
        aspectRatio: 'auto',
        images: [
          '/projects/kollateral/pic2.png',
        ]
      },
      {
        type: 'heading',
        text: 'Collateral Beauty'
      },
      {
        type: 'details',
        text: 'The name Kollateral evokes the idea of collateral beauty—light, meaning, and transformation emerging directly from rupture and damage.'
      },
      {
        type: 'heading',
        text: 'Real-Time Audiovisual Integration'
      },
      {
        type: 'details',
        text: 'Kollateral is a fully developed, interactive audiovisual installation, tested and ready for deployment.<br/><br/><b>Interactive System Components:</b><br/>Original sound composition (Ableton Live)<br/>Real-time audio analysis controlling visual elements (TouchDesigner)<br/>DMX-controlled lighting and airflow, synchronized via MIDI triggers responding to real-time audio input.<br/><br/>This integration ensures a dynamic, responsive experience, optimized for immersive audience engagement.'
      },
      {
        type: 'imageGrid',
        columns: 1,
        aspectRatio: 'auto',
        images: [
          '/projects/kollateral/pic3.png',
        ]
      },
      {
        type: 'heading',
        text: 'Timecoded Structure & Narrative'
      },
      {
        type: 'details',
        text: 'Kollateral is structured into multiple acts, synchronized via a precise timecode system. Each act forms part of an abstract narrative arc, aligned with the installation’s themes of transformation and renewal.<br/><br/>Each complete cycle lasts approximately 20 minutes and loops seamlessly, allowing audiences to enter at any point and engage with the evolving rhythmic narrative.'
      },
      {
        type: 'heading',
        text: 'Performance Capability'
      },
      {
        type: 'details',
        text: 'Kollateral can also be presented as a live performance, with all three artists directly controlling visual elements, lighting, and performing the original sound composition in real-time.'
      },
      {
        type: 'imageGrid',
        columns: 1,
        aspectRatio: 'auto',
        images: [
          '/projects/kollateral/pic4.png',
          '/projects/kollateral/pic5.png',
          '/projects/kollateral/pic6.png',
        ]
      }
    ]
  },
  {
    id: 'chupa-chups-sweet-escape',
    title: 'Chupa Chups – Sweet Escape',
    categories: [CATEGORY_TAGS.STRATEGY_CONCEPT, CATEGORY_TAGS.UI_UX],
    year: '2025',
    images: {
      cover: '/projects/chupa-chups/cover.png',
    },
    content: [
      {
        type: 'heading',
        text: 'Refreshing a Classic Icon'
      },
      {
        type: 'overview',
        text: 'A full strategic and creative campaign to reposition Chupa Chups for a younger digital audience. From research and brand analysis to the design of a cross-platform communication system, Sweet Escape reframes the brand as a bold, guilty pleasure &mdash; one that&rsquo;s earned, not given.<br/><br/>The project included: brand research, creative concept development, digital experience design, gamification, physical activations, and a social-first content strategy.'
      },
      {
        type: 'imageGrid',
        columns: 1,
        aspectRatio: 'auto',
        images: [
          '/projects/chupa-chups/intro2.png',
          '/projects/chupa-chups/intro3.png',
          '/projects/chupa-chups/intro4.png',
        ]
      },
      {
        type: 'heading',
        text: 'The Modern Forbidden Fruit'
      },
      {
        type: 'details',
        text: 'Chupa Chups isn&rsquo;t just a lollipop &mdash; it&rsquo;s a guilty pleasure to be conquered. Famously hard to unwrap, it becomes a playful metaphor for temptation and reward.<br/><br/>Like a modern forbidden fruit, it hides a sweetness that must be earned: its stubborn wrapper turns into a daily challenge, a small ritual of patience, desire, and just the right amount of frustration.<br/><br/><i>"Only the bold reach the center of pleasure."</i><br/><br/>Unwrapping a Chupa Chups becomes an irresistible urge &mdash; an instinctive, almost rebellious act to conquer something small, sweet, and slightly forbidden.<br/><br/><b>The goal:</b> To reposition the brand as a symbol of small daily transgressions &mdash; transforming the simple act of opening a lollipop into a moment of joy, irony, and emotional gratification.'
      },
      {
        type: 'imageGrid',
        aspectRatio: '16 / 9',
        columns: 1,
        images: ['/projects/chupa-chups/concept.png']
      },
      {
        type: 'heading',
        text: 'A Multichannel, Playful Journey'
      },
      {
        type: 'details',
        text: "The Sweet Escape experience unfolded across digital and physical spaces &mdash; blending street, social, and interactive content into a cohesive engagement flow.<br/><br/><b>Entry Points</b><br/>QR posters, social teasers, and a branded Mini Truck activated the journey in physical and digital environments.<br/><br/><b>Challenges</b><br/>Users could take on mini social challenges or short mobile games &mdash; playful actions that tested their creativity and determination.<br/><br/><b>Landing Page</b><br/>After completing a challenge, participants were directed to a landing page to claim small rewards and get early access info about the final event.<br/><br/><b>Final Event</b><br/>The journey culminated in a live pop-up event with music, visuals, and on-site challenges. Special guest: Anna Pepe, bringing energy and hype to the Sweet Escape finale.<br/><br/><b>Sweet Victory</b><br/>Final rewards were unlocked based on overall participation &mdash; rewarding consistency and engagement across the entire experience."
      },
       {
        type: 'imageGrid',
        columns: 1,
        aspectRatio: 'auto',
        images: ['/projects/chupa-chups/landingpage.png']
      },
      {
        type: 'heading',
        text: '#SweetEscapeChallenge: Social as Playground'
      },
      {
        type: 'details',
        text: 'Users were invited to join via IG Stories and TikTok challenges, tagging @chupachups_it and using #SweetEscapeChallenge.<br/><br/>The tone was personal, playful, and full of guilty pleasure energy &mdash; from rebellious captions to unwrapping rituals.'
      },
      {
        type: 'mediaRow',
        items: [
          { type: 'image', url: '/projects/chupa-chups/story1.png' },
          { type: 'image', url: '/projects/chupa-chups/story2.png' },
          { type: 'image', url: '/projects/chupa-chups/story3.png' },
          { type: 'image', url: '/projects/chupa-chups/story4.png' },
        ]
      },
      {
        type: 'heading',
        text: 'Play Mode: Mini Games, Maximum Pleasure'
      },
       {
        type: 'mediaRow',
        items: [
          { type: 'image', url: '/projects/chupa-chups/game1.png' },
          { type: 'image', url: '/projects/chupa-chups/game2.png' },
          { type: 'image', url: '/projects/chupa-chups/game3.png' },
          { type: 'image', url: '/projects/chupa-chups/game4.png' },
        ]
      },
      {
        type: 'details',
        text: 'In true Chupa Chups fashion, fun came first.<br/><br/>Participants could play simple, fast-paced games (inspired by match-3 and tap challenges) to earn access to rewards &mdash; because sometimes, pleasure really is something you have to fight for.'
      },
      {
        type: 'heading',
        text: 'Campaign Claims'
      },
      {
        type: 'details',
        text: '<i>Only the bold reach the center.</i><br/><i>A guilty pleasure you have to earn.</i><br/><i>Unwrap. Play. Win. Repeat.</i><br/><i>Pleasure tastes better when it&rsquo;s conquered.</i><br/><i>Small rebellion. Sweet reward.</i>'
      },
    ]
  },
  {
    id: 'netflix-lounge',
    title: 'Netflix Lounge — Social Streaming',
    categories: [CATEGORY_TAGS.UI_UX, CATEGORY_TAGS.STRATEGY_CONCEPT],
    year: '2023',
    images: {
      cover: '/projects/netflix/cover.png',
    },
    content: [
      {
        type: 'overview',
        text: 'A strategic concept to reimagine Netflix as a more social, participatory experience. Netflix Lounge was designed to increase user retention and engagement by turning content discovery into something shared, emotional, and customizable.<br/><br/>The project involved concept creation, user research, UI/UX design, prototyping, and a multichannel communication strategy.'
      },
      {
        type: 'heading',
        text: 'Context & Response'
      },
      {
        type: 'details',
        text: 'Despite its leadership in streaming, Netflix faces growing challenges in retaining users, who often feel overwhelmed by choice, disconnected from recommendations, and limited in how they organize or share content.<br/><br/>Netflix Lounge responds to this by introducing a social layer within the platform &mdash; allowing users to create and share watchlists, discover content through friends, co-watch with others, and personalize their profiles. The goal: to transform Netflix into a space of connection as well as consumption.'
      },
      {
        type: 'cyclingImage',
        images: [
          '/projects/netflix/response1.png',
          '/projects/netflix/response2.png',
          '/projects/netflix/response3.png',
          '/projects/netflix/response4.png',
        ]
      },
      {
        type: 'heading',
        text: 'UI & Keyfeatures'
      },
      {
        type: 'details',
        text: 'Netflix Lounge adds a social layer to the platform, allowing users to create and share custom watchlists and discover content through trusted friend recommendations. This shared experience encourages emotional connection and transforms Netflix into a space of connection as well as consumption.<br/><br/>The interface was visually refined using a glassmorphism aesthetic, bringing clarity and depth to the experience. The overall iconography and interface elements were carefully adapted to align with the new social functionalities, ensuring a cohesive and intuitive look & feel.'
      },
      {
        type: 'imageGrid',
        columns: 3,
        aspectRatio: 'auto',
        images: [
          '/projects/netflix/ui1.png',
          '/projects/netflix/ui2.png',
          '/projects/netflix/ui3.png',
          '/projects/netflix/ui5.png',
          '/projects/netflix/ui6.png',
          '/projects/netflix/ui7.png',
        ]
      },
      {
        type: 'heading',
        text: 'Physical Communication &mdash; Netflix Lounge Pass'
      },
      {
        type: 'details',
        text: 'To support the campaign launch, a printed format inspired by cinema tickets was designed.<br/><br/>This tactile element acts as a teaser &mdash; blending Netflix&rsquo;s tone of voice with guerrilla-style communication and a clear call-to-action via QR code. It connects the digital and physical, sparking curiosity and reinforcing the concept of Netflix as a shared space.'
      },
      {
        type: 'imageGrid',
        columns: 1,
        images: [
          '/projects/netflix/ticket1.png',
          '/projects/netflix/ticket2.png',
        ]
      },
      {
        type: 'heading',
        text: 'Social Media Posts'
      },
      {
        type: 'details',
        text: 'A set of teaser posts was designed to support a soft launch of Netflix Lounge. Each post showcases a different Netflix title, paired with a personal-style "review" &mdash; short, emotional, and authentic, as if written by a friend.<br/><br/>The goal is to spark curiosity and highlight the new social dynamic of the platform, without announcing it overtly. These posts were designed to match Netflix&rsquo;s visual tone, using familiar series visuals combined with micro-stories that reflect connection, emotion, and shared taste.'
      },
      {
        type: 'imageGrid',
        columns: 2,
        aspectRatio: '1/1',
        images: [
          '/projects/netflix/social1.png',
          '/projects/netflix/social2.png',
          '/projects/netflix/social3.png',
          '/projects/netflix/social4.png',
        ]
      },
    ]
  },
  {
    id: 'edeneve',
    title: 'EDENEVE',
    categories: [CATEGORY_TAGS.BRANDING, CATEGORY_TAGS.ART_DIRECTION],
    year: '2024',
    images: {
      cover: '/projects/edeneve/cover.png',
    },
    content: [
      {
        type: 'overview',
        text: 'This was a concept proposal for a newly launched cosmetic brand, developed from the ground up after an initial conversation with the client. I worked on defining the brand direction and visual world, crafting a narrative-driven concept and early-stage packaging explorations. The focus was on ideation, aesthetic positioning, and identity system potential.'
      },
      {
        type: 'imageGrid',
        columns: 1,
        aspectRatio: 'auto',
        images: [
          '/projects/edeneve/01.png',
          '/projects/edeneve/02.png',
          '/projects/edeneve/03.png',
          '/projects/edeneve/04.png',
          '/projects/edeneve/05.png',
          '/projects/edeneve/06.png',
          '/projects/edeneve/07.png',
          '/projects/edeneve/08.png',
          '/projects/edeneve/09.png',
          '/projects/edeneve/10.png',
          '/projects/edeneve/11.png',
          '/projects/edeneve/12.png',
          '/projects/edeneve/13.png',
          '/projects/edeneve/14.png',
          '/projects/edeneve/15.png',
          '/projects/edeneve/16.png',
          '/projects/edeneve/17.png',
          '/projects/edeneve/18.png',
        ]
      }
    ]
  },
  {
    id: 'redbull-360',
    title: 'RedBull 360 – Key Visual',
    categories: [CATEGORY_TAGS.ART_DIRECTION, CATEGORY_TAGS.BRANDING],
    year: '2024',
    images: {
      cover: '/projects/redbull-360/cover.png',
    },
    content: [
      {
        type: 'overview',
        text: 'I designed the key visual for RedBull’s 360 event in Ireland, shaping a bold, immersive graphic identity tailored for both digital and physical environments. The design was used across campaign materials, spatial graphics, and promotional content.'
      },
      {
        type: 'imageGrid',
        columns: 1,
        aspectRatio: 'auto',
        images: [
          '/projects/redbull-360/01.png',
          '/projects/redbull-360/02.png',
          '/projects/redbull-360/03.png',
          '/projects/redbull-360/04.png',
          '/projects/redbull-360/05.png',
          '/projects/redbull-360/06.png',
          '/projects/redbull-360/07.png',
        ]
      }
    ]
  },
];

const allCategories = projects.flatMap(p => p.categories);
export const categories = ['All', ...new Set(allCategories)];