import { useEffect, useState } from "react";
import {
  ChangeStatusSchedule,
  GetPicture,
  VetScheduleList,
} from "../../Utils/store";
import ConfirmModal from "../../Components/ConfirmModal";
import RejectModal from "../../Components/RejectModal";

export default function Schedule({ search = "" }) {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");

  const [listSchedules, setListSchedules] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalReject, setModalReject] = useState(false);
  const [message, setmessage] = useState(null);
  const [action, setAction] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [messageReject, setMessageReject] = useState();

  const { isSuccess, data, refetch, isLoading } = VetScheduleList(auth.idVet);
  const {
    mutateAsync,
    isSuccess: changeStatusSuccess,
    isError: changeStatusError,
    isLoading: changeStatusLoading,
  } = ChangeStatusSchedule();

  useEffect(() => {
    if (isSuccess) {
      const filterSchedule = data.data.filter((schedule) =>
        schedule.user.fullName.toLowerCase().includes(search)
      );
      setListSchedules(filterSchedule);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess) {
      const filterSchedule = data.data.filter((schedule) =>
        schedule.user.fullName.toLowerCase().includes(search)
      );
      setListSchedules(filterSchedule);
    }
  }, [search]);

  useEffect(() => {
    if (changeStatusSuccess) {
      setModalConfirm(false);
      refetch();
      setListSchedules(data?.data);
    }
  }, [changeStatusSuccess, changeStatusError]);

  const getStatus = (status) => {
    switch (status) {
      case "draft":
        return "Menunggu Konfirmasi";

      case "accepted":
        return "Diterima";

      case "rejected":
        return "Ditolak";

      case "canceled":
        return "Dibatalkan";

      case "finished":
        return "Selesai";

      default:
        break;
    }
  };

  const handleActionModal = (actionSchedule, dataSchedule) => {
    setmessage(
      `Apakah Anda yakin ingin ${
        actionSchedule === "accept" ? "menerima" : "menolak"
      } jadwal temu pada tanggal ${dataSchedule.date} ${dataSchedule.time} ?`
    );
    setAction(actionSchedule);
    setSelectedSchedule(dataSchedule);
    actionSchedule === "accept" ? setModalConfirm(true) : setModalReject(true);
  };

  const handleActionSchedule = async () => {
    const payload = {
      id: selectedSchedule.id,
      status: `${action}ed`,
      message: action === "reject" ? messageReject : "",
    };

    await mutateAsync(payload);
  };
  return (
    <>
      <div className="py-4 overflow-auto">
        <div className="w-full h-full overflow-auto rounded-xl">
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <table className="w-full ">
              <thead className="sticky top-0 z-[1]">
                <tr className="bg-[#FDE5D9]">
                  <th className="p-2 px-4 w-[1px] whitespace-nowrap text-center">
                    No.
                  </th>
                  <th className="p-2 w-64">Customer</th>
                  <th className="p-2 px-4">Keluhan Hewan</th>
                  <th className="p-2 w-5">Tanggal</th>
                  <th className="p-2 w-5">Jam</th>
                  <th className="p-2 w-48">Status</th>
                  <th className="p-2 w-40"></th>
                </tr>
              </thead>
              <tbody>
                {listSchedules?.length ? (
                  listSchedules?.map((schdule, idx) => (
                    <tr
                      className={`${
                        idx % 2 !== 0 ? "bg-slate-100" : "bg-white"
                      }`}
                      key={schdule.id}
                    >
                      <td className="p-2 text-center">{idx + 1}.</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center space-x-3">
                          <ImageUser user={schdule.user} />
                          <div>
                            <div className="font-semibold">
                              {schdule.user.fullName}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-2 text-center">
                        {schdule.symptom || "-"}
                      </td>
                      <td className="p-2 text-center">{schdule.date}</td>
                      <td className="p-2 text-center">{schdule.time}</td>
                      <td className="p-2 text-center">
                        {getStatus(schdule.status)}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className={`btn btn-outline btn-accent btn-xs ${
                              schdule.status !== "draft" && "btn-disabled"
                            }`}
                            onClick={() => handleActionModal("accept", schdule)}
                          >
                            Terima
                          </button>
                          <button
                            className={`btn btn-outline btn-error btn-xs ${
                              schdule.status !== "draft" && "btn-disabled"
                            }`}
                            onClick={() => handleActionModal("reject", schdule)}
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-slate-200">
                    <td colSpan="7" className="p-2 text-center">
                      No Data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modalConfirm && (
        <ConfirmModal
          message={message}
          closeModal={() => setModalConfirm(false)}
          actionModal={handleActionSchedule}
          isLoading={changeStatusLoading}
        />
      )}
      {modalReject && (
        <RejectModal
          closeModal={() => {
            setModalReject(false);
            setModalConfirm(false);
          }}
          reject={(val) => {
            setMessageReject(val);
            setModalConfirm(true);
          }}
        />
      )}
    </>
  );
}

function ImageUser({ user }) {
  const {
    isSuccess: successGetPicture,
    data: picture,
    isLoading: pictureLoading,
  } = GetPicture(user.id);
  return (
    <div className="avatar">
      <div className="mask mask-squircle w-12 h-12">
        {pictureLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          successGetPicture && (
            <img src={URL.createObjectURL(picture)} alt="pp" />
          )
        )}
      </div>
    </div>
  );
}
