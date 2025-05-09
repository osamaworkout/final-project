import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../Assets/Styles/driverDetails.css";

const DriverManagement = () => {
  const { driverID } = useParams(); // استقبل الـ ID من URL
  const [driverData, setDriverData] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [activeTab, setActiveTab] = useState("driver-info");
  const [showModal, setShowModal] = useState(false);
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");

  useEffect(() => {
    fetchDriverData();
    fetchDriverOrders();
    fetchDriverVacations();
  }, []);

  const fetchDriverData = async () => {
    try {
      const response = await api.get(`Drivers/ByID/${driverID}`);
      setDriverData(response.data);
    } catch (error) {
      console.error("Error fetching driver data", error);
    }
  };

  const fetchDriverOrders = async () => {
    try {
      const response = await api.get(`/WorkOrder/DriverWorkOrders/${driverID}`);
      setWorkOrders(response.data);
    } catch (error) {
      console.error("Error fetching work orders", error);
    }
  };

  const fetchDriverVacations = async () => {
    try {
      const response = await api.get(`/Vacations/GetDriverVacations/${driverID}`);
      setVacations(response.data);
    } catch (error) {
      console.error("Error fetching vacations", error);
    }
  };

  const handleSave = async () => {
    try {
      await api.put("/Drivers", driverData);
      alert("✅ تم حفظ التعديلات بنجاح!");
      fetchDriverData();
    } catch (error) {
      console.error("Error saving driver data", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("⚠ هل أنت متأكد من حذف بيانات السائق؟")) {
      try {
        await api.delete(`/Drivers/ByID/${driverID}`);
        alert("✅ تم حذف بيانات السائق!");
        window.history.back();
      } catch (error) {
        console.error("Error deleting driver", error);
      }
    }
  };

  const handleSaveVacation = async () => {
    if (!leaveFrom || !leaveTo) return alert("⚠ يرجى اختيار التواريخ!");

    try {
      const payload = {
        driverId: driverID,
        from: leaveFrom,
        to: leaveTo,
      };

      await api.post("/Vacations", payload);
      alert("✅ تم إضافة الإجازة!");
      fetchDriverVacations();
      setShowModal(false);
      setLeaveFrom("");
      setLeaveTo("");
    } catch (error) {
      console.error("Error saving vacation", error);
    }
  };

  const handleDeleteVacation = async (vacationID) => {
    try {
      await api.delete(`/Vacations/${vacationID}`);
      alert("✅ تم حذف الإجازة!");
      fetchDriverVacations();
    } catch (error) {
      console.error("Error deleting vacation", error);
    }
  };

  if (!driverData) return <div>جارٍ التحميل...</div>;

  return (
    <div className="container">
      {/* باقي الكود كما هو، فقط استبدل جدول أوامر الشغل وجدول الإجازات بالبيانات من API */}
      {activeTab === "work-history" && (
        <div className="tab-content" id="work-history">
          <table className="orders-table">
            <thead>
              <tr>
                <th>السيارة</th>
                <th>التاريخ</th>
                <th>الوقت</th>
                <th>الرحلة</th>
                <th>KM/المسافة</th>
                <th>رقم أمر الشغل</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.carName}</td>
                  <td>{order.date}</td>
                  <td>{order.time}</td>
                  <td>{order.destination}</td>
                  <td>{order.distance}</td>
                  <td>{order.workOrderNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "vacation-record" && (
        <div className="tab-content" id="vacation-record">
          <table className="vacation-table">
            <thead>
              <tr>
                <th>من</th>
                <th>إلى</th>
                <th>الفترة بالأيام</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {vacations.map((vac, index) => (
                <tr key={index}>
                  <td>{vac.from}</td>
                  <td>{vac.to}</td>
                  <td>{vac.days} أيام</td>
                  <td>
                    <button className="delete-vacation-btn" onClick={() => handleDeleteVacation(vac.id)}>🗑 حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* مودال الإجازة زي ما هو */}
    </div>
  );
};

export default DriverManagement;
