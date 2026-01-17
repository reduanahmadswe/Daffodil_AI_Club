import { Navbar, Footer } from '@/components/layout';
import Chatbot from '@/components/Chatbot';

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
      <Chatbot />
    </>
  );
}
