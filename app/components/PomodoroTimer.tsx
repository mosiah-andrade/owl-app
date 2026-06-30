"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface PomodoroProps {
  onPomodoroEnd: () => void;
}

export default function PomodoroTimer({ onPomodoroEnd }: PomodoroProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"estudo" | "pausa">("estudo");
  
  // Usamos useRef para o áudio para evitar problemas de re-renderização
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicialização segura no lado do cliente
  useEffect(() => {
    audioRef.current = new Audio("/alarme.mp3");
    audioRef.current.load(); // Pré-carrega o áudio
    
    const salvo = localStorage.getItem("owl-pomodoro-time");
    if (salvo) {
      setTimeLeft(parseInt(salvo));
    }
  }, []);

  // Persiste o tempo no localStorage
  useEffect(() => {
    localStorage.setItem("owl-pomodoro-time", timeLeft.toString());
  }, [timeLeft]);

  // Lógica principal do Timer
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, mode]);

  const handleTimerEnd = () => {
    setIsActive(false);
    
    // Tenta tocar o áudio com segurança.
    audioRef.current?.play().catch((e) => console.log("Áudio bloqueado pelo navegador:", e));
    
    // Pequeno atraso (500ms) para garantir que a interface não trave 
    // ao processar o som e a mudança de estado simultaneamente.
    setTimeout(() => {
      if (mode === "estudo") {
        onPomodoroEnd();
        setMode("pausa");
        setTimeLeft(5 * 60);
      } else {
        setMode("estudo");
        setTimeLeft(25 * 60);
      }
    }, 500);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    const novoTempo = mode === "estudo" ? 25 * 60 : 5 * 60;
    setTimeLeft(novoTempo);
  };

  const switchMode = (newMode: "estudo" | "pausa") => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === "estudo" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center relative">
      <div className="flex bg-gray-50 p-1 rounded-full mb-4 border border-gray-100">
        <button 
          onClick={() => switchMode("estudo")}
          className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${mode === "estudo" ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"}`}
        >
          Foco
        </button>
        <button 
          onClick={() => switchMode("pausa")}
          className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${mode === "pausa" ? "bg-white text-blue-500 shadow-sm" : "text-gray-400"}`}
        >
          Pausa
        </button>
      </div>

      <span className={`text-6xl font-extrabold tracking-tighter mb-5 ${mode === "estudo" ? "text-slate-800" : "text-blue-600"}`}>
        {formatTime(timeLeft)}
      </span>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTimer}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-transform hover:scale-105 active:scale-95 ${isActive ? "bg-slate-800" : "bg-pink-500"}`}
        >
          {isActive ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
        </button>
        
        <button 
          onClick={resetTimer}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}