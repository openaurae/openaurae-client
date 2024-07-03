import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/modal";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import { useDevices } from "@/hooks/use-devices.ts";
import { type Device, deviceSchema } from "@/types";
import type { z } from "zod";

const formSchema = deviceSchema.pick({
	id: true,
	name: true,
	latitude: true,
	longitude: true,
});

type Form = z.infer<typeof formSchema>;

export const AddDeviceButton = () => {
	const { addDevice } = useDevices();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<Form>({ resolver: zodResolver(formSchema) });

	return (
		<>
			<Button onPress={onOpen} color="primary" size="md">
				Add Device
			</Button>
			<Modal
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				placement="center"
			>
				<ModalContent>
					{(onClose) => {
						const onSubmit: SubmitHandler<Form> = async (values) => {
							await addDevice(values as Device);
							onClose();
						};

						return (
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader className="flex flex-col gap-1">
									Add Device
								</ModalHeader>
								<ModalBody>
									<Controller
										name="id"
										control={control}
										render={({ field }) => (
											<Input
												isRequired
												label="Device Id"
												description="Allowed characters: a-z, A-Z, 0-9, :"
												isInvalid={errors.id !== undefined}
												errorMessage={errors.id?.message}
												{...field}
											/>
										)}
									/>

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
