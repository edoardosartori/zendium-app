import { useEffect, useState } from "react";
import "./Boot.css";

const lines = [

    "Checking memory...",
    "Loading kernel...",
    "Loading UI...",
    "Starting services...",
    "Initializing renderer...",
    "Loading modules...",
    "Done."

];

export default function Boot({ onFinish }: { onFinish: () => void }) {

    const [visible, setVisible] = useState<string[]>([]);

    useEffect(() => {

        let i = 0;

        const timer = setInterval(() => {

            if (i < lines.length) {

                setVisible(v => [...v, lines[i]]);
                i++;

            } else {

                clearInterval(timer);

                setTimeout(onFinish, 1000);

            }

        }, 450);

        return () => clearInterval(timer);

    }, []);

    return (

        <div className="boot">

            <h1>Zendium</h1>

            {visible.map((l, i) => (

                <div key={i}>{l}</div>

            ))}

        </div>

    );

}