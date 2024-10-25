import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { QRCodeCanvas } from "qrcode.react"; // Correct import

function Dashboard() {
  const [qrCode, setQrCode] = useState(null); // State to store the QR code

  // Function to handle API call and fetch QR code
  const generateQrCode = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/get-qr", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const qrCodeData = response.data.qrCode;
      setQrCode(qrCodeData); // Save the QR code in state
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "400px", // Adjust the height as needed
                padding: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "10px",
              }}
            >
              <CardContent
                style={{
                  flexGrow: 1, // This will push the button to the bottom
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Display the QR Code if available */}
                {qrCode ? (
                  <QRCodeCanvas
                    value={qrCode}
                    size={200}
                    bgColor="#FFFFFF" // Background color
                    fgColor="#000" // Foreground color
                  />
                ) : (
                  <div
                    style={{
                      height: "200px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#bbb",
                      fontSize: "1.2rem",
                    }}
                  >
                    QR Code will appear here
                  </div>
                )}
              </CardContent>

              <CardActions style={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generateQrCode}
                  style={{
                    fontSize: "18px",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    borderRadius: "5px",
                  }}
                >
                  Generate QR
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
