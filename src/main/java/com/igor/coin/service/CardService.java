package com.igor.coin.service;

import com.igor.coin.dto.CardRequest;
import com.igor.coin.dto.CardResponse;
import com.igor.coin.entity.Card;
import com.igor.coin.entity.User;
import com.igor.coin.exception.ResourceNotFoundException;
import com.igor.coin.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;

    public List<CardResponse> getAll(User user) {
        return cardRepository.findAllByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CardResponse getById(Long id, User user) {
        Card card = getCardByIdAndUser(id, user);
        return mapToResponse(card);
    }

    @Transactional
    public CardResponse create(CardRequest request, User user) {
        Card card = Card.builder()
                .user(user)
                .name(request.getName())
                .lastFour(request.getLastFour())
                .creditLimit(request.getCreditLimit() != null ? request.getCreditLimit() : BigDecimal.ZERO)
                .currentBill(BigDecimal.ZERO)
                .dueDay(request.getDueDay())
                .closingDay(request.getClosingDay())
                .color(request.getColor())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        return mapToResponse(cardRepository.save(card));
    }

    @Transactional
    public CardResponse update(Long id, CardRequest request, User user) {
        Card card = getCardByIdAndUser(id, user);
        card.setName(request.getName());
        card.setLastFour(request.getLastFour());
        if (request.getCreditLimit() != null) card.setCreditLimit(request.getCreditLimit());
        card.setDueDay(request.getDueDay());
        card.setClosingDay(request.getClosingDay());
        card.setColor(request.getColor());
        if (request.getIsActive() != null) card.setIsActive(request.getIsActive());
        return mapToResponse(cardRepository.save(card));
    }

    @Transactional
    public void delete(Long id, User user) {
        Card card = getCardByIdAndUser(id, user);
        cardRepository.delete(card);
    }

    public Card getCardByIdAndUser(Long id, User user) {
        return cardRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Card not found with id " + id));
    }

    public CardResponse mapToResponse(Card card) {
        return CardResponse.builder()
                .id(card.getId())
                .name(card.getName())
                .lastFour(card.getLastFour())
                .creditLimit(card.getCreditLimit())
                .currentBill(card.getCurrentBill())
                .dueDay(card.getDueDay())
                .closingDay(card.getClosingDay())
                .color(card.getColor())
                .isActive(card.getIsActive())
                .build();
    }
}
