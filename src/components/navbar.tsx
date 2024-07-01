import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
	Navbar as NextUINavbar,
} from "@nextui-org/navbar";

import UserAvatar from "@/components/avatar";
import { Logo } from "@/components/icons";
import { RouteLink } from "@/components/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { useAuth0User } from "@/hooks/use-user";
import { FaGithub as GithubIcon } from "react-icons/fa";

export const Navbar = () => {
	const { isAuthenticated, login, logout } = useAuth0User();

	return (
		<NextUINavbar
			isBordered
			maxWidth="full"
			position="sticky"
			className="lg:px-32"
		>
			{/* nav links */}
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarMenuToggle className="sm:hidden" />
				<NavbarBrand className="max-w-fit gap-3">
					<Link
						className="flex items-center justify-start gap-2"
						color="foreground"
						href="/"
					>
						<Logo size={24} />
						<p className="font-bold text-inherit">OpenAurae</p>
					</Link>
				</NavbarBrand>
				<div className="ml-2 hidden justify-start gap-4 pl-4 md:flex">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<RouteLink href={item.href}>{item.label}</RouteLink>
						</NavbarItem>
					))}
				</div>
			</NavbarContent>

			{/* lg: icons */}
			<NavbarContent
				className="hidden basis-1/5 sm:flex sm:basis-full"
				justify="end"
			>
				<NavbarItem className="hidden gap-2 sm:flex">
					<Link isExternal href={siteConfig.links.github}>
						<GithubIcon size={24} className="text-default-500" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
				<NavbarItem>
					{isAuthenticated ? (
						<UserAvatar />
					) : (
						<Button as={Link} color="primary" variant="flat" onClick={login}>
							Log In
						</Button>
					)}
				</NavbarItem>
			</NavbarContent>

			{/* sm: icons */}
			<NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
				<Link isExternal href={siteConfig.links.github}>
					<GithubIcon size={24} className="text-default-500" />
				</Link>
				<ThemeSwitch />
				<NavbarItem>
					{isAuthenticated ? (
						<UserAvatar />
					) : (
						<Button as={Link} color="primary" variant="flat" onClick={login}>
							Log In
						</Button>
					)}
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{siteConfig.navMenuItems.map((item) => (
						<NavbarMenuItem key={item.label}>
							<Link color="foreground" href={item.href} size="lg">
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
					<NavbarMenuItem key="logout" hidden={!isAuthenticated}>
						<Link as="button" color="danger" size="lg" onClick={logout}>
							Log Out
						</Link>
					</NavbarMenuItem>
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
