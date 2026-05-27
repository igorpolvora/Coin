package com.igor.coin.service;

import com.igor.coin.dto.TransactionResponse;
import com.igor.coin.dto.dashboard.CategoryBreakdownDto;
import com.igor.coin.dto.dashboard.DashboardSummaryResponse;
import com.igor.coin.dto.dashboard.MonthlyFlowDto;
import com.igor.coin.entity.User;
import com.igor.coin.entity.enums.TransactionType;
import com.igor.coin.repository.AccountRepository;
import com.igor.coin.repository.SavingsGoalRepository;
import com.igor.coin.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AccountRepository accountRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    public DashboardSummaryResponse getSummary(User user) {
        Long userId = user.getId();
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        // 1. Total Balance
        BigDecimal totalBalance = accountRepository.sumBalanceByUserId(userId)
                .orElse(BigDecimal.ZERO);

        // 2. Vault Total
        BigDecimal vaultTotal = savingsGoalRepository.sumCurrentAmountByUserId(userId)
                .orElse(BigDecimal.ZERO);

        // 3. Month Income & Expense
        BigDecimal monthIncome = transactionRepository.sumAmountByUserIdAndTypeAndMonthYear(
                userId, TransactionType.INCOME, currentMonth, currentYear).orElse(BigDecimal.ZERO);
                
        BigDecimal monthExpense = transactionRepository.sumAmountByUserIdAndTypeAndMonthYear(
                userId, TransactionType.EXPENSE, currentMonth, currentYear).orElse(BigDecimal.ZERO);

        // 4. Monthly Flow (Last 6 months)
        LocalDate startDate = now.minusMonths(5).withDayOfMonth(1);
        List<Object[]> flowData = transactionRepository.getMonthlyFlowByTypeSince(userId, startDate);
        List<MonthlyFlowDto> monthlyFlow = buildMonthlyFlow(flowData, now);

        // 5. Category Breakdown (Current month)
        List<Object[]> categoryData = transactionRepository.getCategoryBreakdown(userId, currentMonth, currentYear);
        List<CategoryBreakdownDto> categoryBreakdown = categoryData.stream()
                .map(obj -> CategoryBreakdownDto.builder()
                        .categoryName((String) obj[0])
                        .categoryColor((String) obj[1])
                        .total((BigDecimal) obj[2])
                        .build())
                .collect(Collectors.toList());

        // 6. Recent Transactions
        List<TransactionResponse> recentTransactions = transactionRepository.findTop5ByUserIdOrderByDateDesc(userId).stream()
                .map(transactionService::mapToResponse)
                .collect(Collectors.toList());

        return DashboardSummaryResponse.builder()
                .totalBalance(totalBalance)
                .vaultTotal(vaultTotal)
                .monthIncome(monthIncome)
                .monthExpense(monthExpense)
                .monthlyFlow(monthlyFlow)
                .categoryBreakdown(categoryBreakdown)
                .recentTransactions(recentTransactions)
                .build();
    }

    private List<MonthlyFlowDto> buildMonthlyFlow(List<Object[]> flowData, LocalDate now) {
        Map<String, MonthlyFlowDto> map = new HashMap<>();
        
        // Initialize last 6 months
        for (int i = 5; i >= 0; i--) {
            LocalDate date = now.minusMonths(i);
            int m = date.getMonthValue();
            int y = date.getYear();
            String key = y + "-" + m;
            map.put(key, new MonthlyFlowDto(m, y, BigDecimal.ZERO, BigDecimal.ZERO));
        }

        // Populate with data
        for (Object[] row : flowData) {
            Integer month = (Integer) row[0];
            Integer year = (Integer) row[1];
            TransactionType type = (TransactionType) row[2];
            BigDecimal amount = (BigDecimal) row[3];
            
            String key = year + "-" + month;
            MonthlyFlowDto dto = map.get(key);
            if (dto != null) {
                if (type == TransactionType.INCOME) {
                    dto.setIncome(dto.getIncome().add(amount));
                } else if (type == TransactionType.EXPENSE) {
                    dto.setExpense(dto.getExpense().add(amount));
                }
            }
        }

        // Sort by year and month
        List<MonthlyFlowDto> result = new ArrayList<>(map.values());
        result.sort((a, b) -> {
            if (!a.getYear().equals(b.getYear())) {
                return a.getYear().compareTo(b.getYear());
            }
            return a.getMonth().compareTo(b.getMonth());
        });
        
        return result;
    }
}
