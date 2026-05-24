import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../theme/ThemeProvider";
import ReduxProvider from "../store/ReduxProvider";
import MainLayout from "../components/layout/MainLayout";
import AuthInitializer from "../store/auth/AuthInitializer";
import CartInitializer from "../store/cart/CartInitializer";
import { Toaster } from "react-hot-toast";
import WishlistInitializer from "../store/wishlist/WishlistInitializer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPWTech Store",
  description: "Technology & Printing Materials Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider>
          <Toaster
                position="top-center"
                containerStyle={{
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            <AuthInitializer>
              <CartInitializer>
                <WishlistInitializer>
                  <MainLayout>{children}</MainLayout>
                </WishlistInitializer>
              </CartInitializer>
            </AuthInitializer>
          </ThemeProvider>
        </ReduxProvider>

      </body>
    </html>
  );
}
