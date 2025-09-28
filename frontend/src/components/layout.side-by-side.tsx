import { Form as MyForm } from "@/components/form";
import { MapComponent } from "@/components/map";
import { SideBySideProps } from "@/types";

export function SideBySide({ map, form }: Readonly<SideBySideProps>) {
  const { address } = map;

  return (
    <div className="flex container">
      <div className="w-1/2 p-4">
        <MapComponent address={address} />
      </div>
      <div className="w-1/2 p-4">
        <MyForm
          fields={form.fields}
          submitButton={form.submitButton}
          recipientEmail={form.recipientEmail}
        />
      </div>
    </div>
  );
}
