package com.igor.coin.service;

import com.igor.coin.dto.FixedBillRequest;
import com.igor.coin.dto.FixedBillResponse;
import com.igor.coin.entity.Category;
import com.igor.coin.entity.FixedBill;
import com.igor.coin.entity.FixedBillPayment;
import com.igor.coin.entity.User;
import com.igor.coin.exception.ResourceNotFoundException;
import com.igor.coin.repository.FixedBillPaymentRepository;
import com.igor.coin.repository.FixedBillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FixedBillService {

    private final FixedBillRepository fixedBillRepository;
    private final FixedBillPaymentRepository fixedBillPaymentRepository;
    private final CategoryService categoryService;

    public List<FixedBillResponse> getAll(User user, Integer month, Integer year) {
        return fixedBillRepository.findAllByUserId(user.getId()).stream()
                .filter(FixedBill::getIsActive)
                .map(bill -> {
                    FixedBillResponse response = mapToResponse(bill);
                    if (month != null && year != null) {
                        Optional<FixedBillPayment> payment = fixedBillPaymentRepository.findByFixedBillIdAndMonthAndYear(bill.getId(), month, year);
                        response.setIsPaid(payment.isPresent() && payment.get().getPaid());
                    } else {
                        response.setIsPaid(false);
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    public List<FixedBillResponse> getAll(User user) {
        return getAll(user, null, null);
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

    @Transactional
    public void pay(Long id, Integer month, Integer year, User user) {
        FixedBill bill = getFixedBillByIdAndUser(id, user);
        FixedBillPayment payment = fixedBillPaymentRepository.findByFixedBillIdAndMonthAndYear(bill.getId(), month, year)
                .orElse(FixedBillPayment.builder()
                        .fixedBill(bill)
                        .month(month)
                        .year(year)
                        .amount(bill.getAmount())
                        .build());
                        
        payment.setPaid(true);
        payment.setPaidAt(LocalDateTime.now());
        fixedBillPaymentRepository.save(payment);
    }

    @Transactional
    public void unpay(Long id, Integer month, Integer year, User user) {
        FixedBill bill = getFixedBillByIdAndUser(id, user);
        fixedBillPaymentRepository.findByFixedBillIdAndMonthAndYear(bill.getId(), month, year)
                .ifPresent(payment -> {
                    payment.setPaid(false);
                    payment.setPaidAt(null);
                    fixedBillPaymentRepository.save(payment);
                });
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
