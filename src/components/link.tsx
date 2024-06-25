import { Link, LinkProps } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import { NavLink } from "react-router-dom";

export const RouteLink = ({ href, children, isExternal }: LinkProps) => {
  return (
    <NavLink to={href || "/"}>
      {({ isActive }) => (
        <Link
          className={linkStyles({
            color: isActive ? "primary" : "foreground",
          })}
          isExternal={isExternal}
        >
          {children}
        </Link>
      )}
    </NavLink>
  );
};
