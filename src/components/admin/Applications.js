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
  where,
  setDoc,
} from "firebase/firestore";
import uuid from "react-uuid";
import locationIcon from "../../media/locationIcon.png";
import fieldIcon from "../../media/fieldIcon.png";
import scheduleIcon from "../../media/scheduleIcon.png";
import salaryIcon from "../../media/salaryIcon.png";
import idIcon from "../../media/idIcon.png";
import addIcon from "../../media/addIcon.png";
import refreshIcon from "../../media/refreshIcon.png";
import seeIcon from "../../media/seeIcon.png";
import downloadIcon from "../../media/downloadIcon.png";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

const Applications = ({
  db,
  jobs,
  candidatesJob,
  setNewEmailInput,
  setNewMessageTitle,
  setActiveMenu,
  setFilterStatus,
  fetchJobs,
  setselectedId,
  fetchApplications,
  setCandidatesJob,
  selectedId,
}) => {
  const [candidatesList, setCandidatesList] = useState([]);
  const [refusedCandidatesList, setRefusedCandidatesList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const [selectedApplication, setSelectedApplication] = useState("");
  const [showCV, setShowCV] = useState(false);

  const fetchCandidatesByJob = async (jobId) => {
    const candidatesQuery = query(
      collection(db, "candidatures"),
      where("jobId", "==", jobId)
    );
    const querySnapshot = await getDocs(candidatesQuery);

    const updatedCandidatesList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setEmployeeList(
      updatedCandidatesList.filter(
        (candidate) => candidate.status === "Embauché"
      )
    );

    setCandidatesList(
      updatedCandidatesList.filter(
        (candidate) => candidate.status === "En cours d'étude"
      )
    );
    setRefusedCandidatesList(
      updatedCandidatesList.filter((candidate) => candidate.status === "Refusé")
    );
    console.log(updatedCandidatesList);
  };

  // Job candidatures
  const handleJobCandidates = async () => {
    await fetchCandidatesByJob(candidatesJob.id);
  };

  const handleCandidateStatus = async (status, job) => {
    try {
      await updateDoc(doc(db, "candidatures", job.id), {
        status: status,
      });
      await handleJobCandidates();
    } catch (e) {
      alert("Erreur, statut non mis à jour." + job.id);
    }

    if (status === "Embauché") {
      try {
        const q = query(
          collection(db, "membres"),
          where("email", "==", job.email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Assuming there is only one document with this email
          const docRef = querySnapshot.docs[0].ref;

          await updateDoc(docRef, {
            status: job.title,
          });
        } else {
          alert("Aucun membre trouvé avec l'email : " + job.email);
        }
      } catch (error) {
        alert(
          "Erreur, statut non mis à jour pour le membre : " +
            job.email +
            " Error: " +
            error.message
        );
      }
    }
  };

  const updateJobStatus = async (status) => {
    try {
      await updateDoc(doc(db, "postes", candidatesJob.id), {
        status: status,
      });
      const jobId = candidatesJob.id;

      setFilterStatus(status);
      setCandidatesJob("");
      setselectedId("");
      await fetchApplications();
      await fetchJobs();
      setselectedId(jobId);
    } catch (e) {
      alert("Erreur, statut non mis à jour pour le poste : " + e.message);
    }
  };

  // Job candidatures
  const handleRecoverCandidate = async (job) => {
    await handleCandidateStatus("En cours d'étude", job);
    setSelectedApplication("");
  };

  useEffect(() => {
    if (candidatesJob) {
      handleJobCandidates();
    }
  }, [candidatesJob]);

  return (
    <div className="flex flex-col items-center flex-1 justify-start rounded-lg py-10  h-[900px] bg-black bg-opacity-10 shadow-inner  ">
      {candidatesJob ? (
        <div className="flex flex-col justify-center items-center">
          <h3> {candidatesJob.title}</h3>
          <h5 className="text-center py-5 flex">
            (
            {candidatesList.length +
              refusedCandidatesList.length +
              employeeList.length}{" "}
            candidatures)
          </h5>

          <div className="flex justify-center">
            {candidatesJob.status === "open" ? (
              <button
                onClick={() => updateJobStatus("closed")}
                className="p-2 px-5 col-span-1  text-white bg-gray-500 hover:bg-gray-600 rounded shadow-xl scale-95 hover:scale-100 transition-all"
              >
                Fermer ce poste
              </button>
            ) : (
              ""
            )}
            {candidatesJob.status === "closed" ? (
              <button
                onClick={() => updateJobStatus("open")}
                className="p-2 px-5 col-span-1  text-white bg-gray-500 hover:bg-gray-600 rounded shadow-xl scale-95 hover:scale-100 transition-all"
              >
                Réouvrir ce poste
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="overflow-y-scroll h-full w-11/12 flex flex-col gap-20">
        {employeeList.length > 0 ? (
          <div className=" flex flex-col gap-5 flex-1 w-full pr-10 pb-20">
            <h5> Embauché </h5>
            {employeeList.map((employee, index) => (
              <div
                className="bg-white w-full p-5 gap-2 rounded shadow-xl flex flex-col items-center justify-between whitespace-nowrap "
                key={index}
              >
                <div className="grid grid-cols-4 w-full  items-center justify-between whitespace-nowrap ">
                  <div className=" col-span-3 justify-center  transition-all">
                    <div className="grid grid-cols-3 space-x-5 w-full">
                      <div className="flex justify-start gap-2">
                        <span className="font-bold">Courriel :</span>
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex justify-start gap-2">
                        <span className="font-bold">Nom complet :</span>
                        <div className="gap-2">
                          <span>{employee.firstName}</span>
                          <span>{employee.lastName}</span>
                        </div>
                      </div>
                      <div className="flex justify-start gap-2">
                        <span className="font-bold">Status :</span>
                        <span>{employee.status}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRecoverCandidate(employee)}
                    className="p-2 px-5 col-span-1  text-white bg-gray-500 rounded shadow scale-95 hover:scale-100 transition-all"
                  >
                    Mettre fin au contrat
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}

        {candidatesList.length > 0 ? (
          <div className=" flex flex-col gap-5 flex-1 w-full pr-10 pb-20">
            <div className="  flex-1 flex flex-col gap-5">
              <h5> Liste de candidats </h5>
              {candidatesList.map((candidate, index) => (
                <div
                  className="bg-white w-full p-5 gap-2 rounded shadow-xl flex flex-col items-center justify-between whitespace-nowrap "
                  key={index}
                >
                  <div className="grid grid-cols-4 w-full  items-center justify-between whitespace-nowrap ">
                    <div className=" col-span-3 justify-center  transition-all">
                      <div className="grid grid-cols-3 space-x-5 w-full">
                        <div className="flex justify-start gap-2">
                          <span className="font-bold">Courriel :</span>
                          <span>{candidate.email}</span>
                        </div>
                        <div className="flex justify-start gap-2">
                          <span className="font-bold">Nom complet :</span>
                          <div>
                            <span> {candidate.firstName} </span>
                            <span> {candidate.lastName} </span>
                          </div>
                        </div>
                        <div className="flex justify-start gap-2">
                          <span className="font-bold"> Status :</span>
                          <span> {candidate.status} </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 col-span-1 w-full">
                      {selectedApplication !== candidate.id ? (
                        <button
                          onClick={() => (
                            setSelectedApplication(candidate.id),
                            console.log(candidate.id)
                          )}
                          className="p-2 px-5 w-full  text-white bg-blue-950 rounded shadow scale-95 hover:scale-100 transition-all"
                        >
                          Voir la candidature
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedApplication("")}
                          className="p-2 px-5 w-full text-white bg-blue-950 rounded shadow scale-95 hover:scale-100 transition-all"
                        >
                          Fermer la candidature
                        </button>
                      )}
                    </div>
                  </div>
                  {candidate.id === selectedApplication ? (
                    <div className="w-full items-center justify-between whitespace-nowrap ">
                      <hr className="my-2 mb-4"></hr>
                      <div className=" flex flex-col transition-all justify-center">
                        <div className="grid grid-cols-4 w-full ">
                          <div className="col-span-3 flex flex-col gap-5 ">
                            <div className="row-span-1 grid grid-cols-2 gap-2 ">
                              <div className="flex gap-2  ">
                                <span className="font-bold">
                                  Date d'application :
                                </span>
                                <span>{candidate.createdAt}</span>
                              </div>
                              <div className="flex gap-2 justify-start ">
                                <span className="font-bold">
                                  Numéro de telephone :
                                </span>
                                <span>{candidate.phoneNumber}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 row-span-1">
                              <div className="flex gap-2 items-center  ">
                                <div className="flex gap-2">
                                  <span className="font-bold">
                                    Curriculum vitae :
                                  </span>
                                  <span>{candidate.cvName}</span>
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
                                    href={candidate.cv}
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
                              {console.log(candidate.motivationLetter)}
                              {candidate.motivationLetter !== "Aucune" ? (
                                <div className="flex gap-2 items-center  ">
                                  <div className="flex gap-2">
                                    <span className="font-bold">
                                      Lettre de motivation :
                                    </span>
                                    <span>
                                      {candidate.motivationLetterName}
                                    </span>
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
                            <div className="row-span-1">
                              {candidate.message !== "" ? (
                                <div className="  w-full grid grid-rows-2">
                                  <span className=" row-span-1 font-bold">
                                    Message :
                                  </span>
                                  <p className="row-span-1 flex-1 overflow-y-auto">
                                    {candidate.message}
                                  </p>
                                </div>
                              ) : (
                                " "
                              )}
                            </div>
                          </div>

                          <div className="col-span-1 grid grid-rows-3 px-2 h-full w-full items-start text-white  ">
                            <button
                              onClick={() => {
                                setNewEmailInput(candidate.email);
                                setNewMessageTitle(
                                  `À propos du poste "${candidate.title}"`
                                );
                                setActiveMenu("messages");
                              }}
                              className="p-2 px-5 w-full text-white bg-blue-500 rounded shadow scale-95 hover:scale-100 transition-all"
                            >
                              Contacter
                            </button>

                            <button
                              onClick={() =>
                                handleCandidateStatus("Embauché", candidate)
                              }
                              className="p-2 px-5 w-full bg-gray-500 hover:bg-green-500 rounded shadow scale-95 hover:scale-100 transition-all"
                            >
                              Embauche
                            </button>

                            <button
                              onClick={() =>
                                handleCandidateStatus("Refusé", candidate)
                              }
                              className="p-2 px-5 w-full bg-gray-500 hover:bg-red-500 rounded shadow scale-95 hover:scale-100 transition-all"
                            >
                              Refus
                            </button>
                          </div>
                        </div>
                      </div>

                      {showCV ? (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 gap-5 pt-20 pb-4  flex w-full h-full justify-center items-center">
                          <img
                            src={candidate.cv}
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
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}

        {refusedCandidatesList.length > 0 ? (
          <div className=" flex flex-col gap-5 flex-1 w-full pr-10">
            <h5> Refus </h5>
            {refusedCandidatesList.map((refusedCandidate, index) => (
              <div
                className="bg-white w-full p-5 gap-2 rounded shadow-xl flex flex-col items-center justify-between whitespace-nowrap "
                key={index}
              >
                <div className="grid grid-cols-4 w-full  items-center justify-between whitespace-nowrap ">
                  <div className=" col-span-3 justify-center  transition-all">
                    <div className="grid grid-cols-3 space-x-5 w-full">
                      <div className="flex justify-start gap-2">
                        <span className="font-bold">Courriel :</span>
                        <span>{refusedCandidate.email}</span>
                      </div>
                      <div className="flex justify-start gap-2">
                        <span className="font-bold">Nom complet :</span>
                        <div>
                          <span>{refusedCandidate.firstName}</span>
                          <span>{refusedCandidate.lastName}</span>
                        </div>
                      </div>
                      <div className="flex justify-start gap-2">
                        <span className="font-bold">Status :</span>
                        <span>{refusedCandidate.status}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => (
                      setSelectedApplication(refusedCandidate),
                      handleRecoverCandidate(refusedCandidate)
                    )}
                    className="p-2 px-5 col-span-1  text-white bg-gray-500 rounded shadow scale-95 hover:scale-100 transition-all"
                  >
                    Récupérer la candidature
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
      {candidatesList.length +
        refusedCandidatesList.length +
        employeeList.length ===
        0 && selectedApplication === "" ? (
        <div className="flex-1 absolute h-full w-full flex justify-center items-center">
          <h5> Aucune candidatures pour l'instant. </h5>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Applications;
