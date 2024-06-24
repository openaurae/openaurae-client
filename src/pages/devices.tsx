import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { withAuthenticationRequired } from "@auth0/auth0-react";

const DevicesPage = () => {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg justify-center text-center">
          <h1 className={title()}>Devices</h1>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default withAuthenticationRequired(DevicesPage);
