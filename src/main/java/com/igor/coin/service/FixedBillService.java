package com.igor.coin.service;

import com.igor.coin.dto.FixedBillRequest;
import com.igor.coin.dto.FixedBillResponse;
import com.igor.coin.entity.Category;
import com.igor.coin.entity.FixedBill;
import com.igor.coin.entity.User;
import com.igor.coin.exception.ResourceNotFoundException;
import com.igor.coin.repository.FixedBillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FixedBillService {

    private final FixedBillRepository fixedBillRepository;
    private final CategoryService categoryService;

    public List<FixedBillResponse> getAll(User user) {
        return fixedBillRepository.findAllByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FixedBillResponse getById(Long id, User user) {
        FixedBill bill = getFixedBillByIdAndUser(id, user);
        return mapToResponse(bill);
    }

    @Transactional
    public FixedBillResponse create(FixedBillRequest request, User user) {
        Category category = categoryService.getCategoryByIdAndUser(request.getCategoryId(), user);

        FixedBill bill = FixedBill.builder()
                .user(user)
                .category(category)
                .description(request.getDescription())
                .amount(request.getAmount())
                .dueDay(request.getDueDay())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .autoPay(request.getAutoPay() != null ? request.getAutoPay() : false)
                .build();
                
        return mapToResponse(fixedBillRepository.save(bill));
    }

    @Transactional
    public FixedBillResponse update(Long id, FixedBillRequest request, User user) {
        FixedBill bill = getFixedBillByIdAndUser(id, user);
        
        if (!bill.getCategory().getId().equals(request.getCategoryId())) {
            Category category = categoryService.getCategoryByIdAndUser(request.getCategoryId(), user);
            bill.setCategory(category);
        }
        
        bill.setDescription(request.getDescription());
        bill.setAmount(request.getAmount());
        bill.setDueDay(request.getDueDay());
        if (request.getIsActive() != null) bill.setIsActive(request.getIsActive());
        if (request.getAutoPay() != null) bill.setAutoPay(request.getAutoPay());
        
        return mapToResponse(fixedBillRepository.save(bill));
    }

    @Transactional
    public void delete(Long id, User user) {
        FixedBill bill = getFixedBillByIdAndUser(id, user);
        fixedBillRepository.delete(bill);
    }

    public FixedBill getFixedBillByIdAndUser(Long id, User user) {
        return fixedBillRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("FixedBill not found with id " + id));
    }

    public FixedBillResponse mapToResponse(FixedBill bill) {
        return FixedBillResponse.builder()
                .id(bill.getId())
                .category(categoryService.mapToResponse(bill.getCategory()))
                .description(bill.getDescription())
                .amount(bill.getAmount())
                .dueDay(bill.getDueDay())
                .isActive(bill.getIsActive())
                .autoPay(bill.getAutoPay())
                .build();
    }
}
