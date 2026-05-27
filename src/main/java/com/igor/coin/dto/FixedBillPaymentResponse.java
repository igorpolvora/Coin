package com.igor.coin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FixedBillPaymentResponse {
    private Long id;
    private Long fixedBillId;
    private Integer month;
    private Integer year;
    private Boolean paid;
    private LocalDateTime paidAt;
    private BigDecimal amount;
}
