"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, VolumeX } from "lucide-react";

interface PomodoroProps {
  onPomodoroEnd: () => void;
}

export default function PomodoroTimer({ onPomodoroEnd }: PomodoroProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"estudo" | "pausa">("estudo");
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/alarme.mp3");
    audioRef.current.loop = true; // Loop para garantir que você ouça até parar
    
    const salvo = localStorage.getItem("owl-pomodoro-time");
    if (salvo) setTimeLeft(parseInt(salvo));
  }, []);

  useEffect(() => {
    localStorage.setItem("owl-pomodoro-time", timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const triggerAlarm = () => {
    setIsActive(false);
    setIsAlarmPlaying(true);
    audioRef.current?.play().catch(e => console.log("Áudio bloqueado:", e));
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAlarmPlaying(false);
    
    // Troca o modo após parar o som manualmente
    if (mode === "estudo") {
      onPomodoroEnd();
      setMode("pausa");
      setTimeLeft(5 * 60);
    } else {
      setMode("estudo");
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "estudo" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center relative">
      {/* Botão de Emergência para Parar o Som */}
      {isAlarmPlaying && (
        <button 
          onClick={stopAlarm}
          className="absolute top-2 right-2 bg-red-500 text-white p-3 rounded-full shadow-lg animate-pulse z-50"
        >
          <VolumeX size={24} />
        </button>
      )}

      <div className="flex bg-gray-50 p-1 rounded-full mb-4 border border-gray-100">
        <div className={`text-xs font-bold px-4 py-1.5 rounded-full ${mode === "estudo" ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"}`}>
          {mode === "estudo" ? "Foco" : "Pausa"}
        </div>
      </div>

      <span className="text-6xl font-extrabold tracking-tighter mb-5 text-slate-800">
        {formatTime(timeLeft)}
      </span>
      
      <div className="flex items-center gap-4">
        {!isAlarmPlaying ? (
          <>
            <button onClick={toggleTimer} className="w-14 h-14 rounded-full flex items-center justify-center bg-pink-500 text-white shadow-md">
              {isActive ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
            </button>
            <button onClick={resetTimer} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-500">
              <RotateCcw size={18} />
            </button>
          </>
        ) : (
          <button onClick={stopAlarm} className="bg-red-500 text-white px-6 py-2 rounded-full font-bold">
            Parar Alarme
          </button>
        )}
      </div>
    </div>
  );
}