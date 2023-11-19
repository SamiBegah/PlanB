import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth";
import uuid from "react-uuid";
import { NavLink, useNavigate } from "react-router-dom";
import {
  addDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  FirestoreDataConverter,
  where,
  setDoc,
} from "firebase/firestore";

import Jobs from "./Jobs";
import Messages from "./Messages";
import Members from "./Members";
import downIcon from "../../media/downIcon.png";

const Portal = ({ jobs, fetchJobs, fields, locations }) => {
  const [membersList, setMembersList] = useState([]);
  const [activeMenu, setActiveMenu] = useState("jobs");
  const [showParameters, setShowParameters] = useState(false);

  const navigate = useNavigate();
  /* let userName = `${userFirstName} ${userLastName[0]}.`;*/
  const signOutHandler = async () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* Faciliating members emailing */
  const [newMemberEmail, setNewMemberEmail] = useState("email");
  const [newEmailInput, setNewEmailInput] = useState("");
  const [newMessageTitle, setNewMessageTitle] = useState("");

  const fetchMembers = async () => {
    await getDocs(collection(db, "membres")).then((querySnapshot) => {
      const updatedMembersList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setMembersList(
        updatedMembersList.filter((member) => member.status !== "Admin")
      );
    });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="py-40 px-20 flex flex-col relative justify-center ">
      <div className="flex gap-10 items-start justify-between w-full ">
        <h4 className=" font-bold text-blue-950 whitespace-nowrap">
          Bienvenue au portail administrateur,
        </h4>

        <div className=" text-center grid grid-cols-4  gap-5  transition-all  ">
          <button
            className={`p-1 px-10 bg-blue-500 rounded shadow-xl text-white hover:bg-opacity-100  transition-all ${
              activeMenu === "jobs"
                ? "bg-opacity-100  bg-blue-950"
                : "bg-opacity-80 "
            }`}
            onClick={() => (setActiveMenu("jobs"), setShowParameters(false))}
          >
            <span> Postes </span>
          </button>
          <button
            className={`p-1 px-10 bg-blue-500 rounded shadow-xl text-white hover:bg-opacity-100  transition-all ${
              activeMenu === "candidates"
                ? "bg-opacity-100  bg-blue-950"
                : "bg-opacity-80 "
            }`}
            onClick={() => (
              setActiveMenu("candidates"), setShowParameters(false)
            )}
          >
            <span> Candidats </span>
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
            <span> Messagerie</span>
          </button>
          <div
            className={`relative bg-gray-500 opacity-80 hover:opacity-100 shadow-xl  ${
              showParameters ? "rounded-t" : "rounded"
            }`}
          >
            <button
              onClick={() => setShowParameters(showParameters ? false : true)}
              className={`flex items-center justify-center w-full p-1 px-10  bg-gray-500 rounded  text-white  transition-all `}
            >
              <span> Parametres</span>
              <img src={downIcon} className="w-7 h-7" />
            </button>

            {showParameters ? (
              <div className="absolute grid grid-rows-2 w-full text-white ">
                <button className="text-center py-2 transition-all bg-gray-500 shadow-xl hover:bg-gray-600  hover:text-white ">
                  <small>Modifier le mot de passe </small>
                </button>

                <button
                  onClick={signOutHandler}
                  className="text-center py-2 transition-all bg-gray-500 shadow-xl hover:bg-gray-600  hover:text-white rounded-b"
                >
                  <small>Déconnexion </small>
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {activeMenu === "jobs" ? (
        <div>
          <h3 className="py-20 text-center font-bold whitespace-nowrap">
            Gestion des postes
          </h3>
          <Jobs
            db={db}
            fields={fields}
            setNewEmailInput={setNewEmailInput}
            setNewMessageTitle={setNewMessageTitle}
            setActiveMenu={setActiveMenu}
            jobs={jobs}
            fetchJobs={fetchJobs}
            locations={locations}
          />
        </div>
      ) : (
        ""
      )}

      {activeMenu === "candidates" ? (
        <div>
          <h3 className="py-20 text-center font-bold whitespace-nowrap">
            Gestion des candidats
          </h3>
          <Members
            db={db}
            membersList={membersList}
            setMembersList={setMembersList}
            setNewEmailInput={setNewEmailInput}
            setActiveMenu={setActiveMenu}
          />
        </div>
      ) : (
        ""
      )}
      {/* Messagerie */}
      {activeMenu === "messages" ? (
        <div>
          <h3 className="py-20 text-center font-bold whitespace-nowrap">
            Messagerie
          </h3>
          <Messages
            db={db}
            membersList={membersList}
            setNewEmailInput={setNewEmailInput}
            setNewMessageTitle={setNewMessageTitle}
            newMessageTitle={newMessageTitle}
            newMemberEmail={newMemberEmail}
            newEmailInput={newEmailInput}
            setNewMemberEmail={setNewMemberEmail}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Portal;
