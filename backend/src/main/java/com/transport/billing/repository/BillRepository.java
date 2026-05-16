package com.transport.billing.repository;

import com.transport.billing.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    
    List<Bill> findByVehicleNumberContainingIgnoreCase(String vehicleNumber);
    
    @Query("SELECT b FROM Bill b ORDER BY b.id DESC LIMIT 1")
    Optional<Bill> findTopByOrderByIdDesc();
}
