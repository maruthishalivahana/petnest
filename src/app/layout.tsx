import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/store/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PetNest - Your Trusted Tamil Nadu Pet Marketplace",
  description:
    "The safest pet marketplace in Tamil Nadu. Connect directly with verified breeders and sellers. No middlemen, no scams.",
  keywords: [
    "pets",
    "Tamil Nadu",
    "pet marketplace",
    "verified breeders",
    "dogs",
    "cats",
  ],
  authors: [{ name: "PetNest" }],
  openGraph: {
    title: "PetNest - Your Trusted Tamil Nadu Pet Marketplace",
    description: "The safest pet marketplace in Tamil Nadu",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        <ReduxProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}