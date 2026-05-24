import React from "react";

export default function CreateButton({ handle, title }) {
    return (
        <div className="w-full sm:w-32">
        <button
            type="button"
            onClick={handle}
            className="
            w-full
            px-6 py-2
            font-semibold text-white
            cursor-pointer
            rounded-lg
            transition-all duration-500 ease-out
            bg-[linear-gradient(90deg,#F45C43,#f7702c,#ef4444)]
            bg-[length:200%_100%] bg-left
            hover:bg-right
            transition-[background-position] duration-500 ease-out
            shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]
            "
            
        >
            {title}
        </button>
        </div>
    );
}
