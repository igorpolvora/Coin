package com.igor.coin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fixed_bill_payments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"fixed_bill_id", "month", "year"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixedBillPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fixed_bill_id", nullable = false)
    private FixedBill fixedBill;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Boolean paid = false;

    private LocalDateTime paidAt;

    private BigDecimal amount;
}
