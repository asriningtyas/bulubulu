export default function ConfirmModal({
  closeModal,
  actionModal,
  message,
  isLoading,
}) {
  return (
    <>
      <div>
        <div className="justify-end items-center flex w-[70%] overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none">
          <div className="relative w-[50%]">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-center justify-between pl-5 p-3 border-b border-solid bg-[#fdc074] border-slate-200 rounded-t-lg">
                <div className="capitalize font-semibold">Konfirmasi</div>
                <i className="el-icon-close font-semibold text-xl hover:cursor-pointer" />
              </div>
              <div className="space-y-3 p-4 text-center">
                <div>{message || "Apakah Anda yakin ?"}</div>
                <div className="flex items-center space-x-4 text-center justify-center">
                  <button
                    disabled={isLoading}
                    className="btn btn-outline btn-accent"
                    onClick={() => actionModal()}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <span>Ya</span>
                    )}
                  </button>
                  <button
                    className="btn btn-outline btn-error"
                    onClick={() => closeModal()}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black/30 fixed w-screen h-screen inset-0 z-[60]"></div>
    </>
  );
}
