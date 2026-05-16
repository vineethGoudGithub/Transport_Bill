package com.transport.billing.controller;

import com.transport.billing.dto.BillRequestDTO;
import com.transport.billing.dto.BillResponseDTO;
import com.transport.billing.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping
    public ResponseEntity<BillResponseDTO> createBill(@Valid @RequestBody BillRequestDTO billRequestDTO) {
        return new ResponseEntity<>(billService.createBill(billRequestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BillResponseDTO>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillResponseDTO> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(billService.getBillById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BillResponseDTO> updateBill(@PathVariable Long id, @Valid @RequestBody BillRequestDTO billRequestDTO) {
        return ResponseEntity.ok(billService.updateBill(id, billRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<BillResponseDTO>> searchBills(@RequestParam String vehicleNumber) {
        return ResponseEntity.ok(billService.searchBillsByVehicleNumber(vehicleNumber));
    }
}
