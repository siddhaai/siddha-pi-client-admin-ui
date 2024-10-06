// Loader.js
import React from 'react';
import './Loader.css';

// custom loader html structure
const Loader = () => (
  //  Plus loader
  // <div className="loader-overlay">
  //   <div className="loader" />
  // </div>

  // /* Circle loader */
  // <div className="loader-container">
  //   <div class="loader"></div>
  // </div>
  <div class="loader-wrapper">
    <div class="loader-body">
      <span class="loader"></span>
    </div>
  </div>
);

export default Loader;
