import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Steps, Panel, Placeholder, ButtonGroup, Button } from "rsuite";
import uuid from "react-uuid";
import newTabIcon from "../../media/newTabIcon.png";
import heartIcon from "../../media/heartIcon.png";
import expIcon from "../../media/expIcon.png";
import languageIcon from "../../media/languageIcon.png";
import modeIcon from "../../media/modeIcon.png";
import idIcon from "../../media/idIcon.png";

import locationIcon from "../../media/locationIcon.png";
import fieldIcon from "../../media/fieldIcon.png";
import scheduleIcon from "../../media/scheduleIcon.png";
import salaryIcon from "../../media/salaryIcon.png";

const Application = ({ jobs, userData, setPopUpMessage }) => {
  const navigate = useNavigate();

  const { jobId } = useParams();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [field, setField] = useState("");
  const [schedule, setSchedule] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cvFile, setCvFile] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [motivationLetterFile, setMotivationLetterFile] = useState("");
  const [motivationLetterFileName, setMotivationLetterFileName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (jobs.length > 0 && jobId !== null) {
      const selectedJob = jobs.find((job) => job.id === jobId);
      setTitle(selectedJob.title);
      setLocation(selectedJob.location);
      setField(selectedJob.field);
      setSchedule(selectedJob.schedule);
      setExperience(selectedJob.experience);
      setMode(selectedJob.mode);
      setLanguage(selectedJob.language);
      setDescription(selectedJob.description);
    }
  }, [jobs, jobId]);

  const [step, setStep] = useState(0);
  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  const uploadFile = async (file, type) => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `candidatures/${type}: ${title} - ${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} - ${email} `
    );
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleNewApplication = async (e) => {
    e.preventDefault();
    try {
      const cvFileURL = await uploadFile(cvFile, "CV");
      let motivationLetterFileURL = "";
      if (motivationLetterFile !== "") {
        motivationLetterFileURL = await uploadFile(
          motivationLetterFile,
          "Lettre de motivation"
        );
      }

      await setDoc(
        doc(
          db,
          "candidatures",
          `${email} - ${title} - ${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`
        ),
        {
          id: `${email} - ${title} - ${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`,
          jobId: jobId,
          title: title,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          cv: cvFileURL,
          cvName: cvFileName,
          motivationLetter: motivationLetterFileURL,
          motivationLetterName: motivationLetterFileName,
          message: message,
          createdAt: new Date().toDateString(),
          status: "En cours d'étude",
        }
      );
      setPopUpMessage("Candidature soumise avec succès.");
      navigate("/emplois?jobId=" + jobId);
    } catch (e) {
      setPopUpMessage("Candidature non soumise. Erreur produite." + e.message);
    }
  };

  useEffect(() => {
    if (userData.firstName !== "") {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      if (userData.phoneNumber) {
        setPhoneNumber(userData.phoneNumber);
      }
      if (userData.cv) {
        setCvFile(userData.cv);
        setCvFileName(userData.cvName);
      }
      if (userData.presentation) {
        setMessage(userData.presentation);
      }
    }
  }, [userData.firstName]);

  return (
    <div className="relative h-full w-full flex ">
      <div className="h-screen w-full flex items-center px-20 gap-20">
        <div className="w-1/2 h-5/6 justify-center flex flex-col ">
          <form
            onSubmit={handleNewApplication}
            className="flex flex-col justify-center w-full h-5/6 p-10 bg-white rounded-lg shadow-xl "
          >
            <div className="w-full h-full flex flex-col  ">
              <Steps current={step}>
                <Steps.Item title="Coordonnées" />
                <Steps.Item title="Documents" />
                <Steps.Item title="Confirmation" />
              </Steps>
              <br />
              <br />
              <hr />
              <br />

              <Panel header={`Étape ${step + 1}`} className="flex-1">
                <br />
                <br />
                {step === 0 ? (
                  <div className="grid grid-rows-4 gap-5 justify-center items-center">
                    <div className="grid grid-cols-5 gap-5 ">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-center">
                        Prénom <sup className="text-red-500">*</sup>
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-5 ">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-center">
                        Nom <sup className="text-red-500">*</sup>
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-5 gap-5 ">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-center">
                        Courriel <sup className="text-red-500">*</sup>
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-5">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-center">
                        Téléphone <sup className="text-red-500">*</sup>
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200"
                        type="text"
                        placeholder="(XXX) XXX-XXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : step === 1 ? (
                  <div className="grid grid-rows-5 justify-center text-lg items-center gap-5 px-10">
                    <div className="grid grid-cols-5 gap-5">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-center">
                        Curriculum Vitae <sup className="text-red-500">*</sup>
                      </label>
                      <div className=" shadow-inner bg-[#fafafa]  rounded col-span-4  border border-gray-200">
                        <input
                          className=" rounded "
                          type="file"
                          onChange={(e) => (
                            setCvFile(e.target.files[0]),
                            setCvFileName(e.target.files[0].name)
                          )}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-5 ">
                      <label className="col-span-1 text-justify   whitespace-nowrap flex justify-end items-center">
                        Lettre de motivation
                      </label>
                      <div className=" shadow-inner bg-[#fafafa]  rounded col-span-4  border border-gray-200">
                        <input
                          className="  rounded "
                          type="file"
                          onChange={(e) => (
                            setMotivationLetterFile(e.target.files[0]),
                            setMotivationLetterFileName(e.target.files[0].name)
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-5 row-span-2 w-full h-full">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-start">
                        Message
                      </label>
                      <textarea
                        className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="h-full flex flex-col gap-5">
                      <h6> Termes et conditions </h6>
                      <p>
                        Ne pas avoir d'antécédents judiciaire ni de jugement en
                        cours et avoir l'autorisation légale de travailler au
                        Québec.
                      </p>
                      <div className="flex gap-2  w-full items-start text-lg ">
                        <input
                          className=" shadow-inner bg-[#fafafa]  rounded  border border-gray-200"
                          type="checkbox"
                          required
                        />
                        <label
                          className=" text-black text-justify text-sm white"
                          htmlFor="password"
                        >
                          J'ai lu et j'accepte les termes et conditions
                          <sup className="text-red-500">*</sup>.
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex shadow-xl justify-center items-center m-auto my-5 px-5 py-3 text-base font-semibold no-underline align-middle hover:bg-blue-500 text-white  rounded cursor-pointer select-none bg-blue-950 transition-colors"
                      >
                        Soummettre sa candidature
                      </button>
                      <p>
                        Surveillez votre messagerie, nous contacterons
                        uniquement les candidats selectionnées.
                      </p>
                    </div>
                  </div>
                )}
              </Panel>

              <hr />
              <ButtonGroup>
                <Button
                  className="bg-gray-200 "
                  onClick={onPrevious}
                  disabled={step === 0}
                >
                  Retour
                </Button>
                <Button
                  className="bg-blue-500 text-white"
                  onClick={onNext}
                  disabled={
                    (step === 0 && firstName === "") ||
                    lastName === "" ||
                    email === "" ||
                    phoneNumber === "" ||
                    (step === 1 && cvFile === "") ||
                    step === 2
                  }
                >
                  Suivant
                </Button>
              </ButtonGroup>
            </div>
          </form>
        </div>
        <div className="w-1/2 h-5/6 justify-center flex flex-col ">
          <div className="flex flex-col justify-center w-full h-5/6 px-10 bg-white rounded-lg shadow-xl ">
            <div className="w-full flex flex-col gap-10  col-span-3 pb-5">
              <h2 className="text-5xl  font-bold text-blue-950">{title}</h2>
              <div className=" w-full  ">
                <div className="grid grid-cols-4 grid-rows-2 w-5/6 gap-5 pb-5 text-lg ">
                  <div className="col-span-1 h-full rounded-l-xl flex items-center  ">
                    <img
                      src={locationIcon}
                      className="w-10 h-10 p-1"
                      alt="location icon"
                    />
                    <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                      {location}
                    </span>
                  </div>

                  <div className="col-span-1 h-full rounded-l-xl flex items-center  ">
                    <img
                      src={scheduleIcon}
                      className="w-10 h-10 p-1 "
                      alt="location icon"
                    />
                    <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                      {schedule}
                    </span>
                  </div>
                  <div className="col-span-1 h-full rounded-l-xl flex items-center  ">
                    <img
                      src={salaryIcon}
                      className="w-10 h-10 p-1"
                      alt="location icon"
                    />
                    <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                      18$/h
                    </span>
                  </div>

                  <div className=" h-full rounded-l-xl flex items-center">
                    <img
                      src={fieldIcon}
                      className="w-10 h-10 p-1"
                      alt="location icon"
                    />
                    <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                      {field}
                    </span>
                  </div>

                  {experience === "" ? (
                    ""
                  ) : (
                    <div className="w-1/4 h-full rounded-l-xl flex items-center">
                      <img
                        src={expIcon}
                        className="w-10 h-10 p-1"
                        alt="location icon"
                      />
                      <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                        {experience}{" "}
                      </span>
                    </div>
                  )}
                  {mode === "" ? (
                    ""
                  ) : (
                    <div className="w-1/4 h-full rounded-l-xl flex items-center">
                      <img
                        src={modeIcon}
                        className="w-10 h-10 p-1"
                        alt="location icon"
                      />
                      <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                        {mode}
                      </span>
                    </div>
                  )}
                  {language === "" ? (
                    ""
                  ) : (
                    <div className="w-1/4 h-full rounded-l-xl flex items-center">
                      <img
                        src={languageIcon}
                        className="w-10 h-10 p-1"
                        alt="location icon"
                      />
                      <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                        {language}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center group text-blue-500 transition-all ">
                    <img
                      src={idIcon}
                      alt="ID du poste"
                      className="w-10 h-10 p-1 opacity-80 group-hover:opacity-100 transition-all"
                    />
                    <p className="whitespace-nowrap">{jobId}</p>
                  </div>
                </div>
              </div>
            </div>
            <hr className="w-11/12 px-10 py-3" />
            <div className=" flex flex-col gap-10 h-1/2  overflow-y-scroll">
              <div className="pb-10 px-10 rounded text-lg  h-full  text-black whitespace-pre-line relative">
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;
