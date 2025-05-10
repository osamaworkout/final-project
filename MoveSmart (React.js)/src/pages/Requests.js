import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Assets/Styles/RequestsPage.css";
import api from "../services/api";


const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [viewMy, setViewMy] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [viewMy]);

  const fetchRequests = async () => {
    try {
      const endpoint = viewMy
        ? "https://api.com/api/myRequests"
        : "https://api.com/api/requests";

      const res = await axios.get(endpoint);
      const data = res.data;

      const mapped = data.map((r) => ({
        ...r,
        badgeClass:
          r.status === "مقبول"
            ? "badge-accepted"
            : r.status === "مرفوض"
            ? "badge-rejected"
            : "badge-pending",
      }));

      setRequests(mapped);
    } catch (err) {
      console.error("فشل تحميل البيانات:", err);
    }
  };

  const filterByExactDate = (date) => {
    setRequests((prev) => prev.filter((r) => r.date === date));
    hideFilterMenu();
  };

  const filterByStatus = (status) => {
    if (!status) return;
    setRequests((prev) => prev.filter((r) => r.status === status));
    hideFilterMenu();
  };

  const hideFilterMenu = () => {
    setFilterOpen(false);
    setShowDateInput(false);
    setShowStatusOptions(false);
  };

  return (
    <div className="requests-container">
      <div
        className="flex-between"
        style={{ marginBottom: "16px", position: "relative" }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="button secondary" onClick={() => setViewMy(false)}>
            الطلبات المقدمة
          </button>
          <button className="button secondary" onClick={() => setViewMy(true)}>
            طلباتي
          </button>
        </div>
        <div style={{ display: "flex", gap: "8px", position: "relative" }}>
          <button className="button" onClick={() => setFilterOpen(!filterOpen)}>
            🔍 <span>فلتر</span>
          </button>
          <button className="button" onClick={fetchRequests}>
            🔄 <span>تحديث</span>
          </button>

          {filterOpen && (
            <div className="dropdown">
              <button onClick={() => setShowDateInput(true)}>
                حسب التاريخ
              </button>
              <br />
              {showDateInput && (
                <input
                  type="date"
                  onChange={(e) => filterByExactDate(e.target.value)}
                />
              )}
              <button onClick={() => setShowStatusOptions(true)}>
                حسب الحالة
              </button>
              {showStatusOptions && (
                <select onChange={(e) => filterByStatus(e.target.value)}>
                  <option value="">اختر الحالة</option>
                  <option value="مقبول">مقبول</option>
                  <option value="مرفوض">مرفوض</option>
                  <option value="قيد الانتظار">قيد الانتظار</option>
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {requests.map((req) => (
          <div
            key={req.id}
            className="card"
            onClick={() => setSelectedRequest(req)}
          >
            <span>{req.id}</span>
            <span>{req.date}</span>
            {!viewMy && <span>{req.sender}</span>}
            <span className={`badge ${req.badgeClass}`}>{req.status}</span>
          </div>
        ))}
      </div>

      {selectedRequest && (
        <div className="popup">
          <div className="popup-content">
            <h2 className="text-gray-600 text-sm">اسم الطلب</h2>
            <p>{selectedRequest.date}</p>
            <h3>رقم المسلسل</h3>
            <p>{selectedRequest.id}</p>
            <h4>اسم الشخص</h4>
            <div
              style={{ borderTop: "1px solid #ccc", margin: "16px 0" }}
            ></div>
            <div className="flex-between" style={{ textAlign: "right" }}>
              <div>
                <p>القطعة: اسم القطعة</p>
                <p>الوصف: وصف القطعة</p>
                <p>الكمية: الكمية</p>
              </div>
              <div>
                <p>الحالة:</p>
                <span className={`badge ${selectedRequest.badgeClass}`}>
                  {selectedRequest.status}
                </span>
              </div>
            </div>
            <div className="flex-between" style={{ marginTop: "16px" }}>
              <button
                className="button-accepted"
                onClick={() => setSelectedRequest(null)}
              >
                موافقة
              </button>
              <button
                className="button-rejected"
                onClick={() => setSelectedRequest(null)}
              >
                رفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
