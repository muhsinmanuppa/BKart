import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>BKart</h5>
            <p>Your trusted online shopping destination</p>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>📞 +91 999 666 111</li>
              <li>✉️ support@bkart.com</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Address</h5>
            <address>
              BKart Retail Store<br />
              Perinthalmanna, Kerala<br />
              PIN: 679338
            </address>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="mb-0">© 2024 BKart. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;