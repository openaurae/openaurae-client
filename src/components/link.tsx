import { Link, type LinkProps } from "@nextui-org/link";
import { NavLink } from "react-router-dom";

export const RouteLink = ({ href, children, isExternal }: LinkProps) => {
	return (
		<NavLink className="m-0 inline p-0" to={href || "/"}>
			{({ isActive }) => (
				<Link
					as="span"
					color={isActive ? "primary" : "foreground"}
					isExternal={isExternal}
				>
					{children}
				</Link>
			)}
		</NavLink>
	);
};
