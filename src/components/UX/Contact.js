import React, { useState, useEffect } from "react";

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
  setDoc,
} from "firebase/firestore";
import uuid from "react-uuid";

const Contact = ({ db, userData, setPopUpMessage }) => {
  const [contactFullName, setContactFullName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleNewMessage = async (e) => {
    e.preventDefault();
    try {
      await setDoc(
        doc(
          db,
          `${contactEmail} - messages envoyés`,
          `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De ${contactEmail} à Plan B Placement: ${contactTitle}`
        ),
        {
          id: `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De ${contactEmail} à Plan B Placement: ${contactTitle}`,
          to: "Plan B",
          title: contactTitle,
          content: contactMessage,
          from: contactEmail,
          createdAt: new Date().toDateString(),
        }
      );
      await setDoc(
        doc(
          db,
          `Plan B - messages reçues`,
          `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De ${contactEmail} à Plan B: ${contactTitle} `
        ),
        {
          id: `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De ${contactEmail} à Plan B: ${contactTitle} `,
          to: "Plan B",
          title: contactTitle,
          content: contactMessage,
          from: contactEmail,
          createdAt: new Date().toDateString(),
        }
      );
      setContactTitle("");
      setContactMessage("");
      setPopUpMessage("Message envoyé.");
    } catch (e) {
      setPopUpMessage("Message non envoyé. Erreur produite. " + e.message);
    }
  };

  useEffect(() => {
    if (userData) {
      setContactFullName(userData.firstName + " " + userData.lastName);
      setContactEmail(userData.email);
    }
  }, [userData]);

  return (
    <div className=" inset-0 w-full h-full bg-cover  bg-contact-img  flex flex-col ">
      <div className=" flex justify-center items-center bg-gradient-to-b py-40 from-transparent  to-blue-950">
        <div className=" max-w-[1920px] mx-auto grid grid-cols-2 px-40 gap-60 w-full">
          {/* Map */}
          <div className="h-full rounded-lg flex flex-col gap-10">
            <div className="flex flex-col gap-10 ">
              <div className="flex flex-col bg-blue-500 rounded-lg gap-5  p-8  px-10 shadow-xl text-white">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1 ">
                    <h5 className=" pb-2 font-bold underline">Coordonnées</h5>
                    <p> (514) XXX - XXXX </p>
                    <p>
                      <a href="mailto:contact@planbplacement.ca">
                        contact@planbplacement.ca
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <h5 className=" pb-2 font-bold underline">
                      Heures d'ouverture
                    </h5>
                    <p> Lundi au vendredi</p>
                    <p> De 8h à 20h</p>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <h5 className=" pb-2 font-bold underline">
                      Zone d'opération
                    </h5>
                    <p> Grand-Montréal </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Map */}
            <div className="relative h-[600px] text-transparent bg-map-img bg-cover bg-white p-1 rounded-xl transition-all shadow-lg shadow-blue-950"></div>
          </div>

          {/*  Contact */}
          <div className=" h-full rounded-lg flex flex-col gap-10">
            <div className="flex flex-col gap-10 ">
              <div className="grid grid-rows-3 text-center bg-blue-950 rounded-lg  gap-3 p-5  shadow-xl text-white">
                <h4 className="font-bold ">
                  Des questions pour votre emploi ou entreprise?
                </h4>
                <h5> Envoyez nous un message! </h5>
                <p>Nous répondons en moins de 48 heures.</p>
              </div>
            </div>
            <form
              onSubmit={handleNewMessage}
              className="flex flex-col items-center transition-all justify-between   rounded-lg  py-10 h-full  bg-white   hover:bg-opacity-100  shadow-xl group "
            >
              <h2 className=" font-bold text-blue-950 ">Contactez nous</h2>

              <div className="grid grid-rows-4  items-center gap-7 px-10 w-full">
                <div className="grid grid-cols-2 gap-10 justify-between row-span-1">
                  <div className="flex flex-col  gap-1">
                    <label className="text-start">Nom complet</label>
                    <input
                      className="shadow-inner rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200  "
                      type="text"
                      value={contactFullName}
                      onChange={(e) => setContactFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-start"> Courriel </label>
                    <input
                      className="shadow-inner rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200  "
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full gap-1 items-start row-span-1">
                  <label className="text-start"> Sujet </label>
                  <input
                    className="shadow-inner rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200  "
                    type="text"
                    value={contactTitle}
                    onChange={(e) => setContactTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col items-center h-full w-full gap-1 row-span-2 ">
                  <label className="self-start"> Message </label>
                  <textarea
                    className="rounded w-full flex-1 text-black  bg-[#fafafa] border border-gray-200  "
                    type="text"
                    size={400}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex shadow-xl justify-center items-center m-auto w-full px-5 py-3 text-base font-semibold no-underline align-middle hover:bg-blue-500 text-white  rounded cursor-pointer select-none bg-blue-950 transition-colors"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
