"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, Eye, Edit2, EyeOff, Trash2, X } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/admin/Badge";
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 transition-all duration-200"
                >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                </button>
            }
        >
            {/* Enhanced Search Section */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            value={searchDraft}
                            onChange={(e) => setSearchDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Tìm theo tên hoặc slug"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light hover:shadow-md transition-all duration-200"
                    >
                        Tìm kiếm
                    </button>
                </div>
                {!!search && (
                    <p className="mt-3 text-xs text-muted flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent"></span>
                        Kết quả cho: &quot;{search}&quot;
                    </p>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Enhanced Products Table */}
            <div className="mt-6 bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1180px] text-sm">
                        <thead className="bg-gradient-to-r from-slate-50 to-blue-50/20 text-primary">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">Sản phẩm</th>
                                <th className="px-6 py-4 text-left font-semibold">Giá</th>
                                <th className="px-6 py-4 text-left font-semibold">Tồn kho</th>
                                <th className="px-6 py-4 text-left font-semibold">Đã bán</th>
                                <th className="px-6 py-4 text-left font-semibold">Đánh giá</th>
                                <th className="px-6 py-4 text-left font-semibold">Trạng thái</th>
                                <th className="px-6 py-4 text-left font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-primary">{product.name}</p>
                                        <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
                                            {product.brandName} <span className="text-slate-300">•</span> {product.categoryName}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-accent">{formatPrice(product.price)}</p>
                                        {product.originalPrice !== product.price && (
                                            <p className="text-xs text-muted line-through">{formatPrice(product.originalPrice)}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={product.stockQuantity > 10 ? "success" : product.stockQuantity > 0 ? "warning" : "danger"}>
                                            {product.stockQuantity}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-primary font-medium">{product.soldCount}</td>
                                    <td className="px-6 py-4 text-primary font-medium">{product.reviewCount}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={product.isActive ? "success" : "default"}>
                                            {product.isActive ? "Đang bán" : "Tạm ẩn"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openDetail(product.id)}
                                                className="p-2 rounded-lg border border-slate-200 text-accent hover:border-accent hover:bg-accent/5 transition-all"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openEditForm(product)}
                                                className="p-2 rounded-lg border border-slate-200 text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleActive(product)}
                                                className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                                                title={product.isActive ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
                                            >
                                                <EyeOff className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(product)}
                                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all"
                                                title="Xóa sản phẩm"
                                            >
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
            <p className="mt-2 text-xs text-muted">Tổng {totalElements} sản phẩm</p>

            {/* Enhanced Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200/60 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                Chi tiết sản phẩm
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
                            <div className="grid gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[120px]">Tên:</span>
                                    <span className="text-primary-light flex-1">{selected.name}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[120px]">Slug:</span>
                                    <span className="text-primary-light flex-1">{selected.slug}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[120px]">Thương hiệu:</span>
                                    <Badge variant="info">{selected.brandName}</Badge>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[120px]">Danh mục:</span>
                                    <Badge variant="purple">{selected.categoryName}</Badge>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[120px]">Giá:</span>
                                    <span className="text-accent font-bold">{formatPrice(selected.price)}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[120px]">Tồn kho:</span>
                                    <Badge variant={selected.stockQuantity > 10 ? "success" : selected.stockQuantity > 0 ? "warning" : "danger"}>
                                        {selected.stockQuantity}
                                    </Badge>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[120px]">Đã bán:</span>
                                    <span className="text-primary-light">{selected.soldCount}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[120px]">Số đánh giá:</span>
                                    <span className="text-primary-light">{selected.reviewCount}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-primary min-w-[120px]">Trạng thái:</span>
                                    <Badge variant={selected.isActive ? "success" : "default"}>
                                        {selected.isActive ? "Đang bán" : "Tạm ẩn"}
                                    </Badge>
                                </div>
                                {selected.description && (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-semibold text-primary">Mô tả:</span>
                                        <p className="text-primary-light bg-slate-50 p-3 rounded-xl border border-slate-200">{selected.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Specs Section */}
                            <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-slate-50">
                                <p className="font-semibold text-primary mb-3 flex items-center gap-2">
                                    <span className="inline-block w-1 h-5 bg-accent rounded-full"></span>
                                    Thông số kỹ thuật
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-muted">CPU:</span>
                                        <p className="text-primary font-medium">{selected.specs.cpu}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted">RAM:</span>
                                        <p className="text-primary font-medium">{selected.specs.ram}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted">Storage:</span>
                                        <p className="text-primary font-medium">{selected.specs.storage}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted">Display:</span>
                                        <p className="text-primary font-medium">{selected.specs.display}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200/60 px-6 py-4 flex flex-wrap items-center gap-3 rounded-b-2xl">
                            <Link
                                href={`/laptops/${selected.id}`}
                                target="_blank"
                                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-primary hover:border-accent hover:shadow-md transition-all text-sm font-medium"
                            >
                                Xem trên trang bán hàng
                            </Link>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-light transition-all text-sm"
                            >
                                Đóng
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
                        <span className="text-sm font-medium text-primary">Đang tải chi tiết sản phẩm...</span>
                    </div>
                </div>
            )}

            {/* Enhanced Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setFormOpen(false)} />
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200/60 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                {title}
                            </h2>
                            <button
                                onClick={() => !saving && setFormOpen(false)}
                                disabled={saving}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700 disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    placeholder="Tên sản phẩm *"
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                                <input
                                    placeholder="Slug (tùy chọn)"
                                    value={form.slug || ""}
                                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                                <select
                                    value={form.brandId}
                                    onChange={(e) => setForm((p) => ({ ...p, brandId: Number(e.target.value) }))}
                                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                >
                                    <option value={0}>Chọn thương hiệu *</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm((p) => ({ ...p, categoryId: Number(e.target.value) }))}
                                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                >
                                    <option value={0}>Chọn danh mục *</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Giá bán *"
                                    value={form.price}
                                    onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                                <input
                                    type="number"
                                    placeholder="Giá gốc *"
                                    value={form.originalPrice}
                                    onChange={(e) => setForm((p) => ({ ...p, originalPrice: Number(e.target.value) }))}
                                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                                <input
                                    type="number"
                                    placeholder="Tồn kho *"
                                    value={form.stockQuantity}
                                    onChange={(e) => setForm((p) => ({ ...p, stockQuantity: Number(e.target.value) }))}
                                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                                <select
                                    value={form.badge || ""}
                                    onChange={(e) => setForm((p) => ({ ...p, badge: (e.target.value || undefined) as "Hot" | "New" | "Sale" | undefined }))}
                                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                >
                                    <option value="">Không badge</option>
                                    <option value="Hot">Hot</option>
                                    <option value="New">New</option>
                                    <option value="Sale">Sale</option>
                                </select>
                            </div>

                            <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                                <p className="font-semibold text-primary mb-3 text-sm flex items-center gap-2">
                                    <span className="inline-block w-1 h-4 bg-accent rounded-full"></span>
                                    Thông số kỹ thuật
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        placeholder="CPU"
                                        value={form.specs.cpu}
                                        onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, cpu: e.target.value } }))}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                    />
                                    <input
                                        placeholder="RAM"
                                        value={form.specs.ram}
                                        onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, ram: e.target.value } }))}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                    />
                                    <input
                                        placeholder="Storage"
                                        value={form.specs.storage}
                                        onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, storage: e.target.value } }))}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                    />
                                    <input
                                        placeholder="Display"
                                        value={form.specs.display}
                                        onChange={(e) => setForm((p) => ({ ...p, specs: { ...p.specs, display: e.target.value } }))}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                                    />
                                </div>
                            </div>

                            <input
                                placeholder="URL ảnh *"
                                value={form.image}
                                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                                className="mt-4 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                            <textarea
                                placeholder="Mô tả"
                                value={form.description || ""}
                                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                className="mt-4 w-full min-h-24 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200/60 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={() => setFormOpen(false)}
                                disabled={saving}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-primary font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleSave}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-70 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {saving ? "Đang lưu..." : "Lưu sản phẩm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
