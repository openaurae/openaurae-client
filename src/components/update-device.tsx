import { useDevices } from "@/hooks/use-devices.ts";
import { type Device, deviceSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
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
import { Pencil } from "lucide-react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = deviceSchema.pick({
	name: true,
	latitude: true,
	longitude: true,
});

type Form = z.infer<typeof formSchema>;

export const UpdateDeviceButton = ({ device }: { device: Device }) => {
	const { updateDevice } = useDevices();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<Form>({
		resolver: zodResolver(formSchema),
		defaultValues: { ...device },
	});

	return (
		<>
			<Tooltip content="Edit Device">
				<Link className="text-lg text-default-400" as="button" onClick={onOpen}>
					<Pencil size={20} />
				</Link>
			</Tooltip>
			<Modal
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				placement="center"
			>
				<ModalContent>
					{(onClose) => {
						const onSubmit: SubmitHandler<Form> = async (values) => {
							await updateDevice({
								...device,
								...values,
							});
							onClose();
						};

						return (
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader className="flex flex-col gap-1">
									Add Device
								</ModalHeader>
								<ModalBody>
									<Controller
										name="name"
										control={control}
										render={({ field }) => (
											<Input
												isRequired
												label="Device Name"
												description="All characters are allowed"
												isInvalid={errors.name !== undefined}
												errorMessage={errors.name?.message}
												{...field}
											/>
										)}
									/>

									<Controller
										name="latitude"
										control={control}
										render={({ field }) => (
											<Input
												label="Latitude"
												type="number"
												{...field}
												value={field.value?.toString()}
												description="In range [-90, 90]"
												isInvalid={errors.latitude !== undefined}
												errorMessage={errors.latitude?.message}
											/>
										)}
									/>

									<Controller
										name="longitude"
										control={control}
										render={({ field }) => (
											<Input
												label="Longitude"
												type="number"
												{...field}
												value={field.value?.toString()}
												description="In range [-180, 180]"
												isInvalid={errors.longitude !== undefined}
												errorMessage={errors.longitude?.message}
											/>
										)}
									/>
								</ModalBody>
								<ModalFooter>
									<Button color="primary" type="submit">
										Confirm
									</Button>
								</ModalFooter>
							</form>
						);
					}}
				</ModalContent>
			</Modal>
		</>
	);
};
