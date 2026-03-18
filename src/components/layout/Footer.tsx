import Link from "next/link";
import {
    Laptop,
    MapPin,
    Phone,
    Mail,
    Shield,
    RotateCcw,
    Truck,
    Clock,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 cursor-pointer">
                            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                                <Laptop className="w-5 h-5 text-white" />
                            </div>
                            <span
                                className="text-xl font-bold tracking-tight"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                LaptopVerse
                            </span>
                        </Link>
                        <p className="text-sm text-white/60 leading-relaxed">
                            Hệ thống phân phối Laptop cao cấp hàng đầu Việt Nam. Cam kết
                            100% chính hãng với giá tốt nhất thị trường.
                        </p>
                        <div className="flex items-center gap-3">
                            {["facebook", "youtube", "tiktok"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center transition-colors duration-200 cursor-pointer"
                                    aria-label={social}
                                >
                                    <span className="text-xs font-bold uppercase">
                                        {social[0]}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3
                            className="text-sm font-semibold uppercase tracking-wider text-white/80"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            Liên hệ
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5 text-sm text-white/60">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                                <span>
                                    123 Nguyễn Trãi, Hà Đông, TP. Hà Nội
                                </span>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-white/60">
                                <Phone className="w-4 h-4 shrink-0 text-accent" />
                                <a
                                    href="tel:1900123456"
                                    className="hover:text-white transition-colors duration-200 cursor-pointer"
                                >
                                    1900 123 456
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-white/60">
                                <Mail className="w-4 h-4 shrink-0 text-accent" />
                                <a
                                    href="mailto:support@laptopverse.vn"
                                    className="hover:text-white transition-colors duration-200 cursor-pointer"
                                >
                                    support@laptopverse.vn
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-white/60">
                                <Clock className="w-4 h-4 shrink-0 text-accent" />
                                <span>8:00 - 21:00 (T2 - CN)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Warranty */}
                    <div className="space-y-4">
                        <h3
                            className="text-sm font-semibold uppercase tracking-wider text-white/80"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            Chính sách
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2.5 text-sm text-white/60">
                                <Shield className="w-4 h-4 shrink-0 text-gold" />
                                <span>Bảo hành chính hãng 24 tháng</span>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-white/60">
                                <RotateCcw className="w-4 h-4 shrink-0 text-gold" />
                                <span>Đổi trả miễn phí trong 30 ngày</span>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-white/60">
                                <Truck className="w-4 h-4 shrink-0 text-gold" />
                                <span>Giao hàng miễn phí toàn quốc</span>
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-white/60">
                                <Shield className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                                <span>Hỗ trợ kỹ thuật trọn đời sản phẩm</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3
                            className="text-sm font-semibold uppercase tracking-wider text-white/80"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            Hỗ trợ
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Hướng dẫn mua hàng",
                                "Phương thức thanh toán",
                                "Chính sách vận chuyển",
                                "Chính sách bảo mật",
                                "Điều khoản dịch vụ",
                            ].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-white/40">
                            © 2026 LaptopVerse. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            {["Visa", "MC", "JCB", "MoMo"].map((pay) => (
                                <span
                                    key={pay}
                                    className="text-xs font-medium text-white/40 px-2 py-1 rounded border border-white/10"
                                >
                                    {pay}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
