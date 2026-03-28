package com.laptopshop.dto.admin;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDTO {

    private long totalUsers;
    private long activeUsers;
    private long totalProducts;
    private long lowStockProducts;
    private long totalOrders;
    private long pendingOrders;
    private long totalRevenue;
    private List<AdminOrderDTO> recentOrders;
}
