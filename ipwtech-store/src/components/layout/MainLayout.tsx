import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="min-h-screen">
            {children}
        </main>

        {/* Footer */}
        <Footer />
        </>
    );
}
