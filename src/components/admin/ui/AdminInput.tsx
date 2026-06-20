type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
};

export default function AdminInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: Props) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full
        px-5
        py-4
        rounded-2xl
        bg-black/20
        border
        border-white/10
        outline-none
        focus:border-cyan-400
      "
    />
  );
}