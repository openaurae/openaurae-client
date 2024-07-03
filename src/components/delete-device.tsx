import { useDevices } from "@/hooks/use-devices.ts";
import type { Device } from "@/types";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/modal";
import { Tooltip } from "@nextui-org/tooltip";
import { Trash2 } from "lucide-react";

export const DeleteDeviceButton = ({ device }: { device: Device }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { removeDevice } = useDevices();

	return (
		<>
			<Tooltip color="danger" content="Delete Device">
				<Link className="text-lg text-danger" as="button" onClick={onOpen}>
					<Trash2 size={20} />
				</Link>
			</Tooltip>

			<Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => {
						const onConfirm = async () => {
							await removeDevice(device);
							onClose();
						};

						return (
							<>
								<ModalHeader>Delete Device</ModalHeader>
								<ModalBody>
									Are you sure you want to delete the device? This operation
									cannot be undone.
								</ModalBody>
								<ModalFooter>
									<Button color="danger" onPress={onConfirm}>
										Confirm
									</Button>
								</ModalFooter>
							</>
						);
					}}
				</ModalContent>
			</Modal>
		</>
	);
};
