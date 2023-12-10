import { Navigate, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import logo from "../Assets/Image/LOGO_BULUBULU.png";
import {
  RiMenuLine,
  RiHome4Line,
  RiAccountCircleLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { useEffect } from "react";
import { GetUserData, Logout } from "../Utils/store";

export default function Navbar() {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const navigate = useNavigate();

  const { isSuccess: successGetData, data } = GetUserData(auth?.id);

  const { isSuccess, mutateAsync } = Logout();
  const menus = [
    {
      label: "Halaman Utama",
      icon: <RiHome4Line />,
      action: () => navigate("/"),
      role: "all",
    },
    {
      label: "Profil",
      icon: <RiAccountCircleLine />,
      action: () => navigate("/profile"),
      role: "user",
    },
    {
      label: "Keluar",
      icon: <RiLogoutBoxLine />,
      action: async () => {
        await mutateAsync({ username: auth.username });
      },
      role: "all",
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      localStorage.clear();
      navigate("/");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (successGetData) {
      if (!data?.data?.isLogin) {
        localStorage.clear();
        navigate("/");
      }
    }
  }, [successGetData]);

  useEffect(() => {
    function handleClickOutside() {
      document.querySelectorAll(".dropdown").forEach(function (dropdown) {
        dropdown.open = false;
      });
    }

    // Add the event listener when the component mounts
    window.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // const navigate = useNavigate();

  // Function to scroll to the section with the given ID
  // const scrollToSection = (id) => {
  //   const element = document.getElementById(id);
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  return !auth ? (
    <Navigate to="/welcome" replace />
  ) : (
    <div className="h-screen w-screen overflow-auto">
      <div className="w-full h-20 shadow-sm flex justify-between items-center px-5 sm:px-10 inset-0 absolute top-0 backdrop-blur-md bg-white/30 z-30">
        <div className="flex items-center space-x-1">
          <img src={logo} alt="" className="w-12 lg:w-14" />
          <div className="text-xl sm:text-2xl font-semibold">
            Bulu-bulu Animal Clinic
          </div>
        </div>
        {/* menu dropdown */}
        <details className="dropdown dropdown-end">
          <summary className="btn btn-circle btn-ghost btn-xl">
            <RiMenuLine className="cursor-pointer" />
          </summary>
          <ul className="menu dropdown-content z-[1] shadow bg-base-100 rounded-box w-52 mt-4">
            {menus.map((menu, idx) => (
              <li
                className="hover:bg-gray-200 cursor-pointer"
                key={idx}
                onClick={() => menu.action()}
              >
                {["all", auth.role].includes(menu.role) && (
                  <div className="flex">
                    <span className="text-lg">{menu.icon}</span>
                    <div className="w-full text-sm block">{menu.label}</div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </details>
      </div>
      <Outlet />
    </div>
  );
}
