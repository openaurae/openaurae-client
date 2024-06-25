import { withAuthenticationRequired } from "@auth0/auth0-react";

import DeviceTable from "@/components/device-table";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const DevicesPage = () => {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-4">
        <h1 className={title()}>Devices</h1>
        <DeviceTable />
      </section>
    </DefaultLayout>
  );
};

export default withAuthenticationRequired(DevicesPage);
