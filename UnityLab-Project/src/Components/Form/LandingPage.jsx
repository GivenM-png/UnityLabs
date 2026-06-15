import React from 'react';
import './LandingPage.css';


const LandingPage = () => {
    return (
        <div className="LandingPage">
            <header className='header'>
                <div className='logo'>SKHUL</div>
                <button className='auth-button'>Register/Login</button>
            </header>
            <main className='main-content'>
                <h1>Apply To All 26 South African Universities.</h1>
                <p>One Form, One Login.</p>
                </main>
        </div>
    );
}
export default LandingPage;