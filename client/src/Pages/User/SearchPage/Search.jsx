import { RiArrowDropRightLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import InputField from "../../../Components/InputField";
import { useEffect, useState } from "react";
import { VetList } from "../../../Utils/store";
import ScheduleModal from "../../../Components/ScheduleModal";
import VetCard from "./VetCard";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const { pageName } = location.state || {};

  const [inputSearch, setInputSearch] = useState("");
  const [vets, setVets] = useState([]);
  const [filteredVets, setFilteredVets] = useState([]);
  const [modal, setModal] = useState(false);
  const [operationDays, setOperationDays] = useState(false);
  const [operationhours, setOperationhours] = useState(false);
  const [vetId, setVetId] = useState(null);

  const { isSuccess, data, isLoading } = VetList();

  useEffect(() => {
    if (isSuccess) {
      setVets(data.data);
      setFilteredVets(data.data);
    }
  }, [isSuccess, data]);

  const handleSearch = (e) => {
    setInputSearch(e.target.value);
    const filterVets = vets.filter((vet) =>
      vet.fullName.toLowerCase().includes(inputSearch.toLowerCase())
    );
    setFilteredVets(filterVets);
  };

  return (
    <>
      <div className="bg-[#fdc074] pt-24 flex flex-col h-full gap-5 p-4 lg:px-24 text-slate-700 overflow-auto">
        <div className="flex items-center text-sm text-slate-700">
          <div
            className="text-slate-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Halaman Utama
          </div>
          <RiArrowDropRightLine className="text-xl" />
          <div>{pageName || ""}</div>
        </div>
        <InputField
          placeholder="Cari Nama Dokter Hewan"
          value={inputSearch}
          onChange={handleSearch}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {isLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            filteredVets.map((vet) => (
              <VetCard
                key={vet.id}
                vet={vet}
                vetId={vet.id}
                auth={auth}
                setVetId={(val) => setVetId(val)}
                setModal={(val) => setModal(val)}
                setOperationDays={(val) => setOperationDays(val)}
                setOperationhours={(val) => setOperationhours(val)}
                pageName={pageName}
                btnLabel={
                  pageName === "Telekonsultasi"
                    ? "Mulai Konsultasi Online"
                    : "Buat Jadwal"
                }
              />
            ))
          )}
        </div>
      </div>
      {modal && (
        <ScheduleModal
          setModal={() => setModal(false)}
          operationDays={operationDays}
          operationHours={operationhours}
          vetId={vetId}
          close={() => setModal(false)}
        />
      )}
    </>
  );
}
