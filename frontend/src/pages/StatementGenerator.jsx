import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Search, Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './StatementGenerator.css';

const StatementGenerator = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBillIds, setSelectedBillIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('selection'); // 'selection' or 'preview'
  const statementRef = useRef(null);

  const fetchBills = async () => {
    setLoading(true);
    try {
      let url = '/bills';
      if (searchTerm) {
        url = `/bills/search?vehicleNumber=${encodeURIComponent(searchTerm)}`;
      }
      const response = await api.get(url);
      const sortedBills = response.data.sort((a, b) => b.id - a.id);
      setBills(sortedBills);
    } catch (error) {
      console.error("Error fetching bills", error);
      toast.error("Failed to fetch bills for statement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBills();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = bills.map(b => b.id);
      setSelectedBillIds(new Set(allIds));
    } else {
      setSelectedBillIds(new Set());
    }
  };

  const handleSelectBill = (id) => {
    const newSelected = new Set(selectedBillIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBillIds(newSelected);
  };

  const selectedBills = bills.filter(b => selectedBillIds.has(b.id));
  const grandTotal = selectedBills.reduce((sum, b) => sum + b.finalAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (selectedBills.length === 0) {
      toast.warn("Please select at least one trip.");
      return;
    }
    const element = statementRef.current;
    
    element.style.padding = "40px";
    element.style.background = "white";
    element.style.color = "black";

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Consolidated_Statement.pdf`);
      toast.success("Statement downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed", error);
      toast.error("Failed to generate PDF.");
    } finally {
      element.style.padding = "2rem";
      element.style.background = "";
      element.style.color = "";
    }
  };

  return (
    <div className="statement-container">
      <div className="page-header no-print">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Consolidated Statement</h1>
      </div>

      <div className="statement-layout">
        {/* Mobile Tabs */}
        <div className="mobile-tabs no-print">
          <button 
            className={`tab-btn ${activeTab === 'selection' ? 'active' : ''}`}
            onClick={() => setActiveTab('selection')}
          >
            1. Select Trips ({selectedBillIds.size})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
            disabled={selectedBillIds.size === 0}
          >
            2. View Statement
          </button>
        </div>

        {/* LEFT COLUMN: SELECTION */}
        <div className={`selection-panel glass-panel no-print ${activeTab === 'selection' ? 'show' : 'hide'}`}>
          <h3>Select Trips</h3>
          <div className="search-wrapper statement-search">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search Vehicle..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            />
          </div>
          
          <div className="trip-list">
            {loading ? (
              <div className="p-4 text-center">Loading trips...</div>
            ) : (
              <table className="custom-table compact-table">
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        checked={bills.length > 0 && selectedBillIds.size === bills.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Date</th>
                    <th>Vehicle</th>
                    <th className="text-right">Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill.id} className={selectedBillIds.has(bill.id) ? 'selected-row' : ''} onClick={() => handleSelectBill(bill.id)}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedBillIds.has(bill.id)}
                          onChange={() => {}} // handled by row click
                        />
                      </td>
                      <td>{bill.billDate}</td>
                      <td>{bill.vehicleNumber}</td>
                      <td className="text-right">₹{bill.finalAmount}</td>
                    </tr>
                  ))}
                  {bills.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">No trips found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className={`preview-panel glass-panel ${activeTab === 'preview' ? 'show' : 'hide'}`}>
          <div className="preview-actions no-print">
            <h3>Statement Preview</h3>
            <div className="action-group">
              <button className="btn btn-primary" onClick={handlePrint} disabled={selectedBills.length === 0}>
                <Printer size={16} /> Print
              </button>
              <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={selectedBills.length === 0}>
                <Download size={16} /> Download
              </button>
            </div>
          </div>

          <div className="statement-document" ref={statementRef}>
            {selectedBills.length === 0 ? (
              <div className="empty-preview">
                <p>Select trips from the left to build your statement.</p>
              </div>
            ) : (
              <>
                <table className="statement-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Vehicle No</th>
                      <th className="text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBills.map(bill => (
                      <tr key={bill.id}>
                        <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                        <td><strong>{bill.vehicleNumber}</strong></td>
                        <td className="text-right"><strong>₹{bill.finalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="statement-summary">
                  <div className="summary-row grand-total">
                    <span>Total Amount ({selectedBills.length} trips):</span>
                    <span>₹{grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementGenerator;
