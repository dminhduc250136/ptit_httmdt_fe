import { apiRequest } from "@/lib/apiClient";
import type {
    AdminDashboard,
    AdminOrder,
    AdminProduct,
    AdminUpsertProductPayload,
    AdminUser,
    AuthUser,
    Brand,
    Category,
    LoginPayload,
    OrderDetail,
    OrderCreatePayload,
    OrderCreateResult,
    OrderListItem,
    Product,
    PagedResult,
    ProductReview,
    RegisterPayload,
    ReviewSummary,
    ShippingAddress,
    UpdateProfilePayload,
    UserProfile,
} from "@/lib/types";

interface PageResponse<T> {
    content: T[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
}

interface PageMetadata {
    size?: number;
    number?: number;
    totalElements?: number;
    totalPages?: number;
}

interface RawPageResponse<T> {
    content?: T[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
    page?: PageMetadata;
}

interface ProductListDTO {
    id: number;
    name: string;
    slug: string;
    brand: string;
    category: string;
    price: number;
    originalPrice: number;
    image: string;
    rating: number;
    reviewCount: number;
    soldCount: number;
    badge?: "Hot" | "New" | "Sale";
    specs: {
        cpu: string;
        ram: string;
        storage: string;
        display: string;
    };
}

interface ProductDetailDTO {
    id: number;
    name: string;
    slug: string;
    brand: { name?: string } | string;
    category: { name?: string } | string;
    price: number;
    originalPrice: number;
    image: string;
    gallery?: string[];
    rating: number;
    reviewCount: number;
    soldCount: number;
    badge?: "Hot" | "New" | "Sale";
    specs: {
        cpu: string;
        ram: string;
        storage: string;
        display: string;
    };
    detailedSpecs?: Array<{ label: string; value: string }>;
    description?: string;
    gifts?: string[];
    stockQuantity?: number;
    isFlashSale?: boolean;
}

interface FlashSaleDTO {
    endTime: string;
    products: ProductListDTO[];
}

interface ReviewDTO {
    id: number;
    rating: number;
    title: string;
    content: string;
    helpfulCount: number;
    isVerified: boolean;
    createdAt: string;
    userName: string;
    userAvatar?: string;
    images?: string[];
}

interface ReviewSummaryDTO {
    avgRating: number;
    totalReviews: number;
    distribution?: Record<number, number>;
}

interface AuthResponseDTO {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role?: string;
    token?: string;
}

interface UserProfileDTO {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    avatarUrl?: string;
    role?: string;
}

interface ShippingAddressDTO {
    id: number;
    fullName: string;
    phone: string;
    email?: string;
    province: string;
    district: string;
    address: string;
    isDefault?: boolean;
}

interface OrderListDTO {
    id: number;
    orderCode: string;
    total: number;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    itemCount: number;
    createdAt: string;
}

interface OrderItemDTO {
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    originalPrice: number;
    quantity: number;
    subtotal: number;
}

interface OrderDetailDTO {
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
    items: OrderItemDTO[];
    shippingAddress: ShippingAddressDTO;
}

interface OrderResponseDTO {
    id: number;
    orderCode: string;
    total: number;
}

interface AdminOrderDTO {
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

interface AdminDashboardDTO {
    totalUsers: number;
    activeUsers: number;
    totalProducts: number;
    lowStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: AdminOrderDTO[];
}

interface AdminProductDTO {
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
    specs: {
        cpu: string;
        ram: string;
        storage: string;
        display: string;
    };
    description?: string;
    stockQuantity: number;
    soldCount: number;
    reviewCount: number;
    isActive: boolean;
    createdAt: string;
}

interface AdminUserDTO {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role: "CUSTOMER" | "ADMIN";
    isActive: boolean;
    createdAt: string;
}

export async function getProducts(params?: {
    category?: string;
    search?: string;
    sortBy?: string;
    size?: number;
}): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    query.set("page", "0");
    query.set("size", String(params?.size ?? 100));

