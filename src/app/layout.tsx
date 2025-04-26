import "./globals.css";
import Navbar from "@/components/Navbar";
interface RootLayoutProps {
    children?: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    );
}
