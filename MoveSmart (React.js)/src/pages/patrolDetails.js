import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Assets/Styles/patrolDetails.css"
import api from '../services/api';

export default function PatrolSystem() {
  const [activeTab, setActiveTab] = useState('patrol');

  const [patrolData, setPatrolData] = useState({
    totalKilometers: 0,
    totalFuelUsed: 0,
    patrolNumber: '',
    startTime: '',
    route: '',
    duration: '',
    carNumber: '',
    carType: '',
    hospital: '',
    carStatus: '',
    model: '',
    availableSeats: '',
    totalSeats: '',
    driverName: '',
    driverPhone: '',
    driverStatus: '',
    carIcon: 'car-icon-placeholder.png',
  });

  const [subscribers, setSubscribers] = useState([]);

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  const printPage = () => {
    window.print();
  };

  const generateReport = () => {
    alert('يتم توليد التقرير الآن...');
  };

  const goBack = () => {
    window.history.back();
  };

  const viewEmployeeDetails = (employeeId) => {
    localStorage.setItem('selectedEmployeeId', employeeId);
    window.location.href = '../employeePage/index-1.html';
  };

  const fetchPatrolData = async () => {
    try {
      const response = await api.get('/api/Patrols/{patrolID}');
      setPatrolData(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching patrol data:', error);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await api.get('/api/Employees/WhoAreUsingBus/{busID}');
      setSubscribers(response.data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  useEffect(() => {
    fetchPatrolData();
    fetchSubscribers();
  }, []);

  const getDriverStatusStyles = (status) => {
    if (status === 'متاح') {
      return { backgroundColor: 'rgba(31, 255, 99, 0.19)', border: '1px solid #23FB55' };
    } else if (status === 'غير متاح') {
      return { backgroundColor: 'rgba(255, 31, 31, 0.19)', border: '1px solid #FB2323' };
    } else {
      return {};
    }
  };

  return (
    <div dir="rtl" lang="ar" style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="left-section">
          <button onClick={goBack}>← رجوع</button>
          <div className="action-buttons" style={{ marginTop: '10px' }}>
            <button
              style={{ background: '#F2F2F7', color: 'black', width: '200px', height: '30px', marginRight: '10px' }}
              onClick={generateReport}
            >
              📄 تقرير
            </button>
            <button
              style={{ background: '#080808', color: 'white', width: '200px', height: '30px' }}
              onClick={printPage}
            >
              🖨️ طباعة
            </button>
          </div>
        </div>

        <div className="center-section" style={{ textAlign: 'center' }}>
          <div className="info-group" style={{ marginBottom: '10px' }}>
            <div>إجمالى الكيلومترات: {patrolData.totalKilometers}</div>
            <div>اجمالي الوقود المستخدم: {patrolData.totalFuelUsed}</div>
          </div>
          <div className="icon-box">
            <img src={patrolData.carIcon} alt="car" style={{ width: '50px' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          className={activeTab === 'patrol' ? 'active' : ''}
          onClick={() => switchTab('patrol')}
        >
          معلومات الدورية
        </button>
        <button
          className={activeTab === 'subscribers' ? 'active' : ''}
          onClick={() => switchTab('subscribers')}
        >
          المشتركين
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'patrol' && (
        <div className="form-columns" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Column 1 */}
          <div className="form-column">
            <FormItem label="رقم الدورية" value={patrolData.patrolNumber} />
            <FormItem label="وقت بدء الدورية" value={patrolData.startTime} />
            <FormItem label="خط سير الدورية" value={patrolData.route} />
            <FormItem label="الوقت المستغرق للدورية" value={patrolData.duration} />
            <FormItem label="رقم السيارة" value={patrolData.carNumber} />
          </div>

          {/* Column 2 */}
          <div className="form-column">
            <FormItem label="نوع السيارة" value={patrolData.carType} />
            <FormItem label="المستشفى التابعة له" value={patrolData.hospital} />
            <FormItem label="حالة السيارة" value={patrolData.carStatus} />
            <FormItem label="الموديل" value={patrolData.model} />
            <FormItem label="الأماكن المتاحة" value={patrolData.availableSeats} />
          </div>

          {/* Half Column */}
          <div className="form-column half">
            <FormItem label="إجمالي المقاعد" value={patrolData.totalSeats} />
            <FormItem label="اسم السائق" value={patrolData.driverName} />
            <FormItem label="رقم الهاتف" value={patrolData.driverPhone} />
            <div className="form-item">
              <label>حالة السائق</label>
              <div style={{ padding: '8px', ...getDriverStatusStyles(patrolData.driverStatus) }}>
                {patrolData.driverStatus}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>اسم الموظف</th>
              <th>الوظيفة</th>
              <th>رقم الهاتف</th>
              <th>عرض التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(sub => (
              <tr key={sub.id}>
                <td>{sub.name || 'غير معروف'}</td>
                <td>{sub.jobTitle || 'غير معروف'}</td>
                <td>{sub.phone || 'غير معروف'}</td>
                <td>
                  <button onClick={() => viewEmployeeDetails(sub.id)}>عرض التفاصيل</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function FormItem({ label, value }) {
  return (
    <div className="form-item" style={{ marginBottom: '10px' }}>
      <label>{label}</label>
      <input type="text" value={value} readOnly style={{ width: '100%', padding: '5px' }} />
    </div>
  );
}
