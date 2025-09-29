import { Form as MyForm } from "@/components/form";
import { MapComponent } from "@/components/map";
import { SideBySideProps } from "@/types";

export function SideBySide({ map, form }: Readonly<SideBySideProps>) {
  const { address } = map;

  return (
    <div className="flex flex-col md:flex-row container md:min-h-[83vh] md:pt-20">
      <div className="w-full md:w-1/2 md:p-4 pb-4">
        <MapComponent address={address} />
      </div>
      <div className="w-full md:w-1/2 md:p-4">
        <MyForm
          fields={form.fields}
          submitButton={form.submitButton}
          recipientEmail={form.recipientEmail}
        />
      </div>
    </div>
  );
}
