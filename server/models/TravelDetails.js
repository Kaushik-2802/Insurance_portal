const mongoose=require("mongoose")

const travelDetailsSchema=new mongoose.Schema(
    {
        addOns:{
            lifeTreathCover:{
                type:Boolean,
                default:false
            },
            adventureSportsCover:{
                type:Boolean,
                default:false
            },
            generalSportsCover:{
                type:Boolean,
                default:false
            },
            refundCover:{
                type:Boolean,
                default:false
            },
            emergencyHotelAccomodation:{
                type:Boolean,
                default:false
            }
        },
        medicalQuestions:{
            hasPreexistingDiseases:{
                type:Boolean,
                required:true,
                default:false
            },
            hasBeenHospitalized:{
                type:Boolean,
                required:true,
                default:false
            },
            hasClaimedPolicy:{
                type:Boolean,
                required:true,
                default:false
            },
            hasPep:{
                type:Boolean,
                required:true,
                default:false
            }
        }
    },
    {
        timestamps:true
    }
)

const TravelDetails=mongoose.model("TravelDetails",travelDetailsSchema)
export default TravelDetails;