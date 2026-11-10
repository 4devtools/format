// sw.js - Service Worker do Controle de Ativo Fixo
// Para publicar uma nova versão do app, basta mudar VERSION abaixo.
const VERSION = 'v2.0.3';
const CACHE = 'ativo-fixo-' + VERSION;

const CORE = [
    './',
    'index.html',
    'manifest.json',
    'lib/xlsx.full.min.js',
    'lib/zxing.min.js',
    'icon-192.png',
    'icon-512.png'
];
const OBJ = ['armario2p','armario4p','armariometal','arquivoaco','arquivogaveteiro','cadeira','carteira','chromebook','computador',
    'estantelivros','impressora3d','impressora','lousadigital','mesaprofessor','mesarefeitorio','mesasecretaria','mesasom','notebook',
    'placardigital','planetario','projetor','quadrobranco','radio','televisao'];
const SALAS = ['banheiro','cozinha','refeitorio','salaaula','saladiretora','salamaker','salaprofessores','secretaria'];
const IMAGENS = [
    ...OBJ.map(n => `img-min/imagens/${n}.png`),
    ...SALAS.map(n => `img-min/salas/${n}.png`)
];

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        // arquivos essenciais: se algum faltar, a instalação falha (evita app quebrado offline)
        await cache.addAll(CORE);
        // imagens: tolerante, um arquivo ausente não impede a instalação
        await Promise.all(IMAGENS.map(u => cache.add(u).catch(() => null)));
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k.startsWith('ativo-fixo-') && k !== CACHE).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== location.origin) return;

    // Página principal: tenta a rede (para receber atualizações) e cai para o cache se estiver offline/lento.
    if (req.mode === 'navigate' || req.destination === 'document') {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE);
            try {
                const ctrl = new AbortController();
                const t = setTimeout(() => ctrl.abort(), 4000);
                const res = await fetch(req, { signal: ctrl.signal });
                clearTimeout(t);
                if (res && res.ok) cache.put('index.html', res.clone());
                return res;
            } catch (e) {
                return (await cache.match(req, { ignoreSearch: true })) || (await cache.match('index.html')) || (await cache.match('./'));
            }
        })());
        return;
    }

    // Demais arquivos (bibliotecas, imagens, ícones): cache primeiro, ignorando ?versão.
    event.respondWith((async () => {
        const cache = await caches.open(CACHE);
        const hit = await cache.match(req, { ignoreSearch: true });
        if (hit) return hit;
        try {
            const res = await fetch(req);
            if (res && res.ok) cache.put(req, res.clone());
            return res;
        } catch (e) {
            return new Response('', { status: 504, statusText: 'Offline' });
        }
    })());
});
