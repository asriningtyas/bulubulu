import { RiCloseFill } from "react-icons/ri";
import { DayPicker } from "react-day-picker";
import { useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import moment from "moment";
import Alert from "./Alert";
import { CreateSchedule } from "../Utils/store";

const css = `
  .my-selected:not([disabled]) { 
    font-weight: bold; 
    color: #FF834F;
    border: 2px solid #FF834F;
  }
  .my-selected:hover:not([disabled]) { 
    border-color: #FF834F;
    color: #FF834F;
  }
  .my-today { 
    font-weight: bold;
    font-size: 140%; 
  }
`;

export default function ScheduleModal({
  setModal,
  operationDays,
  operationHours,
  vetId,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeAvailable, setTimeAvailable] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [petMessage, setPetMessage] = useState("");
  const [alert, setAlert] = useState({
    show: false,
  });

  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const listDays = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
    "Minggu",
  ];

  const { mutate, isSuccess, isError } = CreateSchedule();

  useEffect(() => {
    setTimeAvailable(getInterval(operationHours));
  }, []);

  useEffect(() => {
    if (isError) {
      setAlert({
        show: true,
        type: "error",
        desc: "Gagal membuat jadwal",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      setAlert({
        show: true,
        type: "success",
        desc: "Berhasil membuat jadwal",
      });
    }
  }, [isSuccess]);

  const isDateSelectable = (date) => {
    const dayOperationIndex = operationDays.map(
      (dayOperation) => listDays.findIndex((day) => day === dayOperation)
    );
    console.log(operationDays)
    console.log(dayOperationIndex)
    console.log(date.getDay())
    return !dayOperationIndex?.includes(date.getDay());
  };

  const getInterval = (operationHours) => {
    const timeParts = operationHours.split(" - ");

    const startTime = moment(timeParts[0], "HH:mm");
    const endTime = moment(timeParts[1], "HH:mm");

    const timeIntervals = [];
    let currentTime = startTime.clone();

    while (currentTime.isBefore(endTime)) {
      timeIntervals.push(currentTime.format("HH:mm"));
      currentTime.add(1, "hour");
    }
    return timeIntervals;
  };

  const handleSchedule = () => {
    const payload = {
      date: moment(selectedDate).format("L"),
      time: selectedTime,
      userId: auth.id,
      vetId,
      symptom: petMessage,
    };

    if (Object.values(payload).every((value) => value)) {
      mutate(payload);
    }
  };

  return (
    <>
      <div>
        <div className="justify-center items-center flex fixed inset-0 z-50">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[90%] lg:w-[50%] h-[85%] overflow-x-hidden overflow-y-auto bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between pl-5 p-3 border-b border-solid bg-[#FF834F] border-slate-200 rounded-t-lg  text-white">
              <div className="capitalize font-semibold">
                Jadwalkan Kunjungan Langsung
              </div>
              <RiCloseFill
                className="font-semibold text-xl hover:cursor-pointer"
                onClick={() => setModal(false)}
              />
            </div>
            <div className="space-y-1 p-3">
              <div className="text-sm lg:text-base">
                Gejala apa yang dialami hewan peliharaan Anda ?
              </div>
              <div>
                <span className="text-xs text-slate-400">
                  <span className="text-red-600">*</span>maks 200 karakter
                </span>
                <div className="flex items-center space-x-4 text-center justify-center">
                  <textarea
                    className="border-2 w-full"
                    rows="3"
                    maxLength="200"
                    value={petMessage}
                    onChange={(e) => setPetMessage(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-start justify-center">
              <style>{css}</style>
              <DayPicker
                className="flex justify-center w-full"
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateSelectable}
                fromDate={moment().toDate()}
                toDate={moment().add(30, "days").toDate()}
                modifiersClassNames={{
                  selected: "my-selected",
                  today: "my-today",
                }}
                modifiersStyles={{
                  disabled: { fontSize: "75%" },
                }}
              />
              <div className="flex flex-col items-center space-y-3 justify-center w-full">
                <div className="text-lg font-semibold">Pilih jam</div>
                <div className="grid grid-cols-3 gap-5">
                  {timeAvailable.map((time) => (
                    <div
                      key={time}
                      className={`border rounded-md p-3 cursor-pointer text-center ${
                        selectedTime === time && "bg-[#FF834F] text-white"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      <div>{time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-3 py-3 lg:-mt-8 flex justify-end">
              <div
                className={`p-2 px-5 rounded-lg border ${!petMessage || !selectedDate || !selectedTime ? 'bg-slate-400' :  'bg-[#FF834F] text-white cursor-pointer'}`}
                onClick={handleSchedule}
              >
                Jadwalkan
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 absolute inset-0 z-20 bg-black" />
      </div>
      {alert.show && (
        <Alert
          type={alert.type}
          desc={alert.desc}
          close={() => {
            setAlert({ show: false });
            if (alert?.type === "success") {
              setModal(false);
            }
          }}
        />
      )}
    </>
  );
}
