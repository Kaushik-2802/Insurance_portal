import React, { useState, useEffect } from "react";
import "./CalculatePremium.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function CalculatePremium() {
  const vehicleData = {
  Car: {
    Toyota: ["Camry", "Corolla", "Fortuner", "RAV4", "Yaris", "Prius", "Highlander", "Land Cruiser", "Hilux", "Supra", "Glanza", "Taisor", "Innova Crysta", "Innova Hycross", "Vellfire"],
    Honda: ["City", "Amaze", "Elevate", "Civic", "Accord", "CR-V", "HR-V", "Fit", "Pilot", "Odyssey", "WR-V"],
    Tata: ["Nexon", "Harrier", "Safari", "Punch", "Tiago", "Tigor", "Altroz", "Curvv", "Avinya"],
    Hyundai: ["i10 Grand", "i20", "Exter", "Venue", "Creta", "Alcazar", "Tucson", "Verna", "Elantra", "Sonata", "Palisade", "Ioniq 5", "Kona"],
    MarutiSuzuki: ["Alto", "WagonR", "Swift", "Baleno", "Dzire", "Ertiga", "Brezza", "Fronx", "Grand Vitara", "Jimny", "Ciaz", "XL6", "In扩展", "Celerio"],
    Mahindra: ["Thar", "Scorpio-N", "Scorpio Classic", "XUV700", "XUV3XO", "Bolero", "Bolero Neo", "XUV400", "Marazzo"],
    Kia: ["Seltos", "Sonet", "Carens", "Carnival", "EV6", "EV9", "Sportage", "Sorento", "Telluride", "K5"],
    Volkswagen: ["Virtus", "Taigun", "Tiguan", "Polo", "Golf", "Passat", "Jetta", "ID.4", "Touareg", "Arteon"],
    Skoda: ["Slavia", "Kushaq", "Kodiaq", "Superb", "Octavia", "Enyaq", "Fabia"],
    Ford: ["Mustang", "Explorer", "F-150", "Escape", "Edge", "Everest", "Ranger", "Bronco", "EcoSport", "Focus"],
    Chevrolet: ["Corvette", "Camaro", "Silverado", "Malibu", "Equinox", "Tahoe", "Suburban", "Trailblazer", "Bolt EV"],
    BMW: ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7", "M3", "M4", "Z4", "i4", "iX"],
    MercedesBenz: ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "EQE", "EQS"],
    Audi: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "R8", "RS6"],
    Nissan: ["Magnite", "GT-R", "Altima", "Sentra", "Maxima", "Rogue", "Pathfinder", "Patrol", "Leaf", "Z"],
    Renault: ["Kwid", "Kiger", "Triber", "Duster", "Clio", "Megane", "Captur", "Arkana", "Zoe"]
  },
  Bike: {
    Yamaha: ["R15", "MT-15", "FZ", "R1", "R6", "MT-07", "MT-09", "FZ-X", "Aerox 155", "Fascino", "RayZR", "Tenere 700"],
    RoyalEnfield: ["Classic 350", "Hunter", "Bullet", "Meteor 350", "Himalayan 450", "Interceptor 650", "Continental GT 650", "Shotgun 650", "Super Meteor 650", "Scram 411"],
    Honda: ["Activa", "Shine", "SP 125", "Unicorn", "H'ness CB350", "CB350RS", "Hornet 2.0", "CB200X", "Africa Twin", "Gold Wing", "CBR1000RR-R", "CB650R", "Transalp 750"],
    Suzuki: ["Access 125", "Burgman Street", "Gixxer 155", "Gixxer SF 250", "V-Strom SX 250", "Hayabusa", "Katana", "GSX-R1000", "V-Strom 800DE"],
    KTM: ["Duke 200", "Duke 250", "Duke 390", "RC 200", "RC 390", "Adventure 250", "Adventure 390", "Duke 790", "Duke 1290 Super Duke R"],
    Kawasaki: ["Ninja 300", "Ninja 400", "Ninja 650", "Ninja ZX-6R", "Ninja ZX-10R", "Ninja H2R", "Z650", "Z900", "Versys 650", "Vulcan S"],
    BMW_Motorrad: ["G 310 R", "G 310 GS", "F 850 GS", "R 1250 GS", "R 1300 GS", "S 1000 RR", "M 1000 RR", "R nineT", "K 1600 B"],
    Ducati: ["Monster", "Panigale V2", "Panigale V4", "Multistrada V4", "Scrambler 800", "Streetfighter V4", "Diavel V4", "DesertX", "Hypermotard"],
    Triumph: ["Speed 400", "Scrambler 400 X", "Trident 660", "Street Triple 765", "Tiger 900", "Tiger 1200", "Bonneville T100", "Bonneville T120", "Rocket 3"],
    Bajaj: ["Pulsar 150", "Pulsar NS200", "Pulsar RS200", "Pulsar N250", "Pulsar NS400Z", "Dominar 400", "Dominar 250", "Platina", "Chetak", "Avenger Cruise 220"],
    Hero: ["Splendor Plus", "HF Deluxe", "Passion Pro", "Glamour", "Super Splendor", "Xpulse 200 4V", "Mavrick 440", "Xoom", "Karizma XMR 210"],
    TVS: ["Apache RTR 160", "Apache RTR 200 4V", "Apache RR 310", "Apache RTR 310", "Jupiter", "Ntorq 125", "Raider 125", "Ronin", "XL100", "iQube"],
    HarleyDavidson: ["X440", "Nightster", "Sportster S", "Fat Boy", "Heritage Classic", "Pan America 1250", "Street Glide", "Road Glide", "Breakout"]
  }
};

const vehicleBasePrices = {
  Car: {
    Toyota: {
      "Glanza": 4500, "Taisor": 4800, "Yaris": 5000, "Corolla": 5500, "Camry": 7500, 
      "Prius": 7000, "Innova Crysta": 8000, "Innova Hycross": 8500, "Fortuner": 12000, 
      "RAV4": 9000, "Highlander": 11000, "Hilux": 10500, "Supra": 18000, 
      "Vellfire": 25000, "Land Cruiser": 30000, default: 5500
    },
    Honda: {
      "Fit": 4000, "Amaze": 4200, "WR-V": 4800, "City": 5500, "Elevate": 5800, 
      "HR-V": 6500, "Civic": 7000, "CR-V": 8500, "Accord": 8000, "Pilot": 11000, 
      "Odyssey": 10000, default: 5500
    },
    Tata: {
      "Tiago": 3800, "Tigor": 4000, "Punch": 4200, "Altroz": 4500, "Nexon": 5500, 
      "Curvv": 6200, "Harrier": 7800, "Safari": 8500, "Avinya": 15000, default: 5500
    },
    Hyundai: {
      "i10 Grand": 3800, "i20": 4400, "Exter": 4300, "Venue": 5200, "Creta": 6000, 
      "Verna": 5800, "Alcazar": 7000, "Tucson": 9000, "Elantra": 7500, "Kona": 8500, 
      "Ioniq 5": 14000, "Sonata": 8500, "Palisade": 13000, default: 5500
    },
    MarutiSuzuki: {
      "Alto": 3000, "Celerio": 3400, "WagonR": 3500, "Swift": 4000, "Dzire": 4200, 
      "Baleno": 4300, "Fronx": 4800, "Brezza": 5200, "Ertiga": 5500, "Ciaz": 5800, 
      "XL6": 6000, "Grand Vitara": 6500, "Jimny": 6200, default: 4500
    },
    Mahindra: {
      "Bolero": 4800, "Bolero Neo": 5000, "XUV3XO": 5200, "Scorpio Classic": 6800, 
      "Thar": 7000, "Scorpio-N": 8000, "XUV700": 9000, "XUV400": 8500, "Marazzo": 6500, default: 6500
    },
    Kia: {
      "Sonet": 5200, "Seltos": 6000, "Carens": 6200, "K5": 7000, "Sportage": 7500, 
      "Sorento": 9500, "Telluride": 12000, "Carnival": 13000, "EV6": 15000, "EV9": 22000, default: 6000
    },
    Volkswagen: {
      "Polo": 4500, "Golf": 5500, "Virtus": 5800, "Taigun": 6000, "Jetta": 6800, 
      "Passat": 8500, "Arteon": 9500, "Tiguan": 10000, "ID.4": 13000, "Touareg": 16000, default: 6000
    },
    Skoda: {
      "Fabia": 4400, "Slavia": 5800, "Kushaq": 6000, "Octavia": 8500, "Superb": 11000, 
      "Kodiaq": 11500, "Enyaq": 14500, default: 6000
    },
    Ford: {
      "EcoSport": 5000, "Focus": 5200, "Escape": 6000, "Edge": 7500, "Explorer": 11000, 
      "Ranger": 9500, "Bronco": 12000, "F-150": 14000, "Everest": 13000, "Mustang": 18000, default: 7500
    },
    Chevrolet: {
      "Bolt EV": 6500, "Malibu": 6000, "Trailblazer": 6800, "Equinox": 7200, "Tahoe": 13500, 
      "Suburban": 14500, "Silverado": 14000, "Camaro": 16000, "Corvette": 26000, default: 7500
    },
    BMW: {
      "X1": 12000, "3 Series": 14000, "i4": 16000, "X3": 16500, "5 Series": 18000, 
      "X5": 22000, "iX": 25000, "7 Series": 28000, "X7": 30000, "M3": 26000, 
      "M4": 27000, "Z4": 22000, default: 18000
    },
    MercedesBenz: {
      "A-Class": 13000, "GLA": 13500, "C-Class": 15000, "GLB": 15500, "GLC": 18000, 
      "E-Class": 20000, "EQE": 22000, "GLE": 24000, "GLS": 32000, "S-Class": 35000, 
      "EQS": 36000, "G-Class": 40000, default: 20000
    },
    Audi: {
      "A3": 11500, "Q3": 12500, "A4": 13500, "Q5": 16000, "A6": 17500, 
      "Q7": 22000, "A8": 27000, "Q8": 28000, "e-tron": 26000, "RS6": 35000, "R8": 42000, default: 17000
    },
    Nissan: {
      "Magnite": 4200, "Sentra": 4800, "Versa": 4400, "Altima": 5500, "Leaf": 6500, 
      "Rogue": 7000, "Maxima": 7500, "Pathfinder": 10500, "Z": 14000, "Patrol": 22000, "GT-R": 32000, default: 5500
    },
    Renault: {
      "Kwid": 3200, "Kiger": 4400, "Triber": 4500, "Clio": 4200, "Captur": 5200, 
      "Duster": 5800, "Arkana": 6500, "Megane": 6000, "Zoe": 7000, default: 4500
    }
  },
  Bike: {
    Yamaha: {
      "Fascino": 1100, "RayZR": 1150, "FZ": 1600, "FZ-X": 1700, "Aerox 155": 1900, 
      "MT-15": 2200, "R15": 2400, "MT-07": 5500, "Tenere 700": 7000, "MT-09": 8500, 
      "R6": 9500, "R1": 16000, default: 1800
    },
    RoyalEnfield: {
      "Hunter": 2200, "Bullet": 2400, "Classic 350": 2600, "Meteor 350": 2800, 
      "Scram 411": 3000, "Himalayan 450": 3500, "Interceptor 650": 4500, 
      "Continental GT 650": 4800, "Shotgun 650": 5000, "Super Meteor 650": 5500, default: 2800
    },
    Honda: {
      "Activa": 1100, "Shine": 1300, "SP 125": 1350, "Unicorn": 1500, "Hornet 2.0": 1800, 
      "CB200X": 1950, "H'ness CB350": 2600, "CB350RS": 2700, "CB650R": 6500, 
      "Transalp 750": 8500, "Africa Twin": 12000, "CBR1000RR-R": 18000, "Gold Wing": 22000, default: 1500
    },
    Suzuki: {
      "Access 125": 1150, "Burgman Street": 1250, "Gixxer 155": 1650, "Gixxer SF 250": 2400, 
      "V-Strom SX 250": 2600, "V-Strom 800DE": 8000, "Katana": 11000, "GSX-R1000": 15000, "Hayabusa": 16000, default: 1600
    },
    KTM: {
      "Duke 200": 2200, "RC 200": 2300, "Duke 250": 2500, "Adventure 250": 2700, 
      "Duke 390": 3500, "RC 390": 3600, "Adventure 390": 3800, "Duke 790": 8000, "Duke 1290 Super Duke R": 15000, default: 2500
    },
    Kawasaki: {
      "Ninja 300": 4000, "Ninja 400": 4800, "Z650": 6000, "Ninja 650": 6500, 
      "Versys 650": 7000, "Vulcan S": 7200, "Z900": 8500, "Ninja ZX-6R": 11000, 
      "Ninja ZX-10R": 17000, "Ninja H2R": 30000, default: 6000
    },
    BMW_Motorrad: {
      "G 310 R": 3200, "G 310 GS": 3500, "F 850 GS": 9000, "R nineT": 12500, 
      "R 1250 GS": 16000, "R 1300 GS": 18000, "K 1600 B": 22000, "S 1000 RR": 18500, "M 1000 RR": 28000, default: 8000
    },
    Ducati: {
      "Scrambler 800": 7500, "Monster": 9000, "DesertX": 12000, "Hypermotard": 11500, 
      "Multistrada V4": 17000, "Streetfighter V4": 18000, "Diavel V4": 19000, 
      "Panigale V2": 15000, "Panigale V4": 22000, default: 12000
    },
    Triumph: {
      "Speed 400": 3000, "Scrambler 400 X": 3200, "Trident 660": 6500, "Tiger 900": 10500, 
      "Street Triple 765": 9500, "Bonneville T100": 8500, "Bonneville T120": 10000, 
      "Tiger 1200": 15000, "Rocket 3": 19000, default: 6500
    },
    Bajaj: {
      "Platina": 950, "Pulsar 150": 1400, "Chetak": 1500, "Pulsar NS200": 1800, 
      "Pulsar RS200": 1950, "Pulsar N250": 1900, "Avenger Cruise 220": 1750, 
      "Dominar 250": 2100, "Dominar 400": 2600, "Pulsar NS400Z": 2800, default: 1500
    },
    Hero: {
      "Splendor Plus": 900, "HF Deluxe": 850, "Xoom": 1100, "Passion Pro": 1050, 
      "Glamour": 1150, "Super Splendor": 1150, "Xpulse 200 4V": 1700, 
      "Karizma XMR 210": 2100, "Mavrick 440": 2700, default: 1100
    },
    TVS: {
      "XL100": 750, "Jupiter": 1100, "Ntorq 125": 1250, "iQube": 1450, "Raider 125": 1350, 
      "Apache RTR 160": 1600, "Ronin": 2000, "Apache RTR 200 4V": 1900, 
      "Apache RTR 310": 2600, "Apache RR 310": 2800, default: 1300
    },
    HarleyDavidson: {
      "X440": 3200, "Nightster": 10000, "Sportster S": 13000, "Pan America 1250": 16000, 
      "Fat Boy": 18000, "Breakout": 19000, "Heritage Classic": 20000, 
      "Street Glide": 24000, "Road Glide": 25000, default: 12000
    }
  }
};

  const [type, setType] = useState("Car");
  const [company, setCompany] = useState("Toyota");
  const [model, setModel] = useState("Camry");
  const [duration, setDuration] = useState(1);
  const [quote, setQuote] = useState(null);

  // Reset company and model when type changes
  useEffect(() => {
    const companies = Object.keys(vehicleData[type]);
    setCompany(companies[0]);
    setModel(vehicleData[type][companies[0]][0]);
    setQuote(null); // Clear quote on change
  }, [type]);

  // Reset model when company changes
  useEffect(() => {
    // Safety check: ensure the company actually exists in the current type
    if (vehicleData[type][company]) {
      setModel(vehicleData[type][company][0]);
    }
  }, [company, type]);

const handleCalculate = () => {
  // Safe validation check for state setup
  if (!type || !company || !model) return;

  // 1. Traverse down to the specific type category (Car or Bike)
  const categoryMap = vehicleBasePrices[type];
  
  // 2. Identify the company map or create a dynamic fallback based on Category defaults
  const brandMap = categoryMap?.[company] || { default: type === "Car" ? 5500 : 1800 };
  
  // 3. Extract final adjusted model price or capture brand-wide default
  const base = brandMap[model] || brandMap.default;

  const years = Number(duration);
  
  if (!isNaN(years) && years > 0) {
    const totalQuote = base * years * 1.18; // Apply tax/premium adjustment factor
    
    // Updates quote to an elegant localized string format with fixed decimal formatting
    setQuote(
      totalQuote.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    );
  }
};

  return (
    <>
      <InnerHeader />
      <div className="premium-wrapper">
        <div className="premium-card">
          <div className="form-side">
            <h2 className="title-navy">Quick Premium Estimator</h2>
            <p className="subtitle">Select your vehicle details to see respective models.</p>
            
            <div className="grid-inputs">
              <div className="input-group">
                <label>Vehicle Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {Object.keys(vehicleData).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Company</label>
                <select value={company} onChange={(e) => setCompany(e.target.value)}>
                  {/* FIX 1: Added Optional Chaining and fallback to empty array */}
                  {Object.keys(vehicleData[type] || {}).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Model</label>
                <select value={model} onChange={(e) => setModel(e.target.value)}>
                  {/* FIX 2: Safety check to ensure company exists in current type before mapping */}
                  {(vehicleData[type][company] || []).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Duration (Years)</label>
                <input 
                  type="number" 
                  min="1" 
                  value={duration} 
                  onChange={(e) => setDuration(Number(e.target.value))} 
                />
              </div>
            </div>

            <button className="btn-calculate" onClick={handleCalculate}>
              Calculate Quote
            </button>
          </div>

          <div className={`result-side ${quote ? "active" : ""}`}>
            {!quote ? (
              <div className="placeholder-text">Waiting for your selection...</div>
            ) : (
              <div className="quote-display">
                <span className="label-white">Summary for {model}</span>
                <h1 className="amount-yellow">₹{quote}</h1>
                <div className="breakdown-list">
                  <p>📍 {company} India Coverage</p>
                  <p>⏱️ {duration} Year(s) Tenure</p>
                  <p>💎 Comprehensive Protection</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}