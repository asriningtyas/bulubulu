import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../Assets/Image/LOGO_BULUBULU.png";
import InputField from "../../Components/InputField";
import { Login as LoginApi } from "../../Utils/store";

export default function Login({ onSignUp }) {
  const [payloadLogin, setPayloadLogin] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const HandleLogin = LoginApi();

  useEffect(() => {
    if (HandleLogin.isError) {
      setErrorMessage({
        username: HandleLogin.error?.response?.data?.message,
        password: HandleLogin.error?.response?.data?.message,
      });
    }
  }, [HandleLogin.isError]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setPayloadLogin((prev) => {
      return { ...prev, [name]: value };
    });

    if (value) {
      setErrorMessage((prev) => {
        return { ...prev, [name]: "" };
      });
    } else {
      setErrorMessage((prev) => {
        return {
          ...prev,
          [name]: `${name} tidak boleh kosong`,
        };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(payloadLogin).every((v) => v)) {
      HandleLogin.mutate(payloadLogin);
    } else {
      Object.keys(payloadLogin).map((payload) => {
        if (!payloadLogin[payload]) {
          setErrorMessage((prev) => {
            return {
              ...prev,
              [payload]: `${payload} tidak boleh kosong`,
            };
          });
        }
      });
    }
  };

  // handle success log in
  if (HandleLogin.isSuccess) {
    localStorage.setItem("auth", JSON.stringify(HandleLogin.data?.data || {}));
    navigate("/");
  }

  return (
    <>
      <img src={logo} alt="Logo" className="w-16" />

      <div
        className="w-full rounded-md p-2 border border-[#598665] text-[#598665] text-center hover:bg-[#598665] hover:text-white cursor-pointer"
        onClick={() => onSignUp()}
      >
        Anda pengguna baru? Daftar
      </div>

      <div className="w-full flex items-center">
        <hr className="w-[40%] h-px bg-gray-400 border-0 my-5 flex-shrink-0" />
        <div className="w-[20%] text-center text-gray-400">Atau</div>
        <hr className="w-[40%] h-px bg-gray-400 border-0 my-5 flex-shrink-0" />
      </div>

      <div className="text-slate-700">Sudah memiliki Akun? Masuk</div>

      <form action="" className="w-full" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <InputField
            type="text"
            placeholder="Username"
            name="username"
            value={payloadLogin.username}
            onChange={handleChange}
            errorMessage={errorMessage.username}
          />
          <div className="relative">
            <InputField
              type="password"
              placeholder="Password"
              name="password"
              value={payloadLogin.password}
              onChange={handleChange}
              errorMessage={errorMessage.password}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={HandleLogin.isLoading}
          className="w-full rounded-md p-2 my-5 border bg-[#598665] border-[#598665] text-center text-white"
        >
          {HandleLogin.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <span>Masuk</span>
          )}
        </button>
      </form>
    </>
  );
}
