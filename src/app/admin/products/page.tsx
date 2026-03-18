"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";
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

    const title = useMemo(() => (editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"), [editing]);

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

    const openCreateForm = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setFormOpen(true);
    };

    const openEditForm = (product: AdminProduct) => {
        setEditing(product);
        setForm({
            name: product.name,
            slug: product.slug,
            brandId: product.brandId,
            categoryId: product.categoryId,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            badge: product.badge,
            specs: product.specs,
            description: product.description || "",
            stockQuantity: product.stockQuantity,
            isActive: product.isActive,
        });
        setFormOpen(true);
    };

    const handleSearch = async () => {
        if (!token) return;
        setLoading(true);
        try {
            await loadProducts(token, searchDraft.trim(), 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không tìm kiếm được sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = async (nextPage: number) => {
        if (!token) return;
        setLoading(true);
        try {
            await loadProducts(token, search, nextPage);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không chuyển trang được");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!token) return;
        if (!form.name.trim() || !form.image.trim() || form.brandId <= 0 || form.categoryId <= 0) {
            setError("Vui lòng điền đủ thông tin bắt buộc");
            return;
        }

        setSaving(true);
        setError("");
        try {
            if (editing) {
                await updateAdminProduct(editing.id, form, token);
            } else {
                await createAdminProduct(form, token);
            }
            await loadProducts(token, search, pageIndex);
            setFormOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không thể lưu sản phẩm");
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (product: AdminProduct) => {
        if (!token) return;
        try {
            await setAdminProductActive(product.id, !product.isActive, token);
            await loadProducts(token, search, pageIndex);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không đổi được trạng thái sản phẩm");
        }
    };

    const handleDelete = async (product: AdminProduct) => {
        if (!token) return;
        const agreed = window.confirm(`Xóa sản phẩm \"${product.name}\"?`);
        if (!agreed) return;

        try {
            await deleteAdminProduct(product.id, token);
            const nextPage = products.length === 1 && pageIndex > 0 ? pageIndex - 1 : pageIndex;
            await loadProducts(token, search, nextPage);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không xóa được sản phẩm");
        }
    };

    const openDetail = async (productId: number) => {
        if (!token) return;
        setDetailLoading(true);
        try {
            const detail = await getAdminProductById(productId, token);
            setSelected(detail);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không tải được chi tiết sản phẩm");
        } finally {
            setDetailLoading(false);
        }
    };

    if (checking || loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 flex items-center justify-center gap-2 text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải dữ liệu sản phẩm...
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
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
                >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                </button>
            }
        >
            <div className="bg-white border border-border rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={searchDraft}
                            onChange={(e) => setSearchDraft(e.target.value)}
                            placeholder="Tìm theo tên hoặc slug"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light"
                    >
                        Tìm kiếm
                    </button>
                </div>
                {!!search && <p className="mt-2 text-xs text-muted">Kết quả cho: &quot;{search}&quot;</p>}
            </div>

            {error && <p className="mt-4 text-sm text-cta">{error}</p>}

            <div className="mt-4 bg-white border border-border rounded-2xl overflow-x-auto">
                <table className="w-full min-w-[1180px] text-sm">
                    <thead className="bg-slate-50 text-primary-light">
                        <tr>
                            <th className="px-4 py-3 text-left">Sản phẩm</th>
                            <th className="px-4 py-3 text-left">Giá</th>
                            <th className="px-4 py-3 text-left">Tồn kho</th>
                            <th className="px-4 py-3 text-left">Đã bán</th>
                            <th className="px-4 py-3 text-left">Đánh giá</th>
                            <th className="px-4 py-3 text-left">Trạng thái</th>
                            <th className="px-4 py-3 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-t border-border">
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-primary">{product.name}</p>
                                    <p className="text-xs text-muted mt-0.5">{product.brandName} • {product.categoryName}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
                                    <p className="text-xs text-muted">Giá gốc: {formatPrice(product.originalPrice)}</p>
                                </td>
                                <td className="px-4 py-3 text-primary-light">{product.stockQuantity}</td>
                                <td className="px-4 py-3 text-primary-light">{product.soldCount}</td>
                                <td className="px-4 py-3 text-primary-light">{product.reviewCount}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.isActive ? "bg-success/10 text-success" : "bg-slate-200 text-slate-700"}`}>
                                        {product.isActive ? "Đang bán" : "Tạm ẩn"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openDetail(product.id)}
                                            className="px-3 py-1.5 rounded-lg border border-border text-primary hover:border-accent"
                                        >
                                            Xem
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openEditForm(product)}
                                            className="px-3 py-1.5 rounded-lg border border-border text-primary hover:border-accent"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => toggleActive(product)}
                                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-primary hover:bg-slate-200"
                                        >
                                            {product.isActive ? "Ẩn" : "Bật"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(product)}
                                            className="px-3 py-1.5 rounded-lg bg-cta/10 text-cta hover:bg-cta/20"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminPagination currentPage={pageIndex} totalPages={totalPages} onPageChange={handlePageChange} disabled={loading} />
            <p className="mt-2 text-xs text-muted">Tổng {totalElements} sản phẩm</p>

            {selected && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-border p-5 sm:p-6">
                        <h2 className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Chi tiết sản phẩm
                        </h2>
                        <div className="mt-4 space-y-2 text-sm text-primary-light">
                            <p><span className="font-semibold text-primary">Tên:</span> {selected.name}</p>
                            <p><span className="font-semibold text-primary">Slug:</span> {selected.slug}</p>
                            <p><span className="font-semibold text-primary">Thương hiệu:</span> {selected.brandName}</p>
                            <p><span className="font-semibold text-primary">Danh mục:</span> {selected.categoryName}</p>
                            <p><span className="font-semibold text-primary">Giá:</span> {formatPrice(selected.price)}</p>
                            <p><span className="font-semibold text-primary">Tồn kho:</span> {selected.stockQuantity}</p>
                            <p><span className="font-semibold text-primary">Đã bán:</span> {selected.soldCount}</p>
                            <p><span className="font-semibold text-primary">Số đánh giá:</span> {selected.reviewCount}</p>
                            <p><span className="font-semibold text-primary">Trạng thái:</span> {selected.isActive ? "Đang bán" : "Tạm ẩn"}</p>
                            {selected.description && <p><span className="font-semibold text-primary">Mô tả:</span> {selected.description}</p>}
                        </div>
                        <div className="mt-4 p-3 rounded-xl border border-border bg-slate-50 text-sm text-primary-light">
                            <p className="font-semibold text-primary mb-1">Thông số</p>
                            <p>CPU: {selected.specs.cpu}</p>
                            <p>RAM: {selected.specs.ram}</p>
                            <p>Storage: {selected.specs.storage}</p>
                            <p>Display: {selected.specs.display}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Link href={`/laptops/${selected.id}`} target="_blank" className="px-3 py-2 rounded-lg border border-border text-primary hover:border-accent">
                                Xem trên trang bán hàng
                            </Link>
                            <button type="button" onClick={() => setSelected(null)} className="px-3 py-2 rounded-lg bg-primary text-white">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {detailLoading && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30">
                    <div className="bg-white border border-border rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải chi tiết sản phẩm...
                    </div>
                </div>
            )}

            {formOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setFormOpen(false)} />
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-border p-5 sm:p-6">
                        <h2 className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>{title}</h2>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                            <input placeholder="Slug (tùy chọn)" value={form.slug || ""} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                            <select value={form.brandId} onChange={(e) => setForm((p) => ({ ...p, brandId: Number(e.target.value) }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent">
                                <option value={0}>Chọn thương hiệu</option>
                                {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                            </select>
                            <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: Number(e.target.value) }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent">
                                <option value={0}>Chọn danh mục</option>
                                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                            </select>
                            <input type="number" placeholder="Giá bán" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                            <input type="number" placeholder="Giá gốc" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: Number(e.target.value) }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                            <input type="number" placeholder="Tồn kho" value={form.stockQuantity} onChange={(e) => setForm((p) => ({ ...p, stockQuantity: Number(e.target.value) }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                            <select value={form.badge || ""} onChange={(e) => setForm((p) => ({ ...p, badge: (e.target.value || undefined) as "Hot" | "New" | "Sale" | undefined }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent">
                                <option value="">Không badge</option>
                                <option value="Hot">Hot</option>
                                <option value="New">New</option>
                                <option value="Sale">Sale</option>
                            </select>
                            <input placeholder="CPU" value={form.specs.cpu} onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, cpu: e.target.value } }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                            <input placeholder="RAM" value={form.specs.ram} onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, ram: e.target.value } }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                            <input placeholder="Storage" value={form.specs.storage} onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, storage: e.target.value } }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                            <input placeholder="Display" value={form.specs.display} onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, display: e.target.value } }))} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                        </div>

                        <input placeholder="URL ảnh" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="mt-3 w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />
                        <textarea placeholder="Mô tả" value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="mt-3 w-full min-h-24 px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" />

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 rounded-xl border border-border text-primary">Hủy</button>
                            <button type="button" disabled={saving} onClick={handleSave} className="px-4 py-2 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-70">
                                {saving ? "Đang lưu..." : "Lưu sản phẩm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
