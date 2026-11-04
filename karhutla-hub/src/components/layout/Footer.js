export default function Footer({ children = "Sistem Informasi Pemantauan Karhutla" }) {
  return (
    <footer className="border-t border-[#dce5dd] px-5 py-4 text-xs text-[#64776f] sm:px-8">
      {children}
    </footer>
  );
}