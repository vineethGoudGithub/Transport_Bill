package com.transport.billing.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BillResponseDTO {

    private Long id;
    private String billNumber;
    private String vehicleNumber;
    private LocalDate billDate;
    private String fromLocation;
    private String toLocation;
    private Double totalWeightKg;
    private Double weightTons;
    private Double perTonPrice;
    private Double haltingCharges;
    private Double chessCharges;
    private Double advanceAmount;
    private Double finalAmount;
    private String notes;
    private LocalDateTime createdAt;

    public BillResponseDTO() {
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
