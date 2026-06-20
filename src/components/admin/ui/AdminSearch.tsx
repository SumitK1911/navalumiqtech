type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export default function AdminSearch({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {

  return (

    <div className="relative w-full">

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          px-5
          py-4
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-white
          outline-none
          focus:border-cyan-400
          transition
        "
      />

      <div
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
        "
      >
        ⌕
      </div>

    </div>

  );

}