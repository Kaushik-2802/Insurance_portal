import express from "express";
import User from "../models/User.js";
import TravelInsurance from "../models/TravelInsurance.js";
import PassengerDetails from "../models/PasengerDetails.js";
import TravelDetails from "../models/TravelDetails.js";

const router = express.Router();

// =========================================================================
// 1. CREATE BOOKING: Compiles and saves travel documents upon checkout
// =========================================================================
router.post("/booking", async (req, res) => {
  try {
    const { travelType, tripData, members, selectedAddons, healthAnswers,userId } = req.body;

    if (!tripData || !tripData.destination || !tripData.startDate || !tripData.endDate) {
      return res.status(400).json({ success: false, message: "Missing core trip logistics details." });
    }

    const sharedPolicyNo = `TRV${Date.now().toString().slice(-8)}`;

    // Save Core Policy
    const newTravelInsurance = new TravelInsurance({
      userId: userId,
      policyNo: sharedPolicyNo,
      travelType: travelType,          
      destination: tripData.destination,
      startDate: new Date(tripData.startDate), 
      endDate: new Date(tripData.endDate),    
      members: members || []                  
    });
    const savedTravelInsurance = await newTravelInsurance.save();

    // Save Passenger Manifest
    let savedPassengers = [];
    if (members && members.length > 0) {
      for (const member of members) {
        const passenger = new PassengerDetails({
          policyNo: sharedPolicyNo,
          name: member.name,
          age: String(member.age),
          mobile: member.mobile || "Not Provided",
          email: member.email || "Not Provided"
        });
        const savedPassenger = await passenger.save();
        savedPassengers.push(savedPassenger);
      }
    }

    // Save Add-ons and Declarations
    const newTravelDetails = new TravelDetails({
      policyNo: sharedPolicyNo,
      addOns: {
        lifeTreathCover: selectedAddons?.includes("ped") || false,
        adventureSportsCover: selectedAddons?.includes("adventure") || false,
        generalSportsCover: selectedAddons?.includes("sports") || false,
        refundCover: selectedAddons?.includes("visa") || false,
        emergencyHotelAccomodation: selectedAddons?.includes("hotel") || false
      },
      medicalQuestions: {
        hasPreexistingDiseases: healthAnswers?.q1 === "yes",
        hasBeenHospitalized: healthAnswers?.q2 === "yes",
        hasClaimedPolicy: healthAnswers?.q3 === "yes",
        hasPep: healthAnswers?.q4 === "yes"
      }
    });
    const savedTravelDetails = await newTravelDetails.save();

    return res.status(201).json({
      success: true,
      message: "Insurance application compiled and successfully archived.",
      data: {
        policyNo: sharedPolicyNo,
        travelInsurance: savedTravelInsurance,
        passengers: savedPassengers,
        travelDetails: savedTravelDetails
      }
    });

  } catch (error) {
    console.error("Backend Insurance Processing Exception Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Server internal system error parsing payment configurations.",
      error: error.message
    });
  }
});

// =========================================================================
// 2. FETCH SUMMARY: Single policy configuration view for confirmation pages
// =========================================================================
router.get("/summary/:policyNo", async (req, res) => {
  try {
    const { policyNo } = req.params;
    const travelPolicy = await TravelInsurance.findOne({ policyNo });

    if (!travelPolicy) {
      return res.status(404).json({ success: false, message: "No active travel insurance record found." });
    }

    return res.status(200).json({
      success: true,
      policyReferenceNumber: travelPolicy.policyNo,
      ownerName: travelPolicy.name || (travelPolicy.members && travelPolicy.members[0]?.name) || "Valued Customer",
      planName: "Travel Protection Plan",
      destinationDetails: `Trip to ${travelPolicy.destination}`,
      coverageType: `${travelPolicy.travelType?.toUpperCase() || "INTERNATIONAL"} COVER`,
      startTime: new Date(travelPolicy.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + " | 10:00 AM",
      endTime: new Date(travelPolicy.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + " | 11:59 PM",
      paymentAmount: "Paid", 
      paymentMethod: "ONLINE GATEWAY",
      transactionId: "TXN_TRV_" + travelPolicy._id.toString().slice(-8).toUpperCase()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// =========================================================================
// 3. FETCH PROFILE POLICIES: Dashboard aggregation matching profile names
// =========================================================================
router.get("/user-policies/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ success: false, message: "User profile not found." });
    }

    const userProfileName = `${userProfile.firstName} ${userProfile.lastName}`.trim();

    // Find policies matching either the document field or nested member data rosters
    const travelPolicies = await TravelInsurance.find({
      $or: [
        { name: { $regex: new RegExp(`^${userProfileName}$`, "i") } },
        { "members.name": { $regex: new RegExp(`^${userProfileName}$`, "i") } }
      ]
    }).sort({ createdAt: -1 });

    const formattedTravel = travelPolicies.map(policy => {
      const primaryHolder = policy.name || (policy.members && policy.members[0]?.name) || "Valued Member";
      return {
        id: policy.policyNo,
        holder: primaryHolder,
        category: "Travel",
        detailLabel: "Trip Destination",
        detailValue: `Trip to ${policy.destination} (${policy.travelType || "International"})`,
        premium: "Paid",
        expiry: new Date(policy.endDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }),
        status: "Active"
      };
    });

    return res.status(200).json({ success: true, policies: formattedTravel });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;