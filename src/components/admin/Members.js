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
import seeIcon from "../../media/seeIcon.png";
import downloadIcon from "../../media/downloadIcon.png";

const Members = ({
  db,
  setMembersList,
  membersList,
  setNewEmailInput,
  setActiveMenu,
}) => {
  const [applicationsListByMember, setApplicationsListByMember] = useState();
  const [seeCandidateId, setSeeCandidateId] = useState("");
  const [showCV, setShowCV] = useState(false);
  const [seeApplicationId, setSeeApplicationId] = useState("");

  const fetchApplicationsByMember = async (member) => {
    const applicationsQuery = query(
      collection(db, "candidatures"),
      where("email", "==", member.email)
    );
    const querySnapshot = await getDocs(applicationsQuery);

    const updatedApplicationsList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setApplicationsListByMember(updatedApplicationsList);

    console.log(updatedApplicationsList);
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

  const handleCandidateStatus = async (status, job) => {
    try {
      await updateDoc(doc(db, "candidatures", job.id), {
        status: status,
      });
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

  return (
    <div className="bg-black bg-opacity-10 flex flex-col gap-5  p-10 rounded-xl shadow-inner w-full h-[900px]">
      {/* Employees */}
      {membersList &&
        membersList.map((member, index) => {
          return (
            <div
              className={`bg-white shadow-xl p-5 rounded    ${
                seeCandidateId === member.id
                  ? "border-2 border-blue-500 border-opacity-50"
                  : ""
              }`}
              key={index}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-10">
                  <div className="flex gap-2">
                    <span className="font-bold"> Courriel :</span>
                    <span> {member.email} </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold"> Nom complet :</span>
                    <div>
                      <span> {member.firstName} </span>
                      <span> {member.lastName} </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold"> Date de création :</span>
                    <span>{member.createdAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold"> Status :</span>
                    <span> {member.status} </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center items-center text-white">
                  {seeCandidateId !== member.id ? (
                    <button
                      onClick={() => (
                        fetchApplicationsByMember(member),
                        setSeeCandidateId(member.id)
                      )}
                      className="p-2 px-5   bg-blue-950 rounded shadow scale-95 hover:scale-100 transition-all"
                    >
                      Voir le profil
                    </button>
                  ) : (
                    <button
                      onClick={() => setSeeCandidateId("")}
                      className="p-2 px-5   bg-gray-600 rounded shadow scale-95 hover:scale-100 transition-all"
                    >
                      Fermer
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setNewEmailInput(member.email);
                      setActiveMenu("messages");
                    }}
                    className="p-2 px-5  text-white bg-blue-500 rounded shadow scale-95 hover:scale-100 transition-all"
                  >
                    Contacter
                  </button>
                  <button className="p-2 px-5   bg-gray-500 hover:bg-red-500 rounded shadow scale-95 hover:scale-100 transition-all">
                    Désactiver
                  </button>
                </div>
              </div>
              {seeCandidateId === member.id ? (
                <div className="flex flex-col gap-5 pt-5">
                  <hr />
                  <span className="font-bold underline"> Profil</span>
                  <div className="grid grid-cols-2">
                    <div className="grid-rows-2 grid gap-2">
                      <div className="flex gap-2">
                        <span className="font-bold">Numéro de téléphone :</span>
                        {member.phoneNumber ? member.phoneNumber : "non ajouté"}
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold"> Curriculum Vitae :</span>
                        {member.cvName ? (
                          <div className="flex gap-2 items-center">
                            {member.cvName}
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
                              href={member.cv}
                              className="bg-gray-500 p-1 h-fit text-white rounded hover:scale-110 hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                            >
                              <img
                                src={downloadIcon}
                                className="h-4 w-4 "
                                alt="Telecharger"
                              ></img>
                            </a>
                          </div>
                        ) : (
                          "non ajouté"
                        )}
                      </div>
                    </div>
                    <div className="grid grid-flow-col justify-start gap-2">
                      <span className="font-bold">Présentation :</span>
                      <span>
                        {member.presentation
                          ? member.presentation
                          : "non ajouté"}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold underline">
                    Liste de candidatures
                  </span>
                  <div className="bg-black bg-opacity-10 p-10 rounded shadow-inner">
                    {applicationsListByMember &&
                    applicationsListByMember.length > 0 ? (
                      <div className="  pr-10 overflow-y-scroll h-[300px]">
                        {applicationsListByMember
                          ? applicationsListByMember.map(
                              (application, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="relative row-span-1 whitespace-nowrap bg-[#ffffff] border border-gray-200 overflow-hidden p-4 px-10 grid grid-cols-5 justify-between  items-center  shadow-xl group  rounded   transition-all "
                                  >
                                    <a
                                      href={`/emplois?jobId=${application.jobId}`}
                                    >
                                      <h6 className="  hover:text-blue-500  text-blue-950 font-bold  transition-all">
                                        {application.title}
                                      </h6>
                                    </a>
                                    <div className="flex gap-2 w-full ">
                                      <span> Appliqué le : </span>
                                      <span>
                                        {application.createdAt.slice(3)}
                                      </span>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                      <span>Status :</span>
                                      <div className="flex gap-1 items-center">
                                        {application.status ===
                                        "En cours d'étude" ? (
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

                                    <div className="grid grid-cols-3 col-span-2 gap-5 text-white">
                                      {seeApplicationId === "" ? (
                                        <button
                                          onClick={() =>
                                            setSeeApplicationId(application.id)
                                          }
                                          className="p-1 px-5  text-center hover:text-white bg-gray-500 hover:bg-blue-500 rounded shadow scale-95 hover:scale-100 transition-all"
                                        >
                                          Voir la candidature
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            setSeeApplicationId("")
                                          }
                                          className="p-1 px-5  text-center hover:text-white bg-gray-600  rounded shadow scale-95 hover:scale-100 transition-all"
                                        >
                                          Fermer
                                        </button>
                                      )}
                                      <button
                                        onClick={() =>
                                          handleCandidateStatus(
                                            "Embauché",
                                            application.jobId
                                          )
                                        }
                                        className="p-1 px-5   bg-gray-500 hover:bg-green-500 rounded shadow scale-95 hover:scale-100 transition-all"
                                      >
                                        Embauche
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleCandidateStatus(
                                            "Refusé",
                                            application.jobId
                                          )
                                        }
                                        className="p-1 px-5  text-center hover:text-white bg-gray-500 hover:bg-red-500 rounded shadow scale-95 hover:scale-100 transition-all"
                                      >
                                        Refus
                                      </button>
                                    </div>

                                    {seeApplicationId === application.id ? (
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
                                            "test" +
                                              application.motivationLetterName
                                          )}
                                          {application.motivationLetterName !==
                                          "" ? (
                                            <div className="flex gap-2 items-center  ">
                                              <div className="flex gap-2 items-center">
                                                <span className="font-bold">
                                                  Lettre de motivation :
                                                </span>
                                                <span>
                                                  {member.motivationLetterName}
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() =>
                                                    setShowCV(true)
                                                  }
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
                              }
                            )
                          : ""}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        Aucun candidature.
                      </div>
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
  );
};

export default Members;
