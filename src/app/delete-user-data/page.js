import React from 'react';
import './DeleteRequestPage.css'; // Import the CSS file

const DeleteRequestPage = () => {
  return (
    <div className="container">
      <div className="card">
        <h1 className="heading">Deletion Request</h1>
        <p className="text">
          If you wish to delete all or some of your data for the Scenario app, please contact us at
          <a href="mailto:byte9962@gmail.com" className="link"> byte9962@gmail.com</a> with your deletion request.
        </p>
      </div>
    </div>
  );
};

export default DeleteRequestPage;
