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
public class TransactionRequest {
    private Long categoryId;
    private Long accountId;
    private Long cardId;
    private String description;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDate date;
    private String note;
    private Boolean isRecurring;
}
