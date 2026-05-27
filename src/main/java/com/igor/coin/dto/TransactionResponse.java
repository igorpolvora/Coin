package com.igor.coin.dto;

import com.igor.coin.entity.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    private Long id;
    private CategoryResponse category;
    private AccountResponse account;
    private CardResponse card;
    private String description;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDate date;
    private String note;
    private Boolean isRecurring;
}
