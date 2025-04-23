import React, { useState, useEffect } from 'react';
import "../Assets/Styles/Subscription.css"

const initialSubscribers = [
  { name: 'احمد حمدي', phone: '01204514948', status: 'متاحة' },
  { name: 'احمد عادل', phone: '01204514948', status: 'متاحة' },
  { name: 'عمر شعبان', phone: '01204514948', status: 'متاحة' },
  { name: 'اسامة سيد', phone: '01204514948', status: 'متاحة' },
];

export default function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [filtered, setFiltered] = useState(initialSubscribers);
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showNameFilter, setShowNameFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [notification, setNotification] = useState('');
  const [newSub, setNewSub] = useState({ name: '', phone: '', job: '', id: '' });

  useEffect(() => {
    setFiltered(subscribers);
  }, [subscribers]);

  const handleAddSubscriber = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const handleSave = () => {
    const { name, phone, job, id } = newSub;
    if (!name) return showNote('يرجى إدخال الاسم');
    if (!/^01[0-9]{9}$/.test(phone)) return showNote('يرجى إدخال رقم محمول صحيح مكوّن من 11 رقم ويبدأ بـ 01');
    if (!job) return showNote('يرجى إدخال المسمى الوظيفي');
    if (!/^[0-9]{14}$/.test(id)) return showNote('يرجى إدخال رقم قومي صحيح مكوّن من 14 رقم');

    setSubscribers([...subscribers, { name, phone, status: 'متاحة' }]);
    setNewSub({ name: '', phone: '', job: '', id: '' });
    setShowPopup(false);
  };

  const showNote = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const filterByName = () => {
    setFiltered(subscribers.filter(s => s.name.includes(nameInput)));
    setShowFilterMenu(false);
    setShowNameFilter(false);
  };

  const filterByStatus = (status) => {
    setFiltered(subscribers.filter(s => s.status === status));
    setShowFilterMenu(false);
    setShowStatusFilter(false);
  };

  return (
    <div className="container text-right">
      <div className="header">
        <div className="actions">
          <button onClick={handleAddSubscriber}>➕ إضافة مشترك</button>
          <button onClick={() => setShowFilterMenu(!showFilterMenu)}>🔽 فلتر</button>
          <button onClick={() => setFiltered(subscribers)}>🔄 تحديث</button>
        </div>
        <div className="total">إجمالي المشتركين <span>{filtered.length}</span></div>
      </div>

      {showFilterMenu && (
        <div className="filter-menu">
          <div onClick={() => { setShowNameFilter(!showNameFilter); setShowStatusFilter(false); }}>الاسم</div>
          <div onClick={() => { setShowStatusFilter(!showStatusFilter); setShowNameFilter(false); }}>الحالة</div>
        </div>
      )}

      {showNameFilter && (
        <div className="filter-input">
          <input type="text" placeholder="أدخل الاسم" value={nameInput} onChange={e => setNameInput(e.target.value)} />
          <button onClick={filterByName}>بحث</button>
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
            <th>رقم الهاتف</th>
            <th>حالة الاشتراك</th>
            <th>اسم المشترك</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((sub, i) => (
            <tr key={i}>
              <td>≡</td>
              <td>{sub.phone}</td>
              <td><span className="status-active">{sub.status}</span></td>
              <td>{sub.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>إضافة مشترك جديد</h2>
            {notification && <div className="notification">{notification}</div>}
            <div className="form-grid">
              <div>
                <label>رقم المحمول</label>
                <input type="text" value={newSub.phone} onChange={e => setNewSub({ ...newSub, phone: e.target.value })} />
              </div>
              <div>
                <label>الاسم</label>
                <input type="text" value={newSub.name} onChange={e => setNewSub({ ...newSub, name: e.target.value })} />
              </div>
              <div>
                <label>المسمى الوظيفي</label>
                <input type="text" value={newSub.job} onChange={e => setNewSub({ ...newSub, job: e.target.value })} />
              </div>
              <div>
                <label>الرقم القومي</label>
                <input type="text" value={newSub.id} onChange={e => setNewSub({ ...newSub, id: e.target.value })} />
              </div>
            </div>
            <button onClick={handleSave}>حفظ</button>
          </div>
        </div>
      )}
    </div>
  );
};