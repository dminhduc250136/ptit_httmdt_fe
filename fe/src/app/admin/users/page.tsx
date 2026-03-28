"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Eye, Pencil, Trash2 } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { deleteAdminUser, getAdminUserById, getAdminUsers, updateAdminUser } from "@/lib/api";
import { getStoredUser } from "@/lib/authStorage";
import type { AdminUser } from "@/lib/types";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
    const { token, checking } = useAdminGuard();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchDraft, setSearchDraft] = useState("");
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [activeFilter, setActiveFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [selected, setSelected] = useState<AdminUser | null>(null);
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [fullNameDraft, setFullNameDraft] = useState("");
    const [phoneDraft, setPhoneDraft] = useState("");
    const [roleDraft, setRoleDraft] = useState<"CUSTOMER" | "ADMIN">("CUSTOMER");
    const [activeDraft, setActiveDraft] = useState(true);

    const currentUser = getStoredUser();

    const loadUsers = async (authToken: string, params?: { search?: string; role?: "CUSTOMER" | "ADMIN"; isActive?: boolean; page?: number }) => {
        const result = await getAdminUsers(authToken, { size: PAGE_SIZE, ...params });
        setUsers(result.content || []);
        setPageIndex(result.number || 0);
        setTotalPages(Math.max(1, result.totalPages || 1));
        setTotalElements(result.totalElements || 0);
    };

    useEffect(() => {
        if (!token) return;
        loadUsers(token, { page: 0 })
            .catch((err) => setError(err instanceof Error ? err.message : "Không tải được người dùng"))
            .finally(() => setLoading(false));
    }, [token]);

    const applyFilter = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const keyword = searchDraft.trim();
            setSearch(keyword);
            await loadUsers(token, { search: keyword || undefined, role: (role || undefined) as "CUSTOMER" | "ADMIN" | undefined, isActive: activeFilter === "" ? undefined : activeFilter === "true", page: 0 });
        } catch (err) { setError(err instanceof Error ? err.message : "Không lọc được"); } finally { setLoading(false); }
    };

    const handlePageChange = async (nextPage: number) => {
        if (!token) return;
        setLoading(true);
        try { await loadUsers(token, { search: search || undefined, role: (role || undefined) as "CUSTOMER" | "ADMIN" | undefined, isActive: activeFilter === "" ? undefined : activeFilter === "true", page: nextPage }); }
        catch (err) { setError(err instanceof Error ? err.message : "Không chuyển trang được"); }
        finally { setLoading(false); }
    };

    const openDetail = async (userId: number) => {
        if (!token) return;
        setDetailLoading(true);
        try { const detail = await getAdminUserById(userId, token); setSelected(detail); }
        catch (err) { setError(err instanceof Error ? err.message : "Không tải được chi tiết"); }
        finally { setDetailLoading(false); }
    };

    const openEdit = (user: AdminUser) => { setEditing(user); setFullNameDraft(user.fullName); setPhoneDraft(user.phone || ""); setRoleDraft(user.role); setActiveDraft(user.isActive); };

    const saveEdit = async () => {
        if (!token || !editing) return;
        setSaving(true);
        try {
            const updated = await updateAdminUser(editing.id, { fullName: fullNameDraft.trim() || undefined, phone: phoneDraft, role: roleDraft, isActive: activeDraft }, token);
            setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setEditing(null);
        } catch (err) { setError(err instanceof Error ? err.message : "Không cập nhật được"); } finally { setSaving(false); }
    };

    const handleDelete = async (user: AdminUser) => {
        if (!token) return;
        if (currentUser?.id === user.id) { setError("Không thể tự xóa tài khoản đang đăng nhập"); return; }
        if (!window.confirm(`Xóa người dùng \"${user.fullName}\"?`)) return;
        try {
            await deleteAdminUser(user.id, token);
            const nextPage = users.length === 1 && pageIndex > 0 ? pageIndex - 1 : pageIndex;
            await loadUsers(token, { search: search || undefined, role: (role || undefined) as "CUSTOMER" | "ADMIN" | undefined, isActive: activeFilter === "" ? undefined : activeFilter === "true", page: nextPage });
        } catch (err) { setError(err instanceof Error ? err.message : "Không xóa được"); }
    };

    const getInitials = (name: string) => {
        const words = name.trim().split(/\s+/);
        if (words.length === 1) return words[0][0]?.toUpperCase() || "U";
        return `${words[0][0] || ""}${words[words.length - 1][0] || ""}`.toUpperCase();
    };

    if (checking || loading) {
        return (
            <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Đang tải người dùng...</span>
            </div>
        );
    }

    return (
        <AdminShell title="Quản lý người dùng" subtitle="Xem chi tiết, cập nhật thông tin và xóa tài khoản">
            {/* Filter bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-4">
                <form onSubmit={(e) => { e.preventDefault(); applyFilter(); }} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <div className="relative sm:col-span-2">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)}
                            placeholder="Tìm theo email, tên, SĐT..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                    </div>
                    <select value={role} onChange={(e) => setRole(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                        <option value="">Tất cả vai trò</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Đã khóa</option>
                    </select>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
                        Áp dụng
                    </button>
                </form>
            </div>

            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1020px] text-sm">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Người dùng</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Liên hệ</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vai trò</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="admin-table-row border-t border-slate-100">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                {getInitials(user.fullName)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{user.fullName}</p>
                                                <p className="text-xs text-slate-400">ID: #{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-slate-700">{user.email}</p>
                                        <p className="text-xs text-slate-400">{user.phone || "Chưa có SĐT"}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`badge-status ${user.role === "ADMIN" ? "badge-admin" : "badge-customer"}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`badge-status ${user.isActive ? "badge-active" : "badge-locked"}`}>
                                            {user.isActive ? "Hoạt động" : "Đã khóa"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-400 text-[13px]">
                                        {new Date(user.createdAt).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <button type="button" onClick={() => openDetail(user.id)} className="admin-action-btn" title="Chi tiết">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => openEdit(user)} className="admin-action-btn" title="Chỉnh sửa">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => handleDelete(user)} className="admin-action-btn danger" title="Xóa">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminPagination currentPage={pageIndex} totalPages={totalPages} onPageChange={handlePageChange} disabled={loading} />
            <p className="mt-2 text-xs text-slate-400">Tổng {totalElements} người dùng</p>

            {/* User detail modal */}
            {selected && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
                    <div className="admin-modal-enter relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>Chi tiết người dùng</h2>
                        <div className="mt-5 flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                                {getInitials(selected.fullName)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-lg">{selected.fullName}</p>
                                <p className="text-sm text-slate-500">{selected.email}</p>
                            </div>
                        </div>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-400">SĐT</span><span className="text-slate-700 font-medium">{selected.phone || "Chưa có"}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-400">Vai trò</span><span className={`badge-status ${selected.role === "ADMIN" ? "badge-admin" : "badge-customer"}`}>{selected.role}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-400">Trạng thái</span><span className={`badge-status ${selected.isActive ? "badge-active" : "badge-locked"}`}>{selected.isActive ? "Hoạt động" : "Đã khóa"}</span></div>
                            <div className="flex justify-between py-2"><span className="text-slate-400">Ngày tạo</span><span className="text-slate-700">{new Date(selected.createdAt).toLocaleString("vi-VN")}</span></div>
                        </div>
                        <div className="mt-5 flex justify-end">
                            <button type="button" onClick={() => setSelected(null)} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer">Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {editing && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditing(null)} />
                    <div className="admin-modal-enter relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>Cập nhật người dùng #{editing.id}</h2>
                        <div className="mt-5 space-y-4">
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Họ tên</span>
                                <input value={fullNameDraft} onChange={(e) => setFullNameDraft(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Số điện thoại</span>
                                <input value={phoneDraft} onChange={(e) => setPhoneDraft(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Vai trò</span>
                                <select value={roleDraft} onChange={(e) => setRoleDraft(e.target.value as "CUSTOMER" | "ADMIN")} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                                    <option value="CUSTOMER">CUSTOMER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </label>
                            <label className="inline-flex items-center gap-3 text-sm cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" checked={activeDraft} onChange={(e) => setActiveDraft(e.target.checked)} className="sr-only peer" />
                                    <div className="w-10 h-6 bg-slate-200 peer-checked:bg-blue-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-4" />
                                </div>
                                <span className="text-slate-600">Tài khoản đang hoạt động</span>
                            </label>
                        </div>
                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">Hủy</button>
                            <button type="button" onClick={saveEdit} disabled={saving} className="px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60 transition-colors cursor-pointer">
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {detailLoading && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-2 text-sm text-slate-700 shadow-lg">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải chi tiết người dùng...
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
