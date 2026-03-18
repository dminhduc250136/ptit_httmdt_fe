export interface ProductSpec {
    label: string;
    value: string;
}

export interface ProductSpecsSummary {
    cpu: string;
    ram: string;
    storage: string;
    display: string;
}

export interface Product {
    id: number;
    name: string;
    slug?: string;
    brand: string;
    category: string;
    price: number;
    originalPrice: number;
    image: string;
    gallery?: string[];
    rating: number;
    reviewCount: number;
    soldCount: number;
    badge?: "Hot" | "New" | "Sale";
    specs: ProductSpecsSummary;
    detailedSpecs?: ProductSpec[];
    description?: string;
    gifts?: string[];
    isFlashSale?: boolean;
    stockQuantity?: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description?: string;
    productCount?: number;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    productCount?: number;
}

export interface ProductReview {
    id: number;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    title: string;
    content: string;
    helpful: number;
    verified: boolean;
    images?: string[];
}

export interface ReviewSummary {
    avgRating: number;
    totalReviews: number;
    distribution?: Record<number, number>;
}

export interface AuthUser {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    avatarUrl?: string;
    role?: string;
    token?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export interface OrderCreatePayload {
    items: Array<{
        productId: number;
        quantity: number;
    }>;
    shippingAddress: {
        id?: number;
        fullName: string;
        phone: string;
        email?: string;
        province: string;
        district: string;
        address: string;
    };
    paymentMethod: "cod" | "vnpay";
    note?: string;
}

export interface OrderCreateResult {
    id: number;
    orderCode: string;
    total: number;
}

export interface UserProfile {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    avatarUrl?: string;
    role?: string;
}

export interface UpdateProfilePayload {
    fullName: string;
    phone?: string;
    avatarUrl?: string;
}

export interface ShippingAddress {
    id: number;
    fullName: string;
    phone: string;
    email?: string;
    province: string;
    district: string;
    address: string;
    isDefault?: boolean;
}

export interface OrderListItem {
    id: number;
    orderCode: string;
    total: number;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    itemCount: number;
    createdAt: string;
}

export interface OrderItem {
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    originalPrice: number;
    quantity: number;
    subtotal: number;
}

export interface OrderDetail {
    id: number;
    orderCode: string;
    subtotal: number;
    shippingFee: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    note?: string;
    createdAt: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
}

export interface AdminOrder {
    id: number;
    orderCode: string;
    total: number;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    customerName: string;
    customerEmail: string;
    itemCount: number;
    createdAt: string;
}

export interface AdminDashboard {
    totalUsers: number;
    activeUsers: number;
    totalProducts: number;
    lowStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: AdminOrder[];
}

export interface AdminProduct {
    id: number;
    name: string;
    slug: string;
    brandId: number;
    brandName: string;
    categoryId: number;
    categoryName: string;
    price: number;
    originalPrice: number;
    image: string;
    badge?: "Hot" | "New" | "Sale";
    specs: ProductSpecsSummary;
    description?: string;
    stockQuantity: number;
    soldCount: number;
    reviewCount: number;
    isActive: boolean;
    createdAt: string;
}

export interface AdminUpsertProductPayload {
    name: string;
    slug?: string;
    brandId: number;
    categoryId: number;
    price: number;
    originalPrice: number;
    image: string;
    badge?: "Hot" | "New" | "Sale";
    specs: ProductSpecsSummary;
    description?: string;
    stockQuantity: number;
    isActive?: boolean;
}

export interface AdminUser {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role: "CUSTOMER" | "ADMIN";
    isActive: boolean;
    createdAt: string;
}

export interface PagedResult<T> {
    content: T[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
}