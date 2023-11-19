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

const Messages = ({
  db,
  membersList,
  setNewEmailInput,
  setNewMessageTitle,
  newMessageTitle,
  newMemberEmail,
  newEmailInput,
  setNewMemberEmail,
}) => {
  const [messagesList, setMessagesList] = useState([]);
  const [messageSelected, setMessageSelected] = useState([]);

  const [newMessageTo, setNewMessageTo] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");

  const [messagingStatus, setMessagingStatus] = useState("adding");

  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterMessageType, setfilterMessageType] = useState("sent");
  const [filterMessagesByMember, setFilterMessagesByMember] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);

  const fetchMessagesSent = async () => {
    const messagesQuery = query(collection(db, `Plan B - messages envoyés`));
    const querySnapshot = await getDocs(messagesQuery);

    const updatedMessagesList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setFilteredMessages(updatedMessagesList);
  };

  const fetchMessagesReceived = async () => {
    const messagesQuery = query(collection(db, `Plan B - messages reçues`));
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
          "Plan B - messages envoyés",
          `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De Plan B Placement à ${newMessageTo}: ${newMessageTitle} `
        ),
        {
          id: `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De Plan B Placement à ${newMessageTo}: ${newMessageTitle} `,
          to: newMessageTo,
          title: newMessageTitle,
          content: newMessageContent,
          from: "L'équipe de Plan B Placement",
          createdAt: new Date().toDateString(),
        }
      );
      await setDoc(
        doc(
          db,
          `${newMessageTo} - messages reçues`,
          `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De Plan B Placement à ${newMessageTo}: ${newMessageTitle} `
        ),
        {
          id: `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De Plan B Placement à ${newMessageTo}: ${newMessageTitle} `,
          to: newMessageTo,
          title: newMessageTitle,
          content: newMessageContent,
          from: "l'équipe de Plan B Placement",
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
    }
    setFilteredMessages(filtered);
  }, [
    filterKeyword,
    filterMessageType,
    filterMessagesByMember,
    filterMessageType,
  ]);

  return (
    <div className="flex flex-col gap-5">
      {/* messages filter */}
      <div className="flex justify-around  gap-10 bg-blue-500 shadow-inner rounded-lg p-6 ">
        <div className="grid grid-cols-5 gap-10 flex-1 ">
          <input
            placeholder="Sujet, mots clés"
            className="w-full flex gap-5 text-center justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
            value={filterKeyword}
            onChange={(e) => handleFilterKeywordChange(e)}
          ></input>
          <select
            className="w-full flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
            onChange={(e) => handleFilterMessagesByMember(e)}
            value={filterMessagesByMember}
          >
            <option
              value="Tous les membres"
              className="relative flex flex-col shadow-xl  rounded hover:scale-105 group transition-all cursor-pointer"
            >
              Tous les membres
            </option>
            {membersList
              ? membersList.map((member, index) => {
                  return (
                    <option
                      key={index}
                      value={member.email}
                      className="relative flex flex-col shadow-xl  rounded hover:scale-105 group transition-all cursor-pointer"
                    >
                      {member.firstName} {member.lastName} ({member.email})
                    </option>
                  );
                })
              : ""}
          </select>
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
                    messageSelected === message ? "scale-100 " : "scale-95"
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
                      <input
                        className=" shadow-inner rounded p-2 w-1/2 text-black bg-[#fafafa] border border-gray-200"
                        type="email"
                        onChange={(e) => setNewEmailInput(e.target.value)}
                        value={
                          newMemberEmail === "email"
                            ? newEmailInput
                            : newMemberEmail
                        }
                        required
                      ></input>

                      <select
                        onChange={(e) => {
                          setNewMemberEmail(e.target.value);
                        }}
                        className="bg-[#fafafa] rounded  p-2 border shadow-inner border-gray-200 flex-1"
                      >
                        <option
                          value="email"
                          className="relative flex flex-col shadow-xl  rounded hover:scale-105 group transition-all cursor-pointer"
                        >
                          Email personnalisée
                        </option>
                        <option
                          value="Tous les membres"
                          className="relative flex flex-col shadow-xl  rounded hover:scale-105 group transition-all cursor-pointer"
                        >
                          Tous les membres
                        </option>
                        {membersList.map((member, index) => {
                          return (
                            <option
                              key={index}
                              value={member.email}
                              className="relative flex flex-col shadow-xl  rounded hover:scale-105 group transition-all cursor-pointer"
                            >
                              {member.firstName} {member.lastName}
                              <p> ({member.email})</p>
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-1/12  whitespace-nowrap ">Sujet</label>
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
            <div className="flex flex-col items-center w-full h-full p-10 rounded-t-lg ">
              <div className=" w-full h- flex flex-col   gap-5  ">
                <div className="flex flex-col gap-10 py-10 col-span-3 ">
                  <h2 className=" font-bold text-blue-950">
                    {messageSelected.title}
                  </h2>
                </div>
                <div className=" flex justify-between">
                  <span>Envoyé le {messageSelected.createdAt.slice(3)}</span>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
