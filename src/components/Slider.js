import React, { Component } from "react";
import Image from "react-bootstrap/Image";

class Slider extends Component {
  render() {
    return (
      <div className="slideshow-wrapper">
        <a href="#" className="arrow-l"></a>
        <div id="slideshow">
          <div className="slide2">
            <div className="slide-grid">
              <div className="hide-b768"></div>
              <div className="slide-txt">
                <Image src="../images/logo-white.png" />
                <h2>Find buyers and browse art</h2>
                <ul>
                  <li>Browse recommended artwork and engage with artists.</li>
                  <li>Share information, interests, influences and more.</li>
                  <li>
                    Registered users view more relevant content improving
                    experience.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="slide1" style={{ display: "none" }}>
            <div className="slide-grid">
              <div className="hide-b768"></div>
              <div className="slide-txt">
                <Image src="../images/logo-white.png" />
                <h2>Connect and engage</h2>
                <ul>
                  <li>
                    Engage with artists and communicate through discussion.
                  </li>
                  <li>Share and experience local events.</li>
                  <li>
                    Discover more, learn more and follow your favorite artists.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="slide3" style={{ display: "none" }}>
            <div className="slide-grid">
              <div className="hide-b768"></div>
              <div className="slide-txt">
                <Image src="../images/logo-white.png" />
                <h2>Sell and buy art</h2>
                <ul>
                  <li>
                    Sophisticated search and analytics help price your artwork.
                  </li>
                  <li>
                    Save time and money. No need to pay to attend shows,
                    representation, advertising or promotion.
                  </li>
                  <li>
                    Buy and sell with confidence using our advanced tracking and
                    authentication tools.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <a href="#" className="arrow-r"></a>
      </div>
    );
  }
}

export default Slider;
