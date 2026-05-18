import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {

  const backendUrl = 'https://beta-backend-apis.onrender.com/api/assets'; 

  const [formData, setFormData] = useState({
    assetName: '',
    serialNumber: '',
    status: 'Active'
  });
  
  const [assets, setAssets] = useState([]);

  // Fetch data from the database as soon as the page loads
  const fetchAssets = async () => {
    try {
      const response = await fetch(backendUrl);
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Asset successfully registered! 🚀');
        setFormData({ assetName: '', serialNumber: '', status: 'Active' });
        fetchAssets(); // Instantly refreshes the table with your new data
      } else {
        alert('Failed to register asset. Check server logs.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network Error. Is your backend link correct?');
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>Register New Asset</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Asset Name</label>
            <input type="text" name="assetName" placeholder="e.g. Dell XPS 15" value={formData.assetName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Serial Number</label>
            <input type="text" name="serialNumber" placeholder="e.g. SN-987654321" value={formData.serialNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Deployment Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="In Repair">In Repair</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>
          <button type="submit">Deploy Asset</button>
        </form>
      </div>

      <div className="card">
        <h2>Active Asset Registry</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Serial Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.asset_name}</td>
                  <td>{asset.serial_number}</td>
                  <td>{asset.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8' }}>
                  No assets found in the database yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;