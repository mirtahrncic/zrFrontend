import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";



export const NewGame = () => {

    const [gameName, setGameName] = useState('');
    const [gameId, setGameId] = useState(null);

    const [newGameForm, setNewGameForm] = useState(true);
    const [newWordsForm, setNewWordsForm] = useState(false);
    
    const [wordPairs, setWordPairs] = useState(Array.from({ length: 8 }, () => ({ word1: '', word2: '' })));

    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(""); 

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
    }

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
    
    const handleGameCreation = async (e) => {
      /*predaj formu za novu igru, znaci zapravo samo classId i ime igre */
      console.log("Selected class: ", selectedClass);
      e.preventDefault();
    
      try {
        const response = await axios.post(
            'https://zrbackend-dp12.onrender.com/api/newGame/create', {
                name: gameName,
                class_id: selectedClass,
                teacher_id: teacherId
            }
        );
        setGameId(response.data.gameId);
        console.log("Game created successfully. Game id is: " , response.data.gameId);
      } catch (error) {
        console.error('Error creating game:', error);
      }

      /*obriši taj input iz ulaza za tekst, zatvori formu za stvaranje nove igre i otvori formu za dodavanje riječi*/
      setGameName('');
      setNewGameForm(false);
      setNewWordsForm(true);
      
    };

    const handleWordPairChange = (index, field, value) => {
        const updatedWordPairs = [...wordPairs];
        updatedWordPairs[index][field] = value;
        setWordPairs(updatedWordPairs);
    };

    const handleAddWordPairs = async () => {
        /*izbrisi u njoma svima sto je upisano, vrati formu za novu igru*/
        /*salji listu parova na back*/
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/newGame/add', {
                    gameId: gameId,
                    wordPairs: wordPairs
                }
            );
            console.log("Words successfully added to game.");
        } catch (error) {
            console.error('Error adding words to game:', error);
        }
       

        const updatedWordPairs = wordPairs.map(pair => ({ word1: '', word2: '' }));
        setWordPairs(updatedWordPairs);
        setNewWordsForm(false);
        setNewGameForm(true);
        navigate('/teacherHome');
    }



    return (
        <div className="containerNewGame">
            {newGameForm &&  (
            <div>
                <h1 className="newGameTitle">Nova igra</h1>

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
                                onChange={(e) => setSelectedClass(e.target.value)}
                                value={selectedClass}
                            >
                                <option value="">-- Odaberite razred --</option>
                                {classes.map(classes => (
                                    <option key={classes.id} value={classes.id}>{classes.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className='label'><b>Naziv igre:</b></label>
                            <input 
                                type="text" 
                                className="game-input" 
                                value={gameName} 
                                onChange={(e) => setGameName(e.target.value)}
                            />
                        </div>

                        <div className="button-group">
                            <button className="button" onClick={handleGameCreation}>Ver1</button>
                            <button type="submit" className="button">Ver2</button>
                        </div>

                    </form>
                </div>
            )}

            {newWordsForm && (
                <div>
                    <h1 className='newGameTitle'>Dodaj riječi</h1>
                    <form className="wordPairsForm">
                        {wordPairs.map((pair, index) => (
                            <div key={index}>
                                <input
                                    className='game-input'
                                    type="text"
                                    value={pair.word1}
                                    onChange={(e) => handleWordPairChange(index, 'word1', e.target.value)}
                                    placeholder="strana riječ"
                                />
                                <span className='crtica'> - </span>
                                <input
                                    className='game-input'
                                    type="text"
                                    value={pair.word2}
                                    onChange={(e) => handleWordPairChange(index, 'word2', e.target.value)}
                                    placeholder="hrvatska riječ"
                                />
                            </div>
                        ))}
                        
                        <button type="button" onClick={handleAddWordPairs}>Dodaj</button>

                    </form>

                </div>
                
            )}
           
        </div>
    );
};