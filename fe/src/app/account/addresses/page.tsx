"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Pencil, Trash2, Plus, X } from "lucide-react";
import { createMyAddress, deleteMyAddress, getMyAddresses, updateMyAddress } from "@/lib/api";
import { getAuthToken } from "@/lib/authStorage";
import type { ShippingAddress } from "@/lib/types";

interface AddressFormState {
    fullName: string;
    phone: string;
    email: string;
    province: string;
    district: string;
    address: string;
}

const EMPTY_FORM: AddressFormState = {
    fullName: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    address: "",
};

export default function AddressesPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formState, setFormState] = useState<AddressFormState>(EMPTY_FORM);

    const loadAddresses = async (authToken: string) => {
        setLoading(true);
        setError("");
        try {
            const list = await getMyAddresses(authToken);
            setAddresses(list);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không tải được sổ địa chỉ";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const authToken = getAuthToken();
        if (!authToken) {
            router.replace("/auth/login");
            return;
        }

        setToken(authToken);
        loadAddresses(authToken);
    }, [router]);

    const openCreateModal = () => {
        setEditingAddressId(null);
        setFormState(EMPTY_FORM);
        setFormOpen(true);
    };

    const openEditModal = (address: ShippingAddress) => {
        setEditingAddressId(address.id);
        setFormState({
            fullName: address.fullName,
            phone: address.phone,
            email: address.email || "",
            province: address.province,
            district: address.district,
            address: address.address,
        });
        setFormOpen(true);
    };

    const handleSave = async () => {
        if (!token) return;

        setSubmitting(true);
        setError("");
        try {
            const payload = {
                fullName: formState.fullName.trim(),
                phone: formState.phone.trim(),
                email: formState.email.trim() || undefined,
                province: formState.province.trim(),
                district: formState.district.trim(),
                address: formState.address.trim(),
                isDefault: false,
            };

            if (editingAddressId) {
                await updateMyAddress(editingAddressId, payload, token);
            } else {
                await createMyAddress(payload, token);
            }

            setFormOpen(false);
            setFormState(EMPTY_FORM);
            setEditingAddressId(null);
            await loadAddresses(token);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không lưu được địa chỉ";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        setSubmitting(true);
        setError("");
        try {
            await deleteMyAddress(id, token);
            await loadAddresses(token);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không xóa được địa chỉ";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
            <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Sổ địa chỉ
            </h1>
            <p className="text-sm text-muted mt-1">Danh sách địa chỉ giao hàng của bạn.</p>
            <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
            >
                <Plus className="w-4 h-4" /> Thêm địa chỉ
            </button>

            <div className="mt-6 bg-white border border-border rounded-2xl overflow-hidden">
                {loading && (
                    <div className="p-6 flex items-center gap-2 text-muted">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải địa chỉ...
                    </div>
                )}

                {!loading && error && <p className="p-6 text-sm text-cta">{error}</p>}

                {!loading && !error && addresses.length === 0 && (
                    <div className="p-8 text-center text-muted">Bạn chưa lưu địa chỉ nào.</div>
                )}

                {!loading && !error && addresses.length > 0 && (
                    <div className="divide-y divide-border">
                        {addresses.map((address) => (
                            <div key={address.id} className="p-4 sm:p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2 text-primary font-medium">
                                        <MapPin className="w-4 h-4" />
                                        {address.fullName}
                                        {address.isDefault ? (
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">Mặc định</span>
                                        ) : null}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(address)}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-primary-light"
                                            title="Sửa địa chỉ"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={submitting}
                                            onClick={() => handleDelete(address.id)}
                                            className="p-2 rounded-lg hover:bg-cta/10 text-cta disabled:opacity-60"
                                            title="Xóa địa chỉ"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-primary-light mt-1">{address.phone}</p>
                                <p className="text-sm text-primary-light mt-1">
                                    {address.address}, {address.district}, {address.province}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {formOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setFormOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl border border-border p-5 sm:p-6 space-y-4">
                        <button
                            type="button"
                            onClick={() => setFormOpen(false)}
                            className="absolute top-3 right-3 p-2 rounded-lg hover:bg-slate-100"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h2 className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            {editingAddressId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" placeholder="Họ và tên" value={formState.fullName} onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))} />
                            <input className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" placeholder="Số điện thoại" value={formState.phone} onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))} />
                            <input className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent sm:col-span-2" placeholder="Email (không bắt buộc)" value={formState.email} onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))} />
                            <input className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" placeholder="Tỉnh / Thành phố" value={formState.province} onChange={(e) => setFormState((prev) => ({ ...prev, province: e.target.value }))} />
                            <input className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent" placeholder="Quận / Huyện" value={formState.district} onChange={(e) => setFormState((prev) => ({ ...prev, district: e.target.value }))} />
                            <input className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent sm:col-span-2" placeholder="Địa chỉ cụ thể" value={formState.address} onChange={(e) => setFormState((prev) => ({ ...prev, address: e.target.value }))} />
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={submitting || !formState.fullName.trim() || !formState.phone.trim() || !formState.province.trim() || !formState.district.trim() || !formState.address.trim()}
                            className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-70"
                        >
                            {submitting ? "Đang lưu..." : "Lưu địa chỉ"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
