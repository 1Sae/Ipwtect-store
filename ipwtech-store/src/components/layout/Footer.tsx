"use client";
import { useTheme } from "@/src/theme/ThemeProvider";
import {
    FiInstagram,
    FiFacebook,
    FiPhone,
    FiMail,
    FiMapPin,
    FiTwitter,
} from "react-icons/fi";

export default function Footer() {
    const t = useTheme();

    return (
    <footer
        className="text-gray-400 mt-16 pt-12 pb-6"
        style={{ backgroundColor: t.colors.headerBg }}
        >
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">

            {/* Brand */}
            <div className="flex flex-col gap-3">
            <h2 className="text-lg">
                <span
                className="font-bold"
                style={{ color: t.colors.primary }}
                >
                IPW
                </span>{" "}
                <span className="text-gray-200">Tech</span>
            </h2>

            <p className="text-gray-400 leading-relaxed">
                Your one-stop shop for premium electronics,
                laptops, gaming gear, and modern tech
                accessories.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-2">
                <a className="p-2 rounded-lg bg-white/5 hover:text-orange-500 transition-all scale-90 hover:scale-100 ease-in-out transition duration-300 cursor-pointer">
                <FiInstagram size={18} />
                </a>

                <a className="p-2 rounded-lg bg-white/5 hover:text-orange-500 transition-all scale-90 hover:scale-100 ease-in-out transition duration-300 cursor-pointer">
                <FiFacebook size={18} />
                </a>

                <a className="p-2 rounded-lg bg-white/5 hover:text-orange-500 transition-all scale-90 hover:scale-100 ease-in-out transition duration-300 cursor-pointer">
                <FiTwitter size={18} />
                </a>
            </div>
            </div>

            {/* Company */}
            <div>
            <h3
                className="font-semibold mb-4"
                style={{ color: t.colors.primary }}
            >
                Company
            </h3>

            <ul className="space-y-2">
                <li>
                <a className="hover:text-white transition">
                    About Us
                </a>
                </li>

                <li>
                <a className="hover:text-white transition">
                    Contact Us
                </a>
                </li>

                <li>
                <a className="hover:text-white transition">
                    Careers
                </a>
                </li>

                <li>
                <a className="hover:text-white transition">
                    Blog
                </a>
                </li>
            </ul>
            </div>

            {/* Support */}
            <div>
            <h3
                className="font-semibold mb-4"
                style={{ color: t.colors.primary }}
            >
                Support
            </h3>

            <ul className="space-y-2">
                <li>
                <a className="hover:text-white transition">
                    Track Order
                </a>
                </li>

                <li>
                <a className="hover:text-white transition">
                    Returns
                </a>
                </li>

                <li>
                <a className="hover:text-white transition">
                    Warranty
                </a>
                </li>

                <li>
                <a className="hover:text-white transition">
                    Shipping Info
                </a>
                </li>
            </ul>
            </div>

            {/* Contact */}
            <div>
            <h3
                className="font-semibold mb-4"
                style={{ color: t.colors.primary }}
            >
                Contact
            </h3>

            <ul className="space-y-3 text-gray-300">

                <li className="flex items-center gap-3">
                <FiPhone
                    size={18}
                    className="text-orange-500"
                />
                <a href="tel:+905551234567">
                    +90 555 123 45 67
                </a>
                </li>

                <li className="flex items-center gap-3">
                <FiMail
                    size={18}
                    className="text-orange-500"
                />
                <a href="mailto:support@ipwtech.com">
                    support@ipwtech.com
                </a>
                </li>

                <li className="flex items-center gap-3">
                <FiMapPin
                    size={18}
                    className="text-orange-500"
                />
                <span>Istanbul, Turkey</span>
                </li>

            </ul>
            </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-500 text-sm">
            <span className="text-orange-500 text-md">©</span> {new Date().getFullYear()} IPW Tech. All rights
            reserved.
        </div>
        </footer>
    );
}