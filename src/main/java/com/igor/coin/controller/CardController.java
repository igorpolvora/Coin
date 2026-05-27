package com.igor.coin.controller;

import com.igor.coin.dto.CardRequest;
import com.igor.coin.dto.CardResponse;
import com.igor.coin.entity.User;
import com.igor.coin.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping
    public ResponseEntity<List<CardResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cardService.getAll(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardResponse> getById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cardService.getById(id, user));
    }

    @PostMapping
    public ResponseEntity<CardResponse> create(@RequestBody CardRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cardService.create(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardResponse> update(@PathVariable Long id, @RequestBody CardRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cardService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        cardService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
