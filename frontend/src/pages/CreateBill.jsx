import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './CreateBill.css';

const CreateBill = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    billDate: new Date().toISOString().split('T')[0],
    fromLocation: '',
    toLocation: '',
    weightInput: '', // Smart input: either tons or kgs
    perTonPrice: '',
    haltingCharges: '',
    chessCharges: '',
    advanceAmount: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'vehicleNumber' ? value.toUpperCase() : value 
    }));
  };

  // Derived state for live preview
  const getWeightTons = (val) => {
    const num = parseFloat(val) || 0;
    if (num === 0) return 0;
    // Smart detection: double digits (< 100) are treated as Tons, large numbers as KGs
    if (num < 100) return num;
    return num / 1000;
  };

  const weightTons = getWeightTons(formData.weightInput);
  const price = parseFloat(formData.perTonPrice) || 0;
  const halting = parseFloat(formData.haltingCharges) || 0;
  const chess = parseFloat(formData.chessCharges) || 0;
  const advance = parseFloat(formData.advanceAmount) || 0;

  const baseAmount = weightTons * price;
  const finalAmount = baseAmount + halting + chess - advance;

  const showPreview = parseFloat(formData.weightInput) > 0 || price > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        vehicleNumber: formData.vehicleNumber,
        billDate: formData.billDate,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        totalWeightKg: weightTons * 1000, // Send backend exactly KGs
        perTonPrice: price,
        haltingCharges: halting,
        chessCharges: chess,
        advanceAmount: advance,
        notes: formData.notes
      };
      const response = await api.post('/bills', payload);
      toast.success("Bill generated successfully!");
      navigate(`/bills/${response.data.id}`);
    } catch (error) {
      console.error("Error creating bill", error);
      toast.error("Error creating bill. Please check the inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-bill-container">
      <h1 className="page-title">Create New Bill</h1>
      
      <div className="form-layout">
        <div className="form-card glass-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Vehicle Number *</label>
                <input type="text" name="vehicleNumber" required value={formData.vehicleNumber} onChange={handleInputChange} placeholder="e.g. TG 36 G 2035" />
              </div>
              <div className="input-group">
                <label>Bill Date *</label>
                <input type="date" name="billDate" required value={formData.billDate} onChange={handleInputChange} />
              </div>
              
              <div className="input-group">
                <label>From Location (Optional)</label>
                <input type="text" name="fromLocation" value={formData.fromLocation} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>To Location *</label>
                <input type="text" name="toLocation" required value={formData.toLocation} onChange={handleInputChange} />
              </div>

              <div className="input-group">
                <label>Weight (Tons or KG) *</label>
                <input type="number" step="0.01" name="weightInput" required value={formData.weightInput} onChange={handleInputChange} placeholder="e.g. 15 or 15000" />
              </div>
              <div className="input-group">
                <label>Per Ton Price (₹) *</label>
                <input type="number" step="0.01" name="perTonPrice" required value={formData.perTonPrice} onChange={handleInputChange} />
              </div>

              <div className="input-group">
                <label>Halting Charges (Optional)</label>
                <input type="number" step="0.01" name="haltingCharges" value={formData.haltingCharges} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Chess Charges (Optional)</label>
                <input type="number" step="0.01" name="chessCharges" value={formData.chessCharges} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Advance Received (Optional)</label>
                <input type="number" step="0.01" name="advanceAmount" value={formData.advanceAmount} onChange={handleInputChange} style={{borderColor: 'var(--danger-color)'}}/>
              </div>
            </div>
            
            <div className="input-group full-width">
              <label>Notes</label>
              <textarea name="notes" rows="3" value={formData.notes} onChange={handleInputChange}></textarea>
            </div>

            <div className="form-actions">
              <button type="button" className="btn" onClick={() => navigate('/history')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Generate Bill'}
              </button>
            </div>
          </form>
        </div>

        <div className="preview-card glass-panel">
          <h3>Live Calculation Preview</h3>
          {showPreview ? (
            <div className="preview-details">
              <div className="preview-item">
                <span>Interpreted As:</span>
                <strong>{parseFloat(formData.weightInput) < 100 && parseFloat(formData.weightInput) > 0 ? "Tons" : "Kilograms (KG)"}</strong>
              </div>
              <div className="preview-item">
                <span>Weight in Tons:</span>
                <strong>{weightTons.toFixed(3)} Tons</strong>
              </div>
              <div className="preview-item">
                <span>Per Ton Price:</span>
                <strong>₹{price.toFixed(2)}</strong>
              </div>
              <div className="preview-item">
                <span>Base Amount (Freight):</span>
                <strong>₹{baseAmount.toFixed(2)}</strong>
              </div>
              <div className="preview-item">
                <span>Halting Charges:</span>
                <strong>₹{halting.toFixed(2)}</strong>
              </div>
              <div className="preview-item">
                <span>Chess Charges:</span>
                <strong>₹{chess.toFixed(2)}</strong>
              </div>
              <div className="preview-item">
                <span style={{ color: 'var(--danger-color)' }}>Less: Advance</span>
                <strong style={{ color: 'var(--danger-color)' }}>-₹{advance.toFixed(2)}</strong>
              </div>
              <div className="preview-divider"></div>
              <div className="preview-item total">
                <span>Final Amount:</span>
                <strong className="text-primary">₹{finalAmount.toFixed(2)}</strong>
              </div>
            </div>
          ) : (
            <div className="preview-empty">
              <p>Enter weight and price to see calculations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
