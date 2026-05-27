package com.igor.coin.repository;

import com.igor.coin.entity.FixedBillPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FixedBillPaymentRepository extends JpaRepository<FixedBillPayment, Long> {
    List<FixedBillPayment> findAllByFixedBillUserId(Long userId);
    Optional<FixedBillPayment> findByIdAndFixedBillUserId(Long id, Long userId);
}
