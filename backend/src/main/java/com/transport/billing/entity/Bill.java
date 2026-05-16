package com.transport.billing.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_number", unique = true, nullable = false)
    private String billNumber;

    @Column(name = "vehicle_number", nullable = false)
    private String vehicleNumber;

    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;

    @Column(name = "from_location")
    private String fromLocation;

    @Column(name = "to_location")
    private String toLocation;

    @Column(name = "total_weight_kg", nullable = false)
    private Double totalWeightKg;

    @Column(name = "weight_tons", nullable = false)
    private Double weightTons;

    @Column(name = "per_ton_price", nullable = false)
    private Double perTonPrice;

    @Column(name = "halting_charges")
    private Double haltingCharges;

    @Column(name = "chess_charges")
    private Double chessCharges;

    @Column(name = "advance_amount")
    private Double advanceAmount;

    @Column(name = "final_amount", nullable = false)
    private Double finalAmount;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Bill() {
    }

    public Bill(String billNumber, String vehicleNumber, LocalDate billDate, String fromLocation, String toLocation,
                Double totalWeightKg, Double weightTons, Double perTonPrice, Double haltingCharges, Double chessCharges,
                Double advanceAmount, Double finalAmount, String notes) {
        this.billNumber = billNumber;
        this.vehicleNumber = vehicleNumber;
        this.billDate = billDate;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.totalWeightKg = totalWeightKg;
        this.weightTons = weightTons;
        this.perTonPrice = perTonPrice;
        this.haltingCharges = haltingCharges;
        this.chessCharges = chessCharges;
        this.advanceAmount = advanceAmount;
        this.finalAmount = finalAmount;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public String getFromLocation() {
        return fromLocation;
    }

    public void setFromLocation(String fromLocation) {
        this.fromLocation = fromLocation;
    }

    public String getToLocation() {
        return toLocation;
    }

    public void setToLocation(String toLocation) {
        this.toLocation = toLocation;
    }

    public Double getTotalWeightKg() {
        return totalWeightKg;
    }

    public void setTotalWeightKg(Double totalWeightKg) {
        this.totalWeightKg = totalWeightKg;
    }

    public Double getWeightTons() {
        return weightTons;
    }

    public void setWeightTons(Double weightTons) {
        this.weightTons = weightTons;
    }

    public Double getPerTonPrice() {
        return perTonPrice;
    }

    public void setPerTonPrice(Double perTonPrice) {
        this.perTonPrice = perTonPrice;
    }

    public Double getHaltingCharges() {
        return haltingCharges;
    }

    public void setHaltingCharges(Double haltingCharges) {
        this.haltingCharges = haltingCharges;
    }

    public Double getChessCharges() {
        return chessCharges;
    }

    public void setChessCharges(Double chessCharges) {
        this.chessCharges = chessCharges;
    }

    public Double getAdvanceAmount() {
        return advanceAmount;
    }

    public void setAdvanceAmount(Double advanceAmount) {
        this.advanceAmount = advanceAmount;
    }

    public Double getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(Double finalAmount) {
        this.finalAmount = finalAmount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
