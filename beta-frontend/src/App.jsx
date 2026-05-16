import { useState, useEffect } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    asset_name: '',
    serial_number: '',
    ip_address: '',
    department: 'IT Stockroom'
  });
  const [assets, setAssets] = useState([]);

  // API Get Pipeline - Read entries from our backend on port 5001
  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:5001/assets');
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      }
    } catch (err) {
      console.error("Failed to read database asset stream:", err);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // API Post Pipeline - Send new asset logs to port 5001
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Success: Hardware asset logged securely into beta_db registry.");
        setFormData({ asset_name: '', serial_number: '', ip_address: '', department: 'IT Stockroom' });
        fetchAssets(); // Refresh table dynamically
      } else {
        alert("Server validation error: Check for duplicate Serial Numbers.");
      }
    } catch (err) {
      alert("Network Connection Error: Ensure your node server is running on port 5001.");
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', backgroundColor: '#f0f4f8', minHeight: '100vh', color: '#102a43' }}>
      <h2>Project Beta: Enterprise IT Asset Management</h2>
      <p style={{ color: '#486581' }}>Network Port 5001 Integration State: <span style={{ color: 'green', fontWeight: 'bold' }}>ACTIVE</span></p>

      {/* Corporate Asset Logging Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '30px auto', padding: '25px', border: '1px solid #bcccdc', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#334e68', fontSize: '13pt' }}>Log Corporate Hardware Asset</h3>
        
        <input type="text" placeholder="Asset Name (e.g., MNP-Calgary-Laptop-02)" value={formData.asset_name} onChange={(e) => setFormData({...formData, asset_name: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #bac7d5' }} />
        <input type="text" placeholder="Serial Number (Unique ID)" value={formData.serial_number} onChange={(e) => setFormData({...formData, serial_number: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #bac7d5' }} />
        <input type="text" placeholder="IP Address Allocation" value={formData.ip_address} onChange={(e) => setFormData({...formData, ip_address: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #bac7d5' }} />
        
        <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #bac7d5', backgroundColor: 'white' }}>
          <option value="IT Stockroom">IT Stockroom</option>
          <option value="Infrastructure Operations">Infrastructure Operations</option>
          <option value="Finance & Accounting">Finance & Accounting</option>
          <option value="Client Helpdesk Services">Client Helpdesk Services</option>
        </select>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#102a43', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Register Asset</button>
      </form>

      {/* Live System Grid View Dashboard */}
      <div style={{ maxWidth: '750px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #bcccdc', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#102a43', marginTop: 0, fontSize: '12pt' }}>Active Network Inventory Core</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '9.5pt' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '2px solid #bcccdc' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>System ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Asset Tag Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Serial Number</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>IP Address</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Assigned Dept</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eceff1' }}>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#627d98' }}>#{item.id}</td>
                <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>{item.asset_name}</td>
                <td style={{ padding: '12px', textAlign: 'left', fontFamily: 'monospace' }}>{item.serial_number}</td>
                <td style={{ padding: '12px', textAlign: 'left', color: '#243b53' }}>{item.ip_address}</td>
                <td style={{ padding: '12px', textAlign: 'left' }}><span style={{ backgroundColor: '#dceefb', color: '#0b69a3', padding: '4px 8px', borderRadius: '12px', fontSize: '8pt', fontWeight: 'bold' }}>{item.department}</span></td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '30px', color: '#627d98', fontStyle: 'italic' }}>No registered assets loaded in the current database instance.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
