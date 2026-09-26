// ─────────────────────────────────────────────────────────────
//  ALL YOUR WEBSITE TEXT LIVES HERE.
//  Change anything between the quotes "..." and save the file.
//  The website updates automatically while `npm run dev` runs.
// ─────────────────────────────────────────────────────────────

export const site = {
  // Your brand — shown in the top-left logo, browser tab and footer
  brand: "devsden",
  name: "Keyur",
  title: "Web Developer",
  tagline:
    "I build fast, modern websites and web apps that help businesses stand out and grow online.",
  // Where you work — used on the page and for Google (local search)
  city: "Ahmedabad",
  region: "Gujarat",
  country: "India",
  location: "Ahmedabad, India",
  // The live website address (used for Google, sitemap and link previews)
  url: "https://thedevsden.vercel.app",
  yearsExperience: 2,

  about: [
    "Hi, I'm Keyur — a web developer based in Ahmedabad with 2 years of hands-on experience turning ideas into fast, good-looking websites and web applications.",
    "I work across the full stack: from pixel-perfect, mobile-friendly designs on the front end to reliable servers and databases behind the scenes. Whether it's a business website, an online store, or a custom web app, I care about clean code, smooth performance, and a great experience for every visitor.",
    "I enjoy working closely with clients, keeping things simple, and delivering work that actually moves their business forward.",
  ],

  contact: {
    email: "thedevsden.me@gmail.com",
    emailSubject: "Project Inquiry",
    // WhatsApp number: digits only, with country code (91 = India)
    whatsapp: "916355538092",
    whatsappDisplay: "+91 63555 38092",
    phone: "+916355538092",
    whatsappMessage: "Hi Keyur! I saw your portfolio and would like to talk about a project.",
  },

  // Add your profile links here. Empty links ("") are hidden automatically.
  socials: {
    github: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    facebook: "",
  },
};

export const skillGroups = [
  { title: "Basics", skills: ["HTML", "CSS", "JavaScript"] },
  { title: "Frameworks", skills: ["React", "Next.js", "Vue", "Angular"] },
  { title: "Styling", skills: ["Tailwind CSS", "Bootstrap", "SASS"] },
  { title: "Backend", skills: ["Node.js", "Express", "PHP", "Python"] },
  { title: "Databases", skills: ["MySQL", "MongoDB", "Firebase"] },
  { title: "CMS & E-commerce", skills: ["WordPress", "Shopify", "WooCommerce"] },
  { title: "Tools & More", skills: ["Git & GitHub", "Figma", "SEO"] },
];

// `imageAlt` describes the picture for Google and screen readers.
// To use a real screenshot: put the image in the /public/projects folder
// and change `image` to "/projects/your-file-name.png".
// Put the website address in `liveUrl`. Leave it "" to show "Link coming soon".
export const projects = [
  {
    title: "Jokerwal Brothers",
    description:
      "A modern, fully responsive business website for Jokerwal Brothers — showcasing their services, building trust with customers, and making it easy to get in touch.",
    image: "/projects/jokerwal.webp",
    imageAlt: "Homepage design of the Jokerwal Brothers business website with hero banner and service cards",
    tags: ["Next.js", "Tailwind CSS", "SEO"],
    liveUrl: "",
    featured: true,
  },
  // ↓ Example projects — replace these with your own work.
  {
    title: "ShopNest Store",
    description:
      "An online store with product search, cart, secure checkout and an admin panel to manage orders.",
    image: "/projects/shop.webp",
    imageAlt: "ShopNest online store product grid showing prices and add-to-cart buttons",
    tags: ["WooCommerce", "WordPress", "PHP"],
    liveUrl: "",
  },
  {
    title: "TaskFlow Dashboard",
    description:
      "A team task-management web app with login, real-time updates and a clean, fast dashboard.",
    image: "/projects/dashboard.webp",
    imageAlt: "TaskFlow dashboard web app with stats cards, a progress chart and team task list",
    tags: ["React", "Node.js", "MongoDB"],
    liveUrl: "",
  },
  {
    title: "Spice Route Restaurant",
    description:
      "A mouth-watering restaurant website with an online menu, table booking and WhatsApp ordering.",
    image: "/projects/restaurant.webp",
    imageAlt: "Spice Route restaurant website homepage with menu highlights and booking button",
    tags: ["Vue", "Firebase", "SASS"],
    liveUrl: "",
  },
];

export const services = [
  {
    icon: "globe",
    title: "Websites",
    href: "/website-development",
    description:
      "Fast, beautiful and mobile-friendly websites for businesses, personal brands and startups.",
    points: ["Custom design", "Mobile responsive", "SEO-ready", "Fast loading"],
  },
  {
    icon: "app",
    title: "Web Apps",
    href: "/web-app-development",
    description:
      "Custom web applications — dashboards, booking systems, portals and tools built around your workflow.",
    points: ["User login & accounts", "Databases & APIs", "Admin panels", "Scalable code"],
  },
  {
    icon: "cart",
    title: "E-commerce",
    href: "/ecommerce-development",
    description:
      "Online stores that make selling easy — on Shopify, WooCommerce or fully custom.",
    points: ["Product catalog", "Secure payments", "Order management", "Conversion-focused"],
  },
] as const;
