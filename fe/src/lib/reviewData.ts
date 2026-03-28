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

export const reviewsByProductId: Record<number, ProductReview[]> = {
    1: [
        {
            id: 1,
            author: "Nguyễn Mạnh Hùng",
            avatar: "NH",
            rating: 5,
            date: "2026-02-28",
            title: "Máy gaming quá đỉnh, đáng đồng tiền!",
            content:
                "Sau 1 tháng sử dụng, mình thực sự hài lòng với ROG Strix G16. Chạy Cyberpunk 2077 max settings ở 1440p vẫn đạt trên 100fps. Tản nhiệt tốt, nhiệt độ CPU dưới tải hầu như không vượt quá 90°C. Bàn phím RGB đẹp, gõ rất êm. Sẽ giới thiệu cho bạn bè.",
            helpful: 42,
            verified: true,
        },
        {
            id: 2,
            author: "Trần Thị Thu Hà",
            avatar: "TH",
            rating: 4,
            date: "2026-02-20",
            title: "Gaming mạnh, nhưng nặng và ồn khi full load",
            content:
                "Hiệu năng gaming cực kỳ mạnh, không có tựa game nào chạy không mượt. Nhưng khi chạy full load thì quạt khá ồn và máy nặng 2.5kg nên không phù hợp mang đi nhiều. Nếu dùng cố định ở bàn thì tuyệt vời. LaptopVerse giao hàng nhanh, đóng gói kỹ.",
            helpful: 28,
            verified: true,
        },
        {
            id: 3,
            author: "Lê Quốc Bảo",
            avatar: "LB",
            rating: 5,
            date: "2026-02-15",
            title: "Xứng đáng là vua gaming 2024",
            content:
                "RTX 4080 Laptop ở đây thực sự không phải đùa. Ray tracing bật lên vẫn mượt mà, màn hình 240Hz nhìn mắt sướng vô cùng. Pin dùng được khoảng 3-4 tiếng khi không chơi game. Cần adapter 240W khá to nhưng đổi lại hiệu năng không kém bản desktop.",
            helpful: 35,
            verified: true,
        },
        {
            id: 4,
            author: "Phạm Duy Khánh",
            avatar: "PK",
            rating: 5,
            date: "2026-02-10",
            title: "Dịch vụ LaptopVerse 5 sao",
            content:
                "Mua lần đầu tại LaptopVerse, nhân viên tư vấn nhiệt tình, máy giao đúng hẹn và được kiểm tra kỹ trước khi bàn giao. Máy chạy cực mượt, setup ban đầu cũng được hỗ trợ tận tình. Sẽ quay lại mua thêm phụ kiện.",
            helpful: 19,
            verified: true,
        },
        {
            id: 5,
            author: "Vũ Minh Tuấn",
            avatar: "VT",
            rating: 4,
            date: "2026-01-30",
            title: "Màn hình QHD+ 240Hz quá đỉnh",
            content:
                "Được cái màn hình là điểm sáng nhất — QHD+ 240Hz smooth cực kỳ, màu sắc chuẩn 100% DCI-P3 nên vừa chơi game vừa edit ảnh được. i9-14900HX xử lý render cũng nhanh không kém gì desktop. Trừ 1 sao vì pin hơi yếu.",
            helpful: 24,
            verified: false,
        },
    ],
    2: [
        {
            id: 6,
            author: "Đặng Thị Lan Anh",
            avatar: "LA",
            rating: 5,
            date: "2026-02-25",
            title: "MacBook Pro M3 Max — Không có đối thủ",
            content:
                "Upgrade từ M1 Pro lên M3 Max, sự khác biệt rõ rệt. Export video 4K RAW bây giờ nhanh gấp đôi. Màn hình XDR 1000 nits nhìn ngoài trời ban ngày vẫn rõ. Pin dùng cả ngày làm việc (8-9 tiếng edit video) không cần sạc. Đây là laptop tốt nhất mình từng dùng.",
            helpful: 67,
            verified: true,
        },
        {
            id: 7,
            author: "Hoàng Văn Nam",
            avatar: "HN",
            rating: 5,
            date: "2026-02-18",
            title: "Xứng đáng với mức giá",
            content:
                "Đắt nhưng xứng đáng. M3 Max 40 GPU core render 3D trong Blender nhanh kinh khủng. 48GB Unified Memory handle được project phức tạp không bị swap. Màn hình ProMotion 120Hz mượt đến mức không thể quay lại dùng màn 60Hz nữa.",
            helpful: 53,
            verified: true,
        },
        {
            id: 8,
            author: "Ngô Thị Phương",
            avatar: "NP",
            rating: 4,
            date: "2026-02-05",
            title: "Tuyệt vời nhưng giá cao",
            content:
                "Hiệu năng và màn hình không có gì để chê. Nhưng giá gần 90 triệu là một khoản đầu tư lớn. Nếu bạn làm creative professional thì xứng đáng, còn dùng thông thường thì MacBook Air M3 là đủ. LaptopVerse hỗ trợ trả góp 0% lãi suất nên đỡ đau.",
            helpful: 31,
            verified: true,
        },
    ],
    3: [
        {
            id: 9,
            author: "Bùi Thanh Long",
            avatar: "BL",
            rating: 5,
            date: "2026-02-22",
            title: "Đỉnh của đỉnh — MSI Titan 18",
            content:
                "RTX 4090 + i9-14900HX + 64GB RAM = Không có game nào chạy không được. Màn hình Mini LED 18 inch UHD+ đẹp hơn cả nhiều TV của nhà mình. Chơi game như ở rạp chiếu phim thu nhỏ. Nặng nhưng ở nhà thì không thành vấn đề.",
            helpful: 44,
            verified: true,
        },
        {
            id: 10,
            author: "Đinh Quang Minh",
            avatar: "DM",
            rating: 4,
            date: "2026-02-10",
            title: "Monster machine, nhưng cần ổ điện riêng",
            content:
                "Adapter 330W to như viên gạch nhưng đó là cái giá phải trả cho RTX 4090 trong laptop. Hiệu năng tuyệt đối, không có gì là không làm được. Khuyến cáo mua thêm UPS để bảo vệ máy khi nguồn điện không ổn định.",
            helpful: 29,
            verified: true,
        },
    ],
};

// Generate default empty reviews for products without reviews
export function getProductReviews(productId: number): ProductReview[] {
    return reviewsByProductId[productId] ?? [];
}
