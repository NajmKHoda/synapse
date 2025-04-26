import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
interface RootLayoutProps {
    children?: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <Navbar />
            <body>
                {children}
            </body>
            <Footer />
        </html>
    );
}
