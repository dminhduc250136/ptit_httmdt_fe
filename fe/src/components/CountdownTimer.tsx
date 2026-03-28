"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
    targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime();
            const target = targetDate.getTime();
            const diff = Math.max(0, target - now);

            setTimeLeft({
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const pad = (n: number) => n.toString().padStart(2, "0");

    const timeBlocks = [
        { label: "Giờ", value: pad(timeLeft.hours) },
        { label: "Phút", value: pad(timeLeft.minutes) },
        { label: "Giây", value: pad(timeLeft.seconds) },
    ];

    return (
        <div className="flex items-center gap-1.5">
            {timeBlocks.map((block, index) => (
                <div key={block.label} className="flex items-center gap-1.5">
                    <div className="flex flex-col items-center">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary rounded-xl flex items-center justify-center">
                            <span
                                className="text-lg sm:text-xl font-bold text-white tabular-nums"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                {block.value}
                            </span>
                        </div>
                        <span className="text-[10px] text-muted mt-1 font-medium">
                            {block.label}
                        </span>
                    </div>
                    {index < timeBlocks.length - 1 && (
                        <span className="text-lg font-bold text-primary mb-4">:</span>
                    )}
                </div>
            ))}
        </div>
    );
}
