package com.igor.coin.service;

import com.igor.coin.dto.AccountRequest;
import com.igor.coin.dto.AccountResponse;
import com.igor.coin.entity.Account;
import com.igor.coin.entity.User;
import com.igor.coin.exception.ResourceNotFoundException;
import com.igor.coin.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public List<AccountResponse> getAll(User user) {
        return accountRepository.findAllByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AccountResponse getById(Long id, User user) {
        Account account = getAccountByIdAndUser(id, user);
        return mapToResponse(account);
    }

    @Transactional
    public AccountResponse create(AccountRequest request, User user) {
        Account account = Account.builder()
                .user(user)
                .name(request.getName())
                .type(request.getType())
                .balance(request.getBalance() != null ? request.getBalance() : BigDecimal.ZERO)
                .color(request.getColor())
                .isVault(request.getIsVault() != null ? request.getIsVault() : false)
                .build();
        return mapToResponse(accountRepository.save(account));
    }

    @Transactional
    public AccountResponse update(Long id, AccountRequest request, User user) {
        Account account = getAccountByIdAndUser(id, user);
        account.setName(request.getName());
        account.setType(request.getType());
        if (request.getBalance() != null) account.setBalance(request.getBalance());
        account.setColor(request.getColor());
        if (request.getIsVault() != null) account.setIsVault(request.getIsVault());
        return mapToResponse(accountRepository.save(account));
    }

    @Transactional
    public void delete(Long id, User user) {
        Account account = getAccountByIdAndUser(id, user);
        accountRepository.delete(account);
    }

    public Account getAccountByIdAndUser(Long id, User user) {
        return accountRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + id));
    }

    public AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .name(account.getName())
                .type(account.getType())
                .balance(account.getBalance())
                .color(account.getColor())
                .isVault(account.getIsVault())
                .build();
    }
}
