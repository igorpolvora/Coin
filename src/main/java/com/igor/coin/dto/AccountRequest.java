package com.igor.coin.dto;

import com.igor.coin.entity.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountRequest {
    private String name;
    private AccountType type;
    private BigDecimal balance;
    private String color;
    private Boolean isVault;
}
