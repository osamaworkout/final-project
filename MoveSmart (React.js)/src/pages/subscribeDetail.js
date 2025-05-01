import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Assets/Styles/subscribeDetail.css';

const EmployeeSubscription = () => {
    const [employeeData, setEmployeeData] = useState({
        name: "",
        phone: "",
        nationalId: "",
        jobTitle: "",
        subscriptions: []
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSubscription, setNewSubscription] = useState({
        courseNumber: "",
        startTime: "",
        duration: "",
        carNumber: "",
        subscriptionStatus: "مشترك"
    });

    useEffect(() => {
        const loadEmployeeData = async () => {
            const employeeId = localStorage.getItem('selectedEmployeeId');
            if (!employeeId) {
                console.error('لم يتم تحديد موظف');
                return;
            }

            try {
                const response = await axios.get(`https://your-api.com/employees/${employeeId}`);
                setEmployeeData(response.data);
            } catch (error) {
                console.error('Error:', error);
                alert('حدث خطأ أثناء جلب بيانات الموظف');
            }
        };

        loadEmployeeData();
    }, []);

    const updateEmployeeInfo = () => {
        setEmployeeData({
            ...employeeData,
            name: document.querySelector('input[name="employeeName"]').value,
            phone: document.querySelector('input[name="employeePhone"]').value,
            nationalId: document.querySelector('input[name="employeeNationalId"]').value,
            jobTitle: document.querySelector('input[name="employeeJobTitle"]').value,
        });
    };

    const renderSubscriptions = () => {
        return employeeData.subscriptions.length === 0
            ? <div className="no-subscriptions">لا يوجد اشتراكات مسجلة</div>
            : employeeData.subscriptions.map((sub, index) => (
                <div key={index} className="subscription-item">
                    <div>{sub.courseNumber || '-'}</div>
                    <div>{formatDateTime(sub.startTime) || '-'}</div>
                    <div>{sub.duration || '-'}</div>
                    <div>{sub.carNumber || '-'}</div>
                    <div className={`status-cell ${sub.status === 'مشترك' ? 'subscribed' : 'not-subscribed'}`}>
                        {sub.status || 'غير مشترك'}
                    </div>
                </div>
            ));
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "غير محدد";
        const date = new Date(dateTimeString);
        return date.toLocaleString('ar-EG');
    };

    const handleSaveEmployeeData = () => {
        localStorage.setItem("employeeData", JSON.stringify(employeeData));
        alert("✅ تم حفظ البيانات بنجاح");
    };

    const handleAddNewSubscription = () => {
        const { courseNumber, startTime, duration, carNumber, subscriptionStatus } = newSubscription;
        if (!courseNumber || !startTime || !duration || !carNumber) {
            alert("⚠ يرجى ملء جميع الحقول");
            return;
        }

        const updatedEmployeeData = {
            ...employeeData,
            subscriptions: [...employeeData.subscriptions, newSubscription]
        };
        setEmployeeData(updatedEmployeeData);
        localStorage.setItem("employeeData", JSON.stringify(updatedEmployeeData));
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubscription({
            ...newSubscription,
            [name]: value
        });
    };

    return (
        <div className="container">
            <div className="top-section">
                <div className="driver-container">
                    <h2 className="driver-title">إدارة اشتراكات الموظفين</h2>
                    <div className="driver-info">
                        <img src="/img/user-icon.svg" alt="صورة الموظف" className="profile-pic" />
                        <div className="driver-details-container">
                            <h2 id="employee-name">{employeeData.name || "غير محدد"}</h2>
                            <p id="employee-phone" className="driver-details">رقم الهاتف: {employeeData.phone || "غير متوفر"}</p>
                            <p id="employee-department" className="driver-details">القسم: غير محدد</p>
                        </div>
                    </div>
                </div>

                <div className="left-side">
                    <button className="back-btn" onClick={() => window.history.back()}>⬅ رجوع</button>
                    <div className="actions">
                        <button className="print-btn" onClick={() => window.print()}>🖨 طباعة</button>
                        <button className="add-subscription-btn" onClick={() => setIsModalOpen(true)}>➕ إضافة اشتراك</button>
                        <button className="delete-btn" onClick={() => {
                            if (confirm("⚠ هل أنت متأكد من حذف بيانات الموظف؟")) {
                                localStorage.removeItem("employeeData");
                                setEmployeeData({
                                    name: "",
                                    phone: "",
                                    nationalId: "",
                                    jobTitle: "",
                                    subscriptions: []
                                });
                                alert("✅ تم حذف البيانات بنجاح");
                            }
                        }}>🗑 حذف</button>
                    </div>
                </div>
            </div>

            <div className="tabs-container">
                <div className="tabs">
                    <button className="tab active" data-tab="employee-info">معلومات الموظف</button>
                    <button className="tab" data-tab="subscriptions-info">الاشتراكات</button>
                </div>
                <button className="save-btn" onClick={handleSaveEmployeeData}>✅ حفظ</button>
            </div>

            <div className="tab-content" id="employee-info">
                <div className="form-container">
                    <div className="input-group">
                        <label>اسم الموظف:</label>
                        <input type="text" name="employeeName" placeholder="أدخل اسم الموظف" />
                    </div>
                    <div className="input-group">
                        <label>رقم الهاتف:</label>
                        <input type="tel" name="employeePhone" placeholder="أدخل رقم الهاتف" />
                    </div>
                    <div className="input-group">
                        <label>الرقم القومي:</label>
                        <input type="text" name="employeeNationalId" placeholder="أدخل الرقم القومي" />
                    </div>
                    <div className="input-group">
                        <label>المسمى الوظيفي:</label>
                        <input type="text" name="employeeJobTitle" placeholder="أدخل المسمى الوظيفي" />
                    </div>
                </div>
            </div>

            <div className="tab-content" id="subscriptions-info" style={{ display: 'none' }}>
                <div className="subscriptions-list">
                    <div className="subscription-header">
                        <div>رقم الدورات</div>
                        <div>وقت البدء</div>
                        <div>الوقت المستغرق</div>
                        <div>رقم السيارة</div>
                        <div>حالة الاشتراك</div>
                    </div>

                    <div className="subscription-items">
                        {renderSubscriptions()}
                    </div>
                </div>
            </div>

            <div id="subscription-modal" className="modal" style={{ display: isModalOpen ? 'flex' : 'none' }}>
                <div className="modal-content">
                    <span className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</span>
                    <h3>إضافة اشتراك جديد</h3>
                    <div className="modal-form">
                        <div className="input-group">
                            <label>رقم الدورات:</label>
                            <input type="text" name="courseNumber" value={newSubscription.courseNumber} onChange={handleInputChange} placeholder="أدخل رقم الدورات" />
                        </div>
                        <div className="input-group">
                            <label>وقت البدء:</label>
                            <input type="datetime-local" name="startTime" value={newSubscription.startTime} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label>الوقت المستغرق:</label>
                            <input type="text" name="duration" value={newSubscription.duration} onChange={handleInputChange} placeholder="أدخل الوقت المستغرق" />
                        </div>
                        <div className="input-group">
                            <label>رقم السيارة:</label>
                            <input type="text" name="carNumber" value={newSubscription.carNumber} onChange={handleInputChange} placeholder="أدخل رقم السيارة" />
                        </div>
                        <div className="input-group">
                            <label>حالة الاشتراك:</label>
                            <select name="subscriptionStatus" value={newSubscription.subscriptionStatus} onChange={handleInputChange}>
                                <option value="مشترك">مشترك</option>
                                <option value="غير مشترك">غير مشترك</option>
                            </select>
                        </div>
                        <button id="save-subscription-btn" className="save-btn" onClick={handleAddNewSubscription}>حفظ الاشتراك</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSubscription;
