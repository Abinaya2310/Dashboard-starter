import React, { useState } from 'react';
import CustomerReview from '../CustomerReview/CustomerReview';
import Popup from '../Popup/Popup';
import Updates from '../Updates/Updates';
import './RightSide.css';

const RightSide = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="RightSide">
     
      <div>
        <h3>Updates</h3>
        <Updates />
      </div>
      <div>
        <h3>Customer Review</h3>
        <CustomerReview />
      </div>

      <Popup show={showPopup} handleClose={togglePopup}>
        <h2>Add New Record</h2>
      </Popup>
    </div>
  );
};

export default RightSide;



