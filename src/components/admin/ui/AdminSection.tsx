type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AdminSection({
  title,
  children,
}: Props) {
  return (
    <section className="mb-10">

      <h2 className="text-2xl font-black mb-5">
        {title}
      </h2>

      {children}

    </section>
  );
}