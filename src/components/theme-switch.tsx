import { type SwitchProps, useSwitch } from "@nextui-org/switch";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import clsx from "clsx";
import { type FC, useEffect, useState } from "react";

import { useTheme } from "@/hooks/use-theme";
import {
	FaMoon as MoonFilledIcon,
	FaSun as SunFilledIcon,
} from "react-icons/fa";

export interface ThemeSwitchProps {
	className?: string;
	classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
	className,
	classNames,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	const { theme, toggleTheme } = useTheme();

	const onChange = toggleTheme;

	const {
		Component,
		slots,
		isSelected,
		getBaseProps,
		getInputProps,
		getWrapperProps,
	} = useSwitch({
		isSelected: theme === "light",
		onChange,
	});

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Prevent Hydration Mismatch
	if (!isMounted) return <div className="h-6 w-6" />;

	return (
		<Component
			{...getBaseProps({
				className: clsx(
					"cursor-pointer px-px transition-opacity hover:opacity-80",
					className,
					classNames?.base,
				),
			})}
		>
			<VisuallyHidden>
				<input {...getInputProps()} />
			</VisuallyHidden>
			<div
				{...getWrapperProps()}
				className={slots.wrapper({
					class: clsx(
						[
							"h-auto w-auto",
							"bg-transparent",
							"rounded-lg",
							"flex items-center justify-center",
							"group-data-[selected=true]:bg-transparent",
							"!text-default-500",
							"pt-px",
							"px-0",
							"mx-0",
						],
						classNames?.wrapper,
					),
				})}
			>
				{isSelected ? (
					<MoonFilledIcon size={22} />
				) : (
					<SunFilledIcon size={22} />
				)}
			</div>
		</Component>
	);
};
