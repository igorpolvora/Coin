package com.igor.coin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BudgetRequest {
    private Long categoryId;
    private BigDecimal amountLimit;
    private Integer month;
    private Integer year;
}
