// public/sw.js
importScripts('https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js');

// Nome do cache para offline básico
const CACHE_NAME = 'owl-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listener que escuta quando o app ou o sistema operacional acorda o Service Worker
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'CHECAR_REVISOES_DIARIAS') {
    await verificarEMostrarNotificacao();
  }
});

// Rotina periódica em segundo plano (se suportada pelo navegador do celular)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'revisao-diaria-check') {
    event.waitUntil(verificarEMostrarNotificacao());
  }
});

async function verificarEMostrarNotificacao() {
  try {
    // Configura o localforage dentro do worker para ler as aulas
    localforage.config({ name: 'owl_app', storeName: 'dados' });
    const aulas = await localforage.getItem('@owl:aulas') || [];
    
    // Pega a data local no formato YYYY-MM-DD
    const hoje = new Date();
    const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

    // Helper para bater as datas
    const obterIdentificadorFaseHoje = (aula) => {
      if (aula.dataEstudo === hojeStr) return "estudo";
      if (aula.datasRevisao?.r1 === hojeStr) return "r1";
      if (aula.datasRevisao?.r7 === hojeStr) return "r7";
      if (aula.datasRevisao?.r21 === hojeStr) return "r21";
      if (aula.datasRevisao?.r60 === hojeStr) return "r60";
      return "";
    };

    // Filtra as pendências idêntico à interface
    const pendentes = aulas.filter((aula) => {
      const faseHoje = obterIdentificadorFaseHoje(aula);
      if (!faseHoje) return false;
      const jaConcluidoHoje = aula.revisoesConcluidas?.includes(faseHoje) || false;
      const mtCicloFinalizado = (aula.estagioAtual ?? 0) >= 4;
      return !jaConcluidoHoje && !mtCicloFinalizado;
    });

    // Se houver pendências e tivermos permissão, dispara com o app FECHADO!
    if (pendentes.length > 0 && Notification.permission === 'granted') {
      self.registration.showNotification("🦉 Hora da Revisão Espaçada!", {
        body: `Você tem ${pendentes.length} ${pendentes.length === 1 ? "revisão pendente" : "revisões pendentes"} para hoje. Não quebre seu ciclo!`,
        icon: '/Owl-icon.png',
        badge: '/Owl-icon.png',
        vibrate: [200, 100, 200],
        tag: 'lembrete-revisao',
        renotify: true
      });
    }
  } catch (error) {
    console.error("Erro ao rodar verificação em segundo plano:", error);
  }
}