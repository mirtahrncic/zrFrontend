import React from "react";

import { useNavigate } from 'react-router-dom';




export const Home = () => {

    const navigate = useNavigate();

    const goToTeacherLogin = () => {
        navigate('/login');
    }

    const goToStudentLogin = () => {
        navigate('/studentLogin');
    }


    return (
        <div className="container">
            <div className="naslovna">

                <div className="desno">
                    <img className="nastavnik" src="nastavnik.jpg" alt="slikaNastavnika"></img>
                    <button className="naslovniGumb" onClick={goToTeacherLogin}>Nastavnici</button>
                </div>
                <div className="lijevo">
                    <img className="ucenici" src="ucenici.jpg" alt="slikaUcenika"></img>
                    <button className="naslovniGumb" onClick={goToStudentLogin}>Učenici</button>
                </div>

            </div>
        </div>
    );
}