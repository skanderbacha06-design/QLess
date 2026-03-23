import Head from 'next/head'
import { useState } from 'react'

const spinnerStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes blink {
    0%, 20% { opacity: 0; }
    50% { opacity: 1; }
    80%, 100% { opacity: 0; }
  }
  
  .scanner-logo {
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
    margin: 2rem auto;
  }
  
  .scanner-text {
    color: #000;
    font-weight: 600;
    margin-top: 1.5rem;
    font-size: 1.2rem;
  }
  
  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 4px;
    background: #000;
    border-radius: 50%;
  }
  
  .dot:nth-child(1) {
    animation: blink 1.4s infinite;
  }
  
  .dot:nth-child(2) {
    animation: blink 1.4s infinite 0.2s;
  }
  
  .dot:nth-child(3) {
    animation: blink 1.4s infinite 0.4s;
  }
`

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [isUnrecognized, setIsUnrecognized] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setIsUnrecognized(false);
    scanNFC(setIsScanning, setIsUnrecognized);
  };

  const handleRetry = () => {
    setIsUnrecognized(false);
    handleScan();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Head>
        <title>RFID/NFC Tag Scanner</title>
        <meta name="description" content="Scan RFID/NFC tags" />
        <link rel="icon" href="/favicon.ico" />
        <style>{spinnerStyles}</style>
      </Head>

      {/* Scanning State */}
      {isScanning && !isUnrecognized && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%'
        }}>
          <img src="/Qlogo.png" alt="Scanning" className="scanner-logo" />
          <div className="scanner-text">
            Scanning
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      )}

      {/* Unrecognized State */}
      {isUnrecognized && (
        <div style={{
          background: '#fff',
          borderRadius: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          padding: '3rem 2rem',
          maxWidth: '32rem',
          width: '100%',
          textAlign: 'center',
          border: '2px solid #000'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '1rem'
          }}>Unrecognized RFID/NFC Tag</h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem'
          }}>Please try again</p>

          <button 
            onClick={handleRetry} 
            style={{
              width: '100%',
              background: '#000',
              color: 'white',
              fontWeight: '700',
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => e.target.style.background = '#333'}
            onMouseOut={(e) => e.target.style.background = '#000'}
          >
            Scan RFID/NFC Tag
          </button>
        </div>
      )}

      {/* Initial State */}
      {!isScanning && !isUnrecognized && (
        <div style={{
          background: '#fff',
          borderRadius: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          padding: '3rem 2rem',
          maxWidth: '32rem',
          width: '100%',
          textAlign: 'center',
          border: '2px solid #000'
        }}>
          {/* Large Logo */}
          <div style={{ marginBottom: '2rem' }}>
            <img src="/logo.png" alt="Logo" style={{
              width: '140px',
              height: '140px',
              margin: '0 auto',
              display: 'block'
            }} />
          </div>

          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '0.5rem',
            letterSpacing: '-0.5px'
          }}>RFID/NFC Tag Scanner</h1>
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1rem' }}>Scan your tag to get started</p>

          <button 
            onClick={handleScan} 
            style={{
              width: '100%',
              background: '#000',
              color: 'white',
              fontWeight: '700',
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '2rem',
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => e.target.style.background = '#333'}
            onMouseOut={(e) => e.target.style.background = '#000'}
          >
            Scan RFID/NFC Tag
          </button>

          <div id="result" style={{
            color: '#000',
            background: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            minHeight: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'pre-line',
            border: '1px solid #ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}></div>
        </div>
      )}
    </div>
  )
}

function scanNFC(setIsScanning, setIsUnrecognized) {
  if ('NDEFReader' in window) {
    const ndef = new NDEFReader();
    
    ndef.scan().then(() => {
      ndef.onreading = event => {
        const decoder = new TextDecoder();
        let isRecognized = false;
        
        for (const record of event.message.records) {
          console.log("Record type:  " + record.recordType);
          console.log("MIME type:    " + record.mediaType);
          console.log("Record id:    " + record.id);
          try {
            const decodedData = decoder.decode(record.data);
            if (decodedData && decodedData.trim() !== '') {
              isRecognized = true;
              console.log("Recognized tag:", decodedData);
            }
          } catch (e) {
            // Tag not recognized
          }
        }
        
        setIsScanning(false);
        if (!isRecognized) {
          setIsUnrecognized(true);
        }
      };
    }).catch(error => {
      setIsScanning(false);
      console.log(`Error! Scan failed to start: ${error}.`);
    });
  } else {
    alert('Web NFC is not supported on this device/browser.');
    setIsScanning(false);
  }
}