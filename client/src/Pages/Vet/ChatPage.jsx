import { useLocation, useNavigate } from "react-router-dom";
import { RiArrowDropLeftLine, RiSendPlane2Fill } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import moment from "moment";
import TextareaAutosize from "react-textarea-autosize";

import { GetRoomIdChat } from "../../Utils/store";
import { useQueryClient } from "@tanstack/react-query";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, roomId } = location.state || {};
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  // const socket = io("http://localhost:8000", {
  //   transports: ["websocket", "polling"],
  // });
  const socket = io("https://api-bulubulu.onrender.com", {
    transports: ["websocket", "polling"],
  });
  const queryClient = useQueryClient();

  const elementRef = useRef(null);
  const [inputMessage, setInputMessage] = useState();
  const [chatList, setChatList] = useState([]);
  const [room, setRoom] = useState(roomId);

  const { isSuccess: getRoomSuccess, data } = GetRoomIdChat();

  useEffect(() => {
    if (!room && getRoomSuccess) {
      socket.emit("joinRoom", data.data);
      setRoom(data.data);
    }
  }, [getRoomSuccess]);

  useEffect(() => {
    console.log(user, room)
    if (!user || !room) {
      navigate('/vet')
    }
    if (room) {
      socket.emit("joinRoom", room);
    }
    scrollToBottom();
  }, []);

  useEffect(() => {
    socket.on("update", (data) => {
      setChatList(data);
    });
    socket.on("message", (messageData) => {
      if (messageData.vetId === auth.idVet) {
        queryClient.invalidateQueries(["VetListChat"]);
      }
      setChatList((prev) => {
        return [...prev, { ...messageData }];
      });
    });
  });

  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  function scrollToBottom() {
    elementRef.current.scrollIntoView({ behavior: "smooth" });
  }

  const handleInputMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const date = moment().format("l HH:mm");
    socket.emit("message", {
      from: auth?.username,
      room,
      message: inputMessage,
      date,
      userId: user?.id,
      vetId: auth?.idVet,
    });
    setInputMessage("");
  };

  return (
    <div className="pt-24 bg-[#fdc074] flex flex-col h-full space-y-5 px-4 lg:px-20 overflow-hidden text-slate-700">
      <div className="flex items-center text-sm text-slate-700">
        <RiArrowDropLeftLine
          className="text-4xl cursor-pointer"
          onClick={() => navigate("/vet")}
        />
        <div className="font-semibold text-xl">{user?.fullName}</div>
      </div>
      <hr className="border w-full" />

      <div className="flex flex-col flex-1 overflow-y-auto space-y-4 p-2 container-items-chat">
        {chatList.map((chat, idx) => (
          <div
            key={idx}
            className={`flex ${
              chat.from === auth.username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`chat ${
                chat.from === auth.username ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat chat-bubble max-w-none text-black ${
                  chat.from === auth.username ? "bg-[#a6faa7]" : "bg-[#fbf0f0]"
                }`}
              >
                {chat.message}
              </div>
              <div className="chat-footer"> {chat.date} </div>
            </div>
          </div>
        ))}
        <div ref={elementRef} />
      </div>

      <div className="bg-slate-200 sticky bottom-3 p-3 rounded-lg">
        <div className="flex space-x-2 items-center">
          <TextareaAutosize
            className="w-full text-slate-700 rounded-md border bg-white p-2  placeholder:italic focus:outline-[#598665] border-gray-400"
            placeholder="Pesan..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            maxRows={3}
          />
          <button onClick={handleInputMessage}>
            <RiSendPlane2Fill className="text-4xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
