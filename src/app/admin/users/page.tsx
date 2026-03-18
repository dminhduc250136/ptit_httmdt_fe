"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Eye, Edit2, Trash2, X, UserCircle2 } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/admin/Badge";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { deleteAdminUser, getAdminUserById, getAdminUsers, updateAdminUser } from "@/lib/api";
import { getStoredUser } from "@/lib/authStorage";
import type { AdminUser } from "@/lib/types";

const PAGE_SIZE = 10;

//Helper function for role badge variant
const getRoleBadgeVariant = (role: string): "info" | "purple" => {
    return role === "ADMIN" ? "purple" : "info";
};

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

    const loadUsers = async (authToken: string, params?: {
        search?: string;
        role?: "CUSTOMER" | "ADMIN";
        isActive?: boolean;
        page?: number;
    }) => {
        const result = await getAdminUsers(authToken, { size: PAGE_SIZE, ...params });
        setUsers(result.content || []);
        setPageIndex(result.number || 0);
        setTotalPages(Math.max(1, result.totalPages || 1));
        setTotalElements(result.totalElements || 0);
    };

    useEffect(() => {
        if (!token) return;
        loadUsers(token, { page: 0 })
            .catch((err) => setError(err instanceof Error ? err.message : "Không tải được danh sách người dùng"))
            .finally(() => setLoading(false));
    }, [token]);

    const applyFilter = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const keyword = searchDraft.trim();
            setSearch(keyword);
            await loadUsers(token, {
                search: keyword || undefined,
                role: (role || undefined) as "CUSTOMER" | "ADMIN" | undefined,
                isActive: activeFilter === "" ? undefined : activeFilter === "true",
                page: 0,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không lọc được người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = async (nextPage: number) => {
        if (!token) return;
        setLoading(true);
        try {
            await loadUsers(token, {
                search: search || undefined,
                role: (role || undefined) as "CUSTOMER" | "ADMIN" | undefined,
                isActive: activeFilter === "" ? undefined : activeFilter === "true",
                page: nextPage,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không chuyển trang được");
        } finally {
            setLoading(false);
        }
    };

    const openDetail = async (userId: number) => {
        if (!token) return;
        setDetailLoading(true);
        try {
            const detail = await getAdminUserById(userId, token);
            setSelected(detail);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không tải được chi tiết người dùng");
        } finally {
            setDetailLoading(false);
        }
    };

    const openEdit = (user: AdminUser) => {
        setEditing(user);
        setFullNameDraft(user.fullName);
        setPhoneDraft(user.phone || "");
        setRoleDraft(user.role);
        setActiveDraft(user.isActive);
    };

    const saveEdit = async () => {
        if (!token || !editing) return;
        setSaving(true);
        try {
            const updated = await updateAdminUser(
                editing.id,
                {
                    fullName: fullNameDraft.trim() || undefined,
                    phone: phoneDraft,
                    role: roleDraft,
                    isActive: activeDraft,
                },
                token
            );
            setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setEditing(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không cập nhật được thông tin người dùng");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user: AdminUser) => {
        if (!token) return;
        if (currentUser?.id === user.id) {
            setError("Không thể tự xóa tài khoản admin đang đăng nhập");
            return;
        }
        const agreed = window.confirm(`Xóa người dùng \"${user.fullName}\"?`);
        if (!agreed) return;

        try {
            await deleteAdminUser(user.id, token);
            const nextPage = users.length === 1 && pageIndex > 0 ? pageIndex - 1 : pageIndex;
            await loadUsers(token, {
                search: search || undefined,
                role: (role || undefined) as "CUSTOMER" | "ADMIN" | undefined,
                isActive: activeFilter === "" ? undefined : activeFilter === "true",
                page: nextPage,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không xóa được người dùng");
        }
    };

    if (checking || loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 flex items-center justify-center gap-2 text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải người dùng...
            </div>
        );
    }

    return (
        <AdminShell title="Quản lý người dùng" subtitle="Xem chi tiết, cập nhật thông tin và xóa tài khoản">
            {/* Enhanced Search & Filter Section */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="relative sm:col-span-2">
                        <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            value={searchDraft}
                            onChange={(e) => setSearchDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                            placeholder="Tìm theo email, tên, số điện thoại"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                    </div>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Đã khóa</option>
                    </select>
                </div>
                <button
                    type="button"
                    onClick={applyFilter}
                    className="mt-3 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light hover:shadow-md transition-all duration-200"
                >
                    Áp dụng
                </button>
            </div>

            {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Enhanced Users Table */}
            <div className="mt-6 bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1120px] text-sm">
                        <thead className="bg-gradient-to-r from-slate-50 to-blue-50/20 text-primary">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">Người dùng</th>
                                <th className="px-6 py-4 text-left font-semibold">Liên hệ</th>
                                <th className="px-6 py-4 text-left font-semibold">Vai trò</th>
                                <th className="px-6 py-4 text-left font-semibold">Trạng thái</th>
                                <th className="px-6 py-4 text-left font-semibold">Ngày tạo</th>
                                <th className="px-6 py-4 text-left font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                const isCurrentUser = currentUser?.id === user.id;
                                return (
                                    <tr key={user.id} className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/10 to-blue-600/10 flex items-center justify-center">
                                                    <UserCircle2 className="w-6 h-6 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-primary flex items-center gap-2">
                                                        {user.fullName}
                                                        {isCurrentUser && (
                                                            <Badge variant="gold" size="sm">
                                                                Bạn
                                                            </Badge>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted mt-0.5">ID: #{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-primary font-medium">{user.email}</p>
                                            <p className="text-xs text-muted mt-0.5">{user.phone || "Chưa có SĐT"}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={user.isActive ? "success" : "default"}>
                                                {user.isActive ? "Hoạt động" : "Đã khóa"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted text-xs">
                                            {new Date(user.createdAt).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openDetail(user.id)}
                                                    className="p-2 rounded-lg border border-slate-200 text-accent hover:border-accent hover:bg-accent/5 transition-all"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(user)}
                                                    disabled={isCurrentUser}
                                                    className="p-2 rounded-lg border border-slate-200 text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                    title={isCurrentUser ? "Không thể sửa chính mình" : "Chỉnh sửa"}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(user)}
                                                    disabled={isCurrentUser}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                    title={isCurrentUser ? "Không thể xóa chính mình" : "Xóa người dùng"}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminPagination currentPage={pageIndex} totalPages={totalPages} onPageChange={handlePageChange} disabled={loading} />
            <p className="mt-2 text-xs text-muted">Tổng {totalElements} người dùng</p>

            {/* Enhanced Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200/60 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                Chi tiết người dùng
                            </h2>
                            <button
                                onClick={() => setSelected(null)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/10 to-blue-600/10 flex items-center justify-center">
                                    <UserCircle2 className="w-10 h-10 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary">{selected.fullName}</h3>
                                    <p className="text-sm text-muted">ID: #{selected.id}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[100px]">Email:</span>
                                    <span className="text-primary-light flex-1">{selected.email}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[100px]">SĐT:</span>
                                    <span className="text-primary-light flex-1">{selected.phone || "Chưa có"}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[100px]">Vai trò:</span>
                                    <Badge variant={getRoleBadgeVariant(selected.role)}>{selected.role}</Badge>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[100px]">Trạng thái:</span>
                                    <Badge variant={selected.isActive ? "success" : "default"}>
                                        {selected.isActive ? "Đang hoạt động" : "Đã khóa"}
                                    </Badge>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[100px]">Ngày tạo:</span>
                                    <span className="text-primary-light flex-1">
                                        {new Date(selected.createdAt).toLocaleString("vi-VN")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 border-t border-slate-200/60 px-6 py-4 flex justify-end rounded-b-2xl">
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-light transition-all"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Edit Modal */}
            {editing && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setEditing(null)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200/60 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                Cập nhật người dùng #{editing.id}
                            </h2>
                            <button
                                onClick={() => !saving && setEditing(null)}
                                disabled={saving}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700 disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-primary mb-2 block">Họ tên</span>
                                <input
                                    value={fullNameDraft}
                                    onChange={(e) => setFullNameDraft(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-semibold text-primary mb-2 block">Số điện thoại</span>
                                <input
                                    value={phoneDraft}
                                    onChange={(e) => setPhoneDraft(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-semibold text-primary mb-2 block">Vai trò</span>
                                <select
                                    value={roleDraft}
                                    onChange={(e) => setRoleDraft(e.target.value as "CUSTOMER" | "ADMIN")}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                >
                                    <option value="CUSTOMER">CUSTOMER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </label>
                            <label className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
                                <input
                                    type="checkbox"
                                    checked={activeDraft}
                                    onChange={(e) => setActiveDraft(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-accent focus:ring-2 focus:ring-accent/20"
                                />
                                <span className="text-sm font-medium text-primary">Tài khoản đang hoạt động</span>
                            </label>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 border-t border-slate-200/60 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                disabled={saving}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={saveEdit}
                                disabled={saving}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-70 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Loading State */}
            {detailLoading && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-2xl">
                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                        <span className="text-sm font-medium text-primary">Đang tải chi tiết người dùng...</span>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
