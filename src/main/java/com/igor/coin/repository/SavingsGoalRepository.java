package com.igor.coin.repository;

import com.igor.coin.entity.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {
    List<SavingsGoal> findAllByUserId(Long userId);
    Optional<SavingsGoal> findByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT SUM(s.currentAmount) FROM SavingsGoal s WHERE s.user.id = :userId")
    Optional<BigDecimal> sumCurrentAmountByUserId(@Param("userId") Long userId);
}
