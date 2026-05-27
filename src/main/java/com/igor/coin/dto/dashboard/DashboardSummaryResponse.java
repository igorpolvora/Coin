package com.igor.coin.dto.dashboard;

import com.igor.coin.dto.TransactionResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryResponse {
    private BigDecimal totalBalance;
    private BigDecimal vaultTotal;
    private BigDecimal monthIncome;
    private BigDecimal monthExpense;
    private List<MonthlyFlowDto> monthlyFlow;
    private List<CategoryBreakdownDto> categoryBreakdown;
    private List<TransactionResponse> recentTransactions;
}
