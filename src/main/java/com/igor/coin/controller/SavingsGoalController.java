package com.igor.coin.controller;

import com.igor.coin.dto.SavingsGoalRequest;
import com.igor.coin.dto.SavingsGoalResponse;
import com.igor.coin.entity.User;
import com.igor.coin.service.SavingsGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/savings-goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    @GetMapping
    public ResponseEntity<List<SavingsGoalResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(savingsGoalService.getAll(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingsGoalResponse> getById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(savingsGoalService.getById(id, user));
    }

    @PostMapping
    public ResponseEntity<SavingsGoalResponse> create(@RequestBody SavingsGoalRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(savingsGoalService.create(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoalResponse> update(@PathVariable Long id, @RequestBody SavingsGoalRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(savingsGoalService.update(id, request, user));
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<SavingsGoalResponse> deposit(@PathVariable Long id, @RequestBody Map<String, BigDecimal> payload, @AuthenticationPrincipal User user) {
        BigDecimal amount = payload.get("amount");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(savingsGoalService.deposit(id, amount, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        savingsGoalService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
