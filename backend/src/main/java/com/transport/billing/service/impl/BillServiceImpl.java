package com.transport.billing.service.impl;

import com.transport.billing.dto.BillRequestDTO;
import com.transport.billing.dto.BillResponseDTO;
import com.transport.billing.entity.Bill;
import com.transport.billing.exception.ResourceNotFoundException;
import com.transport.billing.repository.BillRepository;
import com.transport.billing.service.BillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl implements BillService {

    private final BillRepository billRepository;

    public BillServiceImpl(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @Override
    @Transactional
    public BillResponseDTO createBill(BillRequestDTO dto) {
        Bill bill = new Bill();
        
        // Generate Bill Number
        String newBillNumber = generateBillNumber();
        bill.setBillNumber(newBillNumber);
        
        mapDtoToEntity(dto, bill);
        calculateAndSetAmounts(bill);
        
        Bill savedBill = billRepository.save(bill);
        return mapEntityToDto(savedBill);
    }

    @Override
    @Transactional
    public BillResponseDTO updateBill(Long id, BillRequestDTO dto) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        
        mapDtoToEntity(dto, bill);
        calculateAndSetAmounts(bill);
        
        Bill updatedBill = billRepository.save(bill);
        return mapEntityToDto(updatedBill);
    }

    @Override
    @Transactional
    public void deleteBill(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        billRepository.delete(bill);
    }

    @Override
    public BillResponseDTO getBillById(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        return mapEntityToDto(bill);
    }

    @Override
    public List<BillResponseDTO> getAllBills() {
        return billRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BillResponseDTO> searchBillsByVehicleNumber(String vehicleNumber) {
        return billRepository.findByVehicleNumberContainingIgnoreCase(vehicleNumber).stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    private String generateBillNumber() {
        int year = LocalDate.now().getYear();
        String prefix = "INV-" + year + "-";
        
        return billRepository.findTopByOrderByIdDesc()
                .map(lastBill -> {
                    String lastBillNo = lastBill.getBillNumber();
                    try {
                        String[] parts = lastBillNo.split("-");
                        int nextNum = Integer.parseInt(parts[2]) + 1;
                        return prefix + String.format("%04d", nextNum);
                    } catch (Exception e) {
                        return prefix + "0001";
                    }
                })
                .orElse(prefix + "0001");
    }

    private void mapDtoToEntity(BillRequestDTO dto, Bill bill) {
        bill.setVehicleNumber(dto.getVehicleNumber());
        bill.setBillDate(dto.getBillDate());
        bill.setFromLocation(dto.getFromLocation());
        bill.setToLocation(dto.getToLocation());
        bill.setTotalWeightKg(dto.getTotalWeightKg());
        bill.setPerTonPrice(dto.getPerTonPrice());
        bill.setHaltingCharges(dto.getHaltingCharges() != null ? dto.getHaltingCharges() : 0.0);
        bill.setChessCharges(dto.getChessCharges() != null ? dto.getChessCharges() : 0.0);
        bill.setAdvanceAmount(dto.getAdvanceAmount() != null ? dto.getAdvanceAmount() : 0.0);
        bill.setNotes(dto.getNotes());
    }

    private void calculateAndSetAmounts(Bill bill) {
        double weightTons = bill.getTotalWeightKg() / 1000.0;
        bill.setWeightTons(weightTons);
        
        double baseAmount = weightTons * bill.getPerTonPrice();
        double finalAmount = baseAmount + bill.getHaltingCharges() + bill.getChessCharges() - (bill.getAdvanceAmount() != null ? bill.getAdvanceAmount() : 0.0);
        
        // Round to 2 decimal places if needed, but let's keep it simple
        bill.setFinalAmount(finalAmount);
    }

    private BillResponseDTO mapEntityToDto(Bill bill) {
        BillResponseDTO dto = new BillResponseDTO();
        dto.setId(bill.getId());
        dto.setBillNumber(bill.getBillNumber());
        dto.setVehicleNumber(bill.getVehicleNumber());
        dto.setBillDate(bill.getBillDate());
        dto.setFromLocation(bill.getFromLocation());
        dto.setToLocation(bill.getToLocation());
        dto.setTotalWeightKg(bill.getTotalWeightKg());
        dto.setWeightTons(bill.getWeightTons());
        dto.setPerTonPrice(bill.getPerTonPrice());
        dto.setHaltingCharges(bill.getHaltingCharges());
        dto.setChessCharges(bill.getChessCharges());
        dto.setAdvanceAmount(bill.getAdvanceAmount());
        dto.setFinalAmount(bill.getFinalAmount());
        dto.setNotes(bill.getNotes());
        dto.setCreatedAt(bill.getCreatedAt());
        return dto;
    }
}
