package com.igor.coin.service;

import com.igor.coin.dto.FixedBillPaymentRequest;
import com.igor.coin.dto.FixedBillPaymentResponse;
import com.igor.coin.entity.FixedBill;
import com.igor.coin.entity.FixedBillPayment;
import com.igor.coin.entity.User;
import com.igor.coin.exception.ResourceNotFoundException;
import com.igor.coin.repository.FixedBillPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FixedBillPaymentService {

    private final FixedBillPaymentRepository paymentRepository;
    private final FixedBillService fixedBillService;

    public List<FixedBillPaymentResponse> getAll(User user) {
        return paymentRepository.findAllByFixedBillUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FixedBillPaymentResponse getById(Long id, User user) {
        FixedBillPayment payment = getPaymentByIdAndUser(id, user);
        return mapToResponse(payment);
    }

    @Transactional
    public FixedBillPaymentResponse create(FixedBillPaymentRequest request, User user) {
        FixedBill bill = fixedBillService.getFixedBillByIdAndUser(request.getFixedBillId(), user);

        FixedBillPayment payment = FixedBillPayment.builder()
                .fixedBill(bill)
                .month(request.getMonth())
                .year(request.getYear())
                .paid(request.getPaid() != null ? request.getPaid() : false)
                .paidAt(request.getPaidAt())
                .amount(request.getAmount())
                .build();
                
        return mapToResponse(paymentRepository.save(payment));
    }

    @Transactional
    public FixedBillPaymentResponse update(Long id, FixedBillPaymentRequest request, User user) {
        FixedBillPayment payment = getPaymentByIdAndUser(id, user);
        
        if (request.getPaid() != null) payment.setPaid(request.getPaid());
        if (request.getPaidAt() != null) payment.setPaidAt(request.getPaidAt());
        if (request.getAmount() != null) payment.setAmount(request.getAmount());
        
        return mapToResponse(paymentRepository.save(payment));
    }

    @Transactional
    public void delete(Long id, User user) {
        FixedBillPayment payment = getPaymentByIdAndUser(id, user);
        paymentRepository.delete(payment);
    }

    public FixedBillPayment getPaymentByIdAndUser(Long id, User user) {
        return paymentRepository.findByIdAndFixedBillUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("FixedBillPayment not found with id " + id));
    }

    private FixedBillPaymentResponse mapToResponse(FixedBillPayment payment) {
        return FixedBillPaymentResponse.builder()
                .id(payment.getId())
                .fixedBillId(payment.getFixedBill().getId())
                .month(payment.getMonth())
                .year(payment.getYear())
                .paid(payment.getPaid())
                .paidAt(payment.getPaidAt())
                .amount(payment.getAmount())
                .build();
    }
}