    const page = await apiRequest<PageResponse<ProductListDTO>>(`/products?${query.toString()}`);
    return (page.content || []).map(mapProductList);
}

export async function getProductById(id: number): Promise<Product> {
    const dto = await apiRequest<ProductDetailDTO>(`/products/${id}`);
    return mapProductDetail(dto);
}

export async function getRelatedProducts(id: number): Promise<Product[]> {
    const list = await apiRequest<ProductListDTO[]>(`/products/${id}/related`);
    return (list || []).map(mapProductList);
}

export async function getCategories(): Promise<Category[]> {
    const list = await apiRequest<Category[]>("/categories");
    return list || [];
}

export async function getBrands(): Promise<Brand[]> {
    const list = await apiRequest<Brand[]>("/brands");
    return list || [];
}

export async function getActiveFlashSale(): Promise<{ endTime: string | null; products: Product[] }> {
    const dto = await apiRequest<FlashSaleDTO | null>("/flash-sales/active");
    if (!dto) return { endTime: null, products: [] };
    return {
        endTime: dto.endTime || null,
        products: (dto.products || []).map(mapProductList),
    };
}

export async function getProductReviews(productId: number): Promise<ProductReview[]> {
    const page = await apiRequest<PageResponse<ReviewDTO>>(`/reviews/product/${productId}?page=0&size=100`);
    return (page.content || []).map((r) => ({
        id: r.id,
        author: r.userName,
        avatar: getAvatarText(r.userName, r.userAvatar),
        rating: r.rating,
        date: r.createdAt,
        title: r.title,
        content: r.content,
        helpful: r.helpfulCount,
        verified: r.isVerified,
        images: r.images,
    }));
}

export async function getProductReviewSummary(productId: number): Promise<ReviewSummary> {
    const dto = await apiRequest<ReviewSummaryDTO>(`/reviews/product/${productId}/summary`);
    return {
        avgRating: dto?.avgRating ?? 0,
        totalReviews: dto?.totalReviews ?? 0,
        distribution: dto?.distribution,
    };
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
    const dto = await apiRequest<AuthResponseDTO>("/auth/login", {
        method: "POST",
        body: payload,
    });
    return mapAuthUser(dto);
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
    const dto = await apiRequest<AuthResponseDTO>("/auth/register", {
        method: "POST",
        body: payload,
    });
    return mapAuthUser(dto);
}

export async function getProfile(token: string): Promise<AuthUser> {
    const dto = await apiRequest<UserProfileDTO>("/auth/me", { token });
    return {
        id: dto.id,
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone,
        role: dto.role,
        token,
    };
}

export async function getMyProfile(token: string): Promise<UserProfile> {
    const dto = await apiRequest<UserProfileDTO>("/auth/me", { token });
    return {
        id: dto.id,
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl,
        role: dto.role,
    };
}

export async function getMyAddresses(token: string): Promise<ShippingAddress[]> {
    const list = await apiRequest<ShippingAddressDTO[]>("/addresses", { token });
    return (list || []).map((address) => ({
        id: address.id,
        fullName: address.fullName,
        phone: address.phone,
        email: address.email,
        province: address.province,
        district: address.district,
        address: address.address,
        isDefault: address.isDefault,
    }));
}

export async function getMyOrders(token: string, status?: string): Promise<OrderListItem[]> {
    const query = new URLSearchParams();
    query.set("page", "0");
    query.set("size", "50");
    if (status) query.set("status", status);

    const page = await apiRequest<PageResponse<OrderListDTO>>(`/orders?${query.toString()}`, { token });
    return (page.content || []).map((order) => ({
        id: order.id,
        orderCode: order.orderCode,
        total: order.total,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        itemCount: order.itemCount,
        createdAt: order.createdAt,
    }));
}

export async function getOrderByCode(orderCode: string, token: string): Promise<OrderDetail> {
    const dto = await apiRequest<OrderDetailDTO>(`/orders/${orderCode}`, { token });
    return {
        id: dto.id,
        orderCode: dto.orderCode,
        subtotal: dto.subtotal,
        shippingFee: dto.shippingFee,
        total: dto.total,
        paymentMethod: dto.paymentMethod,
        paymentStatus: dto.paymentStatus,
        orderStatus: dto.orderStatus,
        note: dto.note,
        createdAt: dto.createdAt,
        items: (dto.items || []).map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            price: item.price,
            originalPrice: item.originalPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
        })),
        shippingAddress: {
            id: dto.shippingAddress.id,
            fullName: dto.shippingAddress.fullName,
            phone: dto.shippingAddress.phone,
            email: dto.shippingAddress.email,
            province: dto.shippingAddress.province,
            district: dto.shippingAddress.district,
            address: dto.shippingAddress.address,
            isDefault: dto.shippingAddress.isDefault,
        },
    };
}

