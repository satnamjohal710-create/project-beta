import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure this matches the name of your CSS file!

function App() {
  // 1. State to hold our form data
  const [formData, setFormData] = useState({
    assetName: '',
    serialNumber: '',
    status: 'Active'
  });

  // 2. State to hold the list of assets from the database
  const [assets, setAssets] = useState([]);

  // 3. Handle typing in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle hitting the Submit button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    // NOTE: Replace this URL with your actual Render Backend URL!
    // Example: 'https://beta-backend-api.onrender.com/api/assets'
    const backendUrl = 'http://localhost:5001/api/assets'; 

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Asset successfully registered!');
        // Clear the form after success
        setFormData({ assetName: '', serialNumber: '', status: 'Active' });
        // You would typically re-fetch your assets here
      } else {
        alert('Failed to register asset.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network Error. Is your backend running?');
    }
  };

  return (
    <div className="app-container">
      
      {/* --- FORM SECTION --- */}
      <div className="card">
        <h2>Register New Asset</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Asset Name</label>
            <input 
              type="text" 
              name="assetName"
              placeholder="e.g. Dell XPS 15" 
              value={formData.assetName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Serial Number</label>
            <input 
              type="text" 
              name="serialNumber"
              placeholder="e.g. SN-987654321" 
              value={formData.serialNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Deployment Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="In Repair">In Repair</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>

          <button type="submit">Deploy Asset</button>
        </form>
      </div>

      {/* --- DATABASE TABLE SECTION --- */}
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
            {/* Hardcoded example data so you can see the CSS layout instantly */}
            <tr>
              <td>MacBook Pro M3</td>
              <td>AAPL-100293</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>ThinkPad T14</td>
              <td>LEN-882736</td>
              <td>In Repair</td>
            </tr>
            
            {/* Once your GET request is working, you will map your dynamic database data here like this:
            {assets.map((asset, index) => (
              <tr key={index}>
                <td>{asset.assetName}</td>
                <td>{asset.serialNumber}</td>
                <td>{asset.status}</td>
              </tr>
            ))} 
            */}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;