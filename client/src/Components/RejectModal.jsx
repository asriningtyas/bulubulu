import { useState } from "react";
import { ImCross } from "react-icons/im";

export default function RejectModal({ reject, closeModal }) {
  const [messageReject, setMessageReject] = useState();

  return (
    <>
      <div className="justify-end items-center flex w-[70%] overflow-x-hidden overflow-y-auto fixed inset-0 z-[51] outline-none focus:outline-none">
        <div className="relative w-[50%]">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between pl-5 p-3 border-b border-solid bg-[#fdc074] border-slate-200 rounded-t-lg">
              <div className="capitalize font-semibold">
                Keterangan Menolak Jadwal
              </div>
              <ImCross
                className="cursor-pointer"
                onClick={() => closeModal()}
              />
            </div>
            <div className="space-y-1 p-5">
              <textarea
                value={messageReject}
                onChange={(e) => setMessageReject(e.target.value)}
                name="reject"
                id="reject"
                rows="5"
                className="border w-full p-2"
              ></textarea>
              <div className="flex items-center space-x-4 text-center justify-end">
                <div
                  className={`btn btn-outline btn-error ${
                    !messageReject && "btn-disabled"
                  }`}
                  onClick={() => reject(messageReject)}
                >
                  Tolak
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black/30 fixed w-screen h-screen inset-0 z-50"></div>
    </>
  );
}
