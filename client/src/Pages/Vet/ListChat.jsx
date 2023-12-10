import { useEffect, useState } from "react";
import { GetPicture, VetListChat } from "../../Utils/store";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment/min/moment-with-locales";

export default function ListChat({ search = "" }) {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const navigate = useNavigate();
  // const socket = io("http://localhost:8000", {
  //   transports: ["websocket", "polling"],
  // });
  const socket = io("https://api-bulubulu-rsaa.onrender.com", {
    transports: ["websocket", "polling"],
  });
  const queryClient = useQueryClient();

  const [listChat, setListChat] = useState([]);

  const { isSuccess, data, refetch, isLoading } = VetListChat(auth.idVet);

  useEffect(() => {
    socket.on("vetMessage", (messageData) => {
      if (messageData.vetId === auth.idVet) {
        queryClient.invalidateQueries(["VetListChat"]);
        refetch();
      }
    });
  });

  useEffect(() => {
    if (isSuccess) {
      const filterChats = data.data.filter((chat) =>
        chat.user.fullName.toLowerCase().includes(search)
      );
      setListChat(filterChats);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess) {
      const filterChats = data.data.filter((chat) =>
        chat.user.fullName.toLowerCase().includes(search)
      );
      setListChat(filterChats);
    }
  }, [search]);

  return (
    <div className="h-full py-4">
      <div className="flex flex-col flex-1 overflow-y-auto space-y-4 p-2 container-items-chat overflow-auto">
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : listChat.length ? (
          listChat.map((chat, idx) => (
            <ChatComponent
              key={idx}
              chat={chat}
              handleClick={() =>
                navigate("/vet/chat", {
                  state: { roomId: chat.roomId, user: chat.user },
                })
              }
            />
          ))
        ) : (
          <div>Tidak ada daftar pesan</div>
        )}
      </div>
    </div>
  );
}

function ChatComponent({ chat, handleClick }) {
  const {
    isSuccess: successGetPicture,
    data: picture,
    isLoading,
  } = GetPicture(chat?.user?.id);
  return (
    <div
      className="p-2 pr-6 lg:pr-10 rounded-full flex items-center space-x-4 cursor-pointer bg-[#edf3ee] border-2 border-[#c8e1ce]"
      onClick={() => handleClick()}
    >
      {isLoading ? (
        <span className="loading loading-spinner"></span>
      ) : successGetPicture ? (
        <div className="avatar">
          <div className="w-10 md:w-12 h-10 md:h-12 rounded-full">
            <img src={URL.createObjectURL(picture)} alt="pp" />
          </div>
        </div>
      ) : (
        <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-red-400" />
      )}
      <div className="grid grid-cols-3 text-xs md:text-base w-full">
        <div className="flex flex-col justify-start col-span-2">
          <div className="font-semibold lg:text-lg">{chat.user.fullName}</div>
          <div className="truncate">{chat.message}</div>
        </div>
        <div className="flex flex-col justify-end items-end">
          <div>{moment(chat.date).locale("id").format("DD MMM YY")}</div>
          <div>{chat.date.split(" ")[1]}</div>
        </div>
      </div>
    </div>
  );
}
