"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    User,
    Phone,
    MapPin,
    Banknote,
    CreditCard,
    CheckCircle2,
    ArrowLeft,
    Zap,
    Package,
    Truck,
    Shield,
    ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { createMyAddress, createOrder, getMyAddresses } from "@/lib/api";
import { getAuthToken } from "@/lib/authStorage";
import type { ShippingAddress } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────
interface FormFields {
    fullName: string;
    phone: string;
    email: string;
    province: string;
    district: string;
    address: string;
    note: string;
    paymentMethod: "cod" | "vnpay";
}

type FormErrors = Partial<Record<keyof FormFields, string>>;

// ─── PROVINCES (sample) ───────────────────────────────────
const PROVINCES = [
    "TP. Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "An Giang",
    "Bình Dương",
    "Đồng Nai",
    "Khánh Hòa",
    "Long An",
];

// ─── Validation ───────────────────────────────────────────
function normalizeVietnamPhone(input: string): string {
    const digits = input.replace(/[^\d+]/g, "").trim();

    if (digits.startsWith("+84")) {
        return `0${digits.slice(3)}`;
    }
    if (digits.startsWith("84")) {
        return `0${digits.slice(2)}`;
    }
    return digits;
}

function validate(fields: FormFields, requireShippingInfo: boolean): FormErrors {
    const e: FormErrors = {};
    if (requireShippingInfo) {
        if (!fields.fullName.trim()) e.fullName = "Vui lòng nhập họ và tên.";
        else if (fields.fullName.trim().length < 3) e.fullName = "Họ tên tối thiểu 3 ký tự.";

        const normalizedPhone = normalizeVietnamPhone(fields.phone);
        if (!normalizedPhone.trim()) e.phone = "Vui lòng nhập số điện thoại.";
        else if (!/^(0[3-9]\d{8})$/.test(normalizedPhone))
            e.phone = "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678).";

        if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
            e.email = "Email không đúng định dạng.";

        if (!fields.province) e.province = "Vui lòng chọn tỉnh/thành.";
        if (!fields.district.trim()) e.district = "Vui lòng nhập quận/huyện.";
        if (!fields.address.trim()) e.address = "Vui lòng nhập địa chỉ cụ thể.";
        else if (fields.address.trim().length < 10)
            e.address = "Địa chỉ cần ít nhất 10 ký tự.";
    }

    return e;
}

// ─── Sub-components ───────────────────────────────────────

