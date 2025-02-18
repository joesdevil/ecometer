import SideBar from "../Components/SideBar";
import AppBarComponent from "../Components/AppBarComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { toast } from 'react-toastify';

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
    border: '1px solid blue',
    background:"#00f",
    borderRadius: '5px',
    cursor: 'pointer'

};

const QuestionsClients = ({ showFirstMain }) => {
    const [questions, setQuestions] = useState([]);

    // request to get questions
    useEffect(() => {
        const token = localStorage.getItem('token');
        const clientId = localStorage.getItem('clientId');

        axios.get(`http://localhost:3000/api/clients/getQstsforClients`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log("**>", response.data);
                setQuestions(response.data.data);
                // setLoading(false);
            })
            .catch(error => {
                toast.error(error.response.data.msg);
                console.error('There was an error fetching the clients!', error);
                // setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;
        const section = dataset.type;

        setQuestions(prevQuestions => ({
            ...prevQuestions,
            [section]: {
                ...prevQuestions[section],
                [name]: value
            }
        }));
        
    };

    const submit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const clientId = localStorage.getItem('clientId');
        let answered=false
        const totalQuestions = Object.keys(questions).reduce((acc, section) => acc + Object.keys(questions[section]).length, 0);
        const answeredQuestions = Object.keys(questions).reduce((acc, section) => acc + Object.values(questions[section]).filter(answer => answer.trim() !== '').length, 0);
        const answeredPercentage = (answeredQuestions / totalQuestions) * 100;
        if( answeredPercentage.toFixed(0) == 100){
            answered=true
            console.log("full")
        } 

        axios.put(`http://localhost:3000/api/clients/updateQstsforClients`, {
            clientId:clientId,
            data:questions,
            answered:answered
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            toast.success("Questions updated successfully!");
        })
        .catch(error => {
            toast.error(error.response.data.msg);
            console.error('There was an error updating the questions!', error);
        });
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
                <AppBarComponent
                    title={showFirstMain ? "Questionnaires" : "Questionnaires"}
                />
                <Grid container height={"auto"}>

                    <div style={containerStyle}>
                    {questions && Object.keys(questions).length > 0 ? (
                        <>
                            <h1>Carbon Footprint Questionnaire</h1>
                            <form>
                                {Object.keys(questions).map((section, sectionIndex) => (
                                    <div key={sectionIndex}>
                                        <Typography variant="h6" gutterBottom>{section}</Typography>
                                        {Object.keys(questions[section]).map((question, questionIndex) => (
                                            <div key={questionIndex} style={formGroupStyle}>
                                                <label style={labelStyle}>{questionIndex + 1}. {question}</label>
                                                <input
                                                    data-type={section}
                                                    type="text"
                                                    name={question}
                                                    style={inputStyle}
                                                    value={questions[section]?.[question] || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <button onClick={submit} type="submit" style={buttonStyle}>Submit</button>
                            </form>
                        </>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <Typography variant="h6" color="green">
                                ✔ All questions have been answered!
                            </Typography>
                        </Box>
                    )}
                    </div>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default QuestionsClients;
