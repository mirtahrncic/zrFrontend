import React, { useState } from "react";
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const GameStudent = () => {
    const location = useLocation();
    const { gameName } = location.state;

    const navigate = useNavigate();

    const [croatianWords, setCroatianWords] = useState([]);
    const [wordsWithPositions, setWordsWithPositions] = useState([]);
    const { gameId } = useParams();
    const [generated, setGenerated] = useState(false);
    const [grid, setGrid] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startCell, setStartCell] = useState(null);
    const [selectedCells, setSelectedCells] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [foreignWords, setForeignWords] = useState([]);
    const [foundCroatianWords, setFoundCroatianWords] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);

    const [helpModal, setHelpModal] = useState(false);
    const [letter, setLetter] = useState("");
    const [len, setLen] = useState(0);

    const [relatedCroatianWord, setRelatedCroatianWord] = useState("");



    const startGame = () => {
        setStartTime(Date.now());
        loadGame(gameId);
    };

    const loadGame = async (gameId) => {
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/game', {
                    gameId: gameId
                 });
            const { croatianWords, foreignWordsWithPositions } = response.data;
            setCroatianWords(croatianWords);
            setWordsWithPositions(foreignWordsWithPositions);


            console.log(foreignWordsWithPositions);

            const extractedWords = foreignWordsWithPositions.map(word => ({
                name: word.word
            }));


            console.log(extractedWords);
            setForeignWords(extractedWords);
            generateGrid(foreignWordsWithPositions);
            //setGenerated(true);
        } catch (error) {
            console.error('Error loading game: ', error);
        }
    };

    const generateGrid = (words) => {
        const tmp = Array.from({ length: 15 }, () => Array(15).fill('0'));

        words.forEach(wordData => {
            const [start_x, start_y] = wordData.start.split(',').map(Number);
            const direction = wordData.direction;
            const letters = [...wordData.word];
            let [step_x, step_y] = [0, 0];

            if (direction === "leftright") [step_x, step_y] = [1, 0];
            else if (direction === "updown") [step_x, step_y] = [0, 1];
            else if (direction === "diagonalup") [step_x, step_y] = [1, -1];
            else if (direction === "diagonaldown") [step_x, step_y] = [1, 1];

            letters.forEach((letter, i) => {
                tmp[start_y + i * step_y][start_x + i * step_x] = letter;
            });
        });

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (tmp[i][j] === '0') {
                    const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
                    tmp[i][j] = randomLetter;
                }
            }
        }

        setGrid(tmp);
        setGenerated(true);
    };

    const handleMouseDown = (row, col, event) => {
        event.preventDefault();
        setIsDragging(true);
        setStartCell({ row, col });
        setSelectedCells([{ row, col }]);
    };

    const handleMouseOver = (row, col, event) => {
        event.preventDefault();
        if (isDragging) {
            const cells = calculateSelectedCells(startCell, { row, col });
            setSelectedCells(cells);
        }
    };

    const handleMouseUp = (event) => {
        event.preventDefault();
        setIsDragging(false);
        checkSelectedWord();
    };


    const handleTouchStart = (row, col, event) => {
        event.preventDefault();
        setIsDragging(true);
        setStartCell({ row, col });
        setSelectedCells([{ row, col }]);
    };

    const handleTouchMove = (row, col, event) => {
        event.preventDefault();
        if (isDragging) {
            const touch = event.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const cellRow = target.getAttribute('data-row');
            const cellCol = target.getAttribute('data-col');
            if (cellRow && cellCol) {
                const cells = calculateSelectedCells(startCell, { row: parseInt(cellRow), col: parseInt(cellCol) });
                setSelectedCells(cells);
            }
        }
    };

    const handleTouchEnd = (event) => {
        event.preventDefault();
        setIsDragging(false);
        checkSelectedWord();
    };

    const calculateSelectedCells = (start, end) => {
        const cells = [];
        const dx = end.col - start.col;
        const dy = end.row - start.row;
        const maxSteps = Math.max(Math.abs(dx), Math.abs(dy));
        const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
        const stepY = dy === 0 ? 0 : dy / Math.abs(dy);

        for (let step = 0; step <= maxSteps; step++) {
            const row = start.row + step * stepY;
            const col = start.col + step * stepX;
            cells.push({ row, col });
        }

        return cells;
    };

    const checkSelectedWord = () => {
        const word = selectedCells.map(cell => grid[cell.row][cell.col]).join('');

        console.log("Word: ", word);
        if(foreignWords.some(foreignWord => foreignWord.name === word) ) {
            if(!foundWords.some(foundWord => foundWord.word === word)) {
                const foundWord = {
                    word: word,
                    cells: selectedCells
                };
                console.log("Found!");

                setFoundWords([...foundWords, foundWord]);

                const foundIndex = foreignWords.findIndex(foreignWord => foreignWord.name === word);

                if (foundIndex !== -1) {
                    setFoundCroatianWords([...foundCroatianWords, croatianWords[foundIndex].word]);
                }
 
            }
        }
        
    };

    const handleFinishButton = async () => {

        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000;
        setElapsedTime(totalTime);
        console.log("Game id: ", gameId);
        console.log("Student id: ", localStorage.getItem("userId"));
        console.log("Time is: ", totalTime);
        console.log("Time is: ", elapsedTime);
        console.log("Number of found words: ", foundWords.length);

        const unfoundCroatianWords = croatianWords
        .filter(wordObj => !foundCroatianWords.includes(wordObj.word))
        .map(wordObj => wordObj.word)
        .join(',');

        console.log("Unfound words: ", unfoundCroatianWords);

        try {
            //predajem joj: gameId,studentId, studentName, time i broj pronadenih rijeci -> velicina liste found words
            const result = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/gameFinish', {
                    gameId: gameId,
                    studentId: localStorage.getItem("userId"),
                    time: totalTime,
                    numberOfFound: foundWords.length,
                    studentName: localStorage.getItem("username")

                });

                const statistics = await axios.post(
                    'https://zrbackend-dp12.onrender.com/api/statisticsFinish', {
                        gameId: gameId,
                        studentId: localStorage.getItem("userId"),
                        notFound: unfoundCroatianWords
                    });


        } catch (error) {
            console.error('Error submiting game result: ', error);
        }

        
        navigate("/studentHome");
        
    };

    const handleGiveUpButton = () => {
        navigate("/studentHome");
    }



    const handleHelpButton = () => {
        const unfoundWords = foreignWords.filter(word => !foundWords.some(foundWord => foundWord.word === word.name));

        if (unfoundWords.length > 0) {
            const randomUnfoundWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
            const relatedIndex = foreignWords.findIndex(foreignWord => foreignWord.name === randomUnfoundWord.name);
            const relatedCroatianWord = croatianWords[relatedIndex].word;

            setLen(randomUnfoundWord.name.length);
            setLetter(randomUnfoundWord.name[0]);
            setRelatedCroatianWord(relatedCroatianWord);
            setHelpModal(true);
            //alert(`Length: ${randomUnfoundWord.name.length}, First Letter: ${randomUnfoundWord.name[0]}`);
        } else {
            //alert('All words found or no words to provide hints for.');
        }
    };

    const closeHelp = () => {
        setHelpModal(false);
    }

    const renderGrid = () => {
        return (
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, cellIndex) => {
                            const isSelected = selectedCells.some(
                                (selected) => selected.row === rowIndex && selected.col === cellIndex
                            );
                            const isFound = foundWords.some(
                                (word) => word.cells.some(
                                    (foundCell) => foundCell.row === rowIndex && foundCell.col === cellIndex
                                )
                            );
                            return (
                                <div
                                    key={cellIndex}
                                    className={`cell ${isSelected ? 'selected' : ''} ${isFound ? 'found' : ''}`}
                                    onMouseDown={(event) => handleMouseDown(rowIndex, cellIndex, event)}
                                    onMouseOver={(event) => handleMouseOver(rowIndex, cellIndex, event)}
                                    onMouseUp={handleMouseUp}
                                    onTouchStart={(event) => handleTouchStart(rowIndex, cellIndex, event)}
                                    onTouchMove={(event) => handleTouchMove(rowIndex, cellIndex, event)}
                                    onTouchEnd={handleTouchEnd}
                                    data-row={rowIndex}
                                    data-col={cellIndex}
                                >
                                    {cell}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="containerWholeGame">
            <div className="containerGame">
                <h1 className="gameTitle">{gameName}</h1>
                {generated ? (
                    <div>
                        
                        <div className="field">{renderGrid()}</div>
                        <button className="gameButton" onClick={handleFinishButton}>Završi</button>
                        <button className="gameButtonWithMargin" onClick={handleGiveUpButton}>Odustani</button>
                    </div>
                ) : (
                    <button className="gameButton" onClick={startGame}>Kreni!</button>
                )}

            </div>
            <div className="containerWords">
                <h1 className="gameTitle">Tražimo<br />ove riječi:</h1>
                <ul>
                    {croatianWords.map((wordObj, index) => (
                        <li
                            className={`wordList ${foundCroatianWords.includes(wordObj.word) ? 'strikethrough' : ''}`}
                            key={index}
                        >
                            {wordObj.word}
                        </li>
                    ))}
                </ul>

                {generated && (
                    <div>
                        <button className="gameButton"onClick={handleHelpButton}>Pomoć</button>
                    </div>
                )}

                {helpModal && (
                   <div className="modal">
                    <div className="overlay">
                       <div className="modal-content">
                           <h1 className="modalTitle">Pomoć</h1>
                           <h3>Riječ: {relatedCroatianWord}</h3>
                           <h3>Dužina riječi: {len}</h3>
                           <h3>Prvo slovo: {letter}</h3>

                           <button className="modalButton" onClick={closeHelp}>Zatvori</button>


                       </div>
           
                   </div>
               </div>
                )}
                
            </div>
        </div>
    );
};

