import { useEffect, useState } from 'react';
import axios from 'axios';
import "../Assets/Styles/Subscription.css"
import api from '../services/api';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showNameFilter, setShowNameFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    name: '',
    phone: '',
    job: '',
    idNumber: ''
  });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await api.get('/api/Employees/All');
      setSubscribers(response.data);
      setFilteredSubscribers(response.data);
    } catch (error) {
      console.error('فشل تحميل البيانات:', error);
      showNotification('حدث خطأ أثناء تحميل البيانات');
    }
  };

  const renderSubscribers = () => {
    return filteredSubscribers.map((sub) => (
      <div key={sub.id} className="card" onClick={() => viewEmployeeDetails(sub.id)}>
        <div>≡</div>
        <div>{sub.phone}</div>
        <div><span className="status-active">{sub.status}</span></div>
        <div>{sub.name}</div>
      </div>
    ));
  };

  const viewEmployeeDetails = (id) => {
    localStorage.setItem('selectedEmployeeId', id);
    window.location.href = '../employeePage/index-1.html';
  };

  const toggleNameFilter = () => {
    setShowNameFilter(!showNameFilter);
    setShowStatusFilter(false);
  };

  const toggleStatusFilter = () => {
    setShowStatusFilter(!showStatusFilter);
    setShowNameFilter(false);
  };

  const filterByName = (name) => {
    const filtered = subscribers.filter((s) => s.name.includes(name));
    setFilteredSubscribers(filtered);
    closeFilters();
  };

  const filterByStatus = (status) => {
    const filtered = subscribers.filter((s) => s.status === status);
    setFilteredSubscribers(filtered);
    closeFilters();
  };

  const closeFilters = () => {
    setShowFilterMenu(false);
    setShowNameFilter(false);
    setShowStatusFilter(false);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleSave = () => {
    const { name, phone, job, idNumber } = newSubscriber;

    if (!name) return showNotification('يرجى إدخال الاسم');
    if (!/^01[0-9]{9}$/.test(phone)) return showNotification('يرجى إدخال رقم محمول صحيح مكوّن من 11 رقم ويبدأ بـ 01');
    if (!job) return showNotification('يرجى إدخال المسمى الوظيفي');
    if (!/^[0-9]{14}$/.test(idNumber)) return showNotification('يرجى إدخال رقم قومي صحيح مكوّن من 14 رقم');

    const newSub = { name, phone, job, idNumber, status: 'متاحة' };
    setSubscribers([...subscribers, newSub]);
    setFilteredSubscribers([...subscribers, newSub]);
    setNewSubscriber({ name: '', phone: '', job: '', idNumber: '' });
    setShowPopup(false);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="actions">
          <button onClick={() => setShowPopup(true)}>➕ إضافة مشترك</button>
          <button onClick={() => setShowFilterMenu(!showFilterMenu)}>🔽 فلتر</button>
          <button onClick={fetchSubscribers}>🔄 تحديث</button>
        </div>
        <div className="total">
          إجمالي المشتركين <span>{filteredSubscribers.length}</span>
        </div>
      </div>

      {showFilterMenu && (
        <div className="filter-menu">
          <div onClick={toggleNameFilter}>الاسم</div>
          <div onClick={toggleStatusFilter}>الحالة</div>
        </div>
      )}

      {showNameFilter && (
        <div className="filter-input">
          <input
            type="text"
            placeholder="أدخل الاسم"
            onChange={(e) => filterByName(e.target.value)}
          />
        </div>
      )}

      {showStatusFilter && (
        <div className="filter-input">
          <button onClick={() => filterByStatus('متاحة')}>متاحة</button>
          <button onClick={() => filterByStatus('منتهية')}>منتهية</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th></th>
            <th>اسم المشترك</th>
            <th>رقم الهاتف</th>
            <th>حالة الاشتراك</th>
            
          </tr>
        </thead>
      </table>

      <div className="cards-container">{renderSubscribers()}</div>

      {/* Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>إضافة مشترك جديد</h2>
            {notification && <div className="notification">{notification}</div>}
            <div className="form-grid">
              <div>
                <label>رقم المحمول</label>
                <input
                  type="text"
                  value={newSubscriber.phone}
                  onChange={(e) => setNewSubscriber({ ...newSubscriber, phone: e.target.value })}
                />
              </div>
              <div>
                <label>الاسم</label>
                <input
                  type="text"
                  value={newSubscriber.name}
                  onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                />
              </div>
              <div>
                <label>المسمى الوظيفي</label>
                <input
                  type="text"
                  value={newSubscriber.job}
                  onChange={(e) => setNewSubscriber({ ...newSubscriber, job: e.target.value })}
                />
              </div>
              <div>
                <label>الرقم القومي</label>
                <input
                  type="text"
                  value={newSubscriber.idNumber}
                  onChange={(e) => setNewSubscriber({ ...newSubscriber, idNumber: e.target.value })}
                />
              </div>
            </div>
            <button onClick={handleSave}>حفظ</button>
          </div>
        </div>
      )}
    </div>
  );
}