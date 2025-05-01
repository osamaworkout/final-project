import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Assets/Styles/jobOrder.css';

const JobOrder = () => {
    const [carData, setCarData] = useState({
        carNumber: '',
        carBrand: '',
        carModel: '',
        carType: '',
        driverCondition: '',
        hospital: '',
        fuelType: '',
        driverName: '',
        driverPhone: '',
        totalKm: 0,
        totalFuel: 0
    });
    
    const [orderModalVisible, setOrderModalVisible] = useState(false);
    const [newOrder, setNewOrder] = useState({
        orderDate: '',
        orderType: '',
        orderDesc: ''
    });

    useEffect(() => {
        loadCarData();
    }, []);

    const loadCarData = async () => {
        try {
            const response = await axios.get('carData.json');
            const data = response.data;
            if (data) {
                setCarData({
                    ...data,
                    totalKm: data.totalKm || 0,
                    totalFuel: data.totalFuel || 0
                });
            }
        } catch (error) {
            console.error('Error loading car data:', error);
        }
    };

    const saveOrderToDatabase = async (orderData) => {
        try {
            const response = await axios.post('api/saveOrder', orderData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                console.log('Order saved successfully:', orderData);
                return true;
            } else {
                console.error('Failed to save order:', response.data.message);
                return false;
            }
        } catch (error) {
            console.error('Error saving order:', error);
            return false;
        }
    };

    const handleOrderFormChange = (e) => {
        const { name, value } = e.target;
        setNewOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value
        }));
    };

    const handleAddOrderClick = () => {
        setOrderModalVisible(true);
    };

    const handleCloseModal = () => {
        setOrderModalVisible(false);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        const orderData = {
            orderNumber: generateOrderNumber(),
            date: newOrder.orderDate,
            type: newOrder.orderType,
            description: newOrder.orderDesc,
            status: 'قيد التنفيذ',
            carId: carData.carNumber,
            createdAt: new Date().toISOString()
        };

        const isSaved = await saveOrderToDatabase(orderData);

        if (isSaved) {
            setOrderModalVisible(false);
            setNewOrder({ orderDate: '', orderType: '', orderDesc: '' });
            alert('تم حفظ أمر الشغل بنجاح في قاعدة البيانات!');
        } else {
            alert('حدث خطأ أثناء حفظ الأمر!');
        }
    };

    const generateOrderNumber = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `ORD-${year}${month}${day}-${Math.floor(1000 + Math.random() * 9000)}`;
    };

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="container">
            {/* الجزء العلوي */}
            <div className="top-section">
                <div className="car-container">
                    <h2 className="car-title">أوامر الشغل</h2>
                    <div className="car-info">
                        <img src="/img/AdobeStock_346839683_Preview.jpg" alt="صورة السيارة" className="profile-pic" />
                        <div className="info-boxes">
                            <div className="km-box">
                                <p>إجمالي الكيلومترات: <span id="total-km">{carData.totalKm} KM</span></p>
                            </div>
                            <div className="fuel-box">
                                <p>إجمالي الوقود المستخدم: <span id="total-fuel">{carData.totalFuel} لتر</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="left-side">
                    <button className="back-btn" onClick={handleBack}>⬅ رجوع</button>
                    <div className="actions">
                        <button className="print-btn" onClick={handlePrint}>🖨 طباعة</button>
                        <button className="report-btn">📄 تقرير</button>
                    </div>
                </div>
            </div>

            <div className="tabs-container">
                <div className="tabs">
                    <button className="tab active" data-tab="car-info">التفاصيل</button>
                </div>
                <button className="add-order-btn" onClick={handleAddOrderClick}>➕ إضافة أمر شغل</button>
            </div>

            {/* معلومات السيارة */}
            <div className="tab-content" id="car-info" style={{ display: 'block' }}>
                <div className="form-container">
                    <div className="column">
                        <div className="input-group"><label>رقم السيارة:</label><input type="number" value={carData.carNumber} readOnly /></div>
                        <div className="input-group"><label>الماركة:</label><input type="text" value={carData.carBrand} readOnly /></div>
                        <div className="input-group"><label>الموديل:</label><input type="text" value={carData.carModel} readOnly /></div>
                        <div className="input-group"><label>نوع السيارة:</label><input type="text" value={carData.carType} readOnly /></div>
                        <div className="input-group"><label>حالة السائق:</label><input type="text" value={carData.driverCondition} readOnly /></div>
                    </div>

                    <div className="column">
                        <div className="input-group"><label>المستشفى التابعة لها:</label><input type="text" value={carData.hospital} readOnly /></div>
                        <div className="input-group"><label>نوع الوقود</label><input type="text" value={carData.fuelType} readOnly /></div>
                        <div className="input-group"><label>اسم السائق:</label><input type="text" value={carData.driverName} readOnly /></div>
                        <div className="input-group"><label>رقم الهاتف:</label><input type="tel" value={carData.driverPhone} readOnly /></div>
                    </div>
                </div>
            </div>

            {/* Modal لإضافة أمر شغل */}
            {orderModalVisible && (
                <div id="orderModal" className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={handleCloseModal}>&times;</span>
                        <h2>إضافة أمر شغل جديد</h2>
                        <form id="orderForm" onSubmit={handleSubmitOrder}>
                            <div className="form-group">
                                <label htmlFor="orderDate">تاريخ الأمر:</label>
                                <input type="date" id="orderDate" name="orderDate" value={newOrder.orderDate} onChange={handleOrderFormChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="orderType">نوع العمل:</label>
                                <select id="orderType" name="orderType" value={newOrder.orderType} onChange={handleOrderFormChange} required>
                                    <option value="">اختر نوع العمل</option>
                                    <option value="صيانة">صيانة</option>
                                    <option value="إصلاح">إصلاح</option>
                                    <option value="فحص">فحص</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="orderDesc">وصف العمل:</label>
                                <textarea id="orderDesc" name="orderDesc" rows="3" value={newOrder.orderDesc} onChange={handleOrderFormChange} required />
                            </div>
                            <button type="submit" className="submit-btn">حفظ الأمر</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobOrder;
