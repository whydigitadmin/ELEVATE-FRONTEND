import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useState } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import HeaderClient from './ClientHeader';
import './clientReport.css';

const clientReportData = [
  { name: 'Order Booking', code: 'EL-1 (OB) XXX FY25' },
  { name: 'Sales', code: 'EL-2 (SL) XXX FY25' },
  { name: 'Other Income', code: 'EL-3 (OI) XXX FY25' },
  { name: 'Purchase', code: 'EL-4 (PUR) XXX FY25' },
  { name: 'Stock', code: 'EL-5 (ST) XXX FY25' },
  { name: 'Conversion Expenses', code: 'EL-6 (CE) XXX FY25' },
  { name: 'Over Heads', code: 'EL-7 (OH) XXX FY25' },
  { name: 'Finance Expenses', code: 'EL-8 (FE) XXX FY25' },
  { name: 'P & L', code: 'EL-9 (PL) XXX FY25' },
  { name: 'Balance Sheet', code: 'EL-10 (BSS) XXX FY25' },
  { name: 'Fixed Assets', code: 'EL-11 (FA) XXX FY25' },
  { name: 'Cash Flow', code: 'EL-12 (CF) XXX FY25' },
  { name: 'AC Receivable', code: 'EL-13 (AR) XXX FY25' },
  { name: 'AC Payable', code: 'EL-14 (AP) XXX FY25' },
  { name: 'Head Count', code: 'EL-15 (HC) XXX FY25' },
  { name: 'Ration Analysis', code: 'EL-16 (RA) XXX FY25' },
  { name: 'Drawing Power Calculation', code: 'EL-17 (DPC) XXX FY25' },
  { name: 'Incremental Profit', code: 'EL-18 (IP) XXX FY25' },
  { name: 'Manpower Efficiency', code: 'EL-19 (MPE) XXX FY25' },
  { name: 'Machinery Efficiency', code: 'EL-20 (ME) XXX FY25' },
  { name: 'Common Expenses', code: 'EL-21 (C) XXX FY25' },
  { name: 'Customer Profitability', code: 'EL-23 (CP) XXX FY25' },
  { name: 'Product - Project Profitability', code: 'EL-23 (PPP) XXX FY25' }
];

const ClientReport = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000); // Hide confetti after 3 seconds
  };

  const handleLogout = () => {
    console.log('Logged out');
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} />}

      <Dialog
        open={isPopupOpen}
        onClose={handlePopupClose}
        maxWidth="xs" // Keep the dialog width small
        PaperProps={{
          style: {
            borderRadius: '12px', // Slightly smaller border radius for a modern look
            padding: '15px', // Reduced padding for a more compact dialog
            textAlign: 'center',
            background: 'linear-gradient(to right, #00c6ff, #0072ff)', // Sea blue color gradient
            color: '#fff'
          }
        }}
      >
        <DialogContent>
          <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold' }}>
            Welcome Ramesh!
          </Typography>
          <Typography variant="h5" style={{ fontSize: '14px', marginTop: '10px' }}>
            Your monthly report is prepared and ready for download. Click below to review the details and stay updated.
          </Typography>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/2917/2917763.png"
            alt="Welcome Icon"
            sx={{ width: '60px', height: '60px', margin: '20px auto' }} // Reduced size of the image
          />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center' // Center-align the button
            // Reduced the space between the image and the button
          }}
        >
          <Button
            onClick={handlePopupClose}
            variant="contained"
            style={{
              backgroundColor: '#00796b', // Sea green button background color
              color: '#fff', // Button text color
              fontWeight: 'bold',
              borderRadius: '50px',
              padding: '8px 30px', // Adjusted padding for the button
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // Box shadow for depth
              transition: 'transform 0.2s ease' // Add hover effect
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')} // Hover effect
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ marginBottom: '40px' }}>
        <HeaderClient username={'PRIME GOLD INTERNATIONAL LIMITED'} onLogout={handleLogout} />
      </div>
      <div className="ag-format-container">
        <div className="ag-courses_box">
          {clientReportData.map((item, index) => (
            <div key={index} className="ag-courses_item">
              <div className="ag-courses-item_link">
                <div className="ag-courses-item_bg"></div>
                <div className="ag-courses-item_title">{item.name}</div>
                <div className="ag-courses-item_date-box">
                  Code : &nbsp;
                  <span className="ag-courses-item_date">{item.code}</span>
                </div>
                <div
                  className="mt-2 ag-courses-item_date-box"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    color: '#fff',
                    marginLeft: '20%',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={'https://cdn-icons-png.flaticon.com/128/10007/10007105.png'}
                    width={20}
                    height={20}
                    alt="Download Icon"
                    style={{ marginRight: '4px' }}
                  />
                  <span style={{ fontWeight: '500' }}>Download</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientReport;
