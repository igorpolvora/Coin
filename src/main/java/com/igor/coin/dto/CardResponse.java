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
public class CardResponse {
    private Long id;
    private String name;
    private String lastFour;
    private BigDecimal creditLimit;
    private BigDecimal currentBill;
    private Integer dueDay;
    private Integer closingDay;
    private String color;
    private Boolean isActive;
}
