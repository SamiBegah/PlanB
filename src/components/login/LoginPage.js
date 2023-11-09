import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import {
  addDoc,
  getDoc,
  collection,
  where,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  FirestoreDataConverter,
  setDoc,
} from "firebase/firestore";
import employerEnd from "../../media/employerEnd.jpg";

const Connection = ({ setUserName }) => {
  const navigate = useNavigate();

  const [connectionPanel, setConnectionPanel] = useState("register");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  let user;

  // Sign up
  const signingUpHandler = async (e) => {
    e.preventDefault();
    if (firstName !== "" && lastName !== "") {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          user = userCredential.user;
          createNewMemberData(user);
          navigate("/");
          // ...
        })
        .catch((error) => {
          setErrorMessage(error.message);

          // ..
        });
    } else {
      setErrorMessage("Tous les champs ne sont pas remplis.");
    }
  };

  // Adding member to database
  const createNewMemberData = async (user) => {
    try {
      await setDoc(doc(db, "membres", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        status: "Nouveau candidat",
        createdAt: new Date().toDateString(),
      });
      console.log("Nouveau membre enregistré!");
    } catch (e) {
      alert("Nouveau membre non enregistré.");
    }
  };

  // Login
  const loginHandler = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        user = userCredential.user;
        navigate("/");
        console.log(user);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <main className="flex flex-col gap-5 h-full ">
      {/*  Lead Image */}
      <div
        className="w-full h-full bg-reviews-img bg-cover "
        style={{ backgroundImage: `url(${employerEnd})` }}
      >
        <div className=" flex py-60 justify-start items-center bg-gradient-to-b from-transparent via-transparent to-blue-950">
          <div className="w-full px-40 max-w-[1920px] mx-auto">
            <div className=" w-full  gap-10 px-10 flex justify-center items-center h-full transition-all ">
              <form
                onSubmit={signingUpHandler}
                className="flex flex-col items-center transition-all justify-center rounded-lg  w-1/2 gap-10 h-full py-20 bg-white  shadow-xl   group "
              >
                <h2 className="text-3xl text-center text-blue-950">
                  Inscription
                </h2>
                <div className="grid grid-rows-3 justify-center items-center gap-5 w-4/5 ">
                  <div className="grid grid-cols-4  w-full justify-start text-lg items-center ">
                    <div className="grid grid-cols-2 col-span-2">
                      <label
                        htmlFor="firstName"
                        className="col-span-1 text-center text-black h-full flex justify-start items-center"
                      >
                        Prénom
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa]  rounded  border border-gray-200"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 col-span-2">
                      <label
                        htmlFor="lastName"
                        className="col-span-1 text-center text-black h-full flex justify-center items-center"
                      >
                        Nom
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa] rounded  border border-gray-200"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4  text-lg  ">
                    <label
                      htmlFor="email"
                      className="col-span-1 text-end text-black h-full flex items-center"
                    >
                      Courriel
                    </label>
                    <input
                      className=" shadow-inner bg-[#fafafa]  rounded col-span-3 border border-gray-200"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4  text-lg  ">
                    <label
                      htmlFor="password"
                      className="col-span-1 text-end text-black h-full flex items-center"
                    >
                      Mot de passe
                    </label>
                    <input
                      className=" shadow-inner bg-[#fafafa]  rounded col-span-3 border border-gray-200"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <span className="text-red-500"> {errorMessage} </span>

                  <button
                    type="submit"
                    className="p-3 rounded w-full bg-blue-950 hover:font-bold transition-all hover:bg-blue-500 hover:shadow-inner text-white shadow-xl"
                  >
                    S'inscrire
                  </button>

                  <div className="flex justify-end  h-fit w-full">
                    <button className="text-sm "> Déjà inscrit ?</button>
                  </div>
                </div>
              </form>
              <h4 className="text-white mx-10 "> ou</h4>
              <form
                onSubmit={loginHandler}
                className="flex flex-col items-center transition-all justify-center rounded-lg w-1/2 gap-10 h-full py-20 bg-white  shadow-xl "
              >
                <h2 className="text-3xl text-center text-blue-500">
                  Connexion
                </h2>
                <div className="grid grid-rows-3 gap-5 items-center  w-4/5">
                  <div className="flex gap-2 w-full justify-between text-lg items-center ">
                    <label
                      className="w-2/6 text-end text-black h-full flex justify-start items-center"
                      htmlFor="email"
                    >
                      Courriel
                    </label>
                    <input
                      className=" shadow-inner bg-[#fafafa]  rounded w-full border border-gray-200"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 w-full justify-between text-lg items-center ">
                    <label
                      className="w-2/6 text-end text-black h-full flex justify-start items-center"
                      htmlFor="password"
                    >
                      Mot de passe
                    </label>
                    <input
                      className=" shadow-inner bg-[#fafafa]  rounded w-full border border-gray-200"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2  w-full justify-end text-lg items-center ">
                    <label
                      className=" text-end text-black h-full flex justify-start items-center"
                      htmlFor="password"
                    >
                      Sauvegarder son compte
                    </label>
                    <input
                      className=" shadow-inner bg-[#fafafa]  rounded  border border-gray-200"
                      type="checkbox"
                    />
                  </div>

                  <span className="text-red-500"> {errorMessage} </span>

                  <button
                    type="submit"
                    className="p-3 rounded w-full bg-blue-500 hover:font-bold transition-all  hover:shadow-inner text-white shadow-xl"
                  >
                    Se connecter
                  </button>

                  <div className="flex justify-end  h-fit w-full">
                    <button className="text-sm ">Mot de passe oublié ?</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Connection;
