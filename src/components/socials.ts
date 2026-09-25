import { site } from "@/data/site";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "./BrandIcons";

const all = [
  { label: "GitHub", href: site.socials.github, Icon: GithubIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedinIcon },
  { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
  { label: "X (Twitter)", href: site.socials.twitter, Icon: XIcon },
  { label: "Facebook", href: site.socials.facebook, Icon: FacebookIcon },
];

// Only socials with a link filled in are shown.
export const socialLinks = all.filter((s) => s.href);

export const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
  site.contact.whatsappMessage,
)}`;

// Opens Gmail's "compose" window in a new tab, with your address and subject filled in.
export const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${site.contact.email}&su=${encodeURIComponent(
  site.contact.emailSubject,
)}`;
