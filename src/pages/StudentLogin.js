import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const StudentLogin = () => {
  const images = [
    {
      link: "/AnimalIcons/bear.jpg",
      animal: "medvjed",
    },
    {
      link: "/AnimalIcons/elephant.jpg",
      animal: "slon",
    },
    {
      link: "/AnimalIcons/giraffe.jpg",
      animal: "žirafa",
    },
    {
      link: "/AnimalIcons/koala.jpg",
      animal: "koala",
    },
    {
      link: "/AnimalIcons/lion.jpg",
      animal: "lav",
    },
    {
      link: "/AnimalIcons/monkey.jpg",
      animal: "majmun",
    },
    {
      link: "/AnimalIcons/panda.jpg",
      animal: "panda",
    },
    {
      link: "/AnimalIcons/tiger.jpg",
      animal: "tigar",
    },
    {
      link: "/AnimalIcons/zebra.jpg",
      animal: "zebra",
    },
  ];

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [wrongPin, setWrongPin] = useState(false);

  const [selectedName, setSelectedName] = useState("");

  
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          'https://zrbackend-dp12.onrender.com/api/schoolList' 
        );

        const extractedSchools = response.data.rows.map(school => ({
          id: school.id,
          name: school.name
        }));
        setSchoolList(extractedSchools);

        if (selectedSchool) {
          console.log("School id: ", selectedSchool);
          const response = await axios.post(
            'https://zrbackend-dp12.onrender.com/api/classList', {
                school_id: selectedSchool
            });

        const extractedClasses = response.data.rows.map(classes => ({
            id: classes.id,
            name: classes.name
        }));
        setClassList(extractedClasses);
        }

        if (selectedSchool && selectedClass) {
          console.log("Selected class: ", selectedClass);
          const response = await axios.post(
            'https://zrbackend-dp12.onrender.com/api/studentsList', {
                class_id: selectedClass
            });

          const extractedStudents = response.data.rows.map(student => ({
            id: student.id,
            name: student.fullname
          }));
        setStudentList(extractedStudents);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedSchool, selectedClass]);

  const handleSchoolChange = (event) => {
    const schoolId = event.target.value;
    setSelectedSchool(schoolId);
    setSelectedClass("");
    setSelectedStudent("");
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setSelectedStudent("");
  };

  const handleStudentChange = (event) => {
    const studentId = event.target.value;
    setSelectedStudent(studentId);
    const selectedStudentObj = studentList.find(student => student.id.toString() === studentId);
    console.log(selectedStudentObj);
    if(selectedStudentObj) {
      setSelectedName(selectedStudentObj.name);
    } else {
      setSelectedName("");
    }

    handleRemoveImage();
  };


  const handleImageSelect = (image) => {
    if (selectedImages.length < 3) {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleRemoveImage = () => {
    setWrongPin(false);
    setSelectedImages([]);
  };

  const handlePrijava = async () => {
    setWrongPin(false);
    const selectedAnimalNames = selectedImages.map((img) => img.animal);
    const animalsString = selectedAnimalNames.join(",");


    try {
      const response = await axios.post(
        'https://zrbackend-dp12.onrender.com/api/login/student', {
          studentId: selectedStudent,
          password: animalsString
        });

        if (response.data.success) {
          const userId = response.data.userId;
          const classId = response.data.classId;

          localStorage.setItem('userId', userId);
          localStorage.setItem('classId', classId);
          localStorage.setItem("username", selectedName);
        }




      navigate("/studentHome");
    } catch (error) {
      setWrongPin(true);
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="containerStudent">
      <div className="form-containerStudent">
        <div className="student-login">
          <select
            id="school"
            value={selectedSchool}
            onChange={handleSchoolChange}
            className="school-select"
          >
            <option value="">-- Odaberi Školu --</option>
            {schoolList.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
      

          {selectedSchool && (
            <div className="student-login">
              <select
                id="class"
                value={selectedClass}
                onChange={handleClassChange}
                className="class-select"
              >
                <option value="">-- Odaberi Razred --</option>
                {classList.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>

              {selectedClass && (
                <div>
                  <select
                    id="student"
                    value={selectedStudent}
                    onChange={handleStudentChange}
                    className="student-select"
                  >
                    <option value="">-- Odaberi Učenika --</option>
                    {studentList.map((studentItem) => (
                      <option key={studentItem.id} value={studentItem.id}>
                        {studentItem.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {selectedSchool && selectedClass && selectedStudent &&  ( 
            <div className="selected-content">
              <h2 className="pozdrav"><i>Bok,<br></br>{ selectedName }!</i></h2>
              <br></br>
              {selectedImages.length > 0 && (
                <div className="selected-images-container">
                  <div className="selected-images">
                    {selectedImages.map((image, index) => (
                      <img
                        key={index}
                        src={image.link}
                        alt={image.animal}
                        className="animal-icon-image"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedImages.length === 3 ? (
                <div className="button-container">
                  <button id="loginStudentBtn" onClick={handleRemoveImage}>
                    Probaj opet
                  </button>
                  <button id="loginStudentBtn" onClick={handlePrijava}>Prijava</button>
                  {wrongPin && (
                    <p className="wrongPIN">
                      Pogrešan PIN!
                    </p>
                  )}
                </div>
              ) : (
                <div className="animal-icons">
                    <div className="animal-icons-row">
                    {images.slice(0, 5).map((image, index) => (
                        <div key={index}>
                            <img
                                src={image.link}
                                alt={image.animal}
                                className="image-button"
                                onClick={() => handleImageSelect(image)}
                            />
                        </div>
                    ))}
                </div>
                <div className="animal-icons-row second-row">
                {images.slice(5).map((image, index) => (
                    <div key={index}>
                        <img
                            src={image.link}
                            alt={image.animal}
                            className="image-button"
                            onClick={() => handleImageSelect(image)}
                        />
                    </div>
                ))}
                </div>
            </div>
            )}
            </div>
          )}
        </div>
      </div>

      <div className="toggle-containerStudent">
        <div className="toggleStudent">
          <div className="toggle-panel">
            <h1>Odaberi svoju školu i razred...</h1>
            <br></br>
            <img
              className="ucenikLogin"
              alt="ucenikLoginSlika"
              src="loginUcenik.png"
            ></img>
            <br></br>
            <h1>...a onda pronađi svoje ime i unesi lozinku!</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
