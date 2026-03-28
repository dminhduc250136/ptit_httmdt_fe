export default function Loading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3 text-muted">
                <span className="inline-block w-10 h-10 border-4 border-slate-200 border-t-accent rounded-full animate-spin" />
                <p className="text-sm">Đang tải dữ liệu...</p>
            </div>
        </div>
    );
}
