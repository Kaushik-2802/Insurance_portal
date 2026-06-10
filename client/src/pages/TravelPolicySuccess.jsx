import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";
import "./TravelPolicySuccess.css";

export default function TravelPolicySuccess() {

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  // ====================================================
  // LOAD POLICY DATA
  // ====================================================

  useEffect(() => {

    try {

      const token =
        localStorage.getItem("token");

      // ✅ SESSION CHECK
      if (!token) {

        navigate("/login");

        return;
      }

      const stored =
        localStorage.getItem(
          "travelInsuranceData"
        );

      if (stored) {

        const parsed =
          JSON.parse(stored);

        setData(parsed);

      } else {

        navigate("/dashboard");
      }

    } catch (err) {

      console.error(
        "Error parsing travel insurance data:",
        err
      );

      navigate("/dashboard");

    } finally {

      setLoading(false);
    }

  }, [navigate]);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem"
        }}
      >
        Loading Policy Details...
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // ====================================================
  // DESTRUCTURE
  // ====================================================

  const {
    travelType,
    tripData,
    members,
    selectedAddons,
    policyNo,
    amountToPay
  } = data;

  // ====================================================
  // POLICY NUMBER
  // ====================================================

  const cleanPolicyNumber =
    policyNo ||
    localStorage.getItem(
      "policyReferenceNumber"
    ) ||
    "TRV-UNAVAILABLE";

  // ====================================================
  // TRANSACTION ID
  // ====================================================

  const transactionId =
    localStorage.getItem(
      "transactionId"
    ) ||
    `TXN${Date.now()}`;

  // ====================================================
  // PAYMENT METHOD
  // ====================================================

  const paymentMethod =
    localStorage.getItem(
      "selectedPaymentMethod"
    ) || "UPI";

  return (

    <div className="travel-success-wrapper">

      <InnerHeader />

      {/* SUCCESS BANNER */}

      <div className="travel-success-banner">

        <div className="check-icon">
          ✓
        </div>

        <h1>
          PAYMENT SUCCESSFUL!
        </h1>

        <p>
          Your travel insurance
          policy is now active
        </p>

      </div>

      {/* POLICY CARD */}

      <div className="travel-policy-card">

        {/* HEADER */}

        <div className="policy-header">

          <div className="brand">
            ✈ SecureTrip Insurance
          </div>

          <div className="policy-ref">

            <span>
              POLICY REFERENCE
            </span>

            <strong>
              {cleanPolicyNumber}
            </strong>

          </div>

        </div>

        {/* DETAILS GRID */}

        <div className="policy-details-grid">

          {/* HOLDER DETAILS */}

          <div className="info-box">

            <h3>
              Policy Holder
            </h3>

            {members &&
              members.map((m, i) => (

              <div
                className="info-row"
                key={i}
              >

                <span>
                  Name
                </span>

                <strong>
                  {m.name}
                </strong>

              </div>
            ))}

            <div className="info-row">

              <span>
                No. of Travelers
              </span>

              <strong>
                {members
                  ? members.length
                  : 0}
              </strong>

            </div>

            <div className="info-row">

              <span>
                Travel Type
              </span>

              <strong>
                {travelType
                  ? travelType.toUpperCase()
                  : "DOMESTIC"}
              </strong>

            </div>

            <div className="info-row">

              <span>
                Policy Status
              </span>

              <strong className="active">
                ACTIVE
              </strong>

            </div>

          </div>

          {/* TRIP DETAILS */}

          <div className="info-box">

            <h3>
              Trip Details
            </h3>

            <div className="info-row">

              <span>
                Destination
              </span>

              <strong>
                {tripData?.destination ||
                  "N/A"}
              </strong>

            </div>

            <div className="info-row">

              <span>
                Valid From
              </span>

              <strong>

                {tripData?.startDate
                  ? new Date(
                      tripData.startDate
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "N/A"}

              </strong>

            </div>

            <div className="info-row">

              <span>
                Valid Till
              </span>

              <strong>

                {tripData?.endDate
                  ? new Date(
                      tripData.endDate
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "N/A"}

              </strong>

            </div>

            <div className="info-row">

              <span>
                Plan Type
              </span>

              <strong>
                Comprehensive
                Travel Cover
              </strong>

            </div>

          </div>

        </div>

        {/* PAYMENT DETAILS */}

        <div className="payment-box">

          <h3>
            Payment Details
          </h3>

          <div className="info-row">

            <span>
              Paid Amount
            </span>

            <strong>
              ₹{amountToPay}
            </strong>

          </div>

          <div className="info-row">

            <span>
              Payment Method
            </span>

            <strong>
              {paymentMethod}
            </strong>

          </div>

          <div className="info-row">

            <span>
              Add-ons
            </span>

            <strong>

              {selectedAddons
                ? selectedAddons.length
                : 0}{" "}

              Selected

            </strong>

          </div>

          <div className="info-row">

            <span>
              Issued On
            </span>

            <strong>

              {new Date()
                .toLocaleDateString(
                  "en-IN"
                )}

            </strong>

          </div>

          <div className="info-row">

            <span>
              Transaction ID
            </span>

            <strong>
              {transactionId}
            </strong>

          </div>

        </div>

        {/* VERIFIED */}

        <div className="verified">

          ✅ Digitally Signed &
          Verified Certificate

        </div>

      </div>

      {/* ACTIONS */}

      <div className="policy-actions">

        <button
          className="outline"
          onClick={() => window.print()}
        >
          Download PDF
        </button>

        <button
          className="outline"
          onClick={() =>
            window.location.href =
            `mailto:?subject=Your Insurance Policy&body=Your travel policy reference number is ${cleanPolicyNumber}`
          }
        >
          Email Policy
        </button>

      </div>

      {/* DASHBOARD */}

      <button
        className="home-btn"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        Go to Dashboard →
      </button>

      <Footer />

    </div>
  );
}