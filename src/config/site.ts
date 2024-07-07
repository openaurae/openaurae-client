export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "OpenAurae",
	description: "Manage your IoT devices and view real-time sensor metrics.",
	navItems: [
		{
			label: "Dashboard",
			href: "/",
		},
		{
			label: "Devices",
			href: "/devices",
		},
	],
	navMenuItems: [
		{
			label: "Dashboard",
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
