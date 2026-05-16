package com.transport.billing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class BillRequestDTO {

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    @NotNull(message = "Bill date is required")
    private LocalDate billDate;

    private String fromLocation;

    @NotBlank(message = "To location is required")
    private String toLocation;

    @NotNull(message = "Total weight in KG is required")
    @Positive(message = "Total weight must be positive")
    private Double totalWeightKg;

    @NotNull(message = "Per ton price is required")
    @Positive(message = "Per ton price must be positive")
    private Double perTonPrice;

    private Double haltingCharges;

    private Double chessCharges;

    private Double advanceAmount;

    private String notes;

    public BillRequestDTO() {
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
