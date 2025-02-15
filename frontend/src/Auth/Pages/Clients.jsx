import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, List, ListItem, Typography, CircularProgress, Box, Button, Avatar } from '@mui/material';
import { Grid } from '@mui/material';
import { toast } from 'react-toastify';
import SideBar from "../Components/SideBar";
import AppBarComponent from "../Components/AppBarComponent";
import { PictureAsPdf } from '@mui/icons-material';

const Clients = ({ showFirstMain }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questionsPercentage, setQuestionsPercentage] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`http://localhost:3000/api/clients/getAll`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setClients(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the clients!', error);
                setLoading(false);
            });
    }, []);

    const handleSendEmail = async (clientId) => {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        try {
            const response = await axios.post("http://localhost:3000/api/clients/reverifyClient", { clientId }, { headers });
            if (response.status === 200) {
                toast.success(response.data.msg);
            } else {
                toast.error(response.data.msg);
            }
        } catch (error) {
            toast.error('There was an error sending the email!');
        }
    };

    const handleGetQuestions = async (clientId) => {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        try {
            const response = await axios.get(`http://localhost:3000/api/clients/getQstsforClient/${clientId}`, { headers });
            // if (response.status === 200) {
                let totalQuestions = 0;
                let answeredQuestions = 0;

                Object.values(response.data.data).forEach(sheet => {
                    Object.values(sheet).forEach(answer => {
                        totalQuestions++;
                        if (answer) {
                            answeredQuestions++;
                        }
                    });
                });

                const percentageAnswered = (answeredQuestions / totalQuestions) * 100;
                setQuestionsPercentage(prevState => ({
                    ...prevState,
                    [clientId]: `${percentageAnswered.toFixed(2)}%`
                }));
                // toast.info(`Percentage of answered questions: ${percentageAnswered.toFixed(2)}%`);
            // } else {
            //     // toast.error('Failed to fetch questions');
            // }
        } catch (error) {
            console.error('There was an error fetching the questions!', error);
            // toast.error('There was an error fetching the questions!');
        }
    };

    useEffect(() => {
        clients.forEach(client => {
            if (!client.isAdmin){
                handleGetQuestions(client._id);
            }
            
        });
    }, [clients]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const generatePDF=async (clientId)=>{
        const token= localStorage.getItem("token");

        try {
            const response = await axios.get(`http://localhost:3000/api/clients/generatePDF/${clientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob' // 👈 Ensure response is treated as a binary file (Blob)
            });
    
            // Create a Blob URL
            const url = window.URL.createObjectURL(new Blob([response.data]));
    
            // Create a temporary download link
            const a = document.createElement("a");
            a.href = url;
            a.download = "client_report.pdf"; // Change filename if needed
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url); // Cleanup
    
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    }

    return (
        <Grid container>
            <Grid item md={2.1} sx={{ minHeight: "100vh", display: { xs: "none", md: "block" } }}>
                <SideBar />
            </Grid>
            <Grid item md={9.9} xs={12}>
                <Grid container height={"auto"}>
                    <Grid item height={"11vh"} xs={12} sx={{ fontFamily: "Inter, sans-serif" }}>
                        <AppBarComponent title={showFirstMain ? "Rapport" : "Rapport Detaillé"} />
                    </Grid>
                    <Container>
                        <Typography variant="h4" gutterBottom>
                            Clients List
                        </Typography>
                        <List>
                            {clients.map(client => (
                                <ListItem key={client.id}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 2,
                                            borderRadius: 2,
                                            boxShadow: 1,
                                            backgroundColor: '#f9f9f9',
                                            marginBottom: 2,
                                            width: '100%'
                                        }}
                                    >
                                        <Avatar src={client.photo} alt={client.name} sx={{ marginRight: 2 }} />
                                        <Typography variant="h6" sx={{ marginRight: 2 }}>{client.name}</Typography>
                                        <Typography variant="body2" sx={{ marginRight: 2 }}>{client.email}</Typography>
                                        <Typography variant="body2" sx={{ marginRight: 2 }}>
                                            {client.verified ? 'Account is valid' : 'Account is not valid'}
                                        </Typography>
                                        {!client.verified && (
                                            <Button variant="contained" color="primary" onClick={() => handleSendEmail(client._id)}>
                                                Send Email
                                            </Button>
                                        )}
                                        <Typography variant="body2" sx={{ marginRight: 2 }}>
                                        {!client.isAdmin && (
                                            questionsPercentage[client._id] || 'Loading...'
                                        )}
                                        </Typography>
                                        {!client.isAdmin && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                startIcon={<PictureAsPdf />}
                                                onClick={() => generatePDF(client._id)}
                                            >
                                                Download PDF
                                            </Button>
                                        )}
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Container>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Clients;
