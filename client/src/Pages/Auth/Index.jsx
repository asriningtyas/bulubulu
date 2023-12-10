import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import windowResize from "../../Utils/windowResize";
import imageLogin from "../../Assets/Image/login.jpg";
import imageSignup from "../../Assets/Image/signup.jpg";

export default function Index() {
  const [isSignUpPage, setIsSignUpPage] = useState(false);
  const { width } = windowResize();

  return (
    <div className="bg-[#fdc074] w-screen h-screen flex justify-center items-center">
      {width <= 1000 ? (
        <div className="w-[80%] flex flex-col items-center space-y-4">
          <div className="text-center">
            <div className="text-2xl text-slate-700">
              Bulu-bulu Animal Clinic
            </div>
            <div className="text-slate-700">Untuk Hewan Peliharan Anda</div>
          </div>

          {isSignUpPage ? (
            <Signup onLogin={() => setIsSignUpPage(false)} />
          ) : (
            <Login onSignUp={() => setIsSignUpPage(true)} />
          )}
        </div>
      ) : (
        <div className="w-[65%] h-[80%] bg-white shadow-lg grid grid-cols-2 rounded-lg overflow-hidden">
          <div
            className="h-full transition-all duration-1000 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                isSignUpPage ? imageSignup : imageLogin
              })`,
            }}
          />
          <div className="flex flex-col items-center justify-center space-y-2 p-10 overflow-auto">
            <div className="text-center">
              <div className="text-xl text-slate-700">
                Bulu-bulu Animal Clinic
              </div>
              <div className="text-slate-700">Untuk Hewan Peliharan Anda</div>
            </div>

            {isSignUpPage ? (
              <Signup onLogin={() => setIsSignUpPage(false)} />
            ) : (
              <Login onSignUp={() => setIsSignUpPage(true)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
