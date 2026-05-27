package com.igor.coin.repository;

import com.igor.coin.entity.FixedBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FixedBillRepository extends JpaRepository<FixedBill, Long> {
    List<FixedBill> findAllByUserId(Long userId);
    Optional<FixedBill> findByIdAndUserId(Long id, Long userId);
}
