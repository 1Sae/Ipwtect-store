"use client";

import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function StarRating({
    value,
    onChange,
}: {
    value: number;
    onChange?: (val: number) => void;
}) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-1 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hover || value);

            return active ? (
            <AiFillStar
                key={star}
                className="text-orange-500 text-xl"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => onChange?.(star)}
            />
            ) : (
            <AiOutlineStar
                key={star}
                className="text-gray-400 text-xl"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => onChange?.(star)}
            />
            );
        })}
        </div>
    );
}