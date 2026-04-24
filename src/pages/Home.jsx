import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css"

export default function Home() {
  return (
    <>
      <Header />
      <div className="content">
        <div className="carousel">
          <div
            id="insuranceCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#insuranceCarousel"
                data-bs-slide-to="0"
                className="active"
              ></button>
              <button
                type="button"
                data-bs-target="#insuranceCarousel"
                data-bs-slide-to="1"
              ></button>
              <button
                type="button"
                data-bs-target="#insuranceCarousel"
                data-bs-slide-to="2"
              ></button>
              <button
                type="button"
                data-bs-target="#insuranceCarousel"
                data-bs-slide-to="3"
              ></button>
              <button
                type="button"
                data-bs-target="#insuranceCarousel"
                data-bs-slide-to="4"
              ></button>
            </div>

            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="img1.png"
                  className="d-block w-100"
                  alt="Car Insurance"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Drive with Confidence</h5>
                  <p>Comprehensive two-wheeler insurance for every journey.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="img2.png"
                  className="d-block w-100"
                  alt="Bike Insurance"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Ride Protected</h5>
                  <p>Four-wheeler insurance designed for driver's safety.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="img3.png"
                  className="d-block w-100"
                  alt="Commercial Vehicle Insurance"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Importance of Renewal</h5>
                  <p>Tailored coverage for business and commercial vehicles.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="img4.png"
                  className="d-block w-100"
                  alt="Commercial Vehicle Insurance"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Importance of Renewal</h5>
                  <p>Tailored coverage for business and commercial vehicles.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="img5.png"
                  className="d-block w-100"
                  alt="Commercial Vehicle Insurance"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Importance of Renewal</h5>
                  <p>Tailored coverage for business and commercial vehicles.</p>
                </div>
              </div>
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#insuranceCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#insuranceCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="Home-about">
        <h1>About Us</h1>
        <p>
          At Shield General, we specialize in protecting drivers and their vehicles.
          Whether you own a car, bike, or commercial fleet, our mission is to
          keep you safe on the road and financially secure in case of accidents,
          theft, or damage.
        </p>
      </div>

      <div className="Home-contact">
        <h1>Contact Us</h1>
        <form id="ContactUs">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />

          <label htmlFor="query">Ask your Query</label>
          <textarea id="query" name="query" rows="4" cols="10"></textarea>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}
