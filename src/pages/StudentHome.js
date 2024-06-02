import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";





export const StudentHome = () => {
    const [classId, setClassId] = useState('');
    const [username, setUsername] = useState('');
    const [gamesList, setGamesList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        /*kod logina zapiši class id kada izabereš raz i mozda student id */
        const storedClassId = localStorage.getItem("classId");
        if (storedClassId) {
            setClassId(storedClassId);
            setUsername(localStorage.getItem("username"));
            fetchMyGames(storedClassId);
        }
    }, []);

    const fetchMyGames = async (classId) => {
        try {
            const response = await axios.post(
                'http://localhost:3001/api/myGames/student', {
                classId: classId,
            });
            //console.log(response.data.games);
            //setGamesList(response.data.games);

            const extractedGames = response.data.rows.map(game => ({
                id: game.id,
                name: game.name
            }));
            setGamesList(extractedGames);


        } catch(error) {
            console.error('Error fetching games: ', error);
        }
    };

    const handleClick = (gameId, gameName) => {
        //tu samo upamtim gameId i idem na stranicu game
        //na toj cu stranici otvarati igru
        navigate(`/gameStudent/${gameId}`, {state: { gameName } });
    };


    const handleLogOut = () => {
        localStorage.clear();
        navigate("/");
    }
    

    return (
        <div className='containerMyGames'>

            <h2>Moje igre</h2>
            <h3>Class id: {classId}</h3>
            <h3>Username: {username}</h3>
            <ul>
                {gamesList.map(game => (
                    <div key={game.id} className="gameItem">
                        <li onClick={() => handleClick(game.id, game.name)}>{game.name}</li>
                    </div>
                ))}
            </ul>

            <button className="gameButton" onClick={handleLogOut}>Odjavi se</button>

        </div>
    );
};
