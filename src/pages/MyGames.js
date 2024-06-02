import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";





export const MyGames = () => {
    const [teacherId, setTeacherId] = useState('');
    const [gamesList, setGamesList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTeacherId = localStorage.getItem("userId");
        if (storedTeacherId) {
            setTeacherId(storedTeacherId);
            fetchMyGames(storedTeacherId);
        }
    }, []);

    const fetchMyGames = async (teacherId) => {
        try {
            const response = await axios.post(
                'http://localhost:3001/api/myGames/teacher', {
                teacherId: teacherId,
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
        navigate(`/game/${gameId}`, {state: { gameName } });

    };

    return (
        <div className='containerMyGames'>

            <h2>Moje igre</h2>
            <p>Teacher ID: {teacherId}</p>
            <ul>
                {gamesList.map(game => (
                    <div key={game.id} className="gameItem">
                        <li onClick={() => handleClick(game.id, game.name)}>{game.name}</li>
                    </div>
                ))}
            </ul>

        </div>
    );
};
