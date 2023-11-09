import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  addDoc,
  getDoc,
  collection,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  FirestoreDataConverter,
  setDoc,
} from "firebase/firestore";
import { Steps, Panel, Placeholder, ButtonGroup, Button } from "rsuite";

import newTabIcon from "../../media/newTabIcon.png";
import heartIcon from "../../media/heartIcon.png";
import expIcon from "../../media/expIcon.png";
import languageIcon from "../../media/languageIcon.png";
import modeIcon from "../../media/modeIcon.png";

import locationIcon from "../../media/locationIcon.png";
import fieldIcon from "../../media/fieldIcon.png";
import scheduleIcon from "../../media/scheduleIcon.png";
import salaryIcon from "../../media/salaryIcon.png";

const Application = ({ jobs }) => {
  const { jobId } = useParams();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [field, setField] = useState("");
  const [schedule, setSchedule] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");

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

  return (
    <div className="relative h-full w-full flex ">
      <div className="h-screen w-full flex items-center px-20 gap-20">
        <div className="w-1/2 h-5/6 justify-center flex flex-col ">
          <form className="flex flex-col justify-center w-full h-5/6 p-10 bg-white rounded-lg shadow-xl ">
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
                        Prénom :
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200"
                        type="text"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-5 ">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-center">
                        Nom :
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200"
                        type="text"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-5 gap-5 ">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-center">
                        Courriel :
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200"
                        type="email"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-5">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-center">
                        Téléphone :
                      </label>
                      <input
                        className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200"
                        type="number"
                        placeholder="(XXX) XXX-XXXX"
                        required
                      />
                    </div>
                  </div>
                ) : step === 1 ? (
                  <div className="grid grid-rows-5 justify-center text-lg items-center gap-5 px-10">
                    <div className="grid grid-cols-5 gap-5">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-center">
                        Curriculum Vitae :
                      </label>
                      <div className=" shadow-inner bg-[#fafafa]  rounded col-span-4  border border-gray-200">
                        <input className=" rounded  " type="file" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-5 ">
                      <label className="col-span-1 text-justify   whitespace-nowrap flex justify-end items-center">
                        Lettre de motivation :
                      </label>
                      <div className=" shadow-inner bg-[#fafafa]  rounded col-span-4  border border-gray-200">
                        <input className="  rounded " type="file" />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-5 row-span-3 w-full h-full">
                      <label className="col-span-1 text-justify whitespace-nowrap flex justify-end items-start">
                        Message :
                      </label>
                      <textarea className=" shadow-inner bg-[#fafafa]  rounded col-span-4  p-2 border border-gray-200" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="h-full flex flex-col  gap-10">
                      <p>
                        Surveillez votre messagerie, nous contacterons les
                        candidats selectionnées.
                      </p>
                      <button className="inline-flex shadow-xl justify-center items-center m-auto  px-5 py-3 text-base font-semibold no-underline align-middle hover:bg-blue-500 text-white  rounded cursor-pointer select-none bg-blue-950 transition-colors">
                        Soummettre sa candidature
                      </button>
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
                  disabled={step === 2}
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
              <div className=" w-full grid grid-rows-2  gap-10 ">
                <div className="grid grid-cols-4 w-5/6 text-lg ">
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
                </div>
                <div className="flex text-lg w-5/6">
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
