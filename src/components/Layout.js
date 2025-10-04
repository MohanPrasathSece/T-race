import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <ScrollToTop />
            <Footer />
        </div>
    );
}
