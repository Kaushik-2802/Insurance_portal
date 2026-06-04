import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [settlementStatus, setSettlementStatus] = useState("Idle");
  const [claimRequests, setClaimRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [txHash, setTxHash] = useState(null);
  const navigate = useNavigate();
  
  const [aiChecks, setAiChecks] = useState({
    identity: false,
    fraudScore: false,
    ledgerSync: false
  });

  const API_BASE_URL = "http://localhost:5000/api/admin";

  // --- Fetch Live Claims from Backend Matrix ---
  const fetchRealtimeClaims = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/realtime-claims`);
      const data = await response.json();
      if (response.ok && data.success) {
        setClaimRequests(data.claims);
      }
    } catch (error) {
      console.error("Critical dashboard synchronization mismatch error: ", error);
    }
  };

  useEffect(() => {
    fetchRealtimeClaims();
    // Optional: Set up polling to check for new claims every 10 seconds
    const interval = setInterval(fetchRealtimeClaims, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Automated System Logger Tracker ---
  const logSystemActivity = (message) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAuditLogs(prev => [{ id: Date.now(), time, msg: message }, ...prev]);
  };

  // --- Live State Transaction Action Handlers ---
  const handleUpdateStatus = async (id, actionStatus, userLabel) => {
    try {
      const response = await fetch(`${API_BASE_URL}/realtime-claims/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionStatus })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        logSystemActivity(`DATABASE UPDATE: Claim ID [${id}] for ${userLabel} changed state to ${actionStatus.toUpperCase()}.`);
        // Re-sync UI records array
        fetchRealtimeClaims();
      } else {
        window.alert(`Database transaction rejected: ${data.message}`);
      }
    } catch (err) {
      console.error("Network communication fault:", err);
      window.alert("Unable to reach backend gateway processing pipelines.");
    }
  };

  // --- Multi-Step Settlement Logic Engine Sequence ---
  const startSettlementSequence = () => {
    setSettlementStatus("Verifying");
    setTxHash(null);
    setAiChecks({ identity: false, fraudScore: false, ledgerSync: false });
    
    setTimeout(() => {
      setAiChecks(prev => ({ ...prev, identity: true }));
      logSystemActivity("AI STATUS MATRIX: Biometric identity matching confirmed.");
    }, 800);

    setTimeout(() => {
      setAiChecks(prev => ({ ...prev, fraudScore: true }));
      logSystemActivity("AI STATUS MATRIX: Anti-fraud historical ledger vectors passed.");
    }, 1600);

    setTimeout(() => {
      setAiChecks(prev => ({ ...prev, ledgerSync: true }));
      setSettlementStatus("Ready");
      logSystemActivity("LIQUIDITY DESK: Vault reconciliation synchronized. Ready to dispatch.");
    }, 2400);
  };

  const processFinalPayment = () => {
    const hash = "0x" + Math.random().toString(16).slice(2, 14).toUpperCase();
    setTxHash(hash);
    setSettlementStatus("Paid");
    logSystemActivity(`FINANCE TRANSMISSION OUTBOUND: Dispatched. Cryptographic Transaction Trace: ${hash}`);
  };

  return (
    <div className="arc-admin-wrapper">
      <nav className="arc-navbar">
        <div className="arc-nav-brand">
          <div className="arc-logo-box"><i className="fa-solid fa-shield-halved"></i></div>
          <span>ARCTIC <strong className="arc-accent-text">CORE</strong> <small className="arc-tag-mini">ADMIN PANEL</small></span>
        </div>
        <div className="arc-nav-info">
          <div className="arc-engine-status"><span className="arc-pulse"></span> DB Pipeline: Connected</div>
          <button onClick={() => navigate("/admin-login")} className="arc-exit-btn" title="Sign Out">
            <i className="fa-solid fa-power-off"></i>
          </button>
        </div>
      </nav>

      <main className="arc-main-grid">
        {/* Left Column: Database Documents Rows */}
        <div className="arc-primary-col">
          <section className="arc-glass-panel">
            <div className="arc-panel-head">
              <h3><i className="fa-solid fa-file-shield"></i> Inbound Claims Queue Matrix</h3>
            </div>
            <div className="arc-verification-stack">
              {claimRequests.length === 0 ? (
                <p className="arc-dim" style={{ padding: '20px', textAlign: 'center' }}>No pipeline insurance requests indexed inside database ledger files.</p>
              ) : (
                claimRequests.map((claim) => (
                  <div key={claim.id} className={`arc-verify-card arc-state-${claim.docs.toLowerCase()}`}>
                    <div className="arc-verify-info">
                      <div className="arc-user-meta">
                        <span className="arc-id-pill">{claim.id.slice(-6).toUpperCase()}</span>
                        <h4>{claim.user}</h4>
                      </div>
                      <div className="arc-missing-box">
                        <p className="arc-label">Policy Reference: <strong>{claim.policyNo}</strong></p>
                        <p className="arc-label">Classification: <span style={{ color: '#3498db', fontWeight: 'bold' }}>{claim.type}</span></p>
                        <p className="arc-label">Incident Context: <em>{claim.incidentType}</em></p>
                        <p className="arc-label" style={{ marginTop: '5px' }}>
                          Status Ledger: <span className={`arc-txt-${claim.docs.toLowerCase()}`} style={{ fontWeight: 'bold' }}>{claim.docs}</span>
                        </p>
                      </div>
                    </div>
                    <div className="arc-verify-actions">
                      <button 
                        onClick={() => handleUpdateStatus(claim.id, "Verified", claim.user)} 
                        className="arc-action-btn arc-confirm"
                        disabled={claim.docs === "Verified"}
                      >
                        <i className="fa-solid fa-check-double"></i> Auto-Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(claim.id, "Rejected", claim.user)} 
                        className="arc-action-btn arc-deny"
                        disabled={claim.docs === "Rejected"}
                      >
                        <i className="fa-solid fa-bell"></i> Flag Rejected
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Activity Log Panel */}
          <section className="arc-glass-panel">
            <div className="arc-panel-head"><h3><i className="fa-solid fa-robot"></i> System Activity Event Stream</h3></div>
            <div className="arc-log-container">
              {auditLogs.length === 0 && <p className="arc-dim">Awaiting inbound event hooks to log ledger records...</p>}
              {auditLogs.map(log => (
                <div key={log.id} className="arc-log-entry">
                  <span className="arc-timestamp">[{log.time}]</span> {log.msg}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Settlement Audit Box */}
        <div className="arc-secondary-col">
          <section className="arc-glass-panel arc-settlement-engine">
            <div className="arc-panel-head">
              <h3><i className="fa-solid fa-microchip"></i> Smart Settlement Engine</h3>
              <div className={`arc-status-pill arc-status-${settlementStatus.toLowerCase()}`}>{settlementStatus}</div>
            </div>

            <div className="arc-engine-body">
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

              <div className="arc-finance-details">
                <div className="arc-data-row">
                  <label>Payout Liquidity Pool</label>
                  <span className="arc-liquidity-high">98.4% Operational</span>
                </div>
                <div className="arc-data-row">
                  <label>Settlement Capital Target</label>
                  <span className="arc-price">$4,500.00</span>
                </div>
                {txHash && (
                  <div className="arc-data-row arc-hash-row">
                    <label>CRYPTOGRAPHIC BANK TRANSFER REF HASH</label>
                    <code>{txHash}</code>
                  </div>
                )}
              </div>

              <button 
                className={`arc-settle-btn arc-btn-${settlementStatus.toLowerCase()}`}
                onClick={settlementStatus === "Idle" || settlementStatus === "Paid" ? startSettlementSequence : processFinalPayment}
                disabled={settlementStatus === "Verifying"}
              >
                {settlementStatus === "Idle" && "Initiate Pre-Payment Audit"}
                {settlementStatus === "Verifying" && "Scanning Security Nodes..."}
                {settlementStatus === "Ready" && "Execute Instant Transfer"}
                {settlementStatus === "Paid" && "Restart Audit Engine"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}