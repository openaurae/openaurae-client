export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "OpenAurae",
  description: "Manage your IoT devices and view real-time sensor metrics.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Devices",
      href: "/devices",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Devices",
      href: "/devices",
    },
  ],
  links: {
    github: "https://github.com/openaurae",
    docs: "https://github.com/openaurae",
  },
};