interface FieldProps {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

function FormField({ id, label, required, error, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-sm font-semibold text-primary"
            >
                {label}
                {required && <span className="text-cta ml-0.5">*</span>}
            </label>
            {children}
            {/* Error state — visible red hint */}
            {error && (
                <p className="text-xs text-cta flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="w-3.5 h-3.5 rounded-full bg-cta/10 flex items-center justify-center shrink-0 text-[10px] font-bold">!</span>
                    {error}
                </p>
            )}
        </div>
    );
}

// Shared input className builder
function inputCls(error?: string, extra?: string) {
    return [
        "w-full px-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 outline-none",
        "placeholder:text-muted/60",
        error
            ? "border-cta/50 bg-cta/5 focus:border-cta focus:ring-2 focus:ring-cta/20 text-primary"
            : "border-border bg-white hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/20 text-primary",
        extra ?? "",
    ]
        .join(" ")
        .trim();
}

// ─── PaymentMethodCard ─────────────────────────────────────
function PaymentMethodCard({
    id,
    value,
    selected,
    onSelect,
    icon: Icon,
    title,
    description,
    badge,
}: {
    id: string;
    value: "cod" | "vnpay";
    selected: boolean;
    onSelect: () => void;
    icon: React.ElementType;
    title: string;
    description: string;
    badge?: string;
}) {
    return (
        <label
            htmlFor={id}
            className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selected
                ? "border-accent bg-accent/5 shadow-sm"
                : "border-border hover:border-border-hover"
                }`}
        >
            <input
                type="radio"
                id={id}
                name="paymentMethod"
                value={value}
                checked={selected}
                onChange={onSelect}
                className="sr-only"
            />
            {/* Custom radio dot */}
            <div
                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${selected ? "border-accent" : "border-border"
                    }`}
            >
                {selected && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
            </div>

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? "bg-accent/10" : "bg-slate-100"}`}>
                <Icon className={`w-5 h-5 ${selected ? "text-accent" : "text-muted"}`} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">{title}</span>
                    {badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-success/10 text-success rounded-md">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted mt-0.5">{description}</p>
            </div>
        </label>
    );
}

// ─── Order Summary Panel ──────────────────────────────────
function OrderSummary({
    shippingFee,
    finalTotal,
    paymentMethod,
    submitting,
    onSubmit,
}: {
    shippingFee: number;
    finalTotal: number;
    paymentMethod: "cod" | "vnpay";
    submitting: boolean;
    onSubmit: () => void;
}) {
    const { checkoutItems } = useCart();
    const items = checkoutItems;  // Only the selected items from cart
    const checkoutTotalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    return (
        <div className="bg-white rounded-2xl border border-border overflow-hidden sticky top-24">
            <div className="px-5 py-4 border-b border-border bg-slate-50/60">
                <h2
                    className="text-base font-bold text-primary"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    Tóm tắt đơn hàng
                </h2>
                <p className="text-xs text-muted mt-0.5">{items.reduce((s, i) => s + i.quantity, 0)} sản phẩm được chọn</p>
            </div>

            {/* Items list */}
            <div className="max-h-56 overflow-y-auto divide-y divide-border">
                {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="48px" />
                            <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-primary line-clamp-2 leading-snug">{item.product.name}</p>
                        </div>
                        <span className="text-xs font-bold text-primary shrink-0">
                            {formatPrice(item.product.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Price breakdown */}
            <div className="px-5 py-4 space-y-3 border-t border-border text-sm">
                <div className="flex justify-between text-muted">
                    <span>Tạm tính</span>
                    <span className="text-primary font-medium">{formatPrice(checkoutTotalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted">
                    <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Vận chuyển</span>
                    <span className={shippingFee === 0 ? "text-success font-semibold" : "text-primary font-medium"}>
                        {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                    </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-3">
                    <span className="text-primary">Tổng cộng</span>
                    <span className="text-cta text-xl" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {formatPrice(finalTotal)}
                    </span>
                </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5 space-y-3">
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-cta hover:bg-cta-hover disabled:opacity-70 text-white text-base font-bold py-4 rounded-2xl transition-all duration-200 cursor-pointer shadow-lg shadow-cta/25 hover:shadow-cta/40 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                    {submitting ? (
                        <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            {paymentMethod === "vnpay" ? <CreditCard className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                            {paymentMethod === "vnpay" ? "Thanh toán qua VNPay" : "Đặt hàng ngay"}
                            <ChevronRight className="w-4 h-4" />
                        </>
                    )}
                </button>
                <div className="flex items-center justify-center gap-4 text-[11px] text-muted">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL 256-bit</span>
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Hàng chính hãng</span>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────
export default function CheckoutPage() {
    const router = useRouter();
    const { checkoutItems, clearCart, setCheckoutItems } = useCart();
    const items = checkoutItems;  // selected items only
    const token = getAuthToken();

    const checkoutTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shippingFee = checkoutTotal >= 20000000 ? 0 : 150000;
    const finalTotal = checkoutTotal + shippingFee;

    const [fields, setFields] = useState<FormFields>({
        fullName: "",
        phone: "",
        email: "",
        province: "",
        district: "",
        address: "",
        note: "",
        paymentMethod: "cod",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());
    const [addressesLoading, setAddressesLoading] = useState(true);
    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [saveNewAddress, setSaveNewAddress] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string>("");

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;
    const requireShippingInfo = useNewAddress || !selectedAddress;

    useEffect(() => {
        if (!token) {
            router.replace("/auth/login?redirect=%2Fcheckout");
            return;
        }
        setAddressesLoading(true);

        getMyAddresses(token)
            .then((list) => {
                setAddresses(list);
                if (list.length === 0) {
                    setUseNewAddress(true);
                    return;
                }

                const preferred = list.find((a) => a.isDefault) || list[0];
                setSelectedAddressId(preferred.id);
                setUseNewAddress(false);
            })
            .catch(() => {
                setAddresses([]);
                setUseNewAddress(true);
            })
            .finally(() => setAddressesLoading(false));
    }, [router, token]);

    const set = useCallback(
        (key: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            const val = e.target.value;
            setFields((f) => ({ ...f, [key]: val }));
            // Live-validate touched field
            setTouched((t) => new Set([...t, key]));
            setErrors((prev) => {
                const next = { ...prev };
                const tempFields = { ...fields, [key]: val };
                    const newErrs = validate(tempFields, requireShippingInfo);
                if (newErrs[key]) next[key] = newErrs[key];
                else delete next[key];
                return next;
            });
        },
        [fields, requireShippingInfo]
    );

    const handleBlur = (key: keyof FormFields) => {
        setTouched((t) => new Set([...t, key]));
        const errs = validate(fields, requireShippingInfo);
        setErrors((prev) => errs[key] ? { ...prev, [key]: errs[key] } : { ...prev, [key]: undefined });
    };

    const handleSubmit = async () => {
        // Mark all fields touched
        setTouched(new Set(Object.keys(fields)));
        const errs = validate(fields, requireShippingInfo);
        setErrors(errs);
        if (Object.keys(errs).length > 0) {
            // Scroll to first error
            const firstErrId = Object.keys(errs)[0];
            document.getElementById(firstErrId)?.focus();
            return;
        }

        if (!token) {
            setSubmitError("Bạn cần đăng nhập trước khi đặt hàng.");
            router.push("/auth/login");
            return;
        }

        const normalizedPhone = normalizeVietnamPhone(fields.phone);
        let shippingAddressPayload = selectedAddress && !useNewAddress
            ? {
                id: selectedAddress.id,
                fullName: selectedAddress.fullName,
                phone: selectedAddress.phone,
                email: selectedAddress.email,
                province: selectedAddress.province,
                district: selectedAddress.district,
                address: selectedAddress.address,
            }
            : {
                fullName: fields.fullName,
                phone: normalizedPhone,
                email: fields.email,
                province: fields.province,
                district: fields.district,
                address: fields.address,
            };

        setSubmitting(true);
        setSubmitError("");

        try {
            if (useNewAddress && saveNewAddress) {
                const normalizedKey = (value?: string) => (value || "").trim().toLowerCase();
                const existed = addresses.find((addr) =>
                    normalizedKey(addr.fullName) === normalizedKey(fields.fullName) &&
                    normalizedKey(addr.phone) === normalizedKey(normalizedPhone) &&
                    normalizedKey(addr.province) === normalizedKey(fields.province) &&
                    normalizedKey(addr.district) === normalizedKey(fields.district) &&
                    normalizedKey(addr.address) === normalizedKey(fields.address)
                );

                if (!existed) {
                    const createdAddress = await createMyAddress(
                        {
                            fullName: fields.fullName,
                            phone: normalizedPhone,
                            email: fields.email,
                            province: fields.province,
                            district: fields.district,
                            address: fields.address,
                            isDefault: false,
                        },
                        token
                    );

                    shippingAddressPayload = {
                        id: createdAddress.id,
                        fullName: createdAddress.fullName,
                        phone: createdAddress.phone,
                        email: createdAddress.email,
                        province: createdAddress.province,
                        district: createdAddress.district,
                        address: createdAddress.address,
                    };
                } else {
                    shippingAddressPayload = {
                        id: existed.id,
                        fullName: existed.fullName,
                        phone: existed.phone,
                        email: existed.email,
                        province: existed.province,
                        district: existed.district,
                        address: existed.address,
                    };
                }
            }

            const order = await createOrder(
                {
                    items: items.map((item) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                    })),
                    shippingAddress: shippingAddressPayload,
                    paymentMethod: fields.paymentMethod,
                    note: fields.note,
                },
                token
            );

            clearCart();
            setCheckoutItems([]);
            setCreatedOrderCode(order.orderCode);
            setSuccess(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể tạo đơn hàng";
            setSubmitError(message);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Success screen ──
    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-success/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-success" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        Đặt hàng thành công! 🎉
                    </h1>
                    <p className="text-sm text-muted mb-2">
                        Cảm ơn bạn đã tin tưởng LaptopVerse. Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút.
                    </p>
                    <p className="text-xs text-muted mb-8">
                        Mã đơn hàng: <span className="font-bold text-accent">{createdOrderCode ?? "-"}</span>
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-2xl hover:bg-accent-hover transition-all duration-200 cursor-pointer"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    // ── Empty checkout guard — redirect back if no items were selected ──
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-muted mb-4">Chưa có sản phẩm nào được chọn để thanh toán.</p>
                    <Link href="/cart" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
                    </Link>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <span className="inline-block w-9 h-9 border-4 border-slate-200 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={[{ label: "Giỏ hàng", href: "/cart" }, { label: "Thanh toán" }]} />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-8" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    Thanh toán
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start">
                    {/* ── LEFT: Form (2/3) ─────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Address Selection */}
                        <div className="bg-white rounded-2xl border border-border p-6">
                            <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                <MapPin className="w-4 h-4 text-accent" /> Địa chỉ nhận hàng
                            </h2>

                            {addressesLoading ? (
                                <div className="flex items-center gap-2 text-sm text-muted">
                                    <span className="inline-block w-4 h-4 border-2 border-slate-200 border-t-accent rounded-full animate-spin" />
                                    Đang tải danh sách địa chỉ...
                                </div>
                            ) : addresses.length > 0 ? (
                                <div className="space-y-3">
                                    {!useNewAddress && addresses.map((address) => (
                                        <button
                                            key={address.id}
                                            type="button"
                                            onClick={() => setSelectedAddressId(address.id)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-colors duration-200 ${selectedAddressId === address.id ? "border-accent bg-accent/5" : "border-border hover:border-border-hover"}`}
                                        >
                                            <p className="text-sm font-semibold text-primary flex items-center gap-2">
                                                {address.fullName}
                                                {address.isDefault ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">Mặc định</span> : null}
                                            </p>
                                            <p className="text-xs text-muted mt-1">{address.phone}</p>
                                            <p className="text-xs text-muted mt-1">
                                                {address.address}, {address.district}, {address.province}
                                            </p>
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => setUseNewAddress((prev) => !prev)}
                                        className="text-sm font-semibold text-accent hover:text-accent-hover"
                                    >
                                        {useNewAddress ? "Dùng địa chỉ đã lưu" : "+ Chọn địa chỉ khác / thêm mới"}
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted">Bạn chưa có địa chỉ đã lưu. Vui lòng thêm địa chỉ mới.</p>
                            )}
                        </div>

                        {/* Customer Info */}
                        {requireShippingInfo && (
                        <div className="bg-white rounded-2xl border border-border p-6">
                            <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                <User className="w-4 h-4 text-accent" /> Thông tin người nhận
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <FormField id="fullName" label="Họ và tên" required error={touched.has("fullName") ? errors.fullName : undefined}>
                                    <div className="relative">
                                        <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${touched.has("fullName") && errors.fullName ? "text-cta/60" : "text-muted/60"}`} />
                                        <input
                                            id="fullName"
                                            type="text"
                                            placeholder="Nguyễn Văn A"
                                            value={fields.fullName}
                                            onChange={set("fullName")}
                                            onBlur={() => handleBlur("fullName")}
                                            className={inputCls(touched.has("fullName") ? errors.fullName : undefined, "pl-10")}
                                            autoComplete="name"
                                        />
                                    </div>
                                </FormField>

                                {/* Phone */}
                                <FormField id="phone" label="Số điện thoại" required error={touched.has("phone") ? errors.phone : undefined}>
                                    <div className="relative">
                                        <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${touched.has("phone") && errors.phone ? "text-cta/60" : "text-muted/60"}`} />
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="0912 345 678 hoặc +84 912 345 678"
                                            value={fields.phone}
                                            onChange={set("phone")}
                                            onBlur={() => handleBlur("phone")}
                                            className={inputCls(touched.has("phone") ? errors.phone : undefined, "pl-10")}
                                            autoComplete="tel"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </FormField>

                                {/* Email (optional) */}
                                <FormField id="email" label="Email" error={touched.has("email") ? errors.email : undefined}>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com (không bắt buộc)"
                                        value={fields.email}
                                        onChange={set("email")}
                                        onBlur={() => handleBlur("email")}
                                        className={inputCls(touched.has("email") ? errors.email : undefined)}
                                        autoComplete="email"
                                    />
                                </FormField>

                                {/* Province */}
                                <FormField id="province" label="Tỉnh / Thành phố" required error={touched.has("province") ? errors.province : undefined}>
                                    <select
                                        id="province"
                                        value={fields.province}
                                        onChange={set("province")}
                                        onBlur={() => handleBlur("province")}
                                        className={inputCls(touched.has("province") ? errors.province : undefined, "appearance-none cursor-pointer")}
                                    >
                                        <option value="">-- Chọn tỉnh/thành --</option>
                                        {PROVINCES.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </FormField>

                                {/* District */}
                                <FormField id="district" label="Quận / Huyện" required error={touched.has("district") ? errors.district : undefined}>
                                    <input
                                        id="district"
                                        type="text"
                                        placeholder="Quận 7"
                                        value={fields.district}
                                        onChange={set("district")}
                                        onBlur={() => handleBlur("district")}
                                        className={inputCls(touched.has("district") ? errors.district : undefined)}
                                    />
                                </FormField>

                                {/* Address */}
                                <FormField id="address" label="Địa chỉ cụ thể" required error={touched.has("address") ? errors.address : undefined}>
                                    <div className="relative">
                                        <MapPin className={`absolute left-3.5 top-3.5 w-4 h-4 ${touched.has("address") && errors.address ? "text-cta/60" : "text-muted/60"}`} />
                                        <input
                                            id="address"
                                            type="text"
                                            placeholder="123 Nguyễn Văn Linh"
                                            value={fields.address}
                                            onChange={set("address")}
                                            onBlur={() => handleBlur("address")}
                                            className={inputCls(touched.has("address") ? errors.address : undefined, "pl-10")}
                                            autoComplete="street-address"
                                        />
                                    </div>
                                </FormField>

                                {/* Note (full width) */}
                                <div className="sm:col-span-2">
                                    <FormField id="note" label="Ghi chú đơn hàng">
                                        <textarea
                                            id="note"
                                            rows={3}
                                            placeholder="Giao giờ hành chính, gọi trước 30 phút..."
                                            value={fields.note}
                                            onChange={set("note")}
                                            className="w-full px-4 py-3 text-sm rounded-xl border-2 border-border hover:border-border-hover focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200 resize-none placeholder:text-muted/60"
                                        />
                                    </FormField>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="inline-flex items-center gap-2 text-sm text-primary-light cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={saveNewAddress}
                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                            className="rounded border-border"
                                        />
                                        Lưu địa chỉ này vào sổ địa chỉ
                                    </label>
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl border border-border p-6">
                            <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                <CreditCard className="w-4 h-4 text-accent" /> Phương thức thanh toán
                            </h2>

                            <div className="space-y-3">
                                <PaymentMethodCard
                                    id="cod"
                                    value="cod"
                                    selected={fields.paymentMethod === "cod"}
                                    onSelect={() => setFields((f) => ({ ...f, paymentMethod: "cod" }))}
                                    icon={Banknote}
                                    title="Thanh toán khi nhận hàng (COD)"
                                    description="Trả tiền mặt khi nhận hàng. Kiểm tra hàng trước khi trả tiền."
                                    badge="Phổ biến"
                                />
                                <PaymentMethodCard
                                    id="vnpay"
                                    value="vnpay"
                                    selected={fields.paymentMethod === "vnpay"}
                                    onSelect={() => setFields((f) => ({ ...f, paymentMethod: "vnpay" }))}
                                    icon={CreditCard}
                                    title="VNPay — Thẻ ATM / QR"
                                    description="Thanh toán qua cổng VNPay. Hỗ trợ tất cả thẻ nội địa và quốc tế."
                                />
                            </div>
                        </div>

                        {submitError && (
                            <div className="bg-cta/5 border border-cta/20 rounded-2xl px-4 py-3 text-sm text-cta">
                                {submitError}
                            </div>
                        )}

                        {/* Back to cart (mobile) */}
                        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors duration-200 lg:hidden">
                            <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
                        </Link>
                    </div>

                    {/* ── RIGHT: Summary (1/3) ─────────────────────────── */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            shippingFee={shippingFee}
                            finalTotal={finalTotal}
                            paymentMethod={fields.paymentMethod}
                            submitting={submitting}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
