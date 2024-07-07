import { Navbar } from "@/components/navbar";
import { useTheme } from "@/hooks/use-theme.ts";
import { Link } from "@nextui-org/link";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function DefaultLayout() {
	const { isLight } = useTheme();

	return (
		<div className="relative flex h-screen flex-col gap-2 md:gap-6">
			<Navbar />
			<main className="container mx-auto max-w-7xl flex-grow px-4 md:px-6">
				<Outlet />
			</main>
			<ToastContainer
				autoClose={3000}
				position="bottom-right"
				theme={isLight ? "light" : "dark"}
			/>
			<footer className="flex w-full items-center justify-center py-3">
				<Link
					isExternal
					className="flex items-center gap-1 text-current"
					href="https://app.openaurae.org/"
					title="OpenAurae homepage"
				>
					<span className="text-default-600">Powered by</span>
					<p className="text-primary">OpenAurae</p>
				</Link>
			</footer>
		</div>
	);
}
