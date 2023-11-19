import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { db, auth } from "./firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  doc,
  where,
} from "firebase/firestore";
import Navbar from "./components/UI/Navbar";
import Home from "./components/Home";
import Jobs from "./components/candidates/Jobs";
import Footer from "./components/UI/Footer";
import Portal from "./components/admin/Portal";
import EmployerHub from "./components/employers/EmployerHub";
import LoginPage from "./components/login/LoginPage";
import Contact from "./components/UX/Contact";
import Account from "./components/UX/Account";
import Application from "./components/candidates/Application";
import ScrollToTop from "./components/UI/ScrollToTop";
import techImage from "./media/techImage.jpg";
import educationImage from "./media/educationImage.jpg";
import logisticImage from "./media/logisticImage.jpg";
import engineeringImage from "./media/engineeringImage.jpg";
import industrielImage from "./media/industrielImage.jpg";
import manutentionImage from "./media/manutentionImage.jpg";
import administrationImage from "./media/administrationImage.jpg";
import checkIcon from "./media/checkIcon.png";

function App() {
  const [userData, setUserData] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState();
  const [scrollToJobs, setScrollToJobs] = useState(false);
  const [isUserConnected, setIsUserConnected] = useState(false);

  const [popUpMessage, setPopUpMessage] = useState("");
  const [popUpOpacity, setPopUpOpacity] = useState("opacity-0");

  useEffect(() => {
    if (popUpMessage !== "") {
      setTimeout(() => {
        setPopUpOpacity("opacity-25");
      }, 100);

      setTimeout(() => {
        setPopUpOpacity("opacity-50");
      }, 200);

      setTimeout(() => {
        setPopUpOpacity("opacity-75");
      }, 300);

      setTimeout(() => {
        setPopUpOpacity("opacity-100");
      }, 400);

      setTimeout(() => {
        setPopUpOpacity("opacity-75");
      }, 3000);

      setTimeout(() => {
        setPopUpOpacity("opacity-50");
      }, 3100);

      setTimeout(() => {
        setPopUpOpacity("opacity-25");
      }, 3200);

      setTimeout(() => {
        setPopUpOpacity("opacity-0");
      }, 3300);

      setTimeout(() => {
        setPopUpMessage("");
      }, 3300);
    }
  }, [popUpMessage]);

  const [authChecking, setAuthChecking] = useState(true);

  const fieldsList = [
    {
      title: "Technologies et information",
      picture: techImage,
    },
    {
      title: "Éducation",
      picture: educationImage,
    },
    {
      title: "Transport et logistique",
      picture: logisticImage,
    },
    {
      title: "Ingénierie",
      picture: engineeringImage,
    },
    {
      title: "Manutention",
      picture: manutentionImage,
    },
    {
      title: "Services administratifs",
      picture: administrationImage,
    },
    {
      title: "Industriel",
      picture: industrielImage,
    },
  ];

  const fetchJobs = async () => {
    try {
      const jobsQuery = query(
        collection(db, "postes"),
        orderBy("createdAt", "desc")
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsList = jobsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setJobs(jobsList);

      const locationsList = jobsList.map((job) => job.location);
      const uniquesLocations = [...new Set(locationsList)].filter(
        (location) => location !== ""
      );
      setLocations(uniquesLocations);
    } catch (err) {
      setError(err);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Member fetch if connected
  const fetchDataOnConnection = async (user) => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "membres"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userDataFetched = doc.data();
        setUserData(userDataFetched);
        setUserEmail(userDataFetched.email);
        setUserFirstName(userDataFetched.firstName);
        setUserLastName(userDataFetched.lastName);
        console.log("Membre connecté: " + userDataFetched.email);
      });
    } catch (e) {
      console.log("Membre non trouvé." + e.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAuthChecking(true);
      if (currentUser) {
        console.log(currentUser.uid + " détécté.");
        setIsUserConnected(true);
        fetchDataOnConnection(currentUser);
      } else {
        setIsUserConnected(false);
        setUserData("");
        setUserFirstName("");
        setUserLastName("");
        setUserEmail("");
      }
      setAuthChecking(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isUserConnected && userData) {
      fetchDataOnConnection(userData);
      setUserEmail(userData.email);
    }
  }, [isUserConnected]);

  return (
    <div className=" relative">
      <Navbar title="Plan B" userData={userData} />
      <ScrollToTop />
      {popUpMessage !== "" ? (
        <div
          className={`fixed z-50 top-20 w-full flex justify-center transition-all ${
            popUpMessage !== "" ? popUpOpacity : "opacity-0"
          }`}
        >
          <div className="flex gap-2 items-center p-3 px-5 rounded shadow-xl bg-white">
            <img src={checkIcon} className="w-7 h-7" />
            <h5> {popUpMessage} </h5>
          </div>
        </div>
      ) : (
        ""
      )}
      <Routes>
        <Route
          index
          element={
            <Home
              db={db}
              jobs={jobs}
              fields={fieldsList}
              userData={userData}
              setSelectedField={setSelectedField}
              setScrollToJobs={setScrollToJobs}
              setPopUpMessage={setPopUpMessage}
            />
          }
        />
        <Route
          path="emplois/"
          element={
            <Jobs
              jobs={jobs}
              fields={fieldsList}
              locations={locations}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              userData={userData}
              setScrollToJobs={setScrollToJobs}
              scrollToJobs={scrollToJobs}
              setPopUpMessage={setPopUpMessage}
            />
          }
        />
        <Route
          path="application/:jobId"
          element={
            <Application
              jobs={jobs}
              userData={userData}
              setPopUpMessage={setPopUpMessage}
            />
          }
        />
        <Route
          path="connexion"
          element={
            <LoginPage
              fields={fieldsList}
              db={db}
              auth={auth}
              setPopUpMessage={setPopUpMessage}
            />
          }
        />
        <Route
          path="employeur"
          element={
            <EmployerHub
              db={db}
              userData={userData}
              setPopUpMessage={setPopUpMessage}
            />
          }
        />
        <Route
          path="contact"
          element={
            <Contact
              db={db}
              userData={userData}
              setPopUpMessage={setPopUpMessage}
            />
          }
        />
        <Route
          path="compte"
          element={
            <Account userData={userData} setPopUpMessage={setPopUpMessage} />
          }
        />
        <Route
          path="portailAdmin"
          element={
            <Portal
              jobs={jobs}
              fetchJobs={fetchJobs}
              fields={fieldsList}
              locations={locations}
              setPopUpMessage={setPopUpMessage}
            />
          }
        />
      </Routes>

      <Footer
        title="Plan B"
        fields={fieldsList}
        isLoaded={loaded}
        jobs={jobs}
        setSelectedField={setSelectedField}
      />
    </div>
  );
}

export default App;
