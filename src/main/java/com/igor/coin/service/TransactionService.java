package com.igor.coin.service;

import com.igor.coin.dto.TransactionRequest;
import com.igor.coin.dto.TransactionResponse;
import com.igor.coin.entity.*;
import com.igor.coin.entity.enums.TransactionType;
import com.igor.coin.exception.BusinessException;
import com.igor.coin.exception.ResourceNotFoundException;
import com.igor.coin.repository.AccountRepository;
import com.igor.coin.repository.CardRepository;
import com.igor.coin.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;
    private final AccountService accountService;
    private final CardService cardService;
    private final AccountRepository accountRepository;
    private final CardRepository cardRepository;

    public List<TransactionResponse> getAll(User user) {
        return transactionRepository.findAllByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<TransactionResponse> getFiltered(User user, Integer month, Integer year, TransactionType type, Long categoryId, Long cardId, Pageable pageable) {
        return transactionRepository.findFilteredTransactions(user.getId(), month, year, type, categoryId, cardId, pageable)
                .map(this::mapToResponse);
    }

    public TransactionResponse getById(Long id, User user) {
        Transaction transaction = getTransactionByIdAndUser(id, user);
        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse create(TransactionRequest request, User user) {
        Category category = categoryService.getCategoryByIdAndUser(request.getCategoryId(), user);
        
        Account account = null;
        if (request.getAccountId() != null) {
            account = accountService.getAccountByIdAndUser(request.getAccountId(), user);
        }
        
        Card card = null;
        if (request.getCardId() != null) {
            card = cardService.getCardByIdAndUser(request.getCardId(), user);
        }

        if (account == null && card == null) {
            throw new BusinessException("A transaction must be associated with an account or a card.");
        }
        
        if (request.getType() == TransactionType.TRANSFER) {
            // Complex logic for transfer can be added here. Assuming simple for now or throw unsupported.
        }

        Transaction transaction = Transaction.builder()
                .user(user)
                .category(category)
                .account(account)
                .card(card)
                .description(request.getDescription())
                .amount(request.getAmount())
                .type(request.getType())
                .date(request.getDate())
                .note(request.getNote())
                .isRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false)
                .build();

        // Business rules: Update Account Balance or Card Bill
        if (request.getType() == TransactionType.EXPENSE) {
            if (card != null) {
                card.setCurrentBill(card.getCurrentBill().add(request.getAmount()));
                cardRepository.save(card);
            } else if (account != null) {
                account.setBalance(account.getBalance().subtract(request.getAmount()));
                accountRepository.save(account);
            }
        } else if (request.getType() == TransactionType.INCOME) {
            if (account != null) {
                account.setBalance(account.getBalance().add(request.getAmount()));
                accountRepository.save(account);
            } else {
                throw new BusinessException("Income transactions cannot be applied to credit cards.");
            }
        }

        return mapToResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public void delete(Long id, User user) {
        Transaction transaction = getTransactionByIdAndUser(id, user);
        
        // Reverse business rules
        if (transaction.getType() == TransactionType.EXPENSE) {
            if (transaction.getCard() != null) {
                Card card = transaction.getCard();
                card.setCurrentBill(card.getCurrentBill().subtract(transaction.getAmount()));
                cardRepository.save(card);
            } else if (transaction.getAccount() != null) {
                Account account = transaction.getAccount();
                account.setBalance(account.getBalance().add(transaction.getAmount()));
                accountRepository.save(account);
            }
        } else if (transaction.getType() == TransactionType.INCOME) {
            if (transaction.getAccount() != null) {
                Account account = transaction.getAccount();
                account.setBalance(account.getBalance().subtract(transaction.getAmount()));
                accountRepository.save(account);
            }
        }
        
        transactionRepository.delete(transaction);
    }

    public Transaction getTransactionByIdAndUser(Long id, User user) {
        return transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id " + id));
    }

    public TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .category(categoryService.mapToResponse(transaction.getCategory()))
                .account(transaction.getAccount() != null ? accountService.mapToResponse(transaction.getAccount()) : null)
                .card(transaction.getCard() != null ? cardService.mapToResponse(transaction.getCard()) : null)
                .description(transaction.getDescription())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .date(transaction.getDate())
                .note(transaction.getNote())
                .isRecurring(transaction.getIsRecurring())
                .build();
    }
}
