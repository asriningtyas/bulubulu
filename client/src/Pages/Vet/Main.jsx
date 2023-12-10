import { useState } from "react";

import ListChat from "./ListChat";
import Schedule from "./Schedule";
import Profile from "./Profile";
import InputField from "../../Components/InputField";

export default function Main() {
  const [tab, setTab] = useState("chat");
  const [inputSearch, setInputSearch] = useState("");

  const getTab = () => {
    switch (tab) {
      case "chat":
        return <ListChat search={inputSearch.toLocaleLowerCase()} />;

      case "schedule":
        return <Schedule search={inputSearch.toLocaleLowerCase()} />;

      case "profile":
        return <Profile />;

      default:
        break;
    }
  };

  return (
    <div className="bg-[#fdc074] pt-24 flex flex-col h-full px-4 lg:px-20 overflow-auto">
      <InputField
        className={"mb-2"}
        placeholder="Cari Nama Pasien"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />
      <div className="bg-[#fdc074] sticky top-0 w-full flex items-center pt-2">
        <div
          className={`w-[50%] text-center p-3 ${
            tab === "chat" &&
            "border-b border-[#598665] text-[#598665] font-semibold"
          } cursor-pointer lg:text-lg hover:text-[#598665]`}
          onClick={() => setTab("chat")}
        >
          Pesan
        </div>
        <div
          className={`w-[50%] text-center p-3 ${
            tab === "schedule" &&
            "border-b border-[#598665] text-[#598665] font-semibold"
          } cursor-pointer lg:text-lg hover:text-[#598665]`}
          onClick={() => setTab("schedule")}
        >
          Jadwal
        </div>
        <div
          className={`w-[50%] text-center p-3 ${
            tab === "profile" &&
            "border-b border-[#598665] text-[#598665] font-semibold"
          } cursor-pointer lg:text-lg hover:text-[#598665]`}
          onClick={() => setTab("profile")}
        >
          Profil
        </div>
      </div>
      {getTab()}
    </div>
  );
}
