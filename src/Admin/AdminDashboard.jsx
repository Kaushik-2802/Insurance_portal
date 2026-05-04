import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [settlementStatus, setSettlementStatus] = useState("Idle");
  const [claimRequests, setClaimRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [txHash, setTxHash] = useState(null);
  const navigate=useNavigate();
  
  // Detailed AI Checkpoints for the Settlement Engine
  const [aiChecks, setAiChecks] = useState({
    identity: false,
    fraudScore: false,
    ledgerSync: false
  });

  // --- Automated Response System ---
  const sendAutomatedResponse = (type, claim) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let message = "";

    if (type === "APPROVE") {
      message = `SYSTEM AUTH: Claim ${claim.id} approved. Automated payout of $4,500.00 queued for ${claim.user}.`;
    } else {
      const missing = claim.missingDocs.length > 0 ? claim.missingDocs.join(", ") : "Valid ID Scan";
      message = `OUTBOUND ALERT to ${claim.user}: "Claim ${claim.id} rejected. Missing docs: ${missing}. Please re-upload."`;
    }

    setAuditLogs(prev => [{ id: Date.now(), time, msg: message }, ...prev]);
  };

  // --- Document Verification Handlers ---
  const handleVerify = (id) => {
    setClaimRequests(prev => prev.map(c => {
      if (c.id === id) {
        sendAutomatedResponse("APPROVE", c);
        return { ...c, docs: "Verified", missingDocs: [] };
      }
      return c;
    }));
  };

  const handleReject = (id) => {
    setClaimRequests(prev => prev.map(c => {
      if (c.id === id) {
        sendAutomatedResponse("REJECT", c);
        return { ...c, docs: "Rejected" };
      }
      return c;
    }));
  };

  // --- Multi-Step Settlement Logic ---
  const startSettlementSequence = () => {
    setSettlementStatus("Verifying");
    setTxHash(null);
    
    // Step 1: Biometrics
    setTimeout(() => setAiChecks(prev => ({...prev, identity: true})), 800);
    // Step 2: Fraud Check
    setTimeout(() => setAiChecks(prev => ({...prev, fraudScore: true})), 1600);
    // Step 3: Ledger Sync
    setTimeout(() => {
      setAiChecks(prev => ({...prev, ledgerSync: true}));
      setSettlementStatus("Ready");
    }, 2400);
  };

  const processFinalPayment = () => {
    const hash = "0x" + Math.random().toString(16).slice(2, 14).toUpperCase();
    setTxHash(hash);
    setSettlementStatus("Paid");
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLogs(prev => [{ id: Date.now(), time, msg: `FINANCE CONFIRMED: Payout successful. TX: ${hash}` }, ...prev]);
  };

  // Initialize Dummy Data
  useEffect(() => {
    setClaimRequests([
      { 
        id: "CLM-882", user: "Alex Rivera", type: "Motor", 
        docs: "Pending", risk: "Low", 
        missingDocs: ["Front Bumper Photo", "Police Report"] 
      },
      { 
        id: "CLM-901", user: "Sarah Chen", type: "2-Wheeler", 
        docs: "Pending", risk: "Medium", 
        missingDocs: ["Current Insurance Copy"] 
      }
    ]);
  }, []);

  return (
    <div className="arc-admin-wrapper">
      {/* Top Navigation */}
      <nav className="arc-navbar">
        <div className="arc-nav-brand">
          <div className="arc-logo-box"><i className="fa-solid fa-shield-halved"></i></div>
          <span>ARCTIC <strong className="arc-accent-text">CORE</strong> <small className="arc-tag-mini">ADMIN PANEL</small></span>
        </div>
        <div className="arc-nav-info">
          <div className="arc-engine-status"><span className="arc-pulse"></span> AI Engine: Active</div>
          <button onClick={() => navigate("/admin-login")} className="arc-exit-btn" title="Sign Out">
            <i className="fa-solid fa-power-off"></i>
          </button>
        </div>
      </nav>

      <main className="arc-main-grid">
        {/* Left Column: Verification & Logs */}
        <div className="arc-primary-col">
          
          {/* Detailed Verification Section */}
          <section className="arc-glass-panel">
            <div className="arc-panel-head">
              <h3><i className="fa-solid fa-file-shield"></i> Document Verification Detail</h3>
            </div>
            <div className="arc-verification-stack">
              {claimRequests.map((claim) => (
                <div key={claim.id} className={`arc-verify-card arc-state-${claim.docs.toLowerCase()}`}>
                  <div className="arc-verify-info">
                    <div className="arc-user-meta">
                      <span className="arc-id-pill">{claim.id}</span>
                      <h4>{claim.user}</h4>
                    </div>
                    <div className="arc-missing-box">
                      <p className="arc-label">Status: <span className={`arc-txt-${claim.docs.toLowerCase()}`}>{claim.docs}</span></p>
                      {claim.missingDocs.length > 0 && claim.docs !== "Verified" && (
                        <div className="arc-warning-list">
                          <strong>Missing Requirements:</strong>
                          <ul>
                            {claim.missingDocs.map((doc, i) => <li key={i}><i className="fa-solid fa-circle-exclamation"></i> {doc}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="arc-verify-actions">
                    <button onClick={() => handleVerify(claim.id)} className="arc-action-btn arc-confirm">
                      <i className="fa-solid fa-check-double"></i> Auto-Approve
                    </button>
                    <button onClick={() => handleReject(claim.id)} className="arc-action-btn arc-deny">
                      <i className="fa-solid fa-bell"></i> Alert Missing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Automated Response & Activity Log */}
          <section className="arc-glass-panel">
            <div className="arc-panel-head"><h3><i className="fa-solid fa-robot"></i> Automated Activity Log</h3></div>
            <div className="arc-log-container">
              {auditLogs.length === 0 && <p className="arc-dim">Waiting for system triggers...</p>}
              {auditLogs.map(log => (
                <div key={log.id} className="arc-log-entry">
                  <span className="arc-timestamp">{log.time}</span> {log.msg}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Detailed Settlement Engine */}
        <div className="arc-secondary-col">
          <section className="arc-glass-panel arc-settlement-engine">
            <div className="arc-panel-head">
              <h3><i className="fa-solid fa-microchip"></i> Smart Settlement Engine</h3>
              <div className={`arc-status-pill arc-status-${settlementStatus.toLowerCase()}`}>{settlementStatus}</div>
            </div>

            <div className="arc-engine-body">
              {/* AI Verification Checklist */}
              <div className="arc-checklist">
                <div className={`arc-check-item ${aiChecks.identity ? 'active' : ''}`}>
                  <i className={aiChecks.identity ? "fa-solid fa-circle-check" : "fa-solid fa-circle-notch fa-spin"}></i>
                  <span>Biometric Identity Match</span>
                </div>
                <div className={`arc-check-item ${aiChecks.fraudScore ? 'active' : ''}`}>
                  <i className={aiChecks.fraudScore ? "fa-solid fa-circle-check" : "fa-solid fa-circle-notch fa-spin"}></i>
                  <span>Anti-Fraud Score Analysis</span>
                </div>
                <div className={`arc-check-item ${aiChecks.ledgerSync ? 'active' : ''}`}>
                  <i className={aiChecks.ledgerSync ? "fa-solid fa-circle-check" : "fa-solid fa-circle-notch fa-spin"}></i>
                  <span>Bank Ledger Synchronization</span>
                </div>
              </div>

              <hr className="arc-divider" />

              {/* Financial Detail Summary */}
              <div className="arc-finance-details">
                <div className="arc-data-row">
                  <label>Payout Liquidity</label>
                  <span className="arc-liquidity-high">98.4% Stable</span>
                </div>
                <div className="arc-data-row">
                  <label>Approved Payout</label>
                  <span className="arc-price">$4,500.00</span>
                </div>
                {txHash && (
                  <div className="arc-data-row arc-hash-row">
                    <label>TRANSACTION HASH</label>
                    <code>{txHash}</code>
                  </div>
                )}
              </div>

              <button 
                className={`arc-settle-btn arc-btn-${settlementStatus.toLowerCase()}`}
                onClick={settlementStatus === "Idle" ? startSettlementSequence : processFinalPayment}
                disabled={settlementStatus === "Verifying" || settlementStatus === "Paid"}
              >
                {settlementStatus === "Idle" && "Initiate Pre-Payment Audit"}
                {settlementStatus === "Verifying" && "Scanning Security Nodes..."}
                {settlementStatus === "Ready" && "Execute Instant Transfer"}
                {settlementStatus === "Paid" && "Funds Dispatched"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}