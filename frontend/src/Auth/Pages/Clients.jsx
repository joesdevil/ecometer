import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, List, ListItem, ListItemText, Typography, CircularProgress, Box, Button, Avatar } from '@mui/material';
import { Grid } from '@mui/material';

import { toast } from 'react-toastify';
import SideBar from "../Components/SideBar";
import AppBarComponent from "../Components/AppBarComponent";


const Clients = ({ showFirstMain }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the clients!', error);
                setLoading(false);
            });
    }, []);

    const handleSendEmail = async(clientId) => {
        // Implement the function to send an email
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
          };
          
    
        const response = await axios.post("http://localhost:3000/api/clients/reverifyClient",
        { clientId: clientId },
        { headers: headers }
        );
        
        if(response.status ==200){
            toast.success(response.data.msg)
        }else{
            toast.error(response.data.msg)
        }
        
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    

    return (
        <Grid container>
            {/* Sidebar */}
            <Grid
                item
                md={2.1}
                sx={{ minHeight: "100vh", display: { xs: "none", md: "block" } }}
            >
                <SideBar />
            </Grid>

            {/* Main Content */}
            <Grid item md={9.9} xs={12}>
                <Grid container height={"auto"}>
                    {/* Header */}
                    <Grid
                        item
                        height={"11vh"}
                        xs={12}
                        sx={{ fontFamily: "Inter, sans-serif" }}
                    >
                        <AppBarComponent
                            title={showFirstMain ? "Rapport" : "Rapport Detaillé"}
                        />
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