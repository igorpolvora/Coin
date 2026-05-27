package com.igor.coin.service;

import com.igor.coin.dto.SavingsGoalRequest;
import com.igor.coin.dto.SavingsGoalResponse;
import com.igor.coin.entity.SavingsGoal;
import com.igor.coin.entity.User;
import com.igor.coin.exception.ResourceNotFoundException;
import com.igor.coin.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;

    public List<SavingsGoalResponse> getAll(User user) {
        return savingsGoalRepository.findAllByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SavingsGoalResponse getById(Long id, User user) {
        SavingsGoal goal = getSavingsGoalByIdAndUser(id, user);
        return mapToResponse(goal);
    }

    @Transactional
    public SavingsGoalResponse create(SavingsGoalRequest request, User user) {
        SavingsGoal goal = SavingsGoal.builder()
                .user(user)
                .name(request.getName())
                .icon(request.getIcon())
                .targetAmount(request.getTargetAmount())
                .currentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO)
                .deadline(request.getDeadline())
                .color(request.getColor())
                .isCompleted(request.getIsCompleted() != null ? request.getIsCompleted() : false)
                .build();
                
        return mapToResponse(savingsGoalRepository.save(goal));
    }

    @Transactional
    public SavingsGoalResponse update(Long id, SavingsGoalRequest request, User user) {
        SavingsGoal goal = getSavingsGoalByIdAndUser(id, user);
        
        goal.setName(request.getName());
        goal.setIcon(request.getIcon());
        goal.setTargetAmount(request.getTargetAmount());
        if (request.getCurrentAmount() != null) goal.setCurrentAmount(request.getCurrentAmount());
        goal.setDeadline(request.getDeadline());
        goal.setColor(request.getColor());
        if (request.getIsCompleted() != null) goal.setIsCompleted(request.getIsCompleted());
        
        return mapToResponse(savingsGoalRepository.save(goal));
    }

    @Transactional
    public void delete(Long id, User user) {
        SavingsGoal goal = getSavingsGoalByIdAndUser(id, user);
        savingsGoalRepository.delete(goal);
    }

    public SavingsGoal getSavingsGoalByIdAndUser(Long id, User user) {
        return savingsGoalRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal not found with id " + id));
    }

    private SavingsGoalResponse mapToResponse(SavingsGoal goal) {
        return SavingsGoalResponse.builder()
                .id(goal.getId())
                .name(goal.getName())
                .icon(goal.getIcon())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .deadline(goal.getDeadline())
                .color(goal.getColor())
                .isCompleted(goal.getIsCompleted())
                .build();
    }
}
