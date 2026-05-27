package com.igor.coin.repository;

import com.igor.coin.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByUserId(Long userId);
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    Optional<BigDecimal> sumAmountByUserIdAndTypeAndMonthYear(@Param("userId") Long userId, @Param("type") com.igor.coin.entity.enums.TransactionType type, @Param("month") Integer month, @Param("year") Integer year);
    
    @Query("SELECT t.category.name, t.category.color, SUM(t.amount) as total FROM Transaction t WHERE t.user.id = :userId AND t.type = 'EXPENSE' AND MONTH(t.date) = :month AND YEAR(t.date) = :year GROUP BY t.category.name, t.category.color ORDER BY total DESC")
    List<Object[]> getCategoryBreakdown(@Param("userId") Long userId, @Param("month") Integer month, @Param("year") Integer year);
    
    @Query("SELECT MONTH(t.date), YEAR(t.date), t.type, SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.date >= :startDate GROUP BY YEAR(t.date), MONTH(t.date), t.type ORDER BY YEAR(t.date) DESC, MONTH(t.date) DESC")
    List<Object[]> getMonthlyFlowByTypeSince(@Param("userId") Long userId, @Param("startDate") java.time.LocalDate startDate);
    
    List<Transaction> findTop5ByUserIdOrderByDateDesc(Long userId);
}