export async function createOrder(payload: OrderCreatePayload, token: string): Promise<OrderCreateResult> {
    const dto = await apiRequest<OrderResponseDTO>("/orders", {
        method: "POST",
        body: payload,
        token,
    });

    return {
        id: dto.id,
        orderCode: dto.orderCode,
        total: dto.total,
    };
}

export async function getAdminDashboard(token: string): Promise<AdminDashboard> {
    const dto = await apiRequest<AdminDashboardDTO>("/admin/dashboard", { token });
    return {
        totalUsers: dto.totalUsers,
        activeUsers: dto.activeUsers,
        totalProducts: dto.totalProducts,
        lowStockProducts: dto.lowStockProducts,
        totalOrders: dto.totalOrders,
        pendingOrders: dto.pendingOrders,
        totalRevenue: dto.totalRevenue,
        recentOrders: (dto.recentOrders || []).map(mapAdminOrder),
    };
}

export async function getAdminProducts(token: string, params?: {
    search?: string;
    page?: number;
    size?: number;
}): Promise<PagedResult<AdminProduct>> {
    const requestedPage = params?.page ?? 0;
    const requestedSize = params?.size ?? 20;
    const query = new URLSearchParams();
    query.set("page", String(requestedPage));
    query.set("size", String(requestedSize));
    if (params?.search) query.set("search", params.search);

    const rawPage = await apiRequest<RawPageResponse<AdminProductDTO>>(`/admin/products?${query.toString()}`, { token });
    const page = normalizePageResponse(rawPage, requestedPage, requestedSize);
    return {
        ...page,
        content: (page.content || []).map(mapAdminProduct),
    };
}

export async function getAdminProductById(id: number, token: string): Promise<AdminProduct> {
    const dto = await apiRequest<AdminProductDTO>(`/admin/products/${id}`, { token });
    return mapAdminProduct(dto);
}

export async function createAdminProduct(payload: AdminUpsertProductPayload, token: string): Promise<AdminProduct> {
    const dto = await apiRequest<AdminProductDTO>("/admin/products", {
        method: "POST",
        body: payload,
        token,
    });
    return mapAdminProduct(dto);
}

export async function updateAdminProduct(id: number, payload: AdminUpsertProductPayload, token: string): Promise<AdminProduct> {
    const dto = await apiRequest<AdminProductDTO>(`/admin/products/${id}`, {
        method: "PUT",
        body: payload,
        token,
    });
    return mapAdminProduct(dto);
}

export async function setAdminProductActive(id: number, active: boolean, token: string): Promise<AdminProduct> {
    const dto = await apiRequest<AdminProductDTO>(`/admin/products/${id}/active`, {
        method: "PATCH",
        body: { active },
        token,
    });
    return mapAdminProduct(dto);
}

export async function deleteAdminProduct(id: number, token: string): Promise<void> {
    await apiRequest<void>(`/admin/products/${id}`, {
        method: "DELETE",
        token,
    });
}

export async function getAdminOrders(token: string, params?: {
    search?: string;
    status?: string;
    page?: number;
    size?: number;
}): Promise<PagedResult<AdminOrder>> {
    const requestedPage = params?.page ?? 0;
    const requestedSize = params?.size ?? 20;
    const query = new URLSearchParams();
    query.set("page", String(requestedPage));
    query.set("size", String(requestedSize));
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);

    const rawPage = await apiRequest<RawPageResponse<AdminOrderDTO>>(`/admin/orders?${query.toString()}`, { token });
    const page = normalizePageResponse(rawPage, requestedPage, requestedSize);
    return {
        ...page,
        content: (page.content || []).map(mapAdminOrder),
    };
}

export async function getAdminOrderByCode(orderCode: string, token: string): Promise<OrderDetail> {
    const dto = await apiRequest<OrderDetailDTO>(`/admin/orders/${orderCode}`, { token });
    return {
        id: dto.id,
        orderCode: dto.orderCode,
        subtotal: dto.subtotal,
        shippingFee: dto.shippingFee,
        total: dto.total,
        paymentMethod: dto.paymentMethod,
        paymentStatus: dto.paymentStatus,
        orderStatus: dto.orderStatus,
        note: dto.note,
        createdAt: dto.createdAt,
        items: (dto.items || []).map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            price: item.price,
            originalPrice: item.originalPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
        })),
        shippingAddress: {
            id: dto.shippingAddress.id,
            fullName: dto.shippingAddress.fullName,
            phone: dto.shippingAddress.phone,
            email: dto.shippingAddress.email,
            province: dto.shippingAddress.province,
            district: dto.shippingAddress.district,
            address: dto.shippingAddress.address,
            isDefault: dto.shippingAddress.isDefault,
        },
    };
}

