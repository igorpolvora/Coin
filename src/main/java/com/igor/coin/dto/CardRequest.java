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
public class CardRequest {
    private String name;
    private String lastFour;
    private BigDecimal creditLimit;
    private Integer dueDay;
    private Integer closingDay;
    private String color;
    private Boolean isActive;
}
