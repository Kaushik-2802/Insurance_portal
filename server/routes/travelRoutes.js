import express from "express";
const router = express.Router();

import TravelInsurance from "../models/TravelInsurance.js";
import PassengerDetails from "../models/PasengerDetails.js";
import TravelDetails from "../models/TravelDetails.js";

router.post("/booking", async (req, res) => {
  try {
    const { travelType, tripData, members, selectedAddons, healthAnswers } = req.body;

    if (!tripData || !tripData.destination || !tripData.startDate || !tripData.endDate) {
      return res.status(400).json({ success: false, message: "Missing core trip logistics details." });
    }

    const sharedPolicyNo = `TRV${Date.now().toString().slice(-8)}`;

    // ========================================================
    // FIXED: Keys now perfectly match your TravelInsurance Schema requirements
    // ========================================================
    const newTravelInsurance = new TravelInsurance({
      policyNo: sharedPolicyNo,
      travelType: travelType,           // Corrected from vehicleType
      destination: tripData.destination,
      startDate: new Date(tripData.startDate), // Corrected from takeOffDate
      endDate: new Date(tripData.endDate),     // Corrected from returnDate
      members: members || []                   // Matches the schema array definition if needed
    });
    const savedTravelInsurance = await newTravelInsurance.save();

    // 2. Save Passenger Manifest
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

    // 3. Save Add-ons and Declarations
    const newTravelDetails = new TravelDetails({
      policyNo: sharedPolicyNo,
      addOns: {
        lifeTreathCover: selectedAddons.includes("ped"),
        adventureSportsCover: selectedAddons.includes("adventure"),
        generalSportsCover: selectedAddons.includes("sports"),
        refundCover: selectedAddons.includes("visa"),
        emergencyHotelAccomodation: selectedAddons.includes("hotel")
      },
      medicalQuestions: {
        hasPreexistingDiseases: healthAnswers?.q1 === "yes",
        hasBeenHospitalized: healthAnswers?.q2 === "yes",
        hasClaimedPolicy: healthAnswers?.q3 === "yes",
        hasPep: healthAnswers?.q4 === "yes"
      }
    });
    const savedTravelDetails = await newTravelDetails.save();

    // 4. Return Combined Data Response
    res.status(201).json({
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
    res.status(500).json({
      success: false,
      message: "Server internal system error parsing payment configurations.",
      error: error.message
    });
  }
});

export default router;