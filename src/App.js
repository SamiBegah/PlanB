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
} from "firebase/firestore";
import Navbar from "./components/UI/Navbar";
import Home from "./components/Home";
import Jobs from "./components/Candidates/Jobs";
import Footer from "./components/UI/Footer";
import AdminPortal from "./components/admin/AdminPortal";
import EmployerHub from "./components/employers/EmployerHub";
import LoginPage from "./components/login/LoginPage";
import Contact from "./components/UX/Contact";
import Account from "./components/UX/Account";
import Application from "./components/Candidates/Application";
import techImage from "./media/techImage.jpg";
import educationImage from "./media/educationImage.jpg";
import logisticImage from "./media/logisticImage.jpg";
import engineeringImage from "./media/engineeringImage.jpg";

function App() {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAuth, setUserAuth] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [isUserConnected, setIsUserConnected] = useState(false);

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
      picture: techImage,
    },
    {
      title: "Services administratifs",
      picture: techImage,
    },
    {
      title: "Industriel",
      picture: techImage,
    },
  ];

  const fetchJobs = async () => {
    setLoaded(false);
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
    } catch (err) {
      setError(err);
    } finally {
      setLoaded(true);
      console.log("Finished loading");
    }
  };

  useEffect(() => {
    if (!loaded) {
      fetchJobs();
      console.log("loaded again");
    }
    return () => {
      console.log("App is unmounting");
    };
  }, [loaded]);

  // Member fetch if connected
  const fetchDataOnConnection = async (user) => {
    try {
      const userData = (await getDoc(doc(db, "membres", user.uid))).data();
      setUserName(`${userData.firstName} ${userData.lastName[0]}.`);
      setUserEmail(userData.email);
    } catch (e) {
      console.log("Membre non trouvé.");
    } finally {
      setIsUserConnected(true);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthChecking(true);

      if (user) {
        setIsUserConnected(true);
        await fetchDataOnConnection(user);
      } else {
        setIsUserConnected(false);
        setUserFirstName("");
        setUserLastName("");
        setUserName("");
        setUserEmail("");
      }

      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const getNavbarLinks = () => {
    const baseLinks = [
      { label: "Accueil", url: "/" },
      { label: "Emplois", url: "/emplois" },
      { label: "Employeur", url: "/employeur" },
      { label: "Contact", url: "/contact" },
    ];

    /*if (isUserConnected && userEmail === "begsami2903@gmail.com") {
      return [
        ...baseLinks,
        {
          label: "Portail admin",
          url: "/portailAdmin",
        },
      ];
    } */ if (isUserConnected) {
      return [
        ...baseLinks,
        {
          label: `Mon plan B (${userName})`,
          url: "/compte",
        },
      ];
    } else {
      return [
        ...baseLinks,
        {
          label: "Inscription / Connexion",
          url: "/connexion",
        },
      ];
    }
  };

  const navbarLinks = getNavbarLinks();

  return (
    <div className="App">
      <Navbar
        title="Plan B"
        links={navbarLinks}
        userName={userName}
        userStatus={isUserConnected}
      />

      <Routes>
        <Route index element={<Home jobs={jobs} fields={fieldsList} />} />
        <Route
          path="emplois"
          element={<Jobs jobs={jobs} fields={fieldsList} />}
        />
        <Route path="emplois/:jobId" element={<Application jobs={jobs} />} />
        <Route path="connexion" element={<LoginPage fields={fieldsList} />} />
        <Route path="employeur" element={<EmployerHub fields={fieldsList} />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="compte"
          element={<Account userName={userName} userEmail={userEmail} />}
        />
        <Route
          path="portailAdmin"
          element={<AdminPortal fields={fieldsList} />}
        />
      </Routes>

      <Footer title="Plan B" links={navbarLinks} fields={fieldsList} />
    </div>
  );
}

export default App;