export async function updateAdminOrder(
    orderCode: string,
    payload: { orderStatus?: string; paymentStatus?: string },
    token: string
): Promise<AdminOrder> {
    const dto = await apiRequest<AdminOrderDTO>(`/admin/orders/${orderCode}`, {
        method: "PATCH",
        body: payload,
        token,
    });
    return mapAdminOrder(dto);
}

export async function getAdminUsers(token: string, params?: {
    search?: string;
    role?: "CUSTOMER" | "ADMIN";
    isActive?: boolean;
    page?: number;
    size?: number;
}): Promise<PagedResult<AdminUser>> {
    const requestedPage = params?.page ?? 0;
    const requestedSize = params?.size ?? 20;
    const query = new URLSearchParams();
    query.set("page", String(requestedPage));
    query.set("size", String(requestedSize));
    if (params?.search) query.set("search", params.search);
    if (params?.role) query.set("role", params.role);
    if (params?.isActive !== undefined) query.set("isActive", String(params.isActive));

    const rawPage = await apiRequest<RawPageResponse<AdminUserDTO>>(`/admin/users?${query.toString()}`, { token });
    const page = normalizePageResponse(rawPage, requestedPage, requestedSize);
    return {
        ...page,
        content: (page.content || []).map(mapAdminUser),
    };
}

function normalizePageResponse<T>(
    payload: RawPageResponse<T> | null | undefined,
    fallbackPage: number,
    fallbackSize: number
): PageResponse<T> {
    const content = payload?.content || [];
    const pageMeta = payload?.page;

    const size = payload?.size ?? pageMeta?.size ?? fallbackSize;
    const number = payload?.number ?? pageMeta?.number ?? fallbackPage;
    const totalElements = payload?.totalElements ?? pageMeta?.totalElements ?? content.length;
    const totalPages = payload?.totalPages ?? pageMeta?.totalPages ?? Math.max(1, Math.ceil(totalElements / Math.max(size, 1)));

    return {
        content,
        size,
        number,
        totalElements,
        totalPages,
    };
}

export async function getAdminUserById(id: number, token: string): Promise<AdminUser> {
    const dto = await apiRequest<AdminUserDTO>(`/admin/users/${id}`, { token });
    return mapAdminUser(dto);
}

export async function updateAdminUser(
    id: number,
    payload: { fullName?: string; phone?: string; role?: "CUSTOMER" | "ADMIN"; isActive?: boolean },
    token: string
): Promise<AdminUser> {
    const dto = await apiRequest<AdminUserDTO>(`/admin/users/${id}`, {
        method: "PATCH",
        body: payload,
        token,
    });
    return mapAdminUser(dto);
}

export async function deleteAdminUser(id: number, token: string): Promise<void> {
    await apiRequest<void>(`/admin/users/${id}`, {
        method: "DELETE",
        token,
    });
}

function mapProductList(dto: ProductListDTO): Product {
    const safeSpecs = dto.specs || {
        cpu: "N/A",
        ram: "N/A",
        storage: "N/A",
        display: "N/A",
    };

    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        brand: dto.brand,
        category: dto.category,
        price: dto.price,
        originalPrice: dto.originalPrice,
        image: dto.image,
        rating: Number(dto.rating || 0),
        reviewCount: dto.reviewCount || 0,
        soldCount: dto.soldCount || 0,
        badge: dto.badge,
        specs: safeSpecs,
    };
}

function mapProductDetail(dto: ProductDetailDTO): Product {
    const safeSpecs = dto.specs || {
        cpu: "N/A",
        ram: "N/A",
        storage: "N/A",
        display: "N/A",
    };

    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        brand: typeof dto.brand === "string" ? dto.brand : dto.brand?.name || "",
        category: typeof dto.category === "string" ? dto.category : dto.category?.name || "",
        price: dto.price,
        originalPrice: dto.originalPrice,
        image: dto.image,
        gallery: dto.gallery || [],
        rating: Number(dto.rating || 0),
        reviewCount: dto.reviewCount || 0,
        soldCount: dto.soldCount || 0,
        badge: dto.badge,
        specs: safeSpecs,
        detailedSpecs: dto.detailedSpecs || [],
        description: dto.description,
        gifts: dto.gifts || [],
        stockQuantity: dto.stockQuantity,
        isFlashSale: dto.isFlashSale,
    };
}

