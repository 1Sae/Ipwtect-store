import toast from "react-hot-toast";

// SUCCESS
export const showSuccess = (message: string) => {
  toast.custom((t) => (
    <div
    style={{
      backgroundColor: "#0f172a",
    }}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl 
      shadow-lg text-orange-500 transition-all
      ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <span className="text-orange-500 text-xl">✓</span>
      <span className="text-md font-medium">{message}</span>
    </div>
  ));
};

// ERROR
export const showError = (message: string) => {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-xl 
      bg-[#0f172a] border border-red-500/30 
      shadow-lg text-white transition-all
      ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <span className="text-red-400 text-lg">✕</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  ));
};