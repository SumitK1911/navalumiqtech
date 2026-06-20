type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function AdminModal({
  open,
  onClose,
  title,
  children,
}: Props) {

  if (!open) return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        backdrop-blur-sm
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-3xl
          bg-[#0b1120]
          border
          border-white/10
          rounded-3xl
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-white/10
          "
        >

          <h2 className="text-2xl font-black text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-xl
              bg-white/5
              hover:bg-white/10
              transition
              text-white
            "
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="p-6 text-white">
          {children}
        </div>

      </div>

    </div>

  );

}