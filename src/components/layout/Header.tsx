"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Search,
    ShoppingCart,
    User,
    Menu,
    X,
    ChevronDown,
    Laptop,
    LogOut,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getBrands } from "@/lib/api";
import { AUTH_CHANGED_EVENT, clearAuthSession, getAuthToken, getStoredUser } from "@/lib/authStorage";
import type { AuthUser, Brand } from "@/lib/types";

export default function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<Brand[]>([]);
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
    const { totalItems } = useCart();

    const shortName = user?.fullName?.trim().split(/\s+/).slice(-1)[0] || "Tài khoản";

    useEffect(() => {
        const syncAuth = () => setUser(getStoredUser());
        window.addEventListener("storage", syncAuth);
        window.addEventListener(AUTH_CHANGED_EVENT, syncAuth);
        return () => {
            window.removeEventListener("storage", syncAuth);
            window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth);
        };
    }, []);

    const handleLogout = () => {
        clearAuthSession();
        setUser(null);
        setIsAccountOpen(false);
        setIsMenuOpen(false);
        router.push("/");
    };

    useEffect(() => {
        getBrands()
            .then(setCategories)
            .catch(() => setCategories([]));
    }, []);

    const handleCartClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const token = getAuthToken();
        if (!token) {
            e.preventDefault();
            router.push("/auth/login?redirect=%2Fcart");
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border"
            style={{ boxShadow: "var(--shadow-header)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0">
                        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                            <Laptop className="w-5 h-5 text-white" />
                        </div>
                        <span
                            className="text-xl font-bold text-primary tracking-tight hidden sm:block"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            LaptopVerse
                        </span>
                    </Link>

                    {/* Category Dropdown - Desktop */}
                    <div className="hidden lg:block relative ml-6">
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-light hover:text-accent rounded-lg hover:bg-accent/5 transition-colors duration-200 cursor-pointer"
                        >
                            <Menu className="w-4 h-4" />
                            Danh mục
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isCategoryOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                                <div
                                    className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl border border-border py-2 z-50"
                                    style={{ boxShadow: "var(--shadow-dropdown)" }}
                                >
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/products?category=${encodeURIComponent(cat.slug)}`}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors duration-200 cursor-pointer"
                                            onClick={() => setIsCategoryOpen(false)}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                                                <Laptop className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-primary">{cat.name}</div>
                                                <div className="text-xs text-muted">Thương hiệu</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-4 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm laptop..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-background rounded-xl border border-border hover:border-border-hover focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Mobile Search */}
                        <button className="md:hidden p-2.5 rounded-xl hover:bg-surface-hover transition-colors duration-200 cursor-pointer">
                            <Search className="w-5 h-5 text-primary-light" />
                        </button>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            onClick={handleCartClick}
                            className="relative p-2.5 rounded-xl hover:bg-surface-hover transition-colors duration-200 cursor-pointer"
                        >
                            <ShoppingCart className="w-5 h-5 text-primary-light" />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-cta text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce-once">
                                    {totalItems > 9 ? "9+" : totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Login / Account */}
                        {user ? (
                            <div className="hidden sm:block relative">
                                <button
                                    onClick={() => setIsAccountOpen((prev) => !prev)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-primary text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors duration-200 cursor-pointer"
                                >
                                    <User className="w-4 h-4" />
                                    {shortName}
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAccountOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isAccountOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsAccountOpen(false)} />
                                        <div
                                            className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl border border-border py-2 z-50"
                                            style={{ boxShadow: "var(--shadow-dropdown)" }}
                                        >
                                            <div className="px-4 py-2 border-b border-border">
                                                <p className="text-sm font-semibold text-primary">{user.fullName}</p>
                                                <p className="text-xs text-muted truncate">{user.email}</p>
                                            </div>

                                            <Link
                                                href="/account/profile"
                                                onClick={() => setIsAccountOpen(false)}
                                                className="block px-4 py-2.5 text-sm text-primary hover:bg-surface-hover transition-colors duration-200"
                                            >
                                                Thông tin cá nhân
                                            </Link>
                                            <Link
                                                href="/account/orders"
                                                onClick={() => setIsAccountOpen(false)}
                                                className="block px-4 py-2.5 text-sm text-primary hover:bg-surface-hover transition-colors duration-200"
                                            >
                                                Đơn hàng của tôi
                                            </Link>
                                            <Link
                                                href="/account/addresses"
                                                onClick={() => setIsAccountOpen(false)}
                                                className="block px-4 py-2.5 text-sm text-primary hover:bg-surface-hover transition-colors duration-200"
                                            >
                                                Sổ địa chỉ
                                            </Link>
                                            {user.role === "ADMIN" && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsAccountOpen(false)}
                                                    className="block px-4 py-2.5 text-sm text-primary hover:bg-surface-hover transition-colors duration-200"
                                                >
                                                    Trang quản trị
                                                </Link>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-cta hover:bg-cta/5 transition-colors duration-200"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors duration-200 cursor-pointer"
                            >
                                <User className="w-4 h-4" />
                                Đăng nhập
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2.5 rounded-xl hover:bg-surface-hover transition-colors duration-200 cursor-pointer"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5 text-primary-light" />
                            ) : (
                                <Menu className="w-5 h-5 text-primary-light" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-border py-4 space-y-2">
                        {/* Mobile Search */}
                        <div className="md:hidden relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm laptop..."
                                className="w-full pl-10 pr-4 py-2.5 bg-background rounded-xl border border-border text-sm"
                            />
                        </div>

                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover transition-colors duration-200 cursor-pointer"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                                    <Laptop className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-primary">{cat.name}</span>
                            </Link>
                        ))}

                        <div className="sm:hidden pt-2 border-t border-border">
                            {user ? (
                                <div className="space-y-2">
                                    <Link
                                        href="/account/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-100 text-primary text-sm font-medium rounded-xl cursor-pointer"
                                    >
                                        <User className="w-4 h-4" />
                                        Thông tin cá nhân
                                    </Link>
                                    <Link
                                        href="/account/orders"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-100 text-primary text-sm font-medium rounded-xl cursor-pointer"
                                    >
                                        Đơn hàng của tôi
                                    </Link>
                                    <Link
                                        href="/account/addresses"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-100 text-primary text-sm font-medium rounded-xl cursor-pointer"
                                    >
                                        Sổ địa chỉ
                                    </Link>
                                    {user.role === "ADMIN" && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-100 text-primary text-sm font-medium rounded-xl cursor-pointer"
                                        >
                                            Trang quản trị
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-200 text-primary text-sm font-medium rounded-xl cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Đăng xuất
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl cursor-pointer"
                                >
                                    <User className="w-4 h-4" />
                                    Đăng nhập
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
