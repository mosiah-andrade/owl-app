"use client";
import { useEffect, useState } from "react";

interface LembreteNotificacaoProps {
  aulasDeHoje: any[];
}

export default function LembreteNotificacao({ aulasDeHoje }: LembreteNotificacaoProps) {
  const [permissao, setPermissao] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Registra o Service Worker tradicional se disponível
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js")
          .then((reg) => {
            console.log("Service Worker registrado com sucesso!", reg.scope);
            
            // Tenta registrar a sincronização em segundo plano periódica se o navegador aceitar
            if ("periodicSync" in reg) {
              (reg as any).periodicSync.register("revisao-diaria-check", {
                minInterval: 12 * 60 * 60 * 1000, // Testa a cada 12 horas
              }).catch(() => console.log("PeriodicSync rejeitado pelo navegador de desktop (comum)."));
            }
          })
          .catch((err) => console.error("Erro ao registrar SW:", err));
      }

      if ("Notification" in window) {
        setPermissao(Notification.permission);
      }
    }
  }, []);

  const solicitarPermissao = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      alert("Este dispositivo não tem suporte completo para notificações em segundo plano.");
      return;
    }

    const resultado = await Notification.requestPermission();
    setPermissao(resultado);

    if (resultado === "granted") {
      // Dispara um teste imediato enviando mensagem para o worker recém-ativado
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({ type: "CHECAR_REVISOES_DIARIAS" });
      }
    }
  };

  if (permissao !== "default") return null;

  return (
    <div className="w-full bg-pink-50 border border-pink-100 rounded-2xl p-4 shadow-xs mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in font-alan">
      <div className="flex items-center gap-2 text-center sm:text-left">
        <span className="text-xl">🔔</span>
        <div>
          <p className="text-xs font-bold text-pink-800 uppercase tracking-wide">Ativar Notificações no Celular?</p>
          <p className="text-[11px] text-pink-600 font-light mt-0.5">O Owl te avisa de revisões mesmo com o aplicativo fechado.</p>
        </div>
      </div>
      <button 
        onClick={solicitarPermissao}
        className="w-full sm:w-auto px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
      >
        Permitir Alertas
      </button>
    </div>
  );
}