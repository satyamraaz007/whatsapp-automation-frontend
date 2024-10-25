import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Billing() {
  const [selectedOption, setSelectedOption] = useState("input");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [numbers, setNumbers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editPhoneNumber, setEditPhoneNumber] = useState("");

  // Fetch WhatsApp numbers from the API
  const fetchNumbers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/numbers");
      setNumbers(response.data);
    } catch (error) {
      setError("Failed to fetch numbers.");
    }
  };

  useEffect(() => {
    fetchNumbers(); // Fetch numbers when the component loads
  }, []);

  // Handle phone number input change
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle adding number via input field
  const handleAddByInput = async () => {
    setError("");
    setSuccess("");

    if (!phoneNumber) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/numbers",
        {
          number: phoneNumber,
          status: "ACTIVE",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data) {
        setSuccess("Phone number added successfully!");
        setPhoneNumber(""); // Clear input
        fetchNumbers(); // Fetch updated numbers
      }
    } catch (error) {
      setError("Failed to add phone number. Please try again.");
    }
  };

  // Handle adding number via file upload
  const handleAddByFile = async () => {
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please upload a valid .xlsx or .csv file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3000/api/numbers/add-numbers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setSuccess("File uploaded and numbers added successfully!");
        setFile(null); // Clear file input
        fetchNumbers(); // Fetch updated numbers
      }
    } catch (error) {
      setError("Failed to upload file. Please try again.");
    }
  };

  // Toggle status (ACTIVE/DEACTIVE)
  const handleToggleStatus = async (id, currentStatus, currentNumber) => {
    const updatedStatus = currentStatus === "ACTIVE" ? "DEACTIVE" : "ACTIVE";

    try {
      await axios.put(`http://localhost:3000/api/numbers/${id}`, {
        number: currentNumber, // Keep the current number the same
        status: updatedStatus, // Update only the status
      });
      fetchNumbers(); // Fetch updated numbers
    } catch (error) {
      setError("Failed to update status.");
    }
  };

  // Handle delete number
  const handleDeleteNumber = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/numbers/${id}`);
      fetchNumbers(); // Fetch updated numbers
    } catch (error) {
      setError("Failed to delete number.");
    }
  };

  // Handle edit number
  const handleEditNumber = async (id) => {
    try {
      const numberToUpdate = numbers.find((number) => number.id === id);
      await axios.put(`http://localhost:3000/api/numbers/${id}`, {
        number: editPhoneNumber || numberToUpdate.phone_number, // Update the number (or keep the previous one if not edited)
        status: numberToUpdate.status, // Keep the current status the same
      });
      setEditId(null); // Exit edit mode
      setEditPhoneNumber(""); // Clear input
      fetchNumbers(); // Fetch updated numbers
    } catch (error) {
      setError("Failed to update number.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>Add WhatsApp Number</div>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {/* First Card: Add by input field */}
            <Card
              sx={{
                backgroundColor: selectedOption === "input" ? "#1A73E8" : "#fff",
                color: selectedOption === "input" ? "#fff" : "#000", // Setting card text color
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              onClick={() => setSelectedOption("input")}
            >
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  style={{ color: selectedOption === "input" ? "#fff" : "#000" }} // Conditional color for text
                >
                  Add by input field
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {/* Second Card: Add by excel file */}
            <Card
              sx={{
                backgroundColor: selectedOption === "file" ? "#1A73E8" : "#fff",
                color: selectedOption === "file" ? "#fff" : "#000",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              onClick={() => setSelectedOption("file")}
            >
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  style={{ color: selectedOption === "input" ? "#000" : "#fff" }}
                >
                  Add by excel file
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Second Row: Dynamic UI based on selection */}
        <Grid container spacing={3} justifyContent="center" mt={3}>
          <Grid item xs={12} md={8} lg={6}>
            <Card sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <CardContent>
                {selectedOption === "input" && (
                  <div style={{ padding: "1.5rem 0" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Phone Number
                    </Typography>
                    <TextField
                      label="Phone Number"
                      type="tel"
                      fullWidth
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="Enter WhatsApp number"
                      variant="outlined"
                      style={{ marginBottom: "1.5rem", marginTop: "1rem" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleAddByInput}
                      style={{ color: "white", fontSize: "16px" }}
                    >
                      Add
                    </Button>
                  </div>
                )}

                {selectedOption === "file" && (
                  <div style={{ padding: "1.5rem 0" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Select File{" "}
                      <span style={{ color: "#c30010" }}>(.xlsx & .csv format only)</span>
                    </Typography>
                    <input
                      accept=".xlsx,.csv"
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: "block", marginBottom: "1.5rem", marginTop: "1rem" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleAddByFile}
                      style={{ color: "white", fontSize: "16px" }}
                    >
                      Add
                    </Button>
                  </div>
                )}

                {error && (
                  <Alert severity="error" style={{ marginTop: "1rem" }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" style={{ marginTop: "1rem" }}>
                    {success}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Third Row: Display phone numbers */}
        <Grid container spacing={3} justifyContent="center" mt={3}>
          <Grid item lg={12}>
            {/* <Card sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}> */}
            <CardContent>
              <Typography gutterBottom style={{ fontSize: "20px", fontWeight: "700" }}>
                Added WhatsApp Numbers
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead></TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ fontSize: "16px", fontWeight: "700" }}>Sl No.</TableCell>
                      <TableCell style={{ fontSize: "16px", fontWeight: "700" }}>
                        Phone Number
                      </TableCell>
                      <TableCell style={{ fontSize: "16px", fontWeight: "700" }}>Status</TableCell>
                      <TableCell style={{ fontSize: "16px", fontWeight: "700" }}>Edit</TableCell>
                      <TableCell style={{ fontSize: "16px", fontWeight: "700" }}>Delete</TableCell>
                    </TableRow>
                    {numbers.map((number, index) => (
                      <TableRow key={number.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {editId === number.id ? (
                            <TextField
                              value={editPhoneNumber}
                              onChange={(e) => setEditPhoneNumber(e.target.value)}
                              variant="outlined"
                              placeholder={number.phone_number} // Show previous number in input
                            />
                          ) : (
                            number.phone_number
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={number.status === "ACTIVE"}
                            onChange={() =>
                              handleToggleStatus(number.id, number.status, number.phone_number)
                            }
                            color="primary"
                          />
                          {number.status}
                        </TableCell>
                        <TableCell>
                          {editId === number.id ? (
                            <Button onClick={() => handleEditNumber(number.id)}>Save</Button>
                          ) : (
                            <IconButton
                              onClick={() => {
                                setEditId(number.id);
                                setEditPhoneNumber(number.phone_number); // Pre-fill the input with the current number
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleDeleteNumber(number.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {error && (
                <Alert severity="error" style={{ marginTop: "1rem" }}>
                  {error}
                </Alert>
              )}
            </CardContent>
            {/* </Card> */}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
