import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [settlementStatus, setSettlementStatus] = useState("Idle"); // Idle, Verifying, Ready, Paid
  const [activeStep, setActiveStep] = useState(1);
  const [claimRequests, setClaimRequests] = useState([]);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    window.location.href = '/admin-login';
  };

  const startVerification = () => {
    setSettlementStatus("Verifying");
    setTimeout(() => {
      setSettlementStatus("Ready");
      setActiveStep(2);
    }, 2000);
  };

  const executeTransfer = () => {
    setSettlementStatus("Paid");
    setActiveStep(3);
  };

  // --- Dummy Data ---
  const pendingValidations = [
    { id: "POL-99281", user: "Alex Rivera", amount: "$1,200" },
    { id: "POL-44102", user: "Sarah Chen", amount: "$4,500" },
  ];

  useEffect(() => {
    try {
      const storedRequests = JSON.parse(localStorage.getItem('adminClaimRequests') || '[]');
      setClaimRequests(Array.isArray(storedRequests) ? storedRequests : []);
    } catch (error) {
      setClaimRequests([]);
    }
  }, []);

  const userQueries = [
    { id: 1, subject: "Policy Renewal Delay", msg: "I haven't received my docs...", time: "2m ago" },
    { id: 2, subject: "Payment Failed", msg: "Amount debited but no policy.", time: "1h ago" },
  ];

  return (
    <div className="admin-dashboard-root">
      {/* Top Navigation */}
      <nav className="admin-nav">
        <div className="nav-logo">
          <i className="fa-solid fa-shield-halved"></i>
          <span>ADMIN <strong>PRO</strong></span>
        </div>
        <div className="nav-actions">
          <span className="system-time">System Status: <strong>Online</strong></span>
          <button onClick={handleLogout} className="logout-mini-btn">
            <i className="fa-solid fa-power-off"></i> Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-grid">
        {/* TOP LEFT: Reference Validation */}
        <section className="dashboard-card admin-left">
          <div className="card-header">
            <h3><i className="fa-solid fa-magnifying-glass-chart"></i> Reference Validation</h3>
            <span className="badge-count">{2 + claimRequests.length} Pending</span>
          </div>
          <div className="validation-list">
            {pendingValidations.map((item) => (
              <div key={item.id} className="validation-item">
                <div className="item-info">
                  <span className="id-tag">{item.id}</span>
                  <p>{item.user} • <strong>{item.amount}</strong></p>
                </div>
                <div className="item-actions">
                  <button className="btn-v-green"><i className="fa-solid fa-check"></i></button>
                  <button className="btn-v-red"><i className="fa-solid fa-xmark"></i></button>
                </div>
              </div>
            ))}
            {claimRequests.length > 0 && claimRequests.map((request) => (
              <div key={request.id} className="validation-item new-claim-request">
                <div className="item-info">
                  <span className="id-tag">{request.id}</span>
                  <p>{request.policy} • <strong>{request.reason}</strong></p>
                  <small>{request.status} • {request.createdAt}</small>
                </div>
                <div className="item-actions">
                  <button className="btn-v-green"><i className="fa-solid fa-check"></i></button>
                  <button className="btn-v-red"><i className="fa-solid fa-xmark"></i></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TOP RIGHT: User Queries */}
        <section className="dashboard-card admin-right">
          <div className="card-header">
            <h3><i className="fa-solid fa-message-dots"></i> User Inquiries</h3>
          </div>
          <div className="query-feed">
            {userQueries.map((q) => (
              <div key={q.id} className="query-card">
                <div className="query-top">
                  <span className="query-subject">{q.subject}</span>
                  <span className="query-time">{q.time}</span>
                </div>
                <p className="query-snippet">{q.msg}</p>
                <button className="reply-btn">Open Thread</button>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM: Smart Settlement Console */}
        <section className="dashboard-card admin-bottom">
          <div className="card-header">
            <h3><i className="fa-solid fa-gears"></i> Smart Settlement Console</h3>
            <div className={`status-pill ${settlementStatus}`}>
              {settlementStatus}
            </div>
          </div>

          <div className="settlement-workspace">
            {/* Column 1: Financials */}
            <div className="workspace-column">
              <div className="input-group-modern">
                <label>Payee Account (Linked)</label>
                <div className="verified-input">
                  <input type="text" value="•••• •••• 8829" readOnly />
                  <i className="fa-solid fa-circle-check"></i>
                </div>
              </div>
              <div className="input-group-modern">
                <label>Final Settlement Amount</label>
                <input type="text" defaultValue="$4,500.00" readOnly={settlementStatus === "Paid"} />
              </div>
              
              <button 
                className={`action-trigger-btn ${settlementStatus}`}
                onClick={
                  settlementStatus === "Idle" ? startVerification : 
                  settlementStatus === "Ready" ? executeTransfer : null
                }
                disabled={settlementStatus === "Verifying" || settlementStatus === "Paid"}
              >
                {settlementStatus === "Idle" && "Initiate Bank Verification"}
                {settlementStatus === "Verifying" && <><i className="fa-solid fa-spinner fa-spin"></i> Checking Nodes...</>}
                {settlementStatus === "Ready" && "Execute Instant Transfer"}
                {settlementStatus === "Paid" && <><i className="fa-solid fa-circle-check"></i> Funds Disbursed</>}
              </button>
            </div>

            {/* Column 2: Risk Meter */}
            <div className="workspace-column border-sides">
              <div className="risk-header">
                <span>Risk Assessment</span>
                <span className="risk-score">Low (15/100)</span>
              </div>
              <div className="risk-meter">
                <div className="meter-value" style={{ width: '15%' }}></div>
              </div>
              <ul className="check-list">
                <li className="checked"><i className="fa-solid fa-circle-check"></i> Policy Active</li>
                <li className="checked"><i className="fa-solid fa-circle-check"></i> Identity Verified</li>
                <li className="checked"><i className="fa-solid fa-circle-check"></i> Fraud Scan Passed</li>
              </ul>
            </div>

            {/* Column 3: Audit Trail */}
            <div className="workspace-column">
              <p className="trail-title">Activity Log</p>
              <div className="log-entries">
                <div className="log-entry"><span>14:02</span> Claim Evidence Validated</div>
                <div className="log-entry"><span>14:10</span> AI Risk Assessment: Low</div>
                {settlementStatus === "Verifying" && <div className="log-entry pending">Verifying Bank Routing...</div>}
                {settlementStatus === "Ready" && <div className="log-entry success">Bank Verified: Ready</div>}
                {settlementStatus === "Paid" && <div className="log-entry final">TXID: 8829-SETTLED-2026</div>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}