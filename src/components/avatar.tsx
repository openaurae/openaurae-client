import { useAuth0User } from "@/hooks/use-user";
import { Avatar } from "@nextui-org/avatar";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import type React from "react";
import { toast } from "react-toastify";

const UserAvatar: React.FC = () => {
	const { user, isLoading, accessToken, logout } = useAuth0User();

	if (!user) {
		return null;
	}
	if (isLoading) {
		return <Avatar isBordered as="button" color="default" size="sm" />;
	}

	const copyAccessToken = async () => {
		await navigator.clipboard.writeText(accessToken || "");
		toast("Token copied");
	};

	return (
		<Dropdown placement="bottom">
			<DropdownTrigger>
				<Avatar
					isBordered
					as="button"
					className="transition-transform"
					color="secondary"
					name={user.name}
					size="sm"
					src={user.picture}
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem key="profile" className="h-14 gap-2">
					<p className="font-semibold">Signed in as</p>
					<p className="font-semibold">{user.email}</p>
				</DropdownItem>
				<DropdownItem key="settings">Settings</DropdownItem>
				<DropdownItem
					key="copy_access_token"
					color="warning"
					hidden={!import.meta.env.DEV}
					onClick={copyAccessToken}
				>
					Copy Access Token
				</DropdownItem>
				<DropdownItem key="logout" color="danger" onClick={logout}>
					Log Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};

export default UserAvatar;
