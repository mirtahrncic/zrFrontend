import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export const Results = () => {

    const [choosingForm, setChoosingForm] = useState(true);
    const [resultsDisplay, setResultsDisplay] = useState(false);
    const [statisticsDisplay, setStatisticsDisplay] = useState(false);


    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(""); 
    const [className, setClassName] = useState("");
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(""); 
    const [gameName, setGameName] = useState("");

    const [results, setResults] = useState([]);
    const [commonErrors, setCommonErrors] = useState([]);

    const [teacherId, setTeacherId] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const storedTeacherId = localStorage.getItem("userId");
        if(storedTeacherId) {
            console.log("Teacher id: ", storedTeacherId);
            setTeacherId(storedTeacherId);
            fetchSchoolList();
        }
    }, []);

    useEffect(() => {
        fetchClassList()
    }, [selectedSchool]);

    useEffect(() => {
        fetchGamesList();
    }, [selectedClass]);


    const fetchSchoolList = async () => {
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/schoolList' 
            );

            const extractedSchools = response.data.rows.map(school => ({
                id: school.id,
                name: school.name
            }));
            setSchools(extractedSchools);
        } catch (error) {
            console.error('Error fetching schools: ', error);
        }
    };

    const fetchClassList = async () => {
        if (!selectedSchool) return;
        console.log("Selected school: ", selectedSchool);
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/classList', {
                    school_id: selectedSchool
                });

            const extractedClasses = response.data.rows.map(classes => ({
                id: classes.id,
                name: classes.name
            }));
            console.log(extractedClasses);
            setClasses(extractedClasses);
        } catch (error) {
            console.error('Error fetching classes: ', error);
        }
    }

    const fetchGamesList = async () => {
        if(!selectedClass) return;
        console.log("Selected class: ", selectedClass);
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/gamesList', {
                    class_id: selectedClass
            });

            const extractedGames = response.data.rows.map(gamesR => ({
                id: gamesR.id,
                name: gamesR.name
            }));

            console.log(extractedGames);
            setGames(extractedGames);
        } catch (error) {
            console.error('Error fetching games: ', error);
        }
    };

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);

        const selectedClassObj = classes.find(clas => clas.id.toString() === classId);
        console.log(selectedClassObj);
        if (selectedClassObj) {
            setClassName(selectedClassObj.name);
        } else {
            setClassName("");
        }

    };

    const handleGameChange = (e) => {
        const gameId = e.target.value;
        setSelectedGame(gameId);

        const selectedGameObj = games.find(game => game.id.toString() === gameId);
        if (selectedGameObj) {
            setGameName(selectedGameObj.name);
        } else {
            setGameName("");
        }

    };

    const fetchResults = async () => {
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/results', {
                    game_id: selectedGame
                });

            const extractedResults = response.data.rows.map(result => ({
                id: result.student_id,
                time: result.time,
                nmbOfWords: result.foundnumber,
                name: result.student_name

            }));
            setResults(extractedResults);
            console.log("Extracted results: ", extractedResults);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/statistics', {
                    game_id: selectedGame
                });
            console.log("Most common errors: ", response.data);
            setCommonErrors(response.data.mostCommonWords);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };





    const handleDisplayResults = () => {
        setChoosingForm(false);
        setResultsDisplay(true);
        fetchResults();
    };

    const handleDisplayStatistics = () => {
        setChoosingForm(false);
        setStatisticsDisplay(true);
        fetchStatistics();
    };

    const handleFinishButton = () => {
        navigate('/teacherHome');
    };




    return (
        <div>
            {choosingForm && (
                <div className="containerNewGame">


                    <h1 className="newGameTitle">Pogledaj rezultate igre za razred</h1>
                    <form className="form">

                    <div className="form-group">
    
                        <select
                            className="game-input"
                            onChange={(e) => {
                                setSelectedSchool(e.target.value);
                                if (e.target.value !== "") {
                                    fetchClassList(e.target.value);
                                }
                            }}
                            value={selectedSchool}
                        >
                        <option value="">-- Odaberite školu --</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                         </select>
                    </div>


                    <div className="form-group">
        
                        <select
                            className="game-input"
                            onChange={handleClassChange}
                            value={selectedClass}
                        >
                        <option value="">-- Odaberite razred --</option>
                            {classes.map(classes => (
                                <option key={classes.id} value={classes.id}>{classes.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
        
                        <select
                            className="game-input"
                            onChange={handleGameChange}
                            value={selectedGame}
                        >
                        <option value="">-- Odaberite igru --</option>
                            {games.map(game => (
                                <option key={game.id} value={game.id}>{game.name}</option>
                            ))}
                         </select>
                    </div>

         

                    <div className="button-group">
                        <button className="button" type="button" onClick={handleDisplayResults}>Vidi rezultate</button>
                        <button className="button" type="button" onClick={handleDisplayStatistics}>Vidi najčešće greške</button>
                    </div>

                    </form>

                </div>
            )}

            {resultsDisplay && (
                <div className='containerResults'>
                    <h1 className='resultsTitle'>{className} : {gameName}</h1>
                    <div className="resultsColumns">
                        <div className="column">Učenik</div>
                        <div className="column">Vrijeme</div>
                        <div className="column">Pronađene riječi</div>
                    </div>
                <hr />
                
                

        
    {results.map(result => (
                        <div key={result.student_id} className="resultsColumns">
                            <div className="column">{result.name}</div>
                            <div className="column">{result.time}s</div>
                            <div className="column">{result.nmbOfWords}/8 riječi</div>
                        </div>
                    ))}
   

    <hr />
    <button className="buttonResult" onClick={handleFinishButton}>Završi pregled</button>



                </div>
            )}

            {statisticsDisplay && (
                <div className='containerStatistics'>
                    <h1 className='resultsTitle'>{className} : {gameName}</h1>
                    <h1 className="resultsTitle">Najčešće pogreške</h1>

                    <ol className='commonErrorsList'>
                        {commonErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ol>

                    <button className="buttonStatistics" onClick={handleFinishButton}>Završi pregled</button>
  
                </div>

            )}

        </div>

    );

};