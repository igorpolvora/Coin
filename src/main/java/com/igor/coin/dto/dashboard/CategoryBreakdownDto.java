package com.igor.coin.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryBreakdownDto {
    private String categoryName;
    private String categoryColor;
    private BigDecimal total;
}
