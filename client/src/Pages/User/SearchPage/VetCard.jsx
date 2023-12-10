import { useEffect, useState } from "react";
import { GetDataChat, GetPicture } from "../../../Utils/store";
import { useNavigate } from "react-router-dom";

export default function VetCard({
  vet,
  btnLabel,
  auth,
  setModal,
  setOperationDays,
  setOperationhours,
  setVetId,
  vetId,
  pageName,
}) {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState();

  const {
    isSuccess: successGetPicture,
    data: picture,
    isLoading: pictureLoading,
  } = GetPicture(vet.userId);
  const { isSuccess, data, isError } = GetDataChat({
    userId: auth.id,
    vetId,
  });

  useEffect(() => {
    if (isSuccess) {
      setRoomId(data?.data?.roomId);
    }
  }, [isSuccess, isError]);

  const handleClickBtn = (vet) => {
    if (pageName !== "Telekonsultasi") {
      setModal(true);
      setOperationDays(vet.operationDays);
      setOperationhours(vet.operationHours);
      setVetId(vet.id);
    } else {
      navigate("/chat", { state: { dataVet: vet, roomId } });
    }
  };

  return (
    <div
      key={vet.id}
      className="card card-compact card-side shadow-xl bg-[#edf3ee] border-2 border-[#c8e1ce]"
    >
      <figure className="">
        {pictureLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : successGetPicture ? (
          <div className="avatar max-lg:hidden">
            <div className="w-44">
              <img src={URL.createObjectURL(picture)} alt="pp" />
            </div>
          </div>
        ) : (
          <div className="w-44 h-full bg-red-400" />
        )}
      </figure>
      <div className="card-body lg:max-w-[70%]">
        <div className="flex items-center gap-4">
          {pictureLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : successGetPicture ? (
            <div className="avatar lg:hidden">
              <div className="w-32 rounded-full">
                <img src={URL.createObjectURL(picture)} alt="pp" />
              </div>
            </div>
          ) : (
            <div className="w-44 h-full bg-red-400" />
          )}
          <div>
            <h2 className="card-title">{vet.fullName}</h2>
            <div className="text-sm text-slate-400">
              Pengalaman:{" "}
              <span className="text-slate-700">{vet.experience} Tahun</span>
            </div>
          </div>
        </div>
        <hr className="border" />
        <div className="text-sm text-slate-400">
          Hari :{" "}
          <span className="text-slate-700">
            {vet.operationDays.join(", ")}.
          </span>
        </div>
        <div className="text-sm text-slate-400">
          Jam Operasi :{" "}
          <span className="text-slate-700">{vet.operationHours}</span>
        </div>
        <hr className="border" />
        <div className="card-actions">
          <button
            className="w-full rounded-md p-2 my-5 border bg-[#598665] border-[#598665] text-center text-white"
            onClick={() => handleClickBtn(vet)}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
    // <div
    //   className="border-2 shadow-md rounded-md min-h-40 p-3 space-y-3 col-span-2 lg:col-span-1 flex flex-col lg:flex-row items-center space-x-2"
    //   key={vet.id}
    // >
    //   <div className="w-[60%] lg:w-[40%] flex justify-center">
    //     {successGetPicture && (
    //       <img src={URL.createObjectURL(picture)} alt="tes" />
    //     )}
    //     <div className="w-24 rounded-full h-24 bg-red-400" />
    //   </div>
    //   <div className="w-full space-y-3">
    //     <div className="flex items-center space-x-4">
    //       <div className="col-span-2">
    //         <div>
    //           <div className="font-semibold"> {vet.fullName} </div>
    //           <div className="text-sm text-slate-400">
    //             Pengalaman:{" "}
    //             <span className="text-slate-700">{vet.experience} Tahun</span>{" "}
    //           </div>
    //         </div>
    //         <div className="text-sm text-slate-400"> {vet.address} </div>
    //       </div>
    //     </div>
    //     <hr className="border" />
    //     <div className="text-sm text-slate-400">
    //       Hari :{" "}
    //       <span className="text-slate-700">
    //         {vet.operationDays.join(", ")}.
    //       </span>
    //     </div>
    //     <div className="text-sm text-slate-400">
    //       Jam Operasi :{" "}
    //       <span className="text-slate-700">{vet.operationHours}</span>
    //     </div>
    //     <div className="space-y-2">
    //       <hr className="border" />
    //       <div
    //         className="bg-[#FF834F] rounded-lg text-center p-2 text-white cursor-pointer"
    //         onClick={() => handleClickBtn(vet)}
    //       >
    //         {btnLabel}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
