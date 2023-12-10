import { useEffect } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { ImCross } from "react-icons/im";

export default function Alert({ desc, type, close }) {
  useEffect(() => {
    setTimeout(() => {
      close(true);
    }, 1000);
  }, []);
  let icon;
  if (type === "success") {
    icon = <BsCheckCircleFill size="3em" className="text-emerald-400" />;
  } else if (type === "error") {
    icon = <ImCross size="3em" className="text-red-400" />;
  }
  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center p-10 z-[51]">
        <div className="w-[80%] lg:w-[30%] flex flex-col items-center justify-center bg-white min-h-[100px] rounded-lg overflow-hidden">
          {/* Content */}
          <div className="px-5 flex items-center justify-center space-x-4">
            <span>{icon}</span>
            <div className="text-sm text-center">{desc}</div>
          </div>
        </div>
      </div>
      <div className="bg-black/30 fixed w-screen h-screen inset-0 z-50"></div>
    </>
  );
}
