import express from "express";
import crypto from "crypto";
import BuyInsurance from "../models/BuyInsurance.js"; 
import InsuranceDetails from "../models/InsuranceDetails.js"; 
import User from "../models/User.js"

const router = express.Router();

// POST: http://localhost:5000/api/insurance/create-policy
router.post("/create-policy", async (req, res) => {
  try {
    const {
      userId,
      activeForm,
      manufacturer,
      model,
      drivingLicense,
      purchaseDate,
      registrationNumber,
      engineNumber,
      chasisNumber,
      amount,
      paymentMethod,
      transactionId
    } = req.body;

    // 1. Validation fallback check
    if (!registrationNumber || !model || !manufacturer) {
      return res.status(400).json({
        success: false,
        message: "Required core field profiles are missing (Registration, Model, or Manufacturer)."
      });
    }

    // 2. Format variables matching your database schema expectations
    const insuranceType = activeForm === "bike" ? "Two Wheeler" : "Four Wheeler";
    
    // Compute dynamic coverage expiration spans (1 year)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);
    
    // Unique policy string generation
    const generatedRefNo = "POL-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // 3. Save directly to your detailed policy summary tracking collection
    const finalPolicy = new InsuranceDetails({
      userId: userId || new mongoose.Types.ObjectId(), // fallback token if userId isn't active
      refNo: generatedRefNo,
      name: `${insuranceType} Insurance (${manufacturer})`,
      startDate,
      endDate,
      vehicleType: insuranceType,
      bikeModel: model, 
      regNo: registrationNumber,
      amount: amount || "₹1,850",
      paymentMethod: paymentMethod || "Wallet Gateway",
      transactionId: transactionId || "TXN-" + crypto.randomBytes(6).toString("hex").toUpperCase()
    });

    const savedPolicy = await finalPolicy.save();

    // OPTIONAL: If you also want to log raw leads inside your buyInsuranceSchema collection simultaneously:
    const leadLog = new BuyInsurance({
      insuranceType,
      manufacturer,
      model,
      registration: registrationNumber,
      dlNo: drivingLicense || "N/A",
      engineNo: engineNumber || "N/A",
      chasisNo: chasisNumber || "N/A",
      dateOfPurchase: purchaseDate ? new Date(purchaseDate) : new Date()
    });
    await leadLog.save();

    // 4. Return unified success payload back to React
    return res.status(201).json({
      success: true,
      message: "Insurance policy written and stored successfully!",
      policy: savedPolicy
    });

  } catch (error) {
    console.error("Backend failed handling policy saving sequence:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server data processing failure.",
      error: error.message
    });
  }
});

router.get("/verify-policy/:policyNo",async(req,res)=>{
  try{
    const {policyNo}=req.params;
    const policy=await InsuranceDetails.findOne({refNo: policyNo});
    if(!policy){
      return res.status(404).json({success:false,message:"Policy number not found. Please verify your document entry"});
    }
    return res.status(200).json({success:true,policy})
  }catch(error){
    console.error("Policy verification error:",error);
    return res.status(500).json({success:false,message:"Server error during validation trace.",error:error.message})
  }
})

router.put("/renew-policy",async(req,res)=>{
  try{
    const {policyNo,amount,address}=req.body;
    if(!policyNo){
      return res.status(400).json({success:false,message:"Policy reference number required for tracking."})
    }
    const targetPolicy=await InsuranceDetails.findOne({refNo:policyNo});
    if(!targetPolicy){
      res.status(404).json({success:false,message:"Policy reference number is missing"})
    }
    const baseDate=new Date(targetPolicy.endDate)> new Date()? new Date(targetPolicy.endDate): new Date();
    const extendedEndDate=new Date(baseDate);
    extendedEndDate.setFullYear(extendedEndDate.getFullYear()+1);
    
    const updatedPolicy= await InsuranceDetails.findOneAndUpdate(
      {refNo: policyNo},
      {
        $set:{
          startDate:new Date(),
          endDate:extendedEndDate,
          amount: amount || targetPolicy.amount,
          deliveryAddress: address || "Digitsl delivery only"
        }
      },
      {new:true}
    );
    return res.status(200).json({success:true,message:"Insurance protection policy coverage successfully renewed!",policy:updatedPolicy})
  }catch(error){
    console.error("Policy updating processing block failure:",error)
    return res.status(500).json({success:false,message:"Failed to update target policy framework state parameters.",error:error.message})
  }
})

// =========================================================================
// POST: Verify Policy and Phone Compatibility For Filing Claims
// URL: http://localhost:5000/api/insurance/verify-claim-eligibility
// =========================================================================
router.post("/verify-claim-eligibility", async (req, res) => {
  try {
    const { policyNumber, linkedMobile } = req.body;

    if (!policyNumber || !linkedMobile) {
      return res.status(400).json({
        success: false,
        message: "Both policy tracking token and registered mobile are required for validation."
      });
    }

    // Lookup policy reference record matching criteria
    const activePolicy = await InsuranceDetails.findOne({
      refNo: policyNumber.trim(),

      // Optional: Add phone matching if mobile number is tied directly to user profiles/policy documents
    });
    const mobileNo=await User.findOne({
      mobile: linkedMobile
    })

    if (!activePolicy || !mobileNo) {
      return res.status(404).json({
        success: false,
        message: "Incorrect policy number or mobile number. Please enter correct details."
      });
    }

    // Return verification flag alongside database profile traits to auto-toggle the form category
    return res.status(200).json({
      success: true,
      message: "Security identity criteria successfully mapped.",
      vehicleType: activePolicy.vehicleType // e.g. "Two Wheeler" or "Private Car"
    });

  } catch (error) {
    console.error("Claim eligibility tracking system fault:", error);
    return res.status(500).json({
      success: false,
      message: "Internal record tracing pipeline disruption.",
      error: error.message
    });
  }
});

export default router;