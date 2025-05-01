import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Assets/Styles/Roles/role3.css'

const role3Card = ({ title, icon, data }) => (
  <div className="role3-card">
    <div className="header">
      <img className="icon" src={icon} alt={`${title} icon`} />
      <h2>{title}</h2>
    </div>
    <div className="card-content">
      {data.map((item, index) => (
        <div key={index} className="item">
          <span className="value">{item.value}</span>
          <span className="label">{item.name}</span>
        </div>
      ))}
    </div>
  </div>
);

// Main role3 Component
const role3 = () => {
  const [carData, setCarData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Fetch data using axios
    const fetchData = async () => {
      try {
        const carResponse = await axios.get('/api/carData');
        setCarData(carResponse.data);

        const driverResponse = await axios.get('/api/driverData');
        setDriverData(driverResponse.data);

        const reportResponse = await axios.get('/api/reportData');
        setReportData(reportResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="role3">
      <div className="cards-container">
        <role3Card title="Driver Overview" icon="external-link0.svg" data={driverData} />
        <role3Card title="Car Overview" icon="external-link1.svg" data={carData} />
      </div>
      <div className="fuel-usage-cards">
        <role3Card title="Reports" icon="external-link2.svg" data={reportData} />
        <role3Card title="Patrols" icon="external-link3.svg" data={reportData} />
        <role3Card title="Requests" icon="external-link4.svg" data={reportData} />
      </div>
      <div className="top-bar">
        <div className="time-refresh">
          <span>Updated 0 minutes ago</span>
          <img src="tabler-icon-reload.svg" alt="reload icon" />
        </div>
        <h1>Welcome, Mr. role3!</h1>
      </div>
    </div>
  );
};

export default role3;