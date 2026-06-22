import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

const API_BASE_URL = "http://localhost:5000/api/claims";

const TrackClaims = () => {
  const navigate = useNavigate(); 
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetPolicyNo, setTargetPolicyNo] = useState("");
  const [targetMobileNo, setTargetMobileNo] = useState("");

  // =========================================================================
  // 1. LIFECYCLE HOOK: Parse Local Storage & Initialize Claims Fetch
  // =========================================================================
  useEffect(() => {
    let activePolicy = localStorage.getItem("policyReferenceNumber") || 
                       localStorage.getItem("policyNo") || 
                       localStorage.getItem("policyNumber") || 
                       localStorage.getItem("registration") || "";

    if (activePolicy.includes(" ") || activePolicy.startsWith("TS")) {
      const renewalTarget = localStorage.getItem("renewalPolicyNo");
      if (renewalTarget && renewalTarget.startsWith("POL")) {
        activePolicy = renewalTarget;
      }
    }

    let activeMobile = localStorage.getItem("userMobile") || 
                       localStorage.getItem("mobileNo") || 
                       localStorage.getItem("phone") || "";

    if (!activeMobile || activeMobile.length < 5 || activeMobile === "304") {
      try {
        const travelData = localStorage.getItem("travelInsuranceData");
        if (travelData) {
          const parsedTravel = JSON.parse(travelData);
          if (parsedTravel.members && parsedTravel.members[0]) {
            activeMobile = parsedTravel.members[0].mobile || "";
          }
        }

        if (!activeMobile || activeMobile.length < 5) {
          const adminClaims = localStorage.getItem("adminClaimRequests");
          if (adminClaims) {
            const parsedClaims = JSON.parse(adminClaims);
            const foundMatch = parsedClaims.find(item => item.mobile && item.mobile.length > 5);
            if (foundMatch) activeMobile = foundMatch.mobile;
          }
        }
      } catch (e) {
        console.error("Context scraping operation error:", e);
      }
    }

    if (!activePolicy || activePolicy === "undefined" || activePolicy.startsWith("TS")) {
      activePolicy = "POL-XRD36TAM"; 
    }
    if (!activeMobile || activeMobile === "304" || activeMobile === "undefined") {
      activeMobile = "8790001133";
    }

    const cleanPolicy = activePolicy.trim();
    const cleanMobile = activeMobile.trim();

    setTargetPolicyNo(cleanPolicy);
    setTargetMobileNo(cleanMobile);

    fetchUserClaims(cleanPolicy, cleanMobile);
  }, []);

  // =========================================================================
  // 2. NETWORK ENGINE: Fetch Unified Aggregate Array Streams
  // =========================================================================
  const fetchUserClaims = async (policyNum, mobileNum) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const queryParams = new URLSearchParams({
        policyNo: policyNum,
        mobileNo: mobileNum
      }).toString();

      console.log(`[NETWORK PULL] /user-track?${queryParams}`);

      const response = await fetch(`${API_BASE_URL}/user-track?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setClaims(data);
    } catch (err) {
      console.error("Unified claims pipeline error:", err);
      setError(err.message || "Failed to load tracking data.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // 3. FILTERING REGISTRY: Split Dataset Based on Tab Configurations
  // =========================================================================
  const filteredClaims = claims.filter((claim) => {
    if (activeTab === "all") return true;
    return claim.status?.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "settled":
        return { bg: "#e6f4ea", text: "#137333", label: "Settled & Verified" };
      case "approved":
        return { bg: "#e8f0fe", text: "#1a73e8", label: "Approved" };
      case "rejected":
        return { bg: "#fce8e6", text: "#c5221f", label: "Rejected" };
      default:
        return { bg: "#fef7e0", text: "#b06000", label: "In Review / Pending" };
    }
  };

  // =========================================================================
  // 4. RENDER METHOD INTERFACE
  // =========================================================================
  return (
    <>
      <InnerHeader />
      <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, sans-serif" }}>
        
        {/* Upper Dashboard Header Section */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #e0e0e0", paddingBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: "28px", color: "#1a1f36", margin: "0 0 8px 0" }}>Insurance Claims Center</h2>
            <p style={{ color: "#4f566b", margin: 0, fontSize: "15px" }}>
              Linked Phone: <strong>{targetMobileNo || "N/A"}</strong>
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "6px",
              border: "1px solid #d9d9d9",
              backgroundColor: "#ffffff",
              color: "#4f566b",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#d9d9d9";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Navigation Filter Tabs Control Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "35px" }}>
          {["all", "pending", "settled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 24px",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: activeTab === tab ? "#1a73e8" : "#d9d9d9",
                backgroundColor: activeTab === tab ? "#1a73e8" : "#ffffff",
                color: activeTab === tab ? "#ffffff" : "#4f566b",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "uppercase",
                fontSize: "13px",
                letterSpacing: "0.5px",
                transition: "all 0.2s ease"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Dynamic View Content Card Section */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#4f566b", fontSize: "16px" }}>
            Connecting to distributed claim storage channels...
          </div>
        ) : error ? (
          <div style={{ padding: "20px", backgroundColor: "#fce8e6", borderRadius: "8px", color: "#c5221f", border: "1px solid #fad2cf" }}>
            <strong>Pipeline Connection Exception:</strong> {error}
          </div>
        ) : filteredClaims.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", border: "2px dashed #e0e0e0", borderRadius: "12px", backgroundColor: "#fafafa" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#3c4043" }}>No claims verified</h3>
            <p style={{ color: "#70757a", margin: 0, fontSize: "14px" }}>
              We found no claims registered under the "{activeTab}" status for your selection parameters.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "25px" }}>
            {filteredClaims.map((claim) => {
              const statusConfig = getStatusStyle(claim.status);
              
              // Fallback checking to match both 'claimAmount' and 'requestedAmount'
              const displayRequestedAmount = claim.claimAmount ?? claim.requestedAmount ?? 0;
              const displayApprovedAmount = claim.approvedAmount ?? 0;

              return (
                <div 
                  key={claim._id} 
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    padding: "24px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    {/* Card Upper Status Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <span style={{ 
                        fontSize: "12px", 
                        fontWeight: "bold", 
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "50px",
                        backgroundColor: claim.flowType === "travel" || claim.incidentType ? "#f3e8ff" : "#e0f2fe",
                        color: claim.flowType === "travel" || claim.incidentType ? "#6b21a8" : "#0369a1"
                      }}>
                        {claim.flowType || (claim.incidentType ? "travel" : "insurance")}
                      </span>
                      
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.text
                      }}>
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Core Claims Metrics Metadata */}
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "18px", color: "#1e293b" }}>
                      {claim.incidentType || claim.reason || "Insurance Claim"}
                    </h4>
                    <p style={{ margin: "0 0 14px 0", fontSize: "13px", color: "#64748b" }}>
                      Policy Tracking: <strong style={{ color: "#334155" }}>{claim.policyNo}</strong>
                    </p>

                    <div style={{ margin: "14px 0", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                        <span style={{ color: "#64748b" }}>Requested Amount:</span>
                        <span style={{ fontWeight: "600", color: "#334155" }}>
                          ₹{displayRequestedAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "#64748b" }}>Settled Valuation:</span>
                        <span style={{ fontWeight: "700", color: statusConfig.text }}>
                          ₹{displayApprovedAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Proof Footer Ledger */}
                  <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px dashed #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                      <span style={{ color: "#94a3b8" }}>
                        Filed: {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                      {claim.txHash ? (
                        <span 
                          title={claim.txHash}
                          style={{ 
                            fontFamily: "monospace", 
                            color: "#1a73e8", 
                            backgroundColor: "#f0f4f9",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            cursor: "help"
                          }}
                        >
                          Proof: {claim.txHash.substring(0, 8)}...
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Awaiting Ledger Sync</span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
        
      </div>
      <Footer />
    </>
  );
};

export default TrackClaims;