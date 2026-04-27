import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti'; // Optional: npm install react-confetti
import './PolicyReference.css';

const PolicyReference = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const paymentStatus = localStorage.getItem('paymentCompleted');

    if (paymentStatus === 'true') {
      setPaymentCompleted(true);
      setShowConfetti(true);
      // Stop confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);

      const storedReferenceNumber = localStorage.getItem('policyReferenceNumber');
      if (storedReferenceNumber) {
        setReferenceNumber(storedReferenceNumber);
      } else {
        const uniqueNumber = Math.random().toString(36).substring(2, 10).toUpperCase() + 
                             Math.random().toString(36).substring(2, 10).toUpperCase();
        localStorage.setItem('policyReferenceNumber', uniqueNumber);
        setReferenceNumber(uniqueNumber);
      }
    } else {
      setTimeout(() => navigate('/payment'), 3000);
    }
  }, [navigate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createPdfBytes = (reference) => {
    const streamContent = `BT /F1 18 Tf 50 740 Td (Insurance Policy Reference) Tj T* 0 -30 Td (Reference Number: ${reference}) Tj T* 0 -30 Td (Valid for: 1 Year) Tj ET\n`;
    const objects = [
      { id: 1, content: '<< /Type /Catalog /Pages 4 0 R >>' },
      { id: 2, content: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>' },
      { id: 3, content: `<< /Type /Page /Parent 4 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 2 0 R >> >> /Contents 5 0 R >>` },
      { id: 4, content: '<< /Type /Pages /Kids [3 0 R] /Count 1 >>' },
      { id: 5, content: `<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream` },
    ];

    let pdf = '%PDF-1.3\n';
    const offsets = [];
    let position = pdf.length;

    objects.forEach((obj) => {
      offsets.push(position);
      const objText = `${obj.id} 0 obj\n${obj.content}\nendobj\n`;
      pdf += objText;
      position += objText.length;
    });

    const xrefPos = position;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

    return new TextEncoder().encode(pdf);
  };

  const downloadPolicyPdf = () => {
    if (!referenceNumber) return;
    const pdfBytes = createPdfBytes(referenceNumber);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `policy-reference-${referenceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const emailPolicyDetails = () => {
    if (!referenceNumber) return;
    const subject = encodeURIComponent('Your Insurance Policy Reference');
    const body = encodeURIComponent(
      `Hello,%0D%0A%0D%0AHere is your policy reference number:%0D%0A${referenceNumber}%0D%0A%0D%0AThank you,%0D%0AInsurance Portal`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="policy-root">
      {showConfetti && <Confetti numberOfPieces={150} recycle={false} gravity={0.2} />}
      
      <div className="policy-container">
        {!paymentCompleted ? (
          <div className="redirect-card">
            <div className="loader-ring"></div>
            <h2>Verifying Payment...</h2>
            <p>You'll be redirected to secure payment shortly.</p>
          </div>
        ) : (
          <div className="success-wrapper animated-fade-in">
            {/* Visual Header */}
            <div className="status-badge">
              <div className="checkmark-circle">
                <i className="fa-solid fa-check"></i>
              </div>
              <h1>Success!</h1>
              <p>Your policy is now active.</p>
            </div>

            {/* The Certificate Card */}
            <div className="policy-certificate">
              <div className="cert-header">
                <i className="fa-solid fa-shield-halved"></i>
                <span>OFFICIAL POLICY REFERENCE</span>
              </div>
              
              <div className="cert-body">
                <p className="cert-label">Your unique ID for claims & renewals:</p>
                <div className="ref-display-group">
                  <span className="ref-text">{referenceNumber}</span>
                  <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copyToClipboard}>
                    <i className={copied ? "fa-solid fa-check" : "fa-solid fa-copy"}></i>
                  </button>
                </div>
                {copied && <span className="copy-toast">Copied to clipboard!</span>}
              </div>

              <div className="cert-footer">
                <div className="footer-item">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Valid for: 1 Year</span>
                </div>
                <div className="footer-item">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Status: Verified</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="action-grid">
              <div className="action-item" onClick={downloadPolicyPdf}>
                <i className="fa-solid fa-file-pdf"></i>
                <p>Download PDF</p>
              </div>
              <div className="action-item" onClick={() => window.print()}>
                <i className="fa-solid fa-print"></i>
                <p>Print Page</p>
              </div>
              <div className="action-item" onClick={emailPolicyDetails}>
                <i className="fa-solid fa-envelope"></i>
                <p>Email Me</p>
              </div>
            </div>

            <button className="finish-btn" onClick={() => navigate('/claim-form')}>
              Claim Insurance <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyReference;