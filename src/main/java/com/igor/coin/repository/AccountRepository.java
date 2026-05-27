package com.igor.coin.repository;

import com.igor.coin.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findAllByUserId(Long userId);
    Optional<Account> findByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.user.id = :userId")
    Optional<BigDecimal> sumBalanceByUserId(@Param("userId") Long userId);
}
