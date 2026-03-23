interface Row {
  label: string;
  value: string | null | undefined;
  /** If true and value is null/undefined, shows the fallback string */
  fallback?: string;
}

interface LegalTableProps {
  rows: Row[];
}

export function LegalTable({ rows }: LegalTableProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {rows.map(({ label, value, fallback }) => {
          const display = value ?? fallback ?? "—";
          return (
            <tr key={label} className="border-b border-border last:border-0">
              <th
                scope="row"
                className="w-40 py-3 pr-4 text-left align-top text-xs font-medium text-muted-foreground sm:w-48"
              >
                {label}
              </th>
              <td className="py-3 align-top text-foreground">
                {display.includes("\n")
                  ? display.split("\n").map((line, i) => (
                      <span key={i} className="block">{line}</span>
                    ))
                  : display}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
