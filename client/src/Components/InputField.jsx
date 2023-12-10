import { useState } from "react";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

export default function InputField({
  value,
  onChange,
  placeholder,
  type,
  className,
  errorMessage,
  name,
}) {
  const [seePassword, setSeePassword] = useState(false);

  const getType = () => {
    if (type) {
      if (type === "password") {
        return seePassword ? "text" : "password";
      } else if (type === "experience") {
        return "number";
      } else {
        return type;
      }
    } else {
      return "";
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="relative">
        {type === "experience" && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 bg-[#598665] rounded-r-md text-white z-[1]">
            <span>Tahun</span>
          </div>
        )}
        <input
          type={getType()}
          name={name || ""}
          className={`w-full text-slate-700 rounded-md border bg-white p-2 placeholder:text-sm placeholder:italic focus:outline-[#598665] ${className} ${
            errorMessage ? "border-[#FF4949]" : "border-gray-400"
          }`}
          value={value || ""}
          onChange={(e) => {
            onChange && onChange(e);
          }}
          placeholder={placeholder}
        />
        {type === "password" && (
          <div className="w-4 h-4 absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
            <label className="swap">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                value={seePassword}
                onChange={() => setSeePassword(!seePassword)}
              />

              {/* volume on icon */}
              <RiEyeLine className="w-4 h-4 swap-on" />

              {/* volume off icon */}
              <RiEyeCloseLine className="w-4 h-4 swap-off" />
            </label>
          </div>
        )}
      </div>

      {errorMessage && (
        <small className="text-[#FF4949] indent-2"> {errorMessage} </small>
      )}
    </div>
  );
}
