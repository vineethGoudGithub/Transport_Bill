import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Search, Eye, Trash2 } from 'lucide-react';
import './BillHistory.css';

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBills = async () => {
    setLoading(true);
    try {
      let url = '/bills';
      if (searchTerm) {
        url = `/bills/search?vehicleNumber=${encodeURIComponent(searchTerm)}`;
      }
      const response = await api.get(url);
      // Sort by descending ID/Date
      const sortedBills = response.data.sort((a, b) => b.id - a.id);
      setBills(sortedBills);
    } catch (error) {
      console.error("Error fetching bills", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const delayDebounceFn = setTimeout(() => {
      fetchBills();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/bills/${id}`);
        setBills(bills.filter(b => b.id !== id));
        toast.success("Bill deleted successfully");
      } catch (error) {
        console.error("Error deleting bill", error);
        toast.error("Failed to delete bill");
      }
    }
  };

  return (
    <div className="bill-history-container">
      <div className="page-header">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Bill History</h1>
        <button className="btn btn-primary" onClick={() => navigate('/create-bill')}>
          + New Bill
        </button>
      </div>

      <div className="glass-panel search-panel">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search by Vehicle Number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            />
        </div>
      </div>

      <div className="glass-panel table-panel">
        {loading ? (
          <div className="table-loader">Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Date</th>
                  <th>Vehicle</th>
                  <th>Route</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.id}>
                    <td><strong>{bill.billNumber}</strong></td>
                    <td>{bill.billDate}</td>
                    <td>{bill.vehicleNumber}</td>
                    <td>{bill.fromLocation ? `${bill.fromLocation} → ` : ''}{bill.toLocation}</td>
                    <td className="text-primary"><strong>₹{bill.finalAmount.toLocaleString()}</strong></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon view" onClick={() => navigate(`/bills/${bill.id}`)} title="View & Print">
                          <Eye size={18} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(bill.id)} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bills.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                      No bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillHistory;
