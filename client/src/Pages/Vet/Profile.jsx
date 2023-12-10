import { useEffect, useState } from "react";
import InputField from "../../Components/InputField";
import {
  GetPicture,
  GetUserData,
  UpdateProfilePicture,
  UpdateProfileUser,
} from "../../Utils/store";

export default function Profile() {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const days = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
    "Minggu",
  ];

  const [payloadUpdate, setPayloadSignup] = useState({
    username: "",
    fullName: "",
    email: "",
    operationHoursStart: "",
    operationHoursEnd: "",
    experience: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    username: "",
    fullName: "",
    email: "",
    operationHoursStart: "",
    operationHoursEnd: "",
    operationDays: "",
  });

  const [image, setImage] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [listDays, setListDays] = useState([]);

  const {
    isSuccess: successGetUser,
    data: userData,
    isLoading: getUserLoading,
  } = GetUserData(auth?.id);
  const { mutateAsync: updateUser, isLoading: updateUserLoading } =
    UpdateProfileUser();
  const { mutateAsync: updatePicture, isLoading: updatePictureLoading } =
    UpdateProfilePicture();

  useEffect(() => {
    if (successGetUser) {
      setListDays(
        days.map((day) => {
          const value = userData?.data?.operationDays?.includes(day);
          return {
            name: day,
            value,
          };
        })
      );

      setPayloadSignup((prev) => {
        return {
          ...prev,
          username: userData?.data?.username,
          fullName: userData?.data?.fullName,
          email: userData?.data?.email,
          operationHoursStart:
            userData?.data?.operationHours?.split(" - ")?.[0],
          operationHoursEnd: userData?.data?.operationHours?.split(" - ")?.[1],
          experience: userData?.data?.experience,
        };
      });
    }
  }, [successGetUser]);

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

  const handleCheckboxChange = (index) => {
    const updatedList = [...listDays];
    updatedList[index].value = !updatedList[index].value;

    const isListDays = updatedList.filter((day) => day.value === true);

    if (!isListDays.length) {
      setErrorMessage((prev) => {
        return {
          ...prev,
          operationDays: `Kolom ini tidak boleh kosong`,
        };
      });
    }
    setListDays(updatedList);
  };

  const handleUpdateProfile = async () => {
    if (isChanged) {
      const payloadUpdatePicture = new FormData();
      payloadUpdatePicture.append("picture", image);
      payloadUpdatePicture.append("id", auth?.id);

      await updatePicture(payloadUpdatePicture);
    }

    const {
      experience,
      operationHoursEnd,
      operationHoursStart,
      fullName,
      email,
      username,
    } = payloadUpdate;

    const operationDays = listDays
      .filter((day) => day.value === true)
      ?.map((day) => day.name);
    const payload = {
      id: auth?.id,
      experience,
      operationHours: `${operationHoursStart} - ${operationHoursEnd}`,
      operationDays,
      fullName,
      email,
      username,
    };

    await updateUser(payload);
  };

  return (
    <div className="w-full overflow-auto flex justify-center py-4">
      <div className="w-[70%] overflow-auto bg-white p-2 rounded-xl flex ">
        {getUserLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          successGetUser && (
            <GetImage
              userData={userData.data}
              setImage={(val) => setImage(val)}
              image={image}
              isChanged={() => setIsChanged(true)}
            />
          )
        )}
        <div className="p-5 w-full space-y-4 h-full overflow-auto">
          <div className="">
            <div>Nama Lengkap</div>
            <InputField
              type="text"
              placeholder="Nama Lengkap"
              name="fullName"
              value={payloadUpdate.fullName}
              onChange={handleChange}
              errorMessage={errorMessage.fullName}
            />
          </div>
          <div className="">
            <div>Email</div>
            <InputField
              type="text"
              placeholder="Email"
              name="email"
              value={payloadUpdate.email}
              onChange={handleChange}
              errorMessage={errorMessage.email}
            />
          </div>
          <div className="">
            <div>Username</div>
            <InputField
              type="text"
              placeholder="Username"
              name="username"
              value={payloadUpdate.username}
              onChange={handleChange}
              errorMessage={errorMessage.username}
            />
          </div>
          {/* <div className="">
            <div>Password</div>
            <InputField
              type="password"
              placeholder="Kata Sandi"
              name="password"
              value={payloadUpdate.password}
              onChange={handleChange}
              errorMessage={errorMessage.password}
            />
          </div> */}
          {auth?.role === "vet" && (
            <div className="space-y-4 py-5">
              <div className="relative rounded-md w-full">
                <InputField
                  type="experience"
                  placeholder="experience"
                  name="experience"
                  value={payloadUpdate.experience}
                  onChange={handleChange}
                  errorMessage={errorMessage.experience}
                />
              </div>
              <div>Waktu Operasional</div>
              <div className="space-y-2">
                <div>Hari</div>
                <div className="form-control flex-row flex-wrap items-center gap-4">
                  {listDays.map((day, i) => (
                    <label key={i} className="label cursor-pointer gap-2">
                      <input
                        type="checkbox"
                        checked={day.value}
                        className="checkbox checkbox-accent"
                        onChange={() => handleCheckboxChange(i)}
                      />
                      <span className="label-text">{day.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div>Jam</div>
                <div className="flex items-start gap-5">
                  <div className="w-48">
                    <InputField
                      type="time"
                      placeholder="operationHoursEnd"
                      name="operationHoursStart"
                      value={payloadUpdate.operationHoursStart}
                      onChange={handleChange}
                      errorMessage={errorMessage.operationHoursStart}
                    />
                  </div>
                  <div className="h-11 flex items-center">s/d</div>
                  <div className="w-48">
                    <InputField
                      type="time"
                      placeholder="operationHoursEnd"
                      name="operationHoursEnd"
                      value={payloadUpdate.operationHoursEnd}
                      onChange={handleChange}
                      errorMessage={errorMessage.operationHoursEnd}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="w-full flex justify-end">
            <button
              className={`btn btn-outline btn-accent ${
                Object.values(errorMessage).find((el) => el.length > 0) &&
                "btn-disabled"
              }`}
              onClick={handleUpdateProfile}
            >
              {updateUserLoading || updatePictureLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <span>Ubah Profil</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GetImage({ userData, setImage, image, isChanged }) {
  const {
    isSuccess: successGetPicture,
    data: picture,
    isLoading,
  } = GetPicture(userData?.id);

  useEffect(() => {
    if (successGetPicture) {
      setImage(picture);
    }
  }, [successGetPicture]);
  return (
    <div>
      {isLoading ? (
        <span className="loading loading-spinner"></span>
      ) : image ? (
        <label
          className="avatar cursor-pointer tooltip tooltip-bottom"
          data-tip="Ubah foto profil"
        >
          <div className="w-64 h-64 rounded-full border-4">
            <img src={URL.createObjectURL(image)} alt="pp" />
          </div>
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              isChanged();
            }}
          />
        </label>
      ) : (
        <div className="avatar">
          <div className="w-64 h-64 rounded-full border-4">
            <img alt="pp" />
          </div>
        </div>
      )}
    </div>
  );
}
