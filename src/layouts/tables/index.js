import React, { useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Alert,
  Typography,
} from "@mui/material";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox"; // Make sure to import MDBox

function Tables() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(""); // State to store error messages
  const [success, setSuccess] = useState(""); // State to store success message

  // Handle the file change for the image upload
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  // Handle the message input change
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Handle form submission to the API
  const handleSendMessage = async () => {
    setError(""); // Reset error state
    setSuccess(""); // Reset success state

    //(check if message or image is missing)
    if (!message && !image) {
      setError("Please provide either a message and an image.");
      return;
    }

    // Prepare form data
    const formData = new FormData();

    if (message && !image) {
      formData.append("message", message);
    } else if (!message && image) {
      formData.append("image", image);
    } else if (message && image) {
      formData.append("message", message);
      formData.append("image", image);
    } else {
      setError("Please provide either a message and an image.");
    }

    try {
      // Send message and image to the backend
      const response = await axios.post("http://localhost:3000/api/send-message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for authentication
        },
      });

      // Handle the response from the backend
      if (response.data.message === "Messages sent to all active contacts") {
        setSuccess("Message sent successfully!"); // Show success message
        setMessage(""); // Clear message input
        setImage(null); // Clear image input
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (error) {
      // Handle network or server errors
      setError("An error occurred while sending the message. Please try again later.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card
              style={{
                padding: "2.5rem 1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                {error && (
                  <Alert severity="error" style={{ marginBottom: "1.5rem" }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" style={{ marginBottom: "1.5rem", color: "green" }}>
                    {success}
                  </Alert>
                )}

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Write a message :
                </Typography>
                <TextField
                  label="Message"
                  placeholder="Type your message here..."
                  multiline
                  rows={5}
                  fullWidth
                  value={message}
                  onChange={handleMessageChange}
                  variant="outlined"
                  style={{ marginBottom: "1.5rem" }}
                />

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Select an image :
                </Typography>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                  style={{ marginBottom: "1.5rem", display: "block", width: "100%" }}
                />
              </CardContent>

              <CardActions style={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  style={{
                    fontSize: "16px",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    borderRadius: "5px",
                  }}
                >
                  Send Message
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

export default Tables;
