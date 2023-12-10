import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import InputField from "../../Components/InputField";
import { Register } from "../../Utils/store";

export default function Signup({ onLogin }) {
  const [payloadSignup, setPayloadSignup] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
  });

  // const navigate = useNavigate();
  const HandleSignup = Register();

  useEffect(() => {
    if (HandleSignup.isError) {
      if (HandleSignup.error?.response?.data?.message.includes("email")) {
        setErrorMessage({
          email: HandleSignup.error?.response?.data?.message,
        });
      } else if (
        HandleSignup.error?.response?.data?.message.includes("Username")
      ) {
        setErrorMessage({
          username: HandleSignup.error?.response?.data?.message,
        });
      }
    }
  }, [HandleSignup.isError]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setPayloadSignup((prev) => {
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
          [name]: `Kolom ini tidak boleh kosong`,
        };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(payloadSignup).every((v) => v)) {
      HandleSignup.mutate(payloadSignup);
    } else {
      Object.keys(payloadSignup).map((payload) => {
        if (!payloadSignup[payload]) {
          setErrorMessage((prev) => {
            return {
              ...prev,
              [payload]: `Kolom ini tidak boleh kosong`,
            };
          });
        }
      });
    }
  };

  if (HandleSignup.isSuccess) {
    onLogin();
  }

  return (
    <>
      <div className="text-slate-700">Buat Akun Sekarang</div>

      <form action="" className="w-full" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <InputField
            type="text"
            placeholder="Nama Lengkap"
            name="fullName"
            value={payloadSignup.fullName}
            onChange={handleChange}
            errorMessage={errorMessage.fullName}
          />
          <InputField
            type="text"
            placeholder="Email"
            name="email"
            value={payloadSignup.email}
            onChange={handleChange}
            errorMessage={errorMessage.email}
          />
          <InputField
            type="text"
            placeholder="Username"
            name="username"
            value={payloadSignup.username}
            onChange={handleChange}
            errorMessage={errorMessage.username}
          />
          <InputField
            type="password"
            placeholder="Buat Kata Sandi"
            name="password"
            value={payloadSignup.password}
            onChange={handleChange}
            errorMessage={errorMessage.password}
          />
        </div>

        <button
          type="submit"
          disabled={HandleSignup.isLoading}
          className="w-full rounded-md p-2 mt-5 border bg-[#598665] border-[#598665] text-center text-white"
        >
          {HandleSignup.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <span>Buat Akun</span>
          )}
        </button>
      </form>
      <div className="w-full text-slate-700 text-center text-sm flex items-center justify-center space-x-1">
        <div>Sudah memiliki akun?</div>
        <div
          className="text-[#598665] cursor-pointer"
          onClick={() => onLogin()}
        >
          Masuk
        </div>
      </div>
    </>
  );
}
