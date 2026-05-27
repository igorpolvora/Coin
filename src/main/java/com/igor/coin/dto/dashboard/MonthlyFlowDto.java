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
public class MonthlyFlowDto {
    private Integer month;
    private Integer year;
    private BigDecimal income;
    private BigDecimal expense;
}
