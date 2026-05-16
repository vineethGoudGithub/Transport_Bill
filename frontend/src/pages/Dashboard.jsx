import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Truck, DollarSign, FileText, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBills: 0,
    totalRevenue: 0,
    recentBills: [],
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/bills');
        const bills = response.data;
        
        const totalRev = bills.reduce((sum, bill) => sum + bill.finalAmount, 0);
        
        // Dummy monthly data generation based on actual data
        const monthMap = {};
        bills.forEach(bill => {
          const month = new Date(bill.billDate).toLocaleString('default', { month: 'short' });
          monthMap[month] = (monthMap[month] || 0) + bill.finalAmount;
        });

        const mData = Object.keys(monthMap).map(k => ({ name: k, revenue: monthMap[k] }));

        setStats({
          totalBills: bills.length,
          totalRevenue: totalRev,
          recentBills: bills.slice(-5).reverse(), // Last 5
          monthlyData: mData.length > 0 ? mData : [
            { name: 'Jan', revenue: 0 }, { name: 'Feb', revenue: 0 }, { name: 'Mar', revenue: 0 }
          ]
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Bills</h3>
            <p>{stats.totalBills}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p>₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Truck size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Vehicles</h3>
            <p>{new Set(stats.recentBills.map(b => b.vehicleNumber)).size}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="chart-container glass-panel">
          <h3>Revenue Overview</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface-color)', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--primary-color)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-bills glass-panel">
          <h3>Recent Bills</h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBills.map(bill => (
                  <tr key={bill.id}>
                    <td>{bill.billNumber}</td>
                    <td>{bill.vehicleNumber}</td>
                    <td>{bill.billDate}</td>
                    <td>₹{bill.finalAmount.toLocaleString()}</td>
                  </tr>
                ))}
                {stats.recentBills.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No recent bills found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
