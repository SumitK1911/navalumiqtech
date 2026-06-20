type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
};

export default function AdminTextarea({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full
        min-h-35
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