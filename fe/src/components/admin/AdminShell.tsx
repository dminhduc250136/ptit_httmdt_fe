"use client";

interface AdminShellProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export default function AdminShell({ title, subtitle, children, actions }: AdminShellProps) {
    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                <div>
                    <h2
                        className="text-xl sm:text-2xl font-bold text-slate-900"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        {title}
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>

            <div>{children}</div>
        </div>
    );
}
