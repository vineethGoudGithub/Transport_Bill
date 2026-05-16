import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import './BillPreview.css';

const BillPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await api.get(`/bills/${id}`);
        setBill(response.data);
      } catch (error) {
        console.error("Error fetching bill", error);
        toast.error("Bill not found.");
        navigate('/history');
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    
    // Temporarily fix styles for PDF generation
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
      pdf.save(`${bill.billNumber}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed", error);
      toast.error("Failed to generate PDF.");
    } finally {
      // Revert styles
      element.style.padding = "2rem";
      element.style.background = "";
      element.style.color = "";
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!bill) return null;

  return (
    <div className="preview-container">
      <div className="preview-actions no-print">
        <button className="btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="action-group">
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={18} /> Print
          </button>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      <div className="invoice-wrapper" ref={invoiceRef}>
        <div className="invoice glass-panel">
          
          <div className="invoice-header">
            <div className="company-info">
              <h1>Transport Bill</h1>
            </div>
            <div className="invoice-title">
              <h2>INVOICE</h2>
              <div className="invoice-meta">
                <div className="meta-row">
                  <span>Bill No:</span>
                  <strong>{bill.billNumber}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="invoice-details">
            <div className="detail-box">
              <h3>Trip Details</h3>
              <p className="vehicle-highlight"><strong>Vehicle No:</strong> {bill.vehicleNumber}</p>
              <p><strong>Date:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
              {bill.fromLocation && <p><strong>From:</strong> {bill.fromLocation}</p>}
              <p><strong>To:</strong> {bill.toLocation}</p>
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-right">Quantity / Weight</th>
                <th className="text-right">Rate</th>
                <th className="text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Weight</td>
                <td className="text-right">{bill.totalWeightKg} KG</td>
                <td className="text-right">₹{bill.perTonPrice} / Ton</td>
                <td className="text-right">{(bill.weightTons * bill.perTonPrice).toFixed(2)}</td>
              </tr>
              {bill.haltingCharges > 0 && (
                <tr>
                  <td>Halting Charges</td>
                  <td className="text-right">-</td>
                  <td className="text-right">-</td>
                  <td className="text-right">{bill.haltingCharges.toFixed(2)}</td>
                </tr>
              )}
              {bill.chessCharges > 0 && (
                <tr>
                  <td>Chess Charges</td>
                  <td className="text-right">-</td>
                  <td className="text-right">-</td>
                  <td className="text-right">{bill.chessCharges.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="invoice-summary">
            <div className="notes">
              <strong>Notes:</strong>
              <p>{bill.notes || 'No special instructions.'}</p>
            </div>
            <div className="totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{((bill.weightTons * bill.perTonPrice) + bill.haltingCharges + bill.chessCharges).toFixed(2)}</span>
              </div>
              {bill.advanceAmount > 0 && (
                <div className="total-row">
                  <span>Less Advance:</span>
                  <span style={{ color: 'var(--danger-color)' }}>-₹{bill.advanceAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row grand-total">
                <span>Final Amount:</span>
                <span>₹{bill.finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BillPreview;
