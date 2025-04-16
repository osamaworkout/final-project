import { useState } from "react";
import { Button } from "@mui/material";
import { Card } from "@mui/material";
import { Filter, RefreshCw } from "lucide-react";

const allRequests = [
  { id: 1, sender: "Ahmed", date: "2024-02-15", status: "مقبول", color: "bg-green-400" },
  { id: 2, sender: "Sara", date: "2024-02-14", status: "مرفوض", color: "bg-red-400" },
  { id: 3, sender: "Ali", date: "2024-02-13", status: "قيد الانتظار", color: "bg-yellow-400" },
  { id: 4, sender: "Omar", date: "2024-02-12", status: "مقبول", color: "bg-green-400" },
  { id: 5, sender: "Nada", date: "2024-02-11", status: "مقبول", color: "bg-green-400" },
  { id: 6, sender: "Yousef", date: "2024-02-10", status: "مقبول", color: "bg-green-400" },
];

const myRequests = [
  { id: 7, date: "2024-02-09", status: "مقبول", color: "bg-green-400" },
  { id: 8, date: "2024-02-08", status: "مرفوض", color: "bg-red-400" },
  { id: 9, date: "2024-02-07", status: "قيد الانتظار", color: "bg-yellow-400" },
];

export default function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [viewMyRequests, setViewMyRequests] = useState(null);

  const refreshRequests = () => {
    setRequests(viewMyRequests ? [...myRequests] : [...allRequests]);
  };

  const filterRequests = () => {
    const filtered = (viewMyRequests ? myRequests : allRequests).filter(req => req.status !== "مقبول");
    setRequests(filtered);
  };

  const showAllRequests = () => {
    setViewMyRequests(false);
    setRequests([...allRequests]);
  };

  const showMyRequests = () => {
    setViewMyRequests(true);
    setRequests([...myRequests]);
  };

  return (
    <div className="p-4">
      {/* Header Buttons */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-1" onClick={filterRequests}>
            <Filter className="w-4 h-4" /> <span>Filters</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-1" onClick={refreshRequests}>
            <RefreshCw className="w-4 h-4" /> <span>تحديث</span>
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={showAllRequests}>الطلبات المقدمة</Button>
          <Button variant="secondary" onClick={showMyRequests}>طلباتي</Button>
        </div>
      </div>
      
      {/* Request List */}
      {viewMyRequests !== null && (
        <div className="space-y-2">
          {requests.map((request) => (
            <Card key={request.id} className="p-4 flex justify-between items-center">
              <span>رقم المسلسل: {request.id}</span>
              <span>تاريخ الطلب: {request.date}</span>
              {!viewMyRequests && <span>مين اللي بعت الطلب: {request.sender}</span>}
              <span className={`px-3 py-1 text-white rounded-full ${request.color}`}>{request.status}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
