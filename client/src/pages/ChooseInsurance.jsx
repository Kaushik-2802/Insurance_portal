import React from "react";
import { useNavigate } from "react-router-dom";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";
import "./ChooseInsurance.css"

export default function ChooseInsurance(){
    const navigate=useNavigate();
    const handleMotor=()=>{
        navigate("/buy-insurance");
    }
    const handleTravel=()=>{
        navigate("/travel-insurance")
    }
    return(
        <>
        <InnerHeader />
            <div className="choose-insurance-container">
                <h1>Select your insurance</h1>
                <div className="button-group">
                    <button type="submit" onClick={handleMotor}>Vehicle Insurance</button>
                    <button type="submit" onClick={handleTravel}>Travel Insurance</button>
                </div>
            </div>

        <Footer />
        </>
    )
}