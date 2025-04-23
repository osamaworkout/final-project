import React, { useState, useEffect } from "react";
import "../Assets/Styles/consumables.css";

const PartsPage = () => {
  const [parts, setParts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newPartData, setNewPartData] = useState({
    name: "",
    carType: "",
    code: "",
    quantity: 0,
    lifetime: 0,
    cost: 0
  });
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب البيانات من API
  const fetchParts = async () => {
    try {
      const response = await fetch('YOUR_API_URL_HERE'); // عدل الرابط هنا
      const data = await response.json();
      setParts(data);
    } catch (err) {
      console.error('حدث خطأ أثناء جلب البيانات:', err);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // تحديث قائمة القطع
  const renderPartsList = () => {
    return parts.filter(part => part.name.toLowerCase().includes(searchTerm.toLowerCase())).map((part, index) => (
      <div key={index} className="part-card">
        <input type="checkbox" onChange={() => toggleCard(index)} />
        <span>{part.name}</span>
        <button onClick={() => editPart(index)}>تعديل</button>
        <button onClick={() => deletePart(index)}>حذف</button>
      </div>
    ));
  };

  // إظهار أو إخفاء تفاصيل القطعة
  const toggleCard = (index) => {
    const card = document.getElementById(`card-${index}`);
    if (card) {
      card.remove();
    } else {
      const part = parts[index];
      const div = document.createElement('div');
      div.className = 'card';
      div.id = `card-${index}`;
      div.innerHTML = `
        <h3>${part.name}</h3>
        <div class="card-details">
          <p><strong>نوع السيارة:</strong> ${part.carType}</p>
          <p><strong>الكود:</strong> ${part.code}</p>
          <p><strong>الكمية:</strong> ${part.quantity}</p>
          <p><strong>العمر الافتراضي:</strong> ${part.lifetime} يوم</p>
          <p><strong>التكلفة:</strong> ${part.cost} جنيه</p>
        </div>
      `;
      cardsContainer.appendChild(div);
    }
  };

  // تعديل قطعة
  const editPart = (index) => {
    setEditIndex(index);
    setNewPartData(parts[index]);
    setShowPopup(true);
  };

  // حذف قطعة
  const deletePart = async (index) => {
    const confirmDelete = window.confirm('هل أنت متأكد أنك تريد حذف هذه القطعة؟');
    if (!confirmDelete) return;
    
    try {
      const part = parts[index];
      await fetch(`YOUR_API_URL_HERE/${part.id}`, { method: 'DELETE' });
      setParts(parts.filter((_, i) => i !== index));
    } catch (err) {
      console.error('فشل الحذف:', err);
    }
  };

  // حفظ البيانات الجديدة
  const handleSubmit = async () => {
    const { name, carType, code, quantity, lifetime, cost } = newPartData;
    const part = { name, carType, code, quantity, lifetime, cost };
    
    try {
      if (editIndex === null) {
        // إضافة قطعة جديدة
        await fetch('YOUR_API_URL_HERE', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(part)
        });
      } else {
        // تعديل قطعة
        const existing = parts[editIndex];
        await fetch(`YOUR_API_URL_HERE/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(part)
        });
      }
      setShowPopup(false);
      fetchParts();
    } catch (err) {
      console.error('فشل الحفظ:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPartData(prev => ({ ...prev, [name]: value }));
  };

  // البحث
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container">
      <h1 className="page-title">المستهلكات</h1>

      <div className="header">
        <h2>إجمالي المستهلكات: <span>{parts.length}</span></h2>
        <div className="actions">
          <button onClick={() => setShowPopup(true)}>➕ إضافة</button>
          <button onClick={fetchParts}>🔄 تحديث</button>
          <input
            type="text"
            id="search"
            placeholder="بحث..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="content">
        <div className="parts-list">
          {renderPartsList()}
        </div>
        <div className="cards-container" id="cardsContainer"></div>
      </div>

      {showPopup && (
        <div id="addPartPopup" className="popup">
          <div className="popup-content">
            <h3>{editIndex === null ? 'إضافة قطعة جديدة' : 'تعديل قطعة'}</h3>
            <label>اسم القطعة:</label>
            <input
              type="text"
              name="name"
              value={newPartData.name}
              onChange={handleInputChange}
            />
            <label>نوع السيارة:</label>
            <input
              type="text"
              name="carType"
              value={newPartData.carType}
              onChange={handleInputChange}
            />
            <label>الكود:</label>
            <input
              type="text"
              name="code"
              value={newPartData.code}
              onChange={handleInputChange}
            />
            <label>الكمية:</label>
            <input
              type="number"
              name="quantity"
              value={newPartData.quantity}
              onChange={handleInputChange}
            />
            <label>العمر الافتراضي (يوم):</label>
            <input
              type="number"
              name="lifetime"
              value={newPartData.lifetime}
              onChange={handleInputChange}
            />
            <label>التكلفة:</label>
            <input
              type="number"
              name="cost"
              value={newPartData.cost}
              onChange={handleInputChange}
            />
            <div className="popup-buttons">
              <button onClick={handleSubmit}>حفظ</button>
              <button onClick={() => setShowPopup(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartsPage;
