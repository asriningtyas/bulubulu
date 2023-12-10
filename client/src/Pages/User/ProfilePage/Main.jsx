import { useNavigate } from "react-router-dom";
import Profile from "../../Vet/Profile";

export default function Main() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#fdc074] pt-20 flex flex-col h-full px-4 lg:px-20 overflow-auto">
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <a className="text-slate-500" onClick={() => navigate("/")}>
              Halaman Utama
            </a>
          </li>
          <li>Profil</li>
        </ul>
      </div>
      <Profile />
    </div>
  );
}
