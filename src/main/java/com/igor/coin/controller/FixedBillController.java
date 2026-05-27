package com.igor.coin.controller;

import com.igor.coin.dto.FixedBillRequest;
import com.igor.coin.dto.FixedBillResponse;
import com.igor.coin.entity.User;
import com.igor.coin.service.FixedBillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fixed-bills")
@RequiredArgsConstructor
public class FixedBillController {

    private final FixedBillService fixedBillService;

    @GetMapping
    public ResponseEntity<List<FixedBillResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fixedBillService.getAll(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FixedBillResponse> getById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fixedBillService.getById(id, user));
    }

    @PostMapping
    public ResponseEntity<FixedBillResponse> create(@RequestBody FixedBillRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fixedBillService.create(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FixedBillResponse> update(@PathVariable Long id, @RequestBody FixedBillRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fixedBillService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        fixedBillService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
