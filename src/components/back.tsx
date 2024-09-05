import { Button } from "@nextui-org/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BackButton() {
	const navigate = useNavigate();

	return (
		<Button
			isIconOnly
			aria-label="back"
			color="primary"
			variant="flat"
			size="sm"
			onClick={() => navigate(-1)}
		>
			<ChevronLeft />
		</Button>
	);
}
