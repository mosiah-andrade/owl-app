"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, VolumeX, Check } from "lucide-react";

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
    audioRef.current.loop = true;
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
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleTimerEnd = () => {
    setIsActive(false);
    setIsAlarmPlaying(true);
    audioRef.current?.play().catch((e) => console.log("Áudio aguardando interação:", e));
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAlarmPlaying(false);
    // Troca automática para o próximo modo ao parar o alarme
    const nextMode = mode === "estudo" ? "pausa" : "estudo";
    if (mode === "estudo") onPomodoroEnd();
    setMode(nextMode);
    setTimeLeft(nextMode === "estudo" ? 25 * 60 : 5 * 60);
  };

  return (
    <div 
        className={`w-full rounded-3xl p-6 mb-6 shadow-xl border border-white/20 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700 bg-[length:200%_200%] animate-gradient-flow ${
            mode === "estudo" 
            ? "bg-gradient-to-br from-pink-100 via-white to-pink-50" 
            : "bg-gradient-to-br from-blue-100 via-white to-blue-50"
        }`}
        >
      
      {/* Luzes de fundo (decorativas) */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 ${mode === "estudo" ? "bg-pink-400" : "bg-blue-400"}`} />
      <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-30 ${mode === "estudo" ? "bg-pink-400" : "bg-blue-400"}`} />
      {/* Overlay de Alarme - UX muito mais intuitiva */}
      {isAlarmPlaying && (
        <div className="absolute inset-0 z-20 bg-slate-900/95 flex flex-col items-center justify-center text-white p-6 animate-in fade-in">
          <h2 className="text-2xl font-bold mb-2">Tempo Esgotado!</h2>
          <p className="mb-8 opacity-80">{mode === "estudo" ? "Hora de descansar" : "Hora de focar"}</p>
          <button 
            onClick={stopAlarm}
            className="flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform"
          >
            <Check size={24} /> {mode === "estudo" ? "Iniciar Pausa" : "Iniciar Foco"}
          </button>
        </div>
      )}

      {/* Seletor de Modo */}
      <div className="flex bg-gray-100 p-1 rounded-2xl mb-6 border border-gray-200">
        <button onClick={() => { stopAlarm(); setMode("estudo"); setTimeLeft(25*60); setIsActive(false); }} className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === "estudo" ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"}`}>Foco</button>
        <button onClick={() => { stopAlarm(); setMode("pausa"); setTimeLeft(5*60); setIsActive(false); }} className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === "pausa" ? "bg-white text-blue-500 shadow-sm" : "text-gray-400"}`}>Pausa</button>
      </div>

      <span className={`text-7xl font-mono font-bold tracking-tighter mb-8 ${isAlarmPlaying ? "animate-pulse text-red-500" : mode === "estudo" ? "text-slate-800" : "text-blue-500"}`}>
        {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:{ (timeLeft % 60).toString().padStart(2, "0")}
      </span>
      
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${isActive ? "bg-slate-800" : "bg-pink-500 hover:bg-pink-600"}`}
      >
        {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
      </button>
    </div>
  );
}