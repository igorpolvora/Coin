package com.igor.coin.service;

import com.igor.coin.dto.BudgetRequest;
import com.igor.coin.dto.BudgetResponse;
import com.igor.coin.entity.Budget;
import com.igor.coin.entity.Category;
import com.igor.coin.entity.User;
import com.igor.coin.exception.BusinessException;
import com.igor.coin.exception.ResourceNotFoundException;
import com.igor.coin.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryService categoryService;

    public List<BudgetResponse> getAll(User user) {
        return budgetRepository.findAllByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BudgetResponse getById(Long id, User user) {
        Budget budget = getBudgetByIdAndUser(id, user);
        return mapToResponse(budget);
    }

    @Transactional
    public BudgetResponse create(BudgetRequest request, User user) {
        if (budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(user.getId(), request.getCategoryId(), request.getMonth(), request.getYear())) {
            throw new BusinessException("A budget already exists for this category, month, and year.");
        }

        Category category = categoryService.getCategoryByIdAndUser(request.getCategoryId(), user);

        Budget budget = Budget.builder()
                .user(user)
                .category(category)
                .amountLimit(request.getAmountLimit())
                .month(request.getMonth())
                .year(request.getYear())
                .build();
                
        return mapToResponse(budgetRepository.save(budget));
    }

    @Transactional
    public BudgetResponse update(Long id, BudgetRequest request, User user) {
        Budget budget = getBudgetByIdAndUser(id, user);
        
        if (!budget.getCategory().getId().equals(request.getCategoryId()) ||
            !budget.getMonth().equals(request.getMonth()) ||
            !budget.getYear().equals(request.getYear())) {
            
            if (budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(user.getId(), request.getCategoryId(), request.getMonth(), request.getYear())) {
                throw new BusinessException("A budget already exists for this category, month, and year.");
            }
            Category category = categoryService.getCategoryByIdAndUser(request.getCategoryId(), user);
            budget.setCategory(category);
            budget.setMonth(request.getMonth());
            budget.setYear(request.getYear());
        }
        
        budget.setAmountLimit(request.getAmountLimit());
        return mapToResponse(budgetRepository.save(budget));
    }

    @Transactional
    public void delete(Long id, User user) {
        Budget budget = getBudgetByIdAndUser(id, user);
        budgetRepository.delete(budget);
    }

    public Budget getBudgetByIdAndUser(Long id, User user) {
        return budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id " + id));
    }

    private BudgetResponse mapToResponse(Budget budget) {
        return BudgetResponse.builder()
                .id(budget.getId())
                .category(categoryService.mapToResponse(budget.getCategory()))
                .amountLimit(budget.getAmountLimit())
                .month(budget.getMonth())
                .year(budget.getYear())
                .build();
    }
}
