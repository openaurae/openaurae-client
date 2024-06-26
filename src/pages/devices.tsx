import { withAuthenticationRequired } from "@auth0/auth0-react";

import DeviceTable from "@/components/device-table";

const DevicesPage = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <DeviceTable />
    </section>
  );
};

export default withAuthenticationRequired(DevicesPage);
