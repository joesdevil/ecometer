import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import SideBar from "../Components/SideBar";
import AppBarComponent from "../Components/AppBarComponent";
import { Grid, Typography, Select, MenuItem, Button } from "@mui/material";
import { toast } from 'react-toastify'; // Import toast

const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px', 
    borderRadius: '10px', 
};

const formGroupStyle = {
    marginBottom: '15px'
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    borderRadius: '5px',
    border: '1px solid #ccc'
};

const buttonStyle = {
    padding: '10px 20px', 
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

const QuestionsUpload = ({ showFirstMain }) => {
    const [clients, setClients] = useState([]); // Ensure clients is initialized as an empty array
    const [selectedClient, setSelectedClient] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const clientId = localStorage.getItem('clientId');

        axios.get(`http://localhost:3000/api/clients/getAll`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setClients(response.data);
                 
            })
            .catch(error => {
                console.error('There was an error fetching the clients!', error);
                
            });
    }, []);

    const handleClientChange = (event) => {
        setSelectedClient(event.target.value);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setUploadedFile(file);
    };

    const handleAssignFileToClient = async () => {
        if (!selectedClient || !uploadedFile) {
            toast.error("Please select a client and upload a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadedFile); // Ensure the field name is "file"
        formData.append("clientId", selectedClient); 

        try {
            const response = await axios.post(
                "http://localhost:3000/api/clients/uploadQstsforClients",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Required for file uploads
                    },
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message);
            } else {
                toast.error("Failed to upload file.");
            }
        } catch (error) { 
            console.log('error', error);
            toast.error(error.response.data.error);
        }
    };

    return (
        <Grid container>
            {/* Sidebar */}
            <Grid item md={2.1} sx={{ minHeight: "100vh", display: { xs: "none", md: "block" } }}>
                <SideBar />
            </Grid>

            {/* Main Content */}
            <Grid item md={9.9} xs={12}>
                <AppBarComponent title={showFirstMain ? "Questionnaires Upload" : "Questionnaires Upload"} />
                <Grid container height={"auto"}>
                    <div style={containerStyle}>
                        <Typography variant="h1">Carbon Footprint Questionnaire</Typography>
                        
                        {/* Client Selection Dropdown */}
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Select Client:</label>
                            <Select
                                value={selectedClient}
                                onChange={handleClientChange}
                                style={inputStyle}
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Select a client</em>
                                </MenuItem>
                                {clients.map((client) => (
                                    <MenuItem key={client._id} value={client._id}>
                                        {client.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        {/* File Upload Input */}
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Upload Excel File:</label>
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                style={inputStyle}
                                accept=".xlsx, .xls"
                            />
                        </div>

                        {/* Assign Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAssignFileToClient}
                            style={buttonStyle}
                        >
                            Assign File to Client
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default QuestionsUpload;
