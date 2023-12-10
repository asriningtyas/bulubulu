import chatVet from "../../../Assets/Image/chatVet.png";
import grooming from "../../../Assets/Image/grooming.jpg";
import sterilCat from "../../../Assets/Image/sterilCat.jpg";
import sterilDog from "../../../Assets/Image/sterilDog.jpg";
import Consul from "../../../Assets/Image/Consul.jpg";
import penginapan from "../../../Assets/Image/penginapan.jpg";
import Vaccination from "../../../Assets/Image/Vaccination.jpg";
import Shuttles from "../../../Assets/Image/Shuttles.jpg";
import scheduleVet from "../../../Assets/Image/scheduleVet.png";

import { Navigate, useNavigate } from "react-router-dom";
import Schedule from "./Schedule";

export default function Main() {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth") || "null");

  return auth?.role === "vet" ? (
    <Navigate to="/vet" replace />
  ) : (
    <div className="scroll-smooth overflow-y-auto flex-1 bg-[#fdc074] pt-24 flex flex-col gap-4">
      {/* Main Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 lg:px-24 w-full">
        <div className="card max-sm:card-compact card-side bg-[#edf3ee] border-2 border-[#c8e1ce] shadow-xl">
          <div className="card-body max-sm:max-w-[60%]">
            <h2 className="card-title max-sm:hidden">Kunjungan Langsung</h2>
            <div>
              Jadwalkan kedatangan ke klinik
              <span className="font-semibold"> tanpa antri</span>
            </div>
            <button
              className="rounded-md p-2 mt-5 border bg-[#598665] border-[#598665] text-center text-white"
              onClick={() =>
                navigate("/search", {
                  state: { pageName: "Kunjungan Langsung" },
                })
              }
            >
              Jadwalkan
            </button>
          </div>
          <figure>
            <img src={scheduleVet} alt="scheduleVet" className="w-28 lg:w-40" />
          </figure>
        </div>

        <div className="card max-sm:card-compact card-side bg-[#edf3ee] border-2 border-[#c8e1ce] shadow-xl">
          <div className="card-body max-sm:max-w-[60%]">
            <h2 className="card-title max-sm:hidden">Telekonsultasi</h2>
            <div>
              Mulai konsultasi <span className="font-semibold">online </span>
              sekarang
            </div>
            <button
              className="rounded-md p-2 mt-5 border bg-[#598665] border-[#598665] text-center text-white"
              onClick={() =>
                navigate("/search", { state: { pageName: "Telekonsultasi" } })
              }
            >
              Konsultasi
            </button>
          </div>
          <figure>
            <img src={chatVet} alt="chatVet" className="w-24 lg:w-36" />
          </figure>
        </div>
      </div>

      {/* More Services */}
      <div className="px-4 lg:px-24 pt-5">
        <div className="text-center py-4 text-2xl font-semibold text-[#598665]">
          Sayangi hewan peliharaan Anda dengan layanan kami!
        </div>
        <div className="carousel max-w-full space-x-4">
          <div className="carousel-item pb-5">
            <div className="card w-64 shadow-lg image-full">
              <figure>
                <img src={Consul} alt="Shoes" />
              </figure>
              <div className="card-body">
                <div className="flex flex-col justify-between items-center">
                  <div className="card-title">Konsultasi</div>
                  <div className="font-semibold">IDR 100K</div>
                </div>
                <p>Siap membantu keluhan hewan peliharaan Anda.</p>
              </div>
            </div>
          </div>
          <div className="carousel-item pb-5">
            <div className="card w-64 shadow-lg image-full">
              <figure>
                <img src={sterilCat} alt="Shoes" />
              </figure>
              <div className="card-body">
                <div className="flex flex-col justify-between items-center">
                  <div className="card-title">Sterilisasi Kucing</div>
                  <div className="font-semibold">Mulai dari IDR 500K</div>
                </div>
                <p>
                  Kendalikan populasi, hindari keturunan yang tidak diinginkan.
                </p>
              </div>
            </div>
          </div>
          <div className="carousel-item pb-5">
            <div className="card w-64 shadow-lg image-full">
              <figure>
                <img src={sterilDog} alt="Shoes" />
              </figure>
              <div className="card-body">
                <div className="flex flex-col justify-between items-center">
                  <div className="card-title">Sterilisasi Anjing</div>
                  <div className="font-semibold">Mulai dari IDR 800K</div>
                </div>
                <p>Perlindungan untuk anjing kesayangan Anda.</p>
              </div>
            </div>
          </div>
          <div className="carousel-item pb-5">
            <div className="card w-64 shadow-lg image-full">
              <figure>
                <img src={penginapan} alt="Shoes" />
              </figure>
              <div className="card-body">
                <div className="flex flex-col justify-between items-center">
                  <div className="card-title">Penginapan</div>
                  <div className="font-semibold">Mulai dari IDR 50K</div>
                </div>
                <p>Nyaman, Aman, dan Penuh Perhatian.</p>
              </div>
            </div>
          </div>
          <div className="carousel-item pb-5">
            <div className="card w-64 shadow-lg image-full">
              <figure>
                <img src={grooming} alt="Shoes" />
              </figure>
              <div className="card-body">
                <div className="flex flex-col justify-between items-center">
                  <div className="card-title">Grooming</div>
                  <div className="font-semibold">Mulai dari IDR 75K</div>
                </div>
                <p>Buat hewan peliharaan Anda tampil maksimal.</p>
              </div>
            </div>
          </div>
          <div className="carousel-item pb-5">
            <div className="card w-64 shadow-lg image-full">
              <figure>
                <img src={Vaccination} alt="Shoes" />
              </figure>
              <div className="card-body">
                <div className="flex flex-col justify-between items-center">
                  <div className="card-title">Vaksinasi</div>
                  <div className="font-semibold">Mulai dari IDR 150K</div>
                </div>
                <p>Lindungi mereka dari penyakit.</p>
              </div>
            </div>
          </div>
          <div className="carousel-item pb-5">
            <div className="card w-64 shadow-lg image-full">
              <figure>
                <img src={Shuttles} alt="Shoes" />
              </figure>
              <div className="card-body">
                <div className="flex flex-col justify-between items-center">
                  <div className="card-title">Antar Jemput</div>
                  {/* <div className="font-semibold">Mulai dari IDR 150K</div> */}
                </div>
                <p>Kami mengurus semuanya!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:px-24">
        <Schedule auth={auth} />
      </div>
    </div>
  );
}
