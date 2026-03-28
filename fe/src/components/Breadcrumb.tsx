import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
            <Link
                href="/"
                className="flex items-center gap-1 text-muted hover:text-accent transition-colors duration-200 cursor-pointer"
                aria-label="Trang chủ"
            >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Trang chủ</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-muted/50" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-muted hover:text-accent transition-colors duration-200 cursor-pointer"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-primary font-medium" aria-current="page">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
