import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const Game = () => {

    const location = useLocation();
    const {  gameName } = location.state;

    const [croatianWords, setCroatianWords] = useState([]);
    const [wordsWithPositions, setWordsWithPositions] = useState([]);
    const { gameId } = useParams();
    const [generated, setGenerated] = useState(false);

    const [grid, setGrid] = useState([]);

    const startGame = () => {
        loadGame(gameId);
    }

    const loadGame = async (gameId) => {
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/game', {
                gameId: gameId,
            });
            const { croatianWords, foreignWords } = response.data;
            setCroatianWords(croatianWords);
            setWordsWithPositions(foreignWords);
            console.log(foreignWords);

            generateGrid(foreignWords);
            setGenerated(true);


            //upisi u hrv i strane rijeci
            //hrv rijeci idu zapravo samo u rijeci a strane rijeci se s positionima raspored u grid
            
        } catch(error) {
            console.error('Error loading game: ', error);
        }
    }

    const generateGrid = (words) => {
        const tmp = [];
        for(let i = 0; i < 15; i++) {
            const row = [];
            for(let j = 0; j < 15; j++) {
                row.push('0');
            }
            tmp.push(row);
        }
        setGrid(tmp);

        console.log("Starting grid.");
    
        for(let i = 0; i < words.length; i++) {
            const wordData = words[i];
    
            const startPosition = wordData.start.split(',');
            const start_x = parseInt(startPosition[0]);
            const start_y = parseInt(startPosition[1]);
            console.log(startPosition + " --- " + start_x + "  " + start_y);
    
            const word = wordData.word;
            const letters = [...word];
    
            const direction = wordData.direction;
            let step_x = 0, step_y = 0;
    
            if(direction === "leftright") {
                step_x = 1;
                step_y = 0;
            } else if(direction === "updown") {
                step_x = 0;
                step_y = 1;
            } else if(direction === "diagonalup") {
                step_x = 1;
                step_y = -1;
            } else if(direction === "diagonaldown") {
                step_x = 1;
                step_y = 1;
            }
    
            let letterPosition_x = start_x;
            let letterPosition_y = start_y;
    
            for(let j = 0; j < letters.length; j++) {
                tmp[letterPosition_y][letterPosition_x] = letters[j];
                letterPosition_x += step_x;
                letterPosition_y += step_y;
                console.log("Upisala slovo ", letters[j], " na mjesto: ", letterPosition_x, "  ", letterPosition_y);
                setGrid(tmp);
            }

            console.log("Upisala rijec ", word);
        }

        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 15; j++) {
                if(grid[i][j] === '0') {
                    const randomIndex = Math.floor(Math.random() * 26);
                    const asciiCode = randomIndex + 65;
                    const randomLetter = String.fromCharCode(asciiCode);
                    tmp[i][j] = randomLetter;
                }
            }
        }

        setGrid(tmp);


    };

    const renderGrid = () => {
        return (
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, cellIndex) => (
                            <div key={cellIndex} className="cell">
                                {cell}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };
  



    return (
        <div className="containerWholeGame">
            <div className="containerGame">

            {generated && (
                <div>
                <h1 className="gameTitle">{gameName}</h1>
                <div className="field">{renderGrid()}</div>
                </div>
            )}

            {!generated && (
                <button onClick={startGame}>Učitaj Igru</button>
            )}

            </div>

            <div className="containerWords">
                <h1 className="gameTitle">Tražimo<br></br>ove riječi:</h1>

                <ul>
                    {croatianWords.map((wordObj, index) => (
                        <li className="wordList"key={index}>{wordObj.word}</li> 
                    ))}
                </ul>



            </div>
        </div>
        
    );
}