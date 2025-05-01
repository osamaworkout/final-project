import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Assets/Styles/Roles/role5.css'

const rold5Card = ({ title, icon, data }) => (
  <div className="role5-card">
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


const role5 = () => {
  const [carData, setCarData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
 
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
    <div className="role5">
      <div className="cards-container">
        <rold5Card title="Driver Overview" icon="external-link0.svg" data={driverData} />
        <rold5Card title="Car Overview" icon="external-link1.svg" data={carData} />
      </div>
      <div className="fuel-usage-cards">
        <rold5Card title="Reports" icon="external-link2.svg" data={reportData} />
        <rold5Card title="Patrols" icon="external-link3.svg" data={reportData} />
        <rold5Card title="Requests" icon="external-link4.svg" data={reportData} />
      </div>
      <div className="top-bar">
        <div className="time-refresh">
          <span>Updated 0 minutes ago</span>
          <img src="tabler-icon-reload.svg" alt="reload icon" />
        </div>
        <h1>Welcome, Mr. role5!</h1>
      </div>
    </div>
  );
};

export default role5;