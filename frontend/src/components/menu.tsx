import { MenuProps } from "@/types";

export default function Menu({ days }: MenuProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Menu</h2>
      {days.map((day) => (
        <div key={day.id}>
          <h3 className="font-medium">{day.heading}</h3>
          <ul className="ml-4 list-disc">
            {day.item.map((it) => (
              <li key={it.id}>
                <span>{it.description}</span> – <span>{it.price}</span>{" "}
                <span className="italic text-sm text-gray-500">{it.kind}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
