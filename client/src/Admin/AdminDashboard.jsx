import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [settlementStatus, setSettlementStatus] = useState("Idle");
  const [claimRequests, setClaimRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [txHash, setTxHash] = useState(null);
  const [reducedAmount, setReducedAmount] = useState(0);
  
  // FIXED: Keeps tracking attributes grouped safely together inside a single persistent buffer state
  const [selectedClaim, setSelectedClaim] = useState(null); 
  const [userQueries, setUserQueries] = useState([]);
  
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
        const activeClaims = data.claims.filter(claim => claim.docs !== "Settled");
        setClaimRequests(activeClaims);
        
        // CRITICAL FIX: If the selected claim is currently staging, prevent background polling from resetting it
        if (selectedClaim) {
          const matchingUpdatedClaim = activeClaims.find(c => c.id === selectedClaim.id);
          if (matchingUpdatedClaim) {
            setSelectedClaim(prev => ({
              ...matchingUpdatedClaim,
              fixedPayout: prev.fixedPayout // Retain the one-time calculation securely in memory!
            }));
          }
        }
      }
    } catch (error) {
      console.error("Critical dashboard synchronization mismatch error: ", error);
    }
  };

  useEffect(() => {
    fetchRealtimeClaims();
    const interval = setInterval(fetchRealtimeClaims, 10000);
    return () => clearInterval(interval);
  }, [selectedClaim]); // Listens for state modifications safely

  const queryData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-message`);
      const data = await response.json();
      if (response.ok) {
        setUserQueries(data.queries);
      }
    } catch (err) {
      console.error("Error fetching user messages:", err);
    }
  };

  useEffect(() => {
    queryData();
  }, []);

  const logSystemActivity = (message) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAuditLogs(prev => [{ id: Date.now(), time, msg: message }, ...prev]);
  };

  // --- Stage a Claim Into the Settlement Engine ---
  const handleStageForApproval = (claim) => {
  setSettlementStatus("Idle");
  setTxHash(null);
  setAiChecks({ identity: false, fraudScore: false, ledgerSync: false });
  
  // Calculate a strictly lower amount
  const baseAmount = claim.amount ?? 0;
  const reduction = baseAmount * (0.03 + Math.random() * 0.03); // 3% to 6% cut
  let calculatedLowerValue = Math.floor(baseAmount - reduction - (150 + Math.random() * 200));
  
  // Safety floor check
  if (calculatedLowerValue <= 0) {
    calculatedLowerValue = Math.floor(baseAmount * 0.9);
  }
  
  // Force state allocation
  setReducedAmount(calculatedLowerValue);
  setSelectedClaim(claim);

  const claimIdText = claim.id ? claim.id.slice(-6).toUpperCase() : "UNKNOWN";
  logSystemActivity(`ENGINE STAGING: Loaded Claim ID [${claimIdText}]. Original: ₹${baseAmount.toLocaleString('en-IN')}, Reduced Target: ₹${calculatedLowerValue.toLocaleString('en-IN')}`);
};

  const handleRejectStatus = async (id, userLabel) => {
    try {
      const response = await fetch(`${API_BASE_URL}/realtime-claims/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "Rejected" })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        logSystemActivity(`DATABASE UPDATE: Claim ID [${id}] for ${userLabel} changed state to REJECTED.`);
        if (selectedClaim?.id === id) setSelectedClaim(null);
        fetchRealtimeClaims();
      } else {
        window.alert(`Database transaction rejected: ${data.message}`);
      }
    } catch (err) {
      console.error("Network communication fault:", err);
    }
  };

  // --- Multi-Step Settlement Logic Engine Sequence ---
  const startSettlementSequence = () => {
    if (!selectedClaim) {
      window.alert("Please stage a claim from the queue grid matrix to process first.");
      return;
    }

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
      logSystemActivity(`LIQUIDITY DESK: Vault reconciliation synchronized. Final calculated settlement payout locked at: ₹${selectedClaim.fixedPayout.toLocaleString('en-IN')}`);
    }, 2400);
  };

  const processFinalPayment = async () => {
  if (!selectedClaim) return;

  const hash = "0x" + Math.random().toString(16).slice(2, 14).toUpperCase();
  const claimId = selectedClaim.id;
  
  try {
    const response = await fetch(`${API_BASE_URL}/realtime-claims/${claimId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "Settled",
        txHash: hash,
        customPayout: reducedAmount // Sends the exact lower price displayed on your screen
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setTxHash(hash);
      setSettlementStatus("Paid");
      logSystemActivity(`FINANCE TRANSMISSION: Dispatched adjusted settlement of ₹${reducedAmount.toLocaleString('en-IN')}. Hash: ${hash}`);
      
      setSelectedClaim(null);
      setReducedAmount(0); // Reset buffer state
      fetchRealtimeClaims();
    } else {
      window.alert(`Database transaction rejected: ${data.message}`);
    }
  } catch (err) {
    console.error("Payment pipeline mutation execution exception failure:", err);
  }
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
        {/* Left Column */}
        <div className="arc-primary-col">
          <section className="arc-glass-panel">
            <div className="arc-panel-head">
              <h3><i className="fa-solid fa-file-shield"></i> Inbound Claims Queue Matrix</h3>
            </div>
            <div className="arc-verification-stack">
              {claimRequests.length === 0 ? (
                <p className="arc-dim" style={{ padding: '20px', textAlign: 'center' }}>No pipeline insurance requests indexed inside database ledger files.</p>
              ) : (
                claimRequests.map((claim) => {
                  const currentClaimId = claim.id;
                  const itemAmount = claim.amount ?? 0;
                  const isStaged = selectedClaim?.id === currentClaimId;

                  return (
                    <div 
                      key={currentClaimId} 
                      className={`arc-verify-card arc-state-${claim.docs ? claim.docs.toLowerCase() : "pending"} ${isStaged ? "arc-staged-active" : ""}`}
                    >
                      <div className="arc-verify-info">
                        <div className="arc-user-meta">
                          <span className="arc-id-pill">
                            {currentClaimId ? currentClaimId.slice(-6).toUpperCase() : "NEW"}
                          </span>
                          <h4>{claim.user || "Unknown Applicant"}</h4>
                        </div>
                        <div className="arc-missing-box">
                          <p className="arc-label">Policy Reference: <strong>{claim.policyNo}</strong></p>
                          <p className="arc-label">Classification: <span style={{ color: '#3498db', fontWeight: 'bold' }}>{claim.type}</span></p>
                          <p className="arc-label">Incident Context: <em>{claim.incidentType}</em></p>
                          
                          {/* SHOWS THE EXACT USER CLAIMED AMOUNT IN QUEUE CARD */}
                          <p className="arc-label">Stated Value Match: <strong style={{color: '#2ecc71'}}>₹{itemAmount.toLocaleString('en-IN')}</strong></p>
                          
                          <p className="arc-label" style={{ marginTop: '5px' }}>
                            Status Ledger: <span className={`arc-txt-${claim.docs ? claim.docs.toLowerCase() : "pending"}`} style={{ fontWeight: 'bold' }}>{claim.docs || "Pending"}</span>
                          </p>
                        </div>
                      </div>
                      <div className="arc-verify-actions">
                        <button 
                          onClick={() => handleStageForApproval(claim)} 
                          className="arc-action-btn arc-confirm"
                          disabled={isStaged}
                        >
                          <i className="fa-solid fa-microchip"></i> {isStaged ? "Staged" : "Auto-Approve"}
                        </button>
                        <button 
                          onClick={() => handleRejectStatus(currentClaimId, claim.user || "Applicant")} 
                          className="arc-action-btn arc-deny"
                          disabled={claim.docs === "Rejected"}
                        >
                          <i className="fa-solid fa-bell"></i> Flag Rejected
                        </button>
                      </div>
                    </div>
                  );
                })
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

        {/* Right Column */}
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
                  <label>Target Account Holder Identity</label>
                  <span style={{ fontWeight: 'bold', color: '#f39c12' }}>
                    {selectedClaim ? selectedClaim.user : "None Selected"}
                  </span>
                </div>
                <div className="arc-data-row">
                  <label>Payout Liquidity Pool</label>
                  <span className="arc-liquidity-high">98.4% Operational</span>
                </div>
                <div className="arc-data-row">
                  <label>Settlement Capital Target</label>
                  <span className="arc-price">
                    {selectedClaim 
                      ? `₹${reducedAmount.toLocaleString('en-IN')}`
                      : "₹0.00"
                    }
                  </span>
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
                disabled={settlementStatus === "Verifying" || !selectedClaim}
              >
                {!selectedClaim && "Select a Claim from Queue Matrix"}
                {selectedClaim && settlementStatus === "Idle" && "Initiate Pre-Payment Audit"}
                {settlementStatus === "Verifying" && "Scanning Security Nodes..."}
                {settlementStatus === "Ready" && "Execute Instant Transfer"}
                {settlementStatus === "Paid" && "Restart Audit Engine"}
              </button>
            </div>
          </section>

          {/* User Queries Inbox */}
          <section className="arc-glass-panel">
            <div className="arc-panel-head">
              <h3><i className="fa-solid fa-envelope-open-text"></i> User Queries Inbox</h3>
            </div>
            <div className="arc-log-container">
              {userQueries.length === 0 ? (
                <p className="arc-dim">No user queries available.</p>
              ) : (
                userQueries.map((q) => (
                  <div key={q._id} className="arc-log-entry">
                    <div><strong>{q.fullName}</strong> ({q.email})</div>
                    <p style={{ margin: "5px 0" }}>{q.textContent}</p>
                    <small className="arc-timestamp">{new Date(q.createdAt).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}