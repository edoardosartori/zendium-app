import { useEffect, useState } from "react";

import { beep } from "../audio/Audio";

type Props = {

    text: string;

    speed?: number;

    onComplete?: () => void;

};

export default function TypingText({

    text,

    speed = 60,

    onComplete

}: Props) {

    const [value, setValue] = useState("");

    useEffect(() => {

        let i = 0;

        const timer = setInterval(() => {

            if (i >= text.length) {

                clearInterval(timer);

                onComplete?.();

                return;

            }

            beep();

            setValue(text.slice(0, i + 1));

            i++;

        }, speed);

        return () => clearInterval(timer);

    }, []);

    return (
    <span>
        {value}
        <span className="cursor">█</span>
    </span>
    );

}