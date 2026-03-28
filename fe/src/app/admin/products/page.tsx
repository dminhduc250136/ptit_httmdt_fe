"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, Eye, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProductById,
    getAdminProducts,
    getBrands,
    getCategories,
    setAdminProductActive,
    updateAdminProduct,
} from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { AdminProduct, AdminUpsertProductPayload, Brand, Category } from "@/lib/types";

const EMPTY_FORM: AdminUpsertProductPayload = {
    name: "",
    slug: "",
    brandId: 0,
    categoryId: 0,
    price: 0,
    originalPrice: 0,
    image: "",
    specs: { cpu: "", ram: "", storage: "", display: "" },
    description: "",
    stockQuantity: 0,
    isActive: true,
};

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
    const { token, checking } = useAdminGuard();
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selected, setSelected] = useState<AdminProduct | null>(null);
    const [search, setSearch] = useState("");
    const [searchDraft, setSearchDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<AdminProduct | null>(null);
    const [form, setForm] = useState<AdminUpsertProductPayload>(EMPTY_FORM);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const title = useMemo(() => (editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"), [editing]);

    const loadProducts = useCallback(async (authToken: string, keyword = search, page = pageIndex) => {
        const result = await getAdminProducts(authToken, { search: keyword || undefined, page, size: PAGE_SIZE });
        setPageIndex(result.number || 0);
        setTotalPages(Math.max(1, result.totalPages || 1));
        setTotalElements(result.totalElements || 0);
        setSearch(keyword);
        setProducts(result.content || []);
    }, [pageIndex, search]);

    useEffect(() => {
        if (!token) return;
        Promise.all([loadProducts(token, "", 0), getBrands(), getCategories()])
            .then(([, fetchedBrands, fetchedCategories]) => {
                setBrands(fetchedBrands);
                setCategories(fetchedCategories);
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Không tải được dữ liệu sản phẩm"))
            .finally(() => setLoading(false));
    }, [loadProducts, token]);

    const openCreateForm = () => { setEditing(null); setForm(EMPTY_FORM); setFormOpen(true); };

    const openEditForm = (product: AdminProduct) => {
        setEditing(product);
        setForm({
            name: product.name, slug: product.slug, brandId: product.brandId, categoryId: product.categoryId,
            price: product.price, originalPrice: product.originalPrice, image: product.image, badge: product.badge,
            specs: product.specs, description: product.description || "", stockQuantity: product.stockQuantity, isActive: product.isActive,
        });
        setFormOpen(true);
    };

    const handleSearch = async () => {
        if (!token) return;
        setLoading(true);
        try { await loadProducts(token, searchDraft.trim(), 0); } catch (err) { setError(err instanceof Error ? err.message : "Không tìm kiếm được"); } finally { setLoading(false); }
    };

    const handlePageChange = async (nextPage: number) => {
        if (!token) return;
        setLoading(true);
        try { await loadProducts(token, search, nextPage); } catch (err) { setError(err instanceof Error ? err.message : "Không chuyển trang được"); } finally { setLoading(false); }
    };

    const handleSave = async () => {
        if (!token) return;
        if (!form.name.trim() || !form.image.trim() || form.brandId <= 0 || form.categoryId <= 0) { setError("Vui lòng điền đủ thông tin bắt buộc"); return; }
        setSaving(true); setError("");
        try {
            if (editing) { await updateAdminProduct(editing.id, form, token); } else { await createAdminProduct(form, token); }
            await loadProducts(token, search, pageIndex);
            setFormOpen(false);
        } catch (err) { setError(err instanceof Error ? err.message : "Không thể lưu sản phẩm"); } finally { setSaving(false); }
    };

    const toggleActive = async (product: AdminProduct) => {
        if (!token) return;
        try { await setAdminProductActive(product.id, !product.isActive, token); await loadProducts(token, search, pageIndex); } catch (err) { setError(err instanceof Error ? err.message : "Không đổi được trạng thái"); }
    };

    const handleDelete = async (product: AdminProduct) => {
        if (!token) return;
        if (!window.confirm(`Xóa sản phẩm \"${product.name}\"?`)) return;
        try {
            await deleteAdminProduct(product.id, token);
            const nextPage = products.length === 1 && pageIndex > 0 ? pageIndex - 1 : pageIndex;
            await loadProducts(token, search, nextPage);
        } catch (err) { setError(err instanceof Error ? err.message : "Không xóa được sản phẩm"); }
    };

    const openDetail = async (productId: number) => {
        if (!token) return;
        setDetailLoading(true);
        try { const detail = await getAdminProductById(productId, token); setSelected(detail); } catch (err) { setError(err instanceof Error ? err.message : "Không tải được chi tiết"); } finally { setDetailLoading(false); }
    };

    if (checking || loading) {
        return (
            <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Đang tải dữ liệu sản phẩm...</span>
            </div>
        );
    }

    return (
        <AdminShell
            title="Quản lý sản phẩm"
            subtitle="Tạo mới, chỉnh sửa, bật/tắt và quản lý hiển thị sản phẩm"
            actions={
                <button
                    type="button"
                    onClick={openCreateForm}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                </button>
            }
        >
            {/* Search bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-4">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={searchDraft}
                            onChange={(e) => setSearchDraft(e.target.value)}
                            placeholder="Tìm theo tên hoặc slug..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
                        />
                    </div>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
                        Tìm kiếm
                    </button>
                </form>
                {!!search && <p className="mt-2 text-xs text-slate-400">Kết quả cho: &quot;{search}&quot;</p>}
            </div>

            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-sm">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tồn kho</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Đã bán</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Đánh giá</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="admin-table-row border-t border-slate-100">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            {product.image && (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 truncate max-w-[200px]">{product.name}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{product.brandName} • {product.categoryName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-slate-900">{formatPrice(product.price)}</p>
                                        {product.originalPrice > product.price && (
                                            <p className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</p>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`font-medium ${product.stockQuantity <= 5 ? "text-red-500" : "text-slate-600"}`}>
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">{product.soldCount}</td>
                                    <td className="px-5 py-3.5 text-slate-600">{product.reviewCount}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`badge-status ${product.isActive ? "badge-active" : "badge-locked"}`}>
                                            {product.isActive ? "Đang bán" : "Tạm ẩn"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <button type="button" onClick={() => openDetail(product.id)} className="admin-action-btn" title="Xem chi tiết">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => openEditForm(product)} className="admin-action-btn" title="Chỉnh sửa">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button type="button" onClick={() => toggleActive(product)} className="admin-action-btn" title={product.isActive ? "Tạm ẩn" : "Bật bán"}>
                                                {product.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                            </button>
                                            <button type="button" onClick={() => handleDelete(product)} className="admin-action-btn danger" title="Xóa">
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
            <p className="mt-2 text-xs text-slate-400">Tổng {totalElements} sản phẩm</p>

            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
                    <div className="admin-modal-enter relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Chi tiết sản phẩm
                        </h2>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div><span className="text-slate-400 text-xs">Tên sản phẩm</span><p className="font-medium text-slate-900">{selected.name}</p></div>
                            <div><span className="text-slate-400 text-xs">Slug</span><p className="font-medium text-slate-600">{selected.slug}</p></div>
                            <div><span className="text-slate-400 text-xs">Thương hiệu</span><p className="font-medium text-slate-600">{selected.brandName}</p></div>
                            <div><span className="text-slate-400 text-xs">Danh mục</span><p className="font-medium text-slate-600">{selected.categoryName}</p></div>
                            <div><span className="text-slate-400 text-xs">Giá bán</span><p className="font-bold text-slate-900">{formatPrice(selected.price)}</p></div>
                            <div><span className="text-slate-400 text-xs">Tồn kho</span><p className="font-medium text-slate-600">{selected.stockQuantity}</p></div>
                            <div><span className="text-slate-400 text-xs">Đã bán</span><p className="font-medium text-slate-600">{selected.soldCount}</p></div>
                            <div><span className="text-slate-400 text-xs">Số đánh giá</span><p className="font-medium text-slate-600">{selected.reviewCount}</p></div>
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Thông số kỹ thuật</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p><span className="text-slate-400">CPU:</span> <span className="text-slate-700">{selected.specs.cpu}</span></p>
                                <p><span className="text-slate-400">RAM:</span> <span className="text-slate-700">{selected.specs.ram}</span></p>
                                <p><span className="text-slate-400">Ổ cứng:</span> <span className="text-slate-700">{selected.specs.storage}</span></p>
                                <p><span className="text-slate-400">Màn hình:</span> <span className="text-slate-700">{selected.specs.display}</span></p>
                            </div>
                        </div>
                        {selected.description && (
                            <div className="mt-3">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mô tả</p>
                                <p className="text-sm text-slate-600">{selected.description}</p>
                            </div>
                        )}
                        <div className="mt-5 flex flex-wrap items-center gap-2">
                            <Link href={`/laptops/${selected.id}`} target="_blank" className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-blue-400 text-sm transition-colors">
                                Xem trên trang bán hàng
                            </Link>
                            <button type="button" onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading overlay */}
            {detailLoading && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-2 text-sm text-slate-700 shadow-lg">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải chi tiết sản phẩm...
                    </div>
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
                    <div className="admin-modal-enter relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>{title}</h2>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Tên sản phẩm *</span>
                                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Slug</span>
                                <input value={form.slug || ""} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Thương hiệu *</span>
                                <select value={form.brandId} onChange={(e) => setForm((p) => ({ ...p, brandId: Number(e.target.value) }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                                    <option value={0}>Chọn thương hiệu</option>
                                    {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Danh mục *</span>
                                <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: Number(e.target.value) }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                                    <option value={0}>Chọn danh mục</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Giá bán *</span>
                                <input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Giá gốc</span>
                                <input type="number" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: Number(e.target.value) }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Tồn kho</span>
                                <input type="number" value={form.stockQuantity} onChange={(e) => setForm((p) => ({ ...p, stockQuantity: Number(e.target.value) }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-500">Badge</span>
                                <select value={form.badge || ""} onChange={(e) => setForm((p) => ({ ...p, badge: (e.target.value || undefined) as "Hot" | "New" | "Sale" | undefined }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                                    <option value="">Không badge</option>
                                    <option value="Hot">Hot</option>
                                    <option value="New">New</option>
                                    <option value="Sale">Sale</option>
                                </select>
                            </label>
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Thông số kỹ thuật</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="block"><span className="text-xs text-slate-500">CPU</span><input value={form.specs.cpu} onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, cpu: e.target.value } }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400 text-sm" /></label>
                                <label className="block"><span className="text-xs text-slate-500">RAM</span><input value={form.specs.ram} onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, ram: e.target.value } }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400 text-sm" /></label>
                                <label className="block"><span className="text-xs text-slate-500">Ổ cứng</span><input value={form.specs.storage} onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, storage: e.target.value } }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400 text-sm" /></label>
                                <label className="block"><span className="text-xs text-slate-500">Màn hình</span><input value={form.specs.display} onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, display: e.target.value } }))} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400 text-sm" /></label>
                            </div>
                        </div>

                        <label className="block mt-4">
                            <span className="text-xs font-medium text-slate-500">URL ảnh *</span>
                            <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                        </label>
                        <label className="block mt-3">
                            <span className="text-xs font-medium text-slate-500">Mô tả</span>
                            <textarea value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="mt-1 w-full min-h-24 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm resize-y" />
                        </label>

                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">Hủy</button>
                            <button type="button" disabled={saving} onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60 transition-colors cursor-pointer">
                                {saving ? "Đang lưu..." : "Lưu sản phẩm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
