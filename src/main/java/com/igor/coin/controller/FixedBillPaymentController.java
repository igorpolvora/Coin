package com.igor.coin.controller;

import com.igor.coin.dto.FixedBillPaymentRequest;
import com.igor.coin.dto.FixedBillPaymentResponse;
import com.igor.coin.entity.User;
import com.igor.coin.service.FixedBillPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fixed-bill-payments")
@RequiredArgsConstructor
public class FixedBillPaymentController {

    private final FixedBillPaymentService fixedBillPaymentService;

    @GetMapping
    public ResponseEntity<List<FixedBillPaymentResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fixedBillPaymentService.getAll(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FixedBillPaymentResponse> getById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fixedBillPaymentService.getById(id, user));
    }

    @PostMapping
    public ResponseEntity<FixedBillPaymentResponse> create(@RequestBody FixedBillPaymentRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fixedBillPaymentService.create(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FixedBillPaymentResponse> update(@PathVariable Long id, @RequestBody FixedBillPaymentRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fixedBillPaymentService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        fixedBillPaymentService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
