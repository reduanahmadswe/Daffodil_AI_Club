import { Navbar, Footer } from '@/components/layout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: '#000000' }}>{children}</main>
      <Footer />
    </>
  );
}
