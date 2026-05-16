package com.transport.billing.service;

import com.transport.billing.dto.BillRequestDTO;
import com.transport.billing.dto.BillResponseDTO;

import java.util.List;

public interface BillService {
    BillResponseDTO createBill(BillRequestDTO billRequestDTO);
    BillResponseDTO updateBill(Long id, BillRequestDTO billRequestDTO);
    void deleteBill(Long id);
    BillResponseDTO getBillById(Long id);
    List<BillResponseDTO> getAllBills();
    List<BillResponseDTO> searchBillsByVehicleNumber(String vehicleNumber);
}
