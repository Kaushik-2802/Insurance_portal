import React, { useState } from 'react';
import './BuyInsurance.css';
import InnerHeader from '../components/InnerHeader';
import Footer from '../components/Footer';

const BuyInsurance = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [bikeFormData, setBikeFormData] = useState({
    manufacturer: '',
    model: '',
    drivingLicense: '',
    purchaseDate: '',
    registrationNumber: '',
    engineNumber: '',
    chasisNumber: ''
  });

  const [carFormData, setCarFormData] = useState({
    manufacturer: '',
    model: '',
    drivingLicense: '',
    purchaseDate: '',
    registrationNumber: '',
    engineNumber: '',
    chasisNumber: ''
  });

  const handleBikeInputChange = (e) => {
    const { name, value } = e.target;
    setBikeFormData({
      ...bikeFormData,
      [name]: value
    });
  };

  const handleCarInputChange = (e) => {
    const { name, value } = e.target;
    setCarFormData({
      ...carFormData,
      [name]: value
    });
  };

  const handleBikeSubmit = (e) => {
    e.preventDefault();
    console.log('2-Wheeler Insurance Form Data:', bikeFormData);
    alert('2-Wheeler Insurance form submitted! Check console for details.');
    // Reset form
    setBikeFormData({
      manufacturer: '',
      model: '',
      drivingLicense: '',
      purchaseDate: '',
      registrationNumber: '',
      engineNumber: '',
      chasisNumber: ''
    });
  };

  const handleCarSubmit = (e) => {
    e.preventDefault();
    console.log('4-Wheeler Insurance Form Data:', carFormData);
    alert('4-Wheeler Insurance form submitted! Check console for details.');
    // Reset form
    setCarFormData({
      manufacturer: '',
      model: '',
      drivingLicense: '',
      purchaseDate: '',
      registrationNumber: '',
      engineNumber: '',
      chasisNumber: ''
    });
  };

  return (
    <>
    <InnerHeader />
    <div className="buy-insurance-container">
      {/* Header Section */}
      <div className="buy-insurance-header">
        <h1>Buy Insurance</h1>
        <p>Select the type of vehicle for which you want to purchase insurance</p>
      </div>

      {/* Button Selection Section */}
      <div className="vehicle-selector">
        <button
          className={`vehicle-btn ${activeForm === 'bike' ? 'active' : ''}`}
          onClick={() => setActiveForm('bike')}
        >
          🏍️ 2-Wheeler Insurance
        </button>
        <button
          className={`vehicle-btn ${activeForm === 'car' ? 'active' : ''}`}
          onClick={() => setActiveForm('car')}
        >
          🚗 4-Wheeler Insurance
        </button>
      </div>

      {/* 2-Wheeler Form */}
      {activeForm === 'bike' && (
        <div className="form-section">
          <h2>2-Wheeler Insurance Form</h2>
          <form onSubmit={handleBikeSubmit}>
            <div className="form-group">
              <label htmlFor="bike-manufacturer">Bike Manufacturer</label>
              <input
                type="text"
                id="bike-manufacturer"
                name="manufacturer"
                placeholder="Enter bike manufacturer (e.g., Hero, Honda)"
                value={bikeFormData.manufacturer}
                onChange={handleBikeInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bike-model">Bike Model</label>
              <input
                type="text"
                id="bike-model"
                name="model"
                placeholder="Enter bike model (e.g., Splendor, CB Shine)"
                value={bikeFormData.model}
                onChange={handleBikeInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bike-license">Driving License</label>
              <input
                type="text"
                id="bike-license"
                name="drivingLicense"
                placeholder="Enter driving license number"
                value={bikeFormData.drivingLicense}
                onChange={handleBikeInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bike-purchase">Purchase Date</label>
              <input
                type="date"
                id="bike-purchase"
                name="purchaseDate"
                value={bikeFormData.purchaseDate}
                onChange={handleBikeInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bike-registration">Registration Number</label>
              <input
                type="text"
                id="bike-registration"
                name="registrationNumber"
                placeholder="Enter registration number"
                value={bikeFormData.registrationNumber}
                onChange={handleBikeInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bike-engine">Engine Number</label>
              <input
                type="text"
                id="bike-engine"
                name="engineNumber"
                placeholder="Enter engine number"
                value={bikeFormData.engineNumber}
                onChange={handleBikeInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bike-chasis">Chassis Number</label>
              <input
                type="text"
                id="bike-chasis"
                name="chasisNumber"
                placeholder="Enter chassis number"
                value={bikeFormData.chasisNumber}
                onChange={handleBikeInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      )}

      {/* 4-Wheeler Form */}
      {activeForm === 'car' && (
        <div className="form-section">
          <h2>4-Wheeler Insurance Form</h2>
          <form onSubmit={handleCarSubmit}>
            <div className="form-group">
              <label htmlFor="car-manufacturer">Car Manufacturer</label>
              <input
                type="text"
                id="car-manufacturer"
                name="manufacturer"
                placeholder="Enter car manufacturer (e.g., Toyota, Honda)"
                value={carFormData.manufacturer}
                onChange={handleCarInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="car-model">Car Model</label>
              <input
                type="text"
                id="car-model"
                name="model"
                placeholder="Enter car model (e.g., Fortuner, City)"
                value={carFormData.model}
                onChange={handleCarInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="car-license">Driving License</label>
              <input
                type="text"
                id="car-license"
                name="drivingLicense"
                placeholder="Enter driving license number"
                value={carFormData.drivingLicense}
                onChange={handleCarInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="car-purchase">Purchase Date</label>
              <input
                type="date"
                id="car-purchase"
                name="purchaseDate"
                value={carFormData.purchaseDate}
                onChange={handleCarInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="car-registration">Registration Number</label>
              <input
                type="text"
                id="car-registration"
                name="registrationNumber"
                placeholder="Enter registration number"
                value={carFormData.registrationNumber}
                onChange={handleCarInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="car-engine">Engine Number</label>
              <input
                type="text"
                id="car-engine"
                name="engineNumber"
                placeholder="Enter engine number"
                value={carFormData.engineNumber}
                onChange={handleCarInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="car-chasis">Chassis Number</label>
              <input
                type="text"
                id="car-chasis"
                name="chasisNumber"
                placeholder="Enter chassis number"
                value={carFormData.chasisNumber}
                onChange={handleCarInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      )}

      {/* Placeholder when no form is selected */}
      {/* {activeForm === null && (
        <div className="form-section placeholder">
          <p>Select a vehicle type above to get started with your insurance purchase</p>
        </div>
      )} */}
    </div>
    <Footer />
    </>
  );
};

export default BuyInsurance;
