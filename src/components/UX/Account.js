import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  addDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  FirestoreDataConverter,
  setDoc,
  where,
  arrayRemove,
} from "firebase/firestore";
import uuid from "react-uuid";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import locationIcon from "../../media/locationIcon.png";
import fieldIcon from "../../media/fieldIcon.png";
import scheduleIcon from "../../media/scheduleIcon.png";
import salaryIcon from "../../media/salaryIcon.png";
import downIcon from "../../media/downIcon.png";
import addIcon from "../../media/addIcon.png";
import refreshIcon from "../../media/refreshIcon.png";
import seeIcon from "../../media/seeIcon.png";
import downloadIcon from "../../media/downloadIcon.png";

function Account({ userData, setPopUpMessage }) {
  const navigate = useNavigate();

  const [applicationsList, setApplicationsList] = useState([]);
  const [showCV, setShowCV] = useState(false);
  const [savedJobsList, setSavedJobsList] = useState([]);

  const [activeMenu, setActiveMenu] = useState("account");
  const [showParameters, setShowParameters] = useState(false);
  const [showApplication, setShowApplication] = useState(false);

  const [phoneNumberUpdate, setPhoneNumberUpdate] = useState("");
  const [presentationUpdate, setPresentationUpdate] = useState("");
  const [cvFileUpdate, setCvFileUpdate] = useState("");
  const [cvNameUpdate, setCvNameUpdate] = useState("");
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const handleUpdatePhoneNumber = async () => {
    if (phoneNumberUpdate !== "") {
      try {
        await updateDoc(doc(db, "membres", userData.id), {
          phoneNumber: phoneNumberUpdate,
        });
      } catch (e) {
        alert("Erreur, telephone non mis à jour. " + e);
      }
    }
  };

  const handleUpdatePresentation = async () => {
    if (presentationUpdate !== "") {
      try {
        await updateDoc(doc(db, "membres", userData.id), {
          presentation: presentationUpdate,
        });
      } catch (e) {
        alert("Erreur, telephone non mis à jour. " + e);
      }
    }
  };

  const uploadFile = async (file, type) => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `membres/${type}: ${
        userData.email
      } - ${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`
    );
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleUpdateCV = async () => {
    if (cvFileUpdate !== "") {
      let cvFileURL;
      try {
        cvFileURL = await uploadFile(cvFileUpdate, "CV");
      } catch (e) {
        alert("CV non ajoutée. Erreur produite." + e);
      }
      try {
        console.log(cvFileURL);
        await updateDoc(doc(db, "membres", userData.id), {
          cv: cvFileURL,
          cvName: cvNameUpdate,
        });
      } catch (e) {
        alert("Erreur, telephone non mis à jour. " + e);
      }
    }
  };

  const fetchApplications = async () => {
    const applicationsQuery = query(
      collection(db, "candidatures"),
      where("email", "==", userData.email)
    );
    const querySnapshot = await getDocs(applicationsQuery);

    const updatedApplicationsList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setApplicationsList(updatedApplicationsList);
  };

  // Application deletion
  const handleDeleteApplication = async (id) => {
    try {
      await deleteDoc(doc(db, "candidatures", id));
      alert("Candidature supprimée.");
    } catch (id) {
      alert("Erreur, candidature non supprimé. Id: " + id);
    }
  };

  const fetchSavedJobs = async () => {
    let updatedSavedJobsList = [];
    console.log("User Data Saved Jobs:", userData.savedJobs);
    for (const savedJob of userData.savedJobs) {
      const docRef = doc(db, "postes", savedJob); // Direct reference to the document
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        updatedSavedJobsList.push({ ...docSnap.data(), id: docSnap.id });
      } else {
        console.log(`No document found for job ${savedJob}`);
      }
    }
    console.log(updatedSavedJobsList);
    setSavedJobsList(updatedSavedJobsList);
  };

  // Saved Job deletion
  const handleDeleteSavedJob = async (jobIdToDelete) => {
    try {
      const userRef = doc(db, "membres", userData.id); // Reference to the user document

      // Update the document in Firestore
      await updateDoc(userRef, {
        savedJobs: arrayRemove(jobIdToDelete), // Remove jobId from the savedJobs array
      });

      // Update local state: remove jobId from the local savedJobs list
      const updatedSavedJobsList = userData.savedJobs.filter(
        (jobId) => jobId !== jobIdToDelete
      );
      setSavedJobsList(updatedSavedJobsList);

      alert("Poste retiré des sauvegardés.");
    } catch (error) {
      console.error("Erreur lors de la suppression du poste:", error); // Log the error for debugging
      alert("Erreur, poste non retiré.");
    }
  };

  const signOutHandler = async () => {
    signOut(auth).then(() => {
      setPopUpMessage("Vous êtes déconnecté.");
      navigate("/");
    });
  };

  useEffect(() => {
    if (userData) {
      fetchApplications();
      fetchMessagesReceived();
      if (userData.savedJob) {
        fetchSavedJobs();
      }
      if (userData.presentation) {
        setPresentationUpdate(userData.presentation);
      }
      if (userData.phoneNumber) {
        setPhoneNumberUpdate(userData.phoneNumber);
      }
      if (userData.cvName) {
        setCvNameUpdate(userData.cvName);
      }
    }
  }, [userData, userData.cv]);

  useEffect(() => {
    if (savedJobsList > 0) {
      fetchSavedJobs();
    }
  }, [savedJobsList]);

  useEffect(() => {
    if (userData) {
      if (phoneNumberUpdate !== userData.phoneNumber) {
        setIsDataUpdated(true);
      } else if (presentationUpdate !== userData.presentation) {
        setIsDataUpdated(true);
      } else if (cvNameUpdate !== userData.cvName) {
        setIsDataUpdated(true);
      } else {
        setIsDataUpdated(false);
      }
    }
  }, [phoneNumberUpdate, presentationUpdate, cvNameUpdate]);

  //////////////////////////////////////////////////////////////// Messages ////////////////////////////////////////////////////////////////
  const [messagesList, setMessagesList] = useState([]);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [newMessageTitle, setNewMessageTitle] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("email");
  const [messageSelected, setMessageSelected] = useState([]);
  const [newMessageTo, setNewMessageTo] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterMessageType, setfilterMessageType] = useState("received");
  const [filterMessagesByMember, setFilterMessagesByMember] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [messagingStatus, setMessagingStatus] = useState("adding");

  const fetchMessagesSent = async () => {
    const messagesQuery = query(
      collection(db, `${userData.email} - messages envoyés`)
    );
    const querySnapshot = await getDocs(messagesQuery);

    const updatedMessagesList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setFilteredMessages(updatedMessagesList);
  };

  const fetchMessagesReceived = async () => {
    const messagesQuery = query(
      collection(db, `${userData.email} - messages reçues`)
    );
    const querySnapshot = await getDocs(messagesQuery);

    const updatedMessagesList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setFilteredMessages(updatedMessagesList);
  };

  const handleNewMessage = async (e) => {
    e.preventDefault();
    try {
      await setDoc(
        doc(
          db,
          `${userData.email} - messages envoyés`,
          `${new Date().toDateString()}-${uuid().substring(0, 3)}- De ${
            userData.email
          } à Plan B Placement: ${newMessageTitle}`
        ),
        {
          id: `${new Date().toDateString()}-${uuid().substring(0, 3)}- De ${
            userData.email
          } à Plan B Placement: ${newMessageTitle} `,
          to: "Plan B",
          title: newMessageTitle,
          content: newMessageContent,
          from: userData.email,
          createdAt: new Date().toDateString(),
        }
      );
      await setDoc(
        doc(
          db,
          `Plan B - messages reçues`,
          `${new Date().toDateString()}-${uuid().substring(0, 3)}- De ${
            userData.email
          } à Plan B: ${newMessageTitle} `
        ),
        {
          id: `${new Date().toDateString()}-${uuid().substring(0, 3)}- De ${
            userData.email
          } à Plan B: ${newMessageTitle} `,
          to: "Plan B",
          title: newMessageTitle,
          content: newMessageContent,
          from: userData.email,
          createdAt: new Date().toDateString(),
        }
      );
      setNewMessageTitle("");
      setNewMessageContent("");
      setNewMessageTo("");
    } catch (e) {
      alert("Message non envoyé. Erreur produite." + e);
    }
  };

  useEffect(() => {
    if (newMemberEmail === "email") {
      setNewMessageTo(newEmailInput);
    } else {
      setNewMessageTo(newMemberEmail);
    }
  }, [newMemberEmail]);

  const handleFilterKeywordChange = (e) => {
    setFilterKeyword(e.target.value);
  };

  const handleFilterMessageByType = (e) => {
    setfilterMessageType(e.target.value);
  };

  const handleFilterMessagesByMember = (e) => {
    setFilterMessagesByMember(e.target.value);
  };
  const handleRefresh = () => {
    setFilterKeyword("");
    setFilterMessagesByMember("");
    setFilterMessagesByMember("");
    setMessageSelected("");
    setfilterMessageType("received");
  };

  useEffect(() => {
    if (filterMessageType === "sent") {
      fetchMessagesSent();
    } else {
      fetchMessagesReceived();
    }
    let filtered = messagesList;
    if (filterKeyword !== "") {
      filtered = filtered.filter(
        (message) =>
          message.title.toLowerCase().includes(filterKeyword) ||
          message.content.toLowerCase().includes(filterKeyword) ||
          message.from.toLowerCase().includes(filterKeyword)
      );
      console.log(filtered);
    }
    setFilteredMessages(filtered);
  }, [
    messagesList,
    filterKeyword,
    filterMessageType,
    filterMessagesByMember,
    filterMessageType,
  ]);

  return (
    <div className="relative h-full w-full flex ">
      <div className="h-full w-full px-20 py-40 gap-20">
        <div className="flex flex-col ">
          <div className="flex gap-10 items-start justify-between w-full ">
            <div className="flex flex-col items-center gap-5">
              <h4 className="font-bold">
                {`Bienvenue ${userData ? userData.firstName : ""} ${
                  userData ? userData.lastName[0] : ""
                }.`}
              </h4>
              <Link
                to={"/emplois"}
                className="flex items-center font-bold bg-blue-500 rounded hover:text-white scale-95 hover:scale-105 text-white transition-all px-2 p-1"
              >
                ← Trouves ton plan B par ici
              </Link>
            </div>
            <div className=" text-center grid grid-cols-4  gap-5  transition-all  ">
              <button
                className={`p-1 px-10 bg-blue-500 rounded shadow-xl text-white hover:bg-opacity-100  transition-all ${
                  activeMenu === "account"
                    ? "bg-opacity-100  bg-blue-950"
                    : "bg-opacity-80 "
                }`}
                onClick={() => (
                  setActiveMenu("account"), setShowParameters(false)
                )}
              >
                <span> Mon profil </span>
              </button>
              <button
                className={`p-1 px-10 bg-blue-500 rounded shadow-xl text-white hover:bg-opacity-100  transition-all ${
                  activeMenu === "applications"
                    ? "bg-opacity-100  bg-blue-950"
                    : "bg-opacity-80 "
                }`}
                onClick={() => (
                  setActiveMenu("applications"), setShowParameters(false)
                )}
              >
                <span> Mes candidatures </span>
              </button>
              <button
                className={`p-1 px-10 bg-blue-500 rounded shadow-xl text-white hover:bg-opacity-100  transition-all ${
                  activeMenu === "messages"
                    ? "bg-opacity-100  bg-blue-950"
                    : "bg-opacity-80 "
                }`}
                onClick={() => (
                  setActiveMenu("messages"), setShowParameters(false)
                )}
              >
                <span> Mes messages</span>
              </button>
              <div
                className={`relative  opacity-80 hover:opacity-100 shadow-xl bg-gray-500   ${
                  showParameters ? "rounded-t" : "rounded"
                }`}
              >
                <button
                  onClick={() =>
                    setShowParameters(showParameters ? false : true)
                  }
                  className={`flex items-center justify-center p-1 px-10 w-full  bg-gray-500 rounded  text-white  transition-all `}
                >
                  <span> Paramètres</span>
                  <img src={downIcon} className="w-7 h-7" />
                </button>

                {showParameters ? (
                  <div className="absolute grid grid-rows-2 w-full text-white ">
                    <button
                      onClick={signOutHandler}
                      className="text-center py-2 transition-all bg-gray-500 shadow-xl hover:bg-gray-600  hover:text-white "
                    >
                      <small>Se déconnecter </small>
                    </button>
                    <button className="text-center py-2 transition-all bg-gray-500 shadow-xl hover:bg-gray-600  hover:text-white ">
                      <small>Changer son mot de passe </small>
                    </button>
                    <button className="text-center py-2 transition-all bg-gray-500 shadow-xl hover:bg-red-500  hover:text-white rounded-b">
                      <small>Désactiver son compte </small>
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* Mon profil */}
          {activeMenu === "account" && userData ? (
            <div className="flex flex-col gap-10 px-10">
              <div>
                <h3 className="text-center py-20"> Mon profil</h3>
                <div className="flex justify-center">
                  <div className="bg-white p-10 rounded-xl  shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col gap-5 w-1/2 ">
                    <div className="flex w-full justify-between bg-white">
                      <div className="flex flex-col gap-5  col-span-1 w-full">
                        <div className="flex items-center justify-between ">
                          <div className="flex items-center gap-2 ">
                            <span className="font-bold"> Courriel : </span>
                            <div>{userData.email}</div>
                          </div>
                          <div className="flex items-center gap-2 ">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">
                                Date d'inscription :
                              </span>
                              <div>{userData.createdAt.slice(3)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="relative flex items-center py-2">
                          <div className="w-1/2 h-0.5 bg-gray-200"> </div>
                          <span className="whitespace-nowrap h-full text-gray-500 flex justify-center items-center z-10 px-2">
                            Information supplémentaire
                          </span>
                          <div className="w-1/2 h-0.5 bg-gray-200"> </div>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex whitespace-nowrap items-center gap-2">
                            <span className="font-bold ">
                              Numéro de téléphone :
                            </span>
                            <input
                              className="flex-1 text-center text-sm bg-[#fafafa] shadow-inner h-3/4 border border-gray-200 rounded"
                              placeholder="(XXX)XXX-XXXX"
                              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                              type="tel"
                              value={phoneNumberUpdate}
                              onChange={(e) => {
                                setPhoneNumberUpdate(e.target.value);
                              }}
                            ></input>
                          </div>
                          <button
                            onClick={() => (
                              userData.cvName !== cvNameUpdate
                                ? handleUpdateCV() && alert("CV mis a jour")
                                : "",
                              userData.phoneNumber !== phoneNumberUpdate
                                ? handleUpdatePhoneNumber() &&
                                  alert("Telephone mis a jour")
                                : "",
                              userData.presentation !== presentationUpdate
                                ? handleUpdatePresentation() &&
                                  alert("Presentation mis a jour")
                                : "",
                              setIsDataUpdated(false)
                            )}
                            className={`w-1/3 h-full flex justify-center items-center  whitespace-nowrap   text-white hover:text-white  rounded shadow-xl  transition-all ${
                              isDataUpdated
                                ? "bg-blue-500  animate-pulse-slow "
                                : "bg-gray-500 bg-opacity-80 cursor-default"
                            }`}
                          >
                            <span> Sauvegarder les changements </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="row-span-1 w-full  grid grid-rows-4 ">
                      <div className="flex flex-col items-start gap-2 row-span-3 pb-5 ">
                        <span className="font-bold"> Présentation </span>

                        <textarea
                          value={presentationUpdate}
                          onChange={(e) => {
                            setPresentationUpdate(e.target.value);
                          }}
                          className="bg-[#fafafa] shadow-inner p-1 border border-gray-200 rounded flex-1 w-full"
                        ></textarea>
                      </div>
                      <div className="flex flex-col gap-2 row-span-1 ">
                        <div className=" flex justify-between w-full">
                          <span className="font-bold"> Curriculum Vitae </span>
                        </div>

                        <div className=" w-full gap-5  col-span-4 grid grid-cols-2 items-center ">
                          <div className="  h-full col-span-1 bg-[#fafafa] shadow-inner border border-gray-200 rounded grid grid-cols-3">
                            <div className=" text-white rounded-l bg-[#1C2834] h-full col-span-1 flex items-center justify-center">
                              Enregistré
                            </div>
                            <span className="flex justify-start items-center col-span-2 px-5 ">
                              {userData.cvName ? userData.cvName : "Aucun"}
                            </span>
                          </div>
                          <input
                            className="  col-span-1 bg-[#fafafa] shadow-inner border border-gray-200 rounded  cursor-pointer text-center"
                            type="file"
                            name={userData.cvName}
                            onChange={(e) => (
                              setCvFileUpdate(e.target.files[0]),
                              setCvNameUpdate(e.target.files[0].name)
                            )}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-center py-20"> Mes emplois enregistrés</h3>
                <div className="bg-black bg-opacity-10 shadow-inner p-10 rounded">
                  <div className="grid grid-cols-4 grid-flow-col gap-10 w-full  h-[350px]  overflow-y-scroll ">
                    {savedJobsList
                      ? savedJobsList.map((savedJob, index) => {
                          return (
                            <div
                              key={index}
                              className="relative bg-[#ffffff] overflow-hidden  p-5 grid grid-rows-7  w-full h-full shadow-xl group  rounded-lg  transition-all "
                            >
                              {savedJob.title.length < 30 ? (
                                <h4 className="row-span-2 p-2  group-hover:font-bold text-blue-500 font-bold transition-all  ">{`${savedJob.title}`}</h4>
                              ) : (
                                <h5 className="row-span-2 p-2  group-hover:font-bold text-blue-500 font-bold transition-all  ">{`${savedJob.title}`}</h5>
                              )}
                              <div className=" w-full row-span-1 grid grid-cols-3 whitespace-nowrap ">
                                <span className=" flex items-center justify-center py-2">
                                  <img
                                    src={scheduleIcon}
                                    alt="Horaire"
                                    className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-all"
                                  />
                                  {savedJob.schedule}
                                </span>
                                <span className=" flex items-center justify-center">
                                  <img
                                    src={locationIcon}
                                    alt="Location"
                                    className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-all"
                                  />
                                  {savedJob.mode === "Télétravail"
                                    ? savedJob.mode
                                    : savedJob.location}
                                </span>
                                {savedJob.salary !== "" ? (
                                  <span className="flex items-center justify-center">
                                    <img
                                      src={salaryIcon}
                                      alt="Salaire"
                                      className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-ll"
                                    />
                                    {savedJob.salary}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>

                              <div className="overflow-y-scroll px-2 my-2 row-span-3 overflow-hidden">
                                <small>
                                  {savedJob.description.slice(0, 500)}...
                                </small>
                              </div>

                              <div className=" grid grid-cols-3 justify-center row-span-1 items-center gap-2 whitespace-nowrap pt-5 w-full">
                                <Link
                                  to={`/emplois?jobId=${savedJob.id}`}
                                  className="  w-full p-2 flex justify-center items-center text-center bg-blue-500 hover:text-white hover:scale-105 text-white rounded-lg shadow-lg  transition-all"
                                >
                                  Voir le poste
                                </Link>
                                <Link
                                  to={`/application/${savedJob.id}`}
                                  className=" w-full p-2 flex justify-center items-center text-center bg-blue-950 hover:text-white hover:scale-105 text-white rounded-lg shadow-lg  transition-all"
                                >
                                  Postuler
                                </Link>
                                <button
                                  onClick={() => {
                                    handleDeleteSavedJob(savedJob.id);
                                  }}
                                  className=" w-full p-2 flex justify-center items-center text-center bg-gray-500 hover:text-white hover:scale-105 text-white rounded-lg shadow-lg  transition-all"
                                >
                                  Retirer
                                </button>
                              </div>
                            </div>
                          );
                        })
                      : "  "}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* Mes candidatures */}
          {activeMenu === "applications" && userData ? (
            <div>
              <h3 className="text-center py-20"> Mes candidatures</h3>
              <div className="bg-black bg-opacity-10 p-10  shadow-inner rounded">
                <div className="flex flex-col gap-10 w-full  h-[400px] pr-10  overflow-y-scroll">
                  {applicationsList.map((application, index) => {
                    return (
                      <div
                        key={index}
                        className="relative row-span-1 whitespace-nowrap bg-[#ffffff] border border-gray-200 overflow-hidden p-5  grid grid-cols-2 justify-between  items-center  shadow-xl group  rounded   transition-all "
                      >
                        <div className="grid grid-cols-3 items-center">
                          <h6 className="  hover:text-blue-500  text-blue-950 font-bold  transition-all">
                            {application.title}
                          </h6>

                          <div className="flex gap-2 w-full ">
                            <span> Appliqué le : </span>
                            <span>{application.createdAt.slice(3)}</span>
                          </div>
                          <div className="flex gap-2 w-full">
                            <span>Status :</span>
                            <div className="flex gap-1 items-center">
                              {application.status === "En cours d'étude" ? (
                                <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
                              ) : (
                                ""
                              )}
                              {application.status === "Embauché" ? (
                                <div className="h-4 w-4 bg-green-500 rounded-full "></div>
                              ) : (
                                ""
                              )}
                              {application.status === "Refusé" ? (
                                <div className="h-4 w-4 bg-gray-500 rounded-full "></div>
                              ) : (
                                ""
                              )}
                              <span> {application.status} </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-5">
                          <Link
                            to={`/emplois?jobId=${application.jobId}`}
                            className=" flex justify-center items-center p-2 bg-blue-500 hover:bg-blue-950 text-white hover:text-white hover:font-bold rounded shadow-xl  transition-all"
                          >
                            Voir le poste
                          </Link>
                          {!showApplication ? (
                            <button
                              onClick={() => setShowApplication(true)}
                              className=" flex justify-center items-center p-2 bg-gray-500 hover:bg-gray-600 text-white hover:text-white hover:font-bold rounded shadow-xl  transition-all"
                            >
                              Voir la candidature
                            </button>
                          ) : (
                            <button
                              onClick={() => setShowApplication(false)}
                              className=" flex justify-center items-center p-2 bg-gray-500 hover:bg-blue-950 text-white hover:text-white hover:font-bold rounded shadow-xl  transition-all"
                            >
                              Fermer
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleDeleteApplication(application.id)
                            }
                            className=" flex justify-center items-center p-2 whitespace-nowrap bg-gray-500  text-white hover:text-white hover:bg-red-500 rounded shadow-xl  transition-all"
                          >
                            <span> Retirer sa candidature </span>
                          </button>
                        </div>
                        {showApplication ? (
                          <div className="w-full col-span-6 py-5">
                            <hr />
                            <div className="flex gap-5 pt-5">
                              <div className="flex gap-2 items-center  ">
                                <div className="flex gap-2">
                                  <span className="font-bold">
                                    Curriculum vitae :
                                  </span>
                                  <span>{application.cvName}</span>
                                </div>

                                <div className="flex gap-2 items-center">
                                  <button
                                    onClick={() => setShowCV(true)}
                                    className="bg-gray-500 p-1 h-fit text-white rounded hover:scale-110 hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                                  >
                                    <img
                                      src={seeIcon}
                                      className="h-4 w-4"
                                      alt="Voir"
                                    ></img>
                                  </button>
                                  <a
                                    href={application.cv}
                                    className="bg-gray-500 p-1 h-fit text-white rounded hover:scale-110 hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                                  >
                                    <img
                                      src={downloadIcon}
                                      className="h-4 w-4 "
                                      alt="Telecharger"
                                    ></img>
                                  </a>
                                </div>
                              </div>
                              {console.log(
                                "test" + application.motivationLetterName
                              )}
                              {application.motivationLetterName !== "" ? (
                                <div className="flex gap-2 items-center  ">
                                  <div className="flex gap-2 items-center">
                                    <span className="font-bold">
                                      Lettre de motivation :
                                    </span>
                                    <span>{userData.motivationLetterName}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setShowCV(true)}
                                      className="bg-gray-500 p-1 h-fit text-white rounded hover:scale-110 hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                                    >
                                      <img
                                        src={seeIcon}
                                        className="h-4 w-4"
                                        alt="Voir"
                                      ></img>
                                    </button>
                                    <button className="bg-gray-500 p-1 h-fit text-white rounded hover:scale-110 hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                                      <img
                                        src={downloadIcon}
                                        className="h-4 w-4 "
                                        alt="Telecharger"
                                      ></img>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                " "
                              )}
                            </div>
                            {showCV ? (
                              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 gap-5 pt-20 pb-4  flex w-full h-full justify-center items-center">
                                <img
                                  src={application.cv}
                                  alt="CV du candidat"
                                  className="h-full inset-0 rounded"
                                ></img>
                                <button
                                  onClick={() => setShowCV(false)}
                                  className="h-full flex items-start "
                                >
                                  <span className="bg-white text-gray-500 px-2 rounded hover:scale-110 transition-all hover:text-gray-950">
                                    x
                                  </span>
                                </button>
                              </div>
                            ) : (
                              " "
                            )}
                            <div className="w-full">
                              {application.message !== "" ? (
                                <div className="  w-full grid grid-rows-2 ">
                                  <span className=" row-span-1 font-bold">
                                    Message :
                                  </span>
                                  <p className="row-span-1 flex-1 overflow-y-auto">
                                    {application.message}
                                  </p>
                                </div>
                              ) : (
                                " "
                              )}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* Messagerie */}
          {activeMenu === "messages" ? (
            <div className="h-full ">
              <h3 className="text-center py-20"> Mes messages</h3>

              <div className="flex flex-col gap-5">
                {/* messages filter */}
                <div className="flex justify-around  gap-10 bg-blue-500 shadow-inner rounded-lg p-6 ">
                  <div className="grid grid-cols-4 gap-10 flex-1 ">
                    <input
                      placeholder="Sujet, mots clés"
                      className="w-full flex gap-5 text-center justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
                      value={filterKeyword}
                      onChange={(e) => handleFilterKeywordChange(e)}
                    ></input>

                    <select
                      className="w-full flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
                      value={filterMessageType}
                      onChange={(e) => handleFilterMessageByType(e)}
                    >
                      <option value="received">Messages reçues</option>
                      <option value="sent" defaultValue>
                        Messages envoyés
                      </option>
                    </select>
                    <div className="w-full flex justify-start">
                      <button
                        className="group w-3/4 flex gap-2 hover:scale-110 justify-center items-center whitespace-nowrap shadow-xl px-5 rounded-md bg-blue-950 text-white hover:shadow-none  transition-all"
                        onClick={handleRefresh}
                      >
                        Rafraichir
                        <img
                          className="h-10 w-10 p-1 scale-75 group-hover:scale-100 transition-all "
                          src={refreshIcon}
                          alt="Rafraichir"
                        />
                      </button>
                    </div>
                    <div className="w-full flex justify-end">
                      <button
                        className="group w-3/4 flex gap-2 hover:scale-110 justify-center items-center whitespace-nowrap shadow-xl px-5 rounded-md bg-blue-950 text-white hover:shadow-none  transition-all"
                        onClick={() => {
                          setMessagingStatus("adding");
                          setMessageSelected("");
                        }}
                      >
                        Écrire un message
                        <img
                          className="h-10 w-10 p-1 scale-75 group-hover:scale-100 transition-all "
                          src={addIcon}
                          alt="Ajouter un email"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className=" w-full h-full gap-10 bg-black bg-opacity-10  shadow-inner rounded-lg grid grid-cols-3  p-10 ">
                  <ul className="flex flex-col h-[800px] gap-5  overflow-y-scroll  ">
                    {/* Messages List */}
                    {filteredMessages
                      ? filteredMessages.map((message, index) => (
                          <li
                            key={index}
                            className={`rounded-lg group mr-10 bg-[#fafafa] shadow-xl transition-all  ${
                              messageSelected === message
                                ? "scale-100 "
                                : "scale-95"
                            } hover:scale-100 transition-all`}
                          >
                            <div
                              onClick={() => {
                                setMessageSelected(message);
                                setMessagingStatus("viewing");
                              }}
                              className="  flex flex-col justify-between w-full h-full rounded-lg cursor-pointer "
                            >
                              <div className=" relative flex flex-col p-5 py-10    ">
                                <div className="flex flex-1 flex-col gap-5 pb-5 justify-between">
                                  <h5
                                    className={` group-hover:text-blue-950 font-bold ${
                                      messageSelected === message
                                        ? "text-blue-950"
                                        : "text-blue-500"
                                    }`}
                                  >
                                    {message.title}
                                  </h5>
                                </div>
                                <hr />
                                <p className="text-justify pt-5 px-2 ">
                                  {message.content.slice(0, 100)}...
                                </p>
                              </div>

                              <div
                                className={` p-2 right-0 w-full flex items-center justify-between text-white
                   rounded-b group-hover:bg-blue-950 transition-all ${
                     messageSelected === message ? "bg-blue-950" : "bg-blue-500"
                   }`}
                              >
                                <small> {message.createdAt.slice(3)}</small>
                                <small> De {message.from}</small>
                              </div>
                            </div>
                          </li>
                        ))
                      : ""}
                  </ul>

                  {/* New message */}

                  {messagingStatus === "adding" ? (
                    <div className=" w-full h-[800px] flex flex-col col-span-2 relative text-lg rounded-lg  text-black whitespace-pre-line  bg-[#fafafa]  shadow-xl">
                      <form
                        onSubmit={handleNewMessage}
                        className="flex flex-col items-center w-full h-full p-10 rounded-t-lg "
                      >
                        <div className=" w-full h- flex flex-col   gap-5  ">
                          <div className="flex flex-col gap-10 py-10 ">
                            <div className="flex items-center">
                              <label className="w-1/12  whitespace-nowrap text-center">
                                À
                              </label>
                              <div className="flex gap-5 w-full">
                                <select
                                  onChange={(e) => {
                                    setNewMemberEmail(e.target.value);
                                  }}
                                  className="bg-[#fafafa] rounded  p-2 border shadow-inner border-gray-200 flex-1"
                                >
                                  <option
                                    value="Plan B"
                                    className="relative flex flex-col shadow-xl  rounded hover:scale-105 group transition-all cursor-pointer"
                                  >
                                    Suivi de candidature - L'équipe Plan B
                                    Placement
                                  </option>
                                  <option
                                    value="Plan B"
                                    className="relative flex flex-col shadow-xl  rounded hover:scale-105 group transition-all cursor-pointer"
                                  >
                                    Support - L'équipe Plan B Placement
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <label className="w-1/12  whitespace-nowrap ">
                                Sujet
                              </label>
                              <input
                                className=" shadow-inner rounded p-2 w-full text-black bg-[#fafafa] border border-gray-200"
                                type="text"
                                value={newMessageTitle}
                                onChange={(e) => {
                                  setNewMessageTitle(e.target.value);
                                }}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end items-end    px-5 ">
                          <div className="flex  items-end col-span-1 justify-start gap-5 h-full w-1/2"></div>
                        </div>
                        <hr className="w-11/12 px-10 py-2" />
                        <div className=" flex flex-col gap-10 h-full w-full  ">
                          <div className=" rounded pt-5  h-full  text-black whitespace-pre-line relative">
                            <textarea
                              value={newMessageContent}
                              placeholder="Écrire un message..."
                              onChange={(e) => {
                                setNewMessageContent(e.target.value);
                              }}
                              className="h-full w-full overflow-y-scroll bg-[#fafafa] border border-gray-200 shadow-inner focus:outline-none "
                            ></textarea>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="mt-10 w-fit inline-flex shadow-xl hover:shadow-none justify-center items-center m-auto px-10 py-3 text-base font-semibold no-underline align-middle hover:bg-blue-500 text-white  rounded cursor-pointer select-none bg-blue-950 transition-colors"
                        >
                          Envoyer
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className=" w-full h-[800px] flex flex-col col-span-2 relative text-lg rounded-lg  text-black whitespace-pre-line  bg-[#fafafa] pb-10 shadow-xl">
                      {messageSelected ? (
                        <div className="flex flex-col items-center w-full h-full p-10 rounded-t-lg ">
                          <div className=" w-full h- flex flex-col   gap-5  ">
                            <div className="flex flex-col gap-10 py-10 col-span-3 ">
                              <h2 className=" font-bold text-blue-950">
                                {messageSelected.title}
                              </h2>
                            </div>
                            <div className=" flex justify-between">
                              <span>
                                Envoyé le {messageSelected.createdAt.slice(3)}
                              </span>
                              <span> De {messageSelected.from}</span>
                            </div>
                          </div>
                          <div className="flex justify-end items-end  w-full  px-5 pb-10">
                            <div className="flex  items-end col-span-1 justify-start gap-5 w-1/2"></div>
                          </div>
                          <hr className="w-11/12 px-10 py-2" />
                          <div className=" flex flex-col gap-10 h-3/4 w-full  overflow-y-scroll">
                            <div className=" pr-10 rounded py-5  h-full  text-black whitespace-pre-line relative">
                              {messageSelected.content}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex justify-center items-center">
                          <p> Veuillez choisir un message à afficher.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
