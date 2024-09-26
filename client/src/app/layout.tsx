"use client";
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/modules/user/common/nav-bar/views";
import Footer from "@/modules/user/common/footer/views";
import { usePathname } from "next/navigation";
import AdminNavBar from "@/modules/admin/common/nav-bar/views";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <ApolloProvider client={client}>
      <html lang="en">
        <body>
          {pathname.startsWith("/admin") && <AdminNavBar />}
          {!pathname.startsWith("/admin") && <NavBar />}

          {children}
          {!pathname.startsWith("/admin") && <Footer />}
        </body>
      </html>
    </ApolloProvider>
  );
}
