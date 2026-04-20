import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <div className="max-w-[1400px] mx-auto">
        {children}
      </div>
      <Footer />
    </>
  );
}
