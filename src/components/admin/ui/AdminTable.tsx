type Props = {
  headers: string[];
  children: React.ReactNode;
};

export default function AdminTable({
  headers,
  children,
}: Props) {

  return (

    <div
      className="
        overflow-x-auto
        bg-white/[0.045]
        border
        border-white/10
        rounded-2xl
      "
    >

      <table className="w-full">

        <thead className="bg-white/[0.03]">

          <tr className="border-b border-white/10">

            {headers.map((header) => (

              <th
                key={header}
                className="
                  text-left
                  px-6
                  py-5
                  text-xs
                  uppercase
                  tracking-[0.16em]
                  text-gray-400
                  font-semibold
                "
              >
                {header}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>
          {children}
        </tbody>

      </table>

    </div>

  );

}
