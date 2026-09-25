// ─────────────────────────────────────────────────────────────
//  CONTENT FOR THE SERVICE PAGES
//  /website-development, /web-app-development, /ecommerce-development
//  Edit the text between the quotes "..." and save.
// ─────────────────────────────────────────────────────────────

export type ServiceSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ServicePage = {
  slug: string;
  /** Short name used in menus, breadcrumbs and schema */
  name: string;
  /** Browser tab + Google result title (keep under ~60 characters) */
  seoTitle: string;
  /** Google result description (keep around 150–160 characters) */
  description: string;
  keywords: string[];
  h1: string;
  intro: string[];
  sections: ServiceSection[];
  faqs: { q: string; a: string }[];
};

export const servicePages: ServicePage[] = [
  {
    slug: "website-development",
    name: "Website Development",
    seoTitle: "Website Developer in Ahmedabad — Custom & WordPress Websites",
    description:
      "Fast, mobile-friendly, SEO-ready websites for businesses in Ahmedabad and across India. Custom Next.js or WordPress websites by Keyur (devsden).",
    keywords: [
      "website developer in Ahmedabad",
      "web developer in Ahmedabad",
      "website developer India",
      "WordPress developer",
      "business website design",
      "freelance web developer Ahmedabad",
    ],
    h1: "Website Development in Ahmedabad",
    intro: [
      "Your website is often the first thing a customer sees before they call you, visit your shop or hire you. If it loads slowly, looks broken on a phone or is hard to find on Google, people simply move on to the next result. I build websites that fix exactly that: fast, clean, easy to update and designed to turn visitors into enquiries.",
      "I'm Keyur, a web developer based in Ahmedabad, and I work with small businesses, startups and professionals across India. Every site is built around your goals — whether that's more phone calls, more WhatsApp messages or more walk-ins.",
    ],
    sections: [
      {
        heading: "What you get with every website",
        bullets: [
          "A custom design that matches your brand — no copy-paste templates",
          "Fully mobile-responsive layout that works on every phone, tablet and laptop",
          "Fast loading pages, optimised images and good Core Web Vitals",
          "On-page SEO basics: titles, descriptions, headings, sitemap and schema",
          "WhatsApp, call and email buttons so customers can reach you in one tap",
          "Google Maps, contact forms and social media links where they make sense",
        ],
      },
      {
        heading: "Custom-coded or WordPress — the right fit for you",
        paragraphs: [
          "Not every business needs the same setup. For brands that want the best speed and a unique look, I build custom websites with Next.js and React. They are extremely fast, secure and score well in Google's page-speed tests.",
          "If you want to edit pages and publish blog posts yourself without touching code, I work as a WordPress developer too. I set up a clean, lightweight theme, avoid unnecessary plugins and show you how to manage your content with confidence. Either way, you own your website completely.",
        ],
      },
      {
        heading: "How the process works",
        bullets: [
          "Discovery: a quick call or WhatsApp chat to understand your business, audience and goals",
          "Plan & design: a page structure and design direction you approve before any coding starts",
          "Build: development with regular previews, so you always see progress",
          "Launch: domain connection, speed checks, SEO setup and submission to Google Search Console",
          "Support: small changes, updates and help after launch whenever you need it",
        ],
      },
      {
        heading: "Who this is for",
        paragraphs: [
          "Local shops, clinics, consultants, coaches, manufacturers, restaurants and service businesses in Ahmedabad and Gujarat — and anyone in India who wants a professional online presence that works as hard as they do. If you already have a website that feels outdated or slow, I can redesign it while keeping the content and Google rankings you have already earned.",
        ],
      },
      {
        heading: "Why work with a local web developer",
        paragraphs: [
          "Working with a developer in Ahmedabad means you speak to the person actually building your site — no agency layers, no confusion. You get honest advice, quick replies on WhatsApp and a website that is built to last, not just to look good on launch day.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does it take to build a website?",
        a: "A typical business website with 4–6 pages takes around 1 to 3 weeks, depending on how quickly content and feedback are shared. Larger sites with many pages or custom features take longer, and I share a clear timeline before we start.",
      },
      {
        q: "Will my website work well on mobile phones?",
        a: "Yes. Every website I build is mobile-first, which means it is designed for phones from the start and then scaled up for tablets and desktops. Most of your visitors will arrive on a phone, so this is never an afterthought.",
      },
      {
        q: "Do you work only with businesses in Ahmedabad?",
        a: "No. I'm based in Ahmedabad and happy to meet local clients, but I work with businesses all over India. Most projects run smoothly over WhatsApp, phone and video calls.",
      },
      {
        q: "Can I update the website myself after it's live?",
        a: "Yes. If editing content yourself is important, a WordPress website is usually the best choice and I'll show you how to use it. For custom-coded sites, I can handle updates for you or set up an easy way to edit key content.",
      },
      {
        q: "Will my website show up on Google?",
        a: "I set up the technical SEO foundations — fast pages, proper titles and descriptions, a sitemap, structured data and Google Search Console. Rankings also depend on competition and content over time, and I'm happy to guide you on the next steps.",
      },
    ],
  },
  {
    slug: "web-app-development",
    name: "Web App Development",
    seoTitle: "Web App Developer for Small Business — Custom Web Apps",
    description:
      "Custom web applications for small businesses: dashboards, booking systems, portals and internal tools built with React, Next.js and Node.js by Keyur.",
    keywords: [
      "web app developer for small business",
      "custom web application development",
      "web app developer in Ahmedabad",
      "React developer India",
      "Next.js developer",
      "dashboard development",
    ],
    h1: "Web App Development for Small Businesses",
    intro: [
      "Many small businesses still run on spreadsheets, paper registers and endless WhatsApp messages. It works — until it doesn't. Orders get missed, data is scattered and the same tasks are repeated every day. A custom web app brings everything into one place that you and your team can open from any browser.",
      "I'm Keyur, a web app developer based in Ahmedabad. I build practical, easy-to-use web applications for small businesses across India, designed around the way you already work instead of forcing you into software that doesn't fit.",
    ],
    sections: [
      {
        heading: "What kind of web apps I build",
        bullets: [
          "Admin dashboards to track sales, leads, stock or daily reports",
          "Booking and appointment systems for clinics, salons, studios and services",
          "Customer and client portals with secure login",
          "Internal tools that replace spreadsheets and manual paperwork",
          "Simple CRMs to follow up with leads and customers",
          "Forms, workflows and automatic email or WhatsApp notifications",
        ],
      },
      {
        heading: "Built with modern, reliable technology",
        paragraphs: [
          "I use proven tools such as React and Next.js for fast, smooth interfaces, and Node.js with Express for the server side. Data is stored safely in databases like MySQL, MongoDB or Firebase, depending on what suits your project best.",
          "Everything is built to be secure from day one — protected logins, role-based access for staff and admins, and regular backups. Because it's a web app, there's nothing to install: it works on phones, tablets and computers, and it can grow with your business as you add new features later.",
        ],
      },
      {
        heading: "A simple, step-by-step process",
        bullets: [
          "Understand: we map out your current process and the problems you want to solve",
          "Plan: I suggest the features for a first version that delivers value quickly",
          "Design: clear screens you can review before development starts",
          "Build & test: development in small milestones with demo links along the way",
          "Launch & train: deployment, a walkthrough for your team and ongoing support",
        ],
      },
      {
        heading: "Why start small",
        paragraphs: [
          "The best web apps begin with a focused first version that solves your biggest problem. Instead of spending months on every possible feature, we launch something useful quickly, learn from how your team uses it, and improve step by step. This keeps costs under control and makes sure the final product is something people actually enjoy using.",
        ],
      },
      {
        heading: "Why small businesses work with me",
        paragraphs: [
          "You work directly with the developer who designs, builds and supports your app — so nothing gets lost between a salesperson, a designer and a coder. I explain technical choices in simple language, share progress regularly and focus on features that save your team real time every week.",
          "After launch I stay available for fixes, improvements and new ideas, so your web app keeps up as your business changes and grows.",
        ],
      },
    ],
    faqs: [
      {
        q: "What's the difference between a website and a web app?",
        a: "A website mainly shares information, like your services and contact details. A web app lets people do things — log in, book, manage data, see reports or place orders. Many businesses start with a website and add a web app as they grow.",
      },
      {
        q: "How much does a custom web app cost?",
        a: "It depends on the features, number of user roles and integrations you need. After a short discussion about your requirements, I share a clear quote and suggest a smaller first version if you want to start with a lower budget.",
      },
      {
        q: "Can my team use the web app on their phones?",
        a: "Yes. Every web app I build is responsive, so it works in the browser on phones, tablets and computers without installing anything.",
      },
      {
        q: "Is my business data safe?",
        a: "Security is built in from the start: secure login, protected access for different roles, encrypted connections (HTTPS) and regular backups. You always own your data.",
      },
      {
        q: "Can you add features later?",
        a: "Absolutely. Web apps are built to grow. Once the first version is live, we can add new modules, reports or integrations whenever your business needs them.",
      },
    ],
  },
  {
    slug: "ecommerce-development",
    name: "E-commerce Development",
    seoTitle: "Shopify & WooCommerce Developer — E-commerce Websites",
    description:
      "Online stores that sell: Shopify developer and WooCommerce expert in Ahmedabad building fast, mobile-friendly e-commerce websites with secure payments.",
    keywords: [
      "Shopify developer",
      "Shopify developer India",
      "WooCommerce developer",
      "ecommerce website developer in Ahmedabad",
      "online store development",
      "WordPress developer",
    ],
    h1: "E-commerce Website Development — Shopify & WooCommerce",
    intro: [
      "Selling online is one of the best ways to grow a business in India, but a slow or confusing store loses customers at every step. I build e-commerce websites that are fast, trustworthy and easy to shop on — especially on mobile, where most orders now happen.",
      "I'm Keyur, an e-commerce and Shopify developer based in Ahmedabad. I help brands, retailers and home businesses across India launch online stores, or improve the ones they already have.",
    ],
    sections: [
      {
        heading: "Shopify, WooCommerce or custom — which is right for you?",
        paragraphs: [
          "Shopify is ideal if you want an all-in-one platform that's simple to manage, secure and quick to launch. As a Shopify developer, I set up and customise your theme, collections, product pages, apps and payment options so your store looks unique rather than like every other template.",
          "WooCommerce runs on WordPress and gives you more flexibility and lower monthly costs, which suits many growing businesses. For brands with special requirements, I can also build a fully custom store with Next.js. I'll explain the pros and cons of each in plain language and recommend what fits your products and budget.",
        ],
      },
      {
        heading: "Everything your store needs",
        bullets: [
          "Attractive product pages with clear photos, prices and variants",
          "Secure payments with popular Indian gateways such as Razorpay, plus UPI, cards and cash on delivery",
          "Shipping setup, order management and customer emails",
          "Discount codes, offers and featured collections",
          "Fast, mobile-first design that reduces abandoned carts",
          "SEO-friendly product and category pages so shoppers can find you on Google",
        ],
      },
      {
        heading: "How we'll build your online store",
        bullets: [
          "Discuss your products, customers and how you currently sell",
          "Choose the right platform and plan the store structure",
          "Design and build the store, then add products and payment options",
          "Test orders, checkout and mobile experience thoroughly before launch",
          "Launch, then train you to manage products and orders yourself",
        ],
      },
      {
        heading: "Already have a store?",
        paragraphs: [
          "If your current store is slow, hard to manage or not converting, I can help with speed optimisation, a redesign, better product pages or moving from one platform to another without losing your products and customer data.",
        ],
      },
      {
        heading: "Why sell with a store built by me",
        paragraphs: [
          "I care about the details that make people trust a store and complete their purchase: clear product information, fast pages, simple checkout and helpful emails after every order. You work directly with me from planning to launch, and I explain every step in plain language.",
          "Once your store is live, I remain available for new products, seasonal offers, speed checks and improvements, so your online business keeps growing.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I choose Shopify or WooCommerce?",
        a: "Shopify is easier to manage and great if you want a quick, reliable setup with less maintenance. WooCommerce offers more flexibility and lower ongoing costs but needs a bit more care. I'll recommend the best option after understanding your products and budget.",
      },
      {
        q: "Can I accept UPI and cash on delivery?",
        a: "Yes. Using payment gateways like Razorpay, your store can accept UPI, debit and credit cards, net banking and wallets. Cash on delivery can be enabled too.",
      },
      {
        q: "Will I be able to add products myself?",
        a: "Yes. Both Shopify and WooCommerce have simple dashboards for adding products, changing prices and managing orders. I'll walk you through everything after launch.",
      },
      {
        q: "How long does it take to launch an online store?",
        a: "A standard store usually takes about 2 to 4 weeks, depending on the number of products, custom features and how quickly product details and photos are ready.",
      },
      {
        q: "Can you improve my existing online store?",
        a: "Yes. I can speed it up, redesign pages, improve the checkout, fix issues or migrate it to a different platform while keeping your products and orders.",
      },
    ],
  },
];

export const getServicePage = (slug: string) => {
  const page = servicePages.find((p) => p.slug === slug);
  if (!page) throw new Error(`Unknown service page: ${slug}`);
  return page;
};
