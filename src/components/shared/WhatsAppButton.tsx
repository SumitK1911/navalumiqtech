import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/+9779800000000"
      target="_blank"
      className="fixed bottom-6 right-6 z-50 bg-green-500 p-4 rounded-full shadow-lg hover:scale-110 transition"
    >
      <FaWhatsapp size={30} color="white" />
    </a>
  );
}