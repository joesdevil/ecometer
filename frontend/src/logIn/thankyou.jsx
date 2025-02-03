import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../landingPage/Navbar';
import backgroundImage from '../../public/Section.png'; // Adjust the import based on your actual file structure
const ThankYou = () => {
    return (
        <div  style={styles.background} >
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.heading}>Thank You for Signing Up!</h1>
                <p style={styles.message}>Your account has been successfully created.</p>
                <p style={styles.message}>You will get an email after we review your account to answer questions needed</p>
                 
            </div>
        </div>
    );
};

const styles = {
    background:{
        backgroundImage: 'url(' + backgroundImage + ')',
        backgroundSize: 'cover',
        height: '100vh',
    }
   ,
    container: {
        paddingTop:350+'px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        textAlign: 'center',
        color: '#fff', 
        borderRadius: '10px',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '1rem',
    },
    message: {
        fontSize: '1.2rem',
        marginBottom: '2rem',
    },
    link: {
        fontSize: '1rem',
        color: '#fff',
        textDecoration: 'none',
    },
};

export default ThankYou;