import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [qrId, setQrId] = useState(uuidv4()); // ID unik untuk QR
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  // Cek URL parameter untuk menampilkan form (setelah scan QR)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scannedQrId = urlParams.get('idQR');
    if (scannedQrId) {
      setQrId(scannedQrId);
      setShowForm(true);
    }
  }, []);

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { idQR: qrId, id, fullName };
    
    try {
      const response = await fetch('YOUR_APPS_SCRIPT_URL', { // Ganti dengan URL Apps Script Anda
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setMessage('Data berhasil disimpan!');
        // Generate QR baru
        setQrId(uuidv4());
        setShowForm(false);
        setId('');
        setFullName('');
        // Reset URL (opsional)
        window.history.replaceState(null, null, window.location.pathname);
      } else {
        setMessage('Gagal menyimpan data.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="app">
      <h1>Cafe Visit Logger</h1>
      {!showForm ? (
        <div className="qr-section">
          <p>Scan QR Code untuk mencatat kunjungan:</p>
          <QRCode value={`${window.location.origin}?idQR=${qrId}`} />
          <p>ID QR: {qrId}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <label>
            ID:
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
          </label>
          <label>
            Nama Lengkap:
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