function mapAuthUser(dto: AuthResponseDTO): AuthUser {
    return {
        id: dto.id,
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone,
        role: dto.role,
        token: dto.token,
    };
}

function getAvatarText(userName?: string, avatarUrl?: string): string {
    if (avatarUrl && avatarUrl.trim()) {
        return avatarUrl;
    }
    if (!userName) return "U";
    const words = userName.trim().split(/\s+/);
    if (words.length === 1) return words[0][0]?.toUpperCase() || "U";
    return `${words[0][0] || ""}${words[words.length - 1][0] || ""}`.toUpperCase();
}

export async function createMyAddress(payload: Omit<ShippingAddress, "id">, token: string): Promise<ShippingAddress> {
    const dto = await apiRequest<ShippingAddressDTO>("/addresses", {
        method: "POST",
        body: payload,
        token,
    });

    return {
        id: dto.id,
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        province: dto.province,
        district: dto.district,
        address: dto.address,
        isDefault: dto.isDefault,
    };
}

export async function updateMyProfile(payload: UpdateProfilePayload, token: string): Promise<UserProfile> {
    const dto = await apiRequest<UserProfileDTO>("/auth/me", {
        method: "PUT",
        body: payload,
        token,
    });

    return {
        id: dto.id,
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl,
        role: dto.role,
    };
}

export async function updateMyAddress(id: number, payload: Omit<ShippingAddress, "id">, token: string): Promise<ShippingAddress> {
    const dto = await apiRequest<ShippingAddressDTO>(`/addresses/${id}`, {
        method: "PUT",
        body: payload,
        token,
    });

    return {
        id: dto.id,
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        province: dto.province,
        district: dto.district,
        address: dto.address,
        isDefault: dto.isDefault,
    };
}

export async function deleteMyAddress(id: number, token: string): Promise<void> {
    await apiRequest<void>(`/addresses/${id}`, {
        method: "DELETE",
        token,
    });
}

export async function cancelOrder(orderCode: string, token: string): Promise<OrderDetail> {
    const dto = await apiRequest<OrderDetailDTO>(`/orders/${orderCode}/cancel`, {
        method: "PATCH",
        token,
    });

    return {
        id: dto.id,
        orderCode: dto.orderCode,
        subtotal: dto.subtotal,
        shippingFee: dto.shippingFee,
        total: dto.total,
        paymentMethod: dto.paymentMethod,
        paymentStatus: dto.paymentStatus,
        orderStatus: dto.orderStatus,
        note: dto.note,
        createdAt: dto.createdAt,
        items: (dto.items || []).map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            price: item.price,
            originalPrice: item.originalPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
        })),
        shippingAddress: {
            id: dto.shippingAddress.id,
            fullName: dto.shippingAddress.fullName,
            phone: dto.shippingAddress.phone,
            email: dto.shippingAddress.email,
            province: dto.shippingAddress.province,
            district: dto.shippingAddress.district,
            address: dto.shippingAddress.address,
            isDefault: dto.shippingAddress.isDefault,
        },
    };
}

function mapAdminOrder(dto: AdminOrderDTO): AdminOrder {
    return {
        id: dto.id,
        orderCode: dto.orderCode,
        total: dto.total,
        orderStatus: dto.orderStatus,
        paymentStatus: dto.paymentStatus,
        paymentMethod: dto.paymentMethod,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        itemCount: dto.itemCount,
        createdAt: dto.createdAt,
    };
}

function mapAdminProduct(dto: AdminProductDTO): AdminProduct {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        brandId: dto.brandId,
        brandName: dto.brandName,
        categoryId: dto.categoryId,
        categoryName: dto.categoryName,
        price: dto.price,
        originalPrice: dto.originalPrice,
        image: dto.image,
        badge: dto.badge,
        specs: dto.specs,
        description: dto.description,
        stockQuantity: dto.stockQuantity,
        soldCount: dto.soldCount,
        reviewCount: dto.reviewCount,
        isActive: dto.isActive,
        createdAt: dto.createdAt,
    };
}

function mapAdminUser(dto: AdminUserDTO): AdminUser {
    return {
        id: dto.id,
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone,
        role: dto.role,
        isActive: dto.isActive,
        createdAt: dto.createdAt,
    };
}