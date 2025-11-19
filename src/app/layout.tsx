import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // 1. Import Poppins
import "./globals.css";

// 2. Configure the font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Select the weights you need
  variable: "--font-poppins", // Define the CSS variable
});

export const metadata: Metadata = {
  title: "PetNest",
  description: "The safest pet marketplace in Tamil Nadu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 3. Add the variable to the body class */}
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}