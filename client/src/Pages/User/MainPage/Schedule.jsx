import { GiConfirmed, GiDogBowl } from "react-icons/gi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RiHistoryFill } from "react-icons/ri";
import { ChangeStatusSchedule, UserScheduleList } from "../../../Utils/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment/min/moment-with-locales";
import ConfirmModal from "../../../Components/ConfirmModal";

export default function Schedule({ auth }) {
  const navigate = useNavigate();
  const {
    isSuccess,
    data,
    isError,
    refetch,
    isLoading: getListLoading,
  } = UserScheduleList(auth.id);
  const {
    mutateAsync,
    isSuccess: changeStatusSuccess,
    isLoading,
  } = ChangeStatusSchedule();

  const [tab, setTab] = useState("waiting");
  const [message, setMessage] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [listSchedules, setListSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      filterData();
    }
  }, [isSuccess, data]);

  useEffect(() => {
    setListSchedules(data?.data);
    async function fetch() {
      await refetch();
    }
    if (changeStatusSuccess) {
      fetch();
      setModalConfirm(false);
    }
  }, [changeStatusSuccess]);

  useEffect(() => {
    if (isSuccess) {
      filterData();
    }
  }, [tab]);

  const filterData = () => {
    let filteredSchedules = null;

    switch (tab) {
      case "waiting":
        filteredSchedules = data?.data?.filter(
          (schedule) => schedule.status === "draft"
        );
        break;
      case "coming":
        filteredSchedules = data?.data?.filter(
          (schedule) => schedule.status === "accepted"
        );
        break;
      case "history":
        filteredSchedules = data?.data?.filter(
          (schedule) => !["draft", "accepted"].includes(schedule.status)
        );
        break;

      default:
        break;
    }
    setListSchedules(filteredSchedules);
  };

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

  const getIcon = () => {
    switch (tab) {
      case "waiting":
        return <AiOutlineClockCircle className="text-3xl hidden lg:flex" />;

      case "coming":
        return <GiConfirmed className="text-3xl hidden lg:flex" />;

      case "history":
        return <RiHistoryFill className="text-3xl hidden lg:flex" />;

      default:
        break;
    }
  };

  const handleActionSchedule = async () => {
    const payload = {
      id: selectedSchedule.id,
      status: "canceled",
      message: "",
    };

    await mutateAsync(payload);
  };

  return (
    <>
      <details className="collapse collapse-arrow bg-[#edf3ee] border-2 border-[#c8e1ce]">
        <summary className="collapse-title text-lg lg:text-xl font-medium">
          Jadwal Janji Temu
        </summary>
        <div className="collapse-content max-h-80 overflow-auto relative">
          <div className="tabs w-full font-semibold py-4 sticky top-0 bg-[#edf3ee]">
            <a
              className={`tab w-[33%] tab-bordered ${
                tab === "waiting" && "tab-active"
              }`}
              onClick={() => setTab("waiting")}
            >
              Menunggu Konfirmasi
            </a>
            <a
              className={`tab w-[33%] tab-bordered ${
                tab === "coming" && "tab-active"
              }`}
              onClick={() => setTab("coming")}
            >
              Akan Datang
            </a>
            <a
              className={`tab w-[33%] tab-bordered ${
                tab === "history" && "tab-active"
              }`}
              onClick={() => setTab("history")}
            >
              Riwayat
            </a>
          </div>
          <div className="overflow-auto">
            {isSuccess && (
              <div className="space-y-4">
                {listSchedules?.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 items-center lg:space-x-3"
                  >
                    {getIcon()}
                    <hr className="border w-full lg:hidden" />
                    <div> {item.vet.user.fullName} </div>
                    <div>|</div>
                    <div>
                      {moment(item.date).locale("id").format("LL")} -
                      <span> {item.time} </span>
                    </div>
                    {tab === "history" && (
                      <>
                        <div>|</div>
                        <div>{getStatus(item.status)}</div>
                      </>
                    )}
                    {tab !== "history" && (
                      <div
                        className="btn btn-outline btn-sm btn-error"
                        onClick={() => {
                          setMessage(
                            `Apakah Anda yakin inging membetalkan jadwal temu pada tanggal
                          ${moment(item.date).locale("id").format("LL")} - ${
                              item.time
                            }`
                          );
                          setSelectedSchedule(item);
                          setModalConfirm(true);
                        }}
                      >
                        batalkan
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {isError && (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex flex-col items-center">
                  <GiDogBowl className="text-6xl" />
                  <div className="text-slate-700">
                    Anda belum memiliki janji temu
                  </div>
                </div>
                <div
                  className="p-4 border border-[#FF834F] text-[#FF834F] rounded cursor-pointer hover:bg-[#FF834F] hover:text-white"
                  onClick={() =>
                    navigate("/search", {
                      state: { pageName: "Kunjungan Langsung" },
                    })
                  }
                >
                  Buat janji temu sekarang
                </div>
              </div>
            )}
            {getListLoading && (
              <span className="loading loading-spinner"></span>
            )}
          </div>
        </div>
      </details>
      {modalConfirm && (
        <ConfirmModal
          message={message}
          closeModal={() => setModalConfirm(false)}
          actionModal={handleActionSchedule}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
