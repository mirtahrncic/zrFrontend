import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const TeacherHome = () => {

    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(""); 
    const [students, setStudents] = useState([]);

    const [teacherId, setTeacherId] = useState('');

    const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
    const [password, setPassword] = useState(null);
    const [name, setName] = useState('');

    const navigate = useNavigate();
    const handleLogOutButton = () => {
        localStorage.clear();
        navigate("/");
      };

    const handleAddGameButton = () => {
        navigate("/newGame");
    };

    const handleMyGamesButton = () => {
        navigate("/myGames");
    };

    //premjesti sve u jedan useEffect sa ifovima kao u StudentLogin

    useEffect(() => {
        const storedTeacherId = localStorage.getItem("userId");
        if(storedTeacherId) {
            console.log("Teacher id: ", storedTeacherId);
            setTeacherId(storedTeacherId);
            fetchSchoolList();
        }
    }, []);

    useEffect(() => {
        fetchClassList();
    }, [selectedSchool]);

    useEffect(() => {
        fetchStudentList();
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
            setSelectedClass("");
            setStudents([]);
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
    };

    const fetchStudentList = async () => {
        if(!selectedClass) return;
        console.log("Selected class: ", selectedClass);
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/studentsList', {
                    class_id: selectedClass
                });

                console.log(response);

            const extractedStudents = response.data.rows.map(student => ({
                id: student.id,
                name: student.fullname
            }));
            console.log(extractedStudents);
            setStudents(extractedStudents);
        } catch (error) {
            console.error('Error fetching students: ', error);
        }
    };



    const openAddStudentModal = () => {
        setAddStudentModalOpen(true);
    };
    
    const closeAddStudentModal = () => {
        document.getElementById('studentFName').value = "";
        document.getElementById('studentLName').value = "";
        setAddStudentModalOpen(false);
    };

    const handleAddStudent = async (event) => {
        event.preventDefault();

        const newStudentFName = event.target.elements.studentFName.value;
        const newStudentLName = event.target.elements.studentLName.value;
        try {
            if (newStudentFName !== "" && newStudentLName !== "") {
                const response = await axios.post(
                    'https://zrbackend-dp12.onrender.com/api/newStudent', {
                        class_id: selectedClass,
                        name: newStudentFName,
                        surname: newStudentLName
                });
                console.log("New student password is: ", response.data);
                const newName = newStudentFName + " " + newStudentLName;
                setName(newName);
                setPassword(response.data.password);
                closeAddStudentModal();
            }
            

        } catch (error) {
            console.log('Error creating new student: ', error);

        }

    };

    const handleNewPassword = async (studentId, studentName) => {
        //bude opet modal za novu lozinku
        //samo neće u njega se ništa upisivati nego će se ispisati: za učenika ... nova lozinka je ...

        setName(studentName);
        try {
            const response = await axios.post(
                'https://zrbackend-dp12.onrender.com/api/newPassword', {
                    student_id: studentId
                });
            setPassword(response.data.password);
        } catch (error) {
            console.error('Error getting new password: ', error);
        }
    };

    const closeNewPasswordModal = () => {
        setPassword(null);
    }

    const handleResultsButton = () => {
        navigate("/results");
    }

   


    




    return (
        <div className="containerTeacher">
            <div className="btnGroup">
                <button onClick={handleAddGameButton}>Dodaj igru</button>
                <button onClick={handleMyGamesButton}>Moje igre</button>
                <button onClick={openAddStudentModal}>Dodaj učenika</button>
                <button onClick={handleResultsButton}>Rezultati</button>
            </div>




            <div className="selectGroup">
                <div className="selectContainer">
                <select
                    className="teacher-input"
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

                <select
                    className="teacher-input"
                    onChange={(e) => setSelectedClass(e.target.value)}
                    value={selectedClass}
                >
                    <option value="">-- Odaberite razred --</option>
                        {classes.map(classes => (
                            <option key={classes.id} value={classes.id}>{classes.name}</option>
                        ))}
                </select>
                </div>

                {students && (
                    <div className="popisUcenika">
                        <h3>Popis učenika</h3>
                        <div className="student-list-container">
                            <div className="student-list">
                
                                <ul> 
                                    {students.map((student) => (
                                        <li key={student.id}>
                                            {student.name}
                                            <button onClick={() => handleNewPassword(student.id, student.name)} className="student-button">+</button>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </div>
                    </div>
                )}


            </div>

            {password && (
                <div className="modal">
                    <div className="overlay">
                        <div className="modal-content">
                            <h3>Nova šifra za učenika {name}:  </h3>
                            <h3>{password}</h3>
                            <button onClick={closeNewPasswordModal}>Zatvori</button>
                        </div>

                    </div>
                </div>
            )}




            {addStudentModalOpen && (
                <div className="modal">
                    <div className="overlay">
                        <div className="modal-content">
                            <h2>Dodaj učenika</h2>
                            <form onSubmit={handleAddStudent}>
                                <input
                                    type="text"
                                    id="studentFName"
                                    name="studentFName"
                                    placeholder="Ime učenika..."
                                />
                                <input
                                    type="text"
                                    id="studentLName"
                                    name="studenLtName"
                                    placeholder="Prezime učenika..."
                                />
                                <button type="submit">Dodaj</button>
                            </form>
                            <button onClick={closeAddStudentModal}>Zatvori</button>
                         </div>
                    </div>
                </div>
            )}

            
            


            <div className="toggle-containerTeacher">
                <div className="toggleTeacher">
                    <div className="toggle-panelTeacher">
                        <br></br>
                        <br></br>
                        <br></br>
                        <img
                            className="nastavnik"
                            alt="uciteljicaSlika"
                            src="nastavnica.png"
                        ></img>
                        <br></br>
                        <br></br>
                        <br></br>
                        <h1>Dobrodošli,</h1>
                        <br></br>
                        <p>{localStorage.getItem("email")}</p>
                        <br></br>
                        <button id="odjava" onClick={handleLogOutButton}>Odjavi se</button>
                    </div>
                </div>
             </div>

        </div>
    );


};