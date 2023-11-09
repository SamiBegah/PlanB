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

const LoginPage = ({ setUserName }) => {
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
    <div className="flex flex-col items-center h-full justify-center ">
      <div className="w-full flex flex-col h-full justify-start items-center gap-5">
        <div className="flex rounded-lg shadow">
          <button
            onClick={() => setConnectionPanel("register")}
            className={`text-2xl text-center w-1/2 p-3 px-6 ${
              connectionPanel === "register"
                ? "bg-white text-black bg-opacity-100"
                : "bg-blue-950 text-white bg-opacity-60"
            }  rounded-l-lg transition-all`}
          >
            Inscription
          </button>
          <button
            onClick={() => setConnectionPanel("login")}
            className={`text-2xl text-center w-1/2  p-3 px-6 ${
              connectionPanel === "login"
                ? "bg-white text-black bg-opacity-100"
                : "bg-blue-950 text-white bg-opacity-60"
            }  rounded-r-lg transition-all`}
          >
            Connexion
          </button>
        </div>

        <div className=" w-full  flex justify-center items-center h-full transition-all ">
          {connectionPanel === "register" ? (
            <form
              onSubmit={signingUpHandler}
              className="flex flex-col items-center transition-all justify-center rounded-lg  gap-10 h-full bg-white w-full  shadow-xl   group "
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
          ) : (
            <form
              onSubmit={loginHandler}
              className="flex flex-col items-center transition-all justify-center rounded-lg  gap-10 h-full bg-white w-full  shadow-xl   group "
            >
              <h2 className="text-3xl text-center text-blue-500">
                {" "}
                Connexion{" "}
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
                  className="p-3 rounded w-full bg-blue-500 hover:bg-blue-950 hover:font-bold transition-all hover:shadow-inner text-white shadow-xl"
                >
                  Se connecter
                </button>

                <div className="flex justify-end  h-fit w-full">
                  <button className="text-sm ">Mot de passe oublié ?</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
