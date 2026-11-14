/*
 * Icone del gioco: piccoli disegni SVG a colori pieni (viewBox 0 0 64 64).
 * Servono a dire le cose con un simbolo invece che con una frase.
 * Icone.svg("cuore") restituisce il codice SVG da mettere in una pagina.
 */
(function () {
  "use strict";

  var I = {
    libro: '<path d="M6 14c9-4 18-4 26 1v38c-8-5-17-5-26-1z" fill="#f6e7c8" stroke="#5a4632" stroke-width="3" stroke-linejoin="round"/><path d="M58 14c-9-4-18-4-26 1v38c8-5 17-5 26-1z" fill="#fff4dc" stroke="#5a4632" stroke-width="3" stroke-linejoin="round"/><path d="M12 22c5-2 10-2 15 0M12 30c5-2 10-2 15 0M37 22c5-2 10-2 15 0M37 30c5-2 10-2 15 0" stroke="#c9a77a" stroke-width="2.5" stroke-linecap="round"/>',
    gazzella: '<path d="M18 52l3-16c-6-2-9-8-7-14l8 2 6-8 4 10c6 0 12 4 14 10l2 16" fill="#c98b52" stroke="#5a3a20" stroke-width="3" stroke-linejoin="round"/><path d="M22 14c-2-6 0-10 2-12M28 14c0-6 3-9 6-10" stroke="#5a3a20" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="20" cy="24" r="2" fill="#2a1a10"/><path d="M30 40c4 2 10 2 14 0" stroke="#f3dcc0" stroke-width="3" stroke-linecap="round"/>',
    bimbo: '<circle cx="32" cy="22" r="11" fill="#b9805a" stroke="#4a2e1c" stroke-width="3"/><path d="M14 56c0-12 8-20 18-20s18 8 18 20z" fill="#7fb36a" stroke="#2e4a26" stroke-width="3" stroke-linejoin="round"/><path d="M24 14c4-6 12-6 16 0" stroke="#2a1a14" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="36" cy="22" r="1.8" fill="#1a1010"/>',
    foglia: '<path d="M10 54C10 26 26 10 54 10c0 28-16 44-44 44z" fill="#6cbf5a" stroke="#2e5a26" stroke-width="3" stroke-linejoin="round"/><path d="M12 52L44 20M24 40h12M30 34V22" stroke="#2e5a26" stroke-width="3" stroke-linecap="round"/>',
    corsa: '<circle cx="40" cy="12" r="6" fill="#b9805a" stroke="#4a2e1c" stroke-width="3"/><path d="M36 20l-8 14 10 6-4 14M28 34l-12 4M36 22l10 8 8-4" stroke="#4a2e1c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M4 30h10M2 40h8M6 48h10" stroke="#f2b84b" stroke-width="3" stroke-linecap="round"/>',
    cocco: '<path d="M32 4c8 6 12 14 10 22" stroke="#4f8c4a" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="32" cy="40" r="18" fill="#8a5a34" stroke="#4a2e1c" stroke-width="3"/><circle cx="26" cy="36" r="2.5" fill="#3a2414"/><circle cx="36" cy="34" r="2.5" fill="#3a2414"/><circle cx="31" cy="44" r="2.5" fill="#3a2414"/><path d="M50 18l6-6M54 26l8-2M46 12l2-8" stroke="#f2b84b" stroke-width="3" stroke-linecap="round"/>',
    cuore: '<path d="M32 56C14 44 6 34 6 22a13 13 0 0 1 26-5 13 13 0 0 1 26 5c0 12-8 22-26 34z" fill="#e5484d" stroke="#7a1f22" stroke-width="3" stroke-linejoin="round"/><path d="M16 22a7 7 0 0 1 7-7" stroke="#ffb3b5" stroke-width="3.5" stroke-linecap="round" fill="none"/>',
    battito: '<path d="M2 34h14l5-12 8 26 7-30 6 16h20" stroke="#e5484d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    fuoco: '<path d="M32 4c4 10 16 16 16 32a16 16 0 0 1-32 0c0-8 4-12 6-16 2 6 4 8 6 8-2-10 0-18 4-24z" fill="#ff8a2a" stroke="#8a3a10" stroke-width="3" stroke-linejoin="round"/><path d="M32 30c3 5 8 8 8 15a8 8 0 0 1-16 0c0-6 5-9 8-15z" fill="#ffd34d"/>',
    termometro: '<rect x="26" y="4" width="12" height="38" rx="6" fill="#fff" stroke="#3a3a4a" stroke-width="3"/><circle cx="32" cy="48" r="11" fill="#e5484d" stroke="#3a3a4a" stroke-width="3"/><rect x="29.5" y="20" width="5" height="26" fill="#e5484d"/><path d="M42 14h6M42 22h6M42 30h6" stroke="#3a3a4a" stroke-width="2.5" stroke-linecap="round"/>',
    occhio: '<path d="M2 32s11-18 30-18 30 18 30 18-11 18-30 18S2 32 2 32z" fill="#fff" stroke="#2a3a5a" stroke-width="3"/><circle cx="32" cy="32" r="11" fill="#4a90e2"/><circle cx="32" cy="32" r="5" fill="#13213a"/><circle cx="35" cy="29" r="2" fill="#fff"/>',
    barca: '<path d="M6 42h52l-8 12H14z" fill="#8a5a34" stroke="#4a2e1c" stroke-width="3" stroke-linejoin="round"/><path d="M32 6v36M32 8L12 38h20" fill="#f6eedc" stroke="#4a2e1c" stroke-width="3" stroke-linejoin="round"/><path d="M2 58c6-3 10 3 16 0s10 3 16 0 10 3 16 0 10 3 12 0" stroke="#4a90e2" stroke-width="3" fill="none" stroke-linecap="round"/>',
    parola: '<path d="M6 10h52v32H28l-12 12V42H6z" fill="#fff" stroke="#3a3a5a" stroke-width="3" stroke-linejoin="round"/><path d="M14 22h36M14 30h24" stroke="#9a7ad8" stroke-width="4" stroke-linecap="round"/>',
    cervello: '<path d="M20 52c-8 0-14-6-14-14 0-4 2-7 4-9-2-8 4-16 12-16 2-6 12-8 16-2 8-2 16 4 15 12 6 4 6 14 0 18 0 8-8 12-14 10-4 4-12 4-16 0z" fill="#f4a6b8" stroke="#8a3a52" stroke-width="3" stroke-linejoin="round"/><path d="M32 12v40M20 26c4 2 8 0 10-2M44 24c-4 2-8 0-10-2M20 40c4-2 8 0 10 2M44 40c-4-2-8 0-10 2" stroke="#8a3a52" stroke-width="2.5" stroke-linecap="round" fill="none"/>',
    fulmine: '<path d="M36 2L12 36h16l-6 26 30-38H34z" fill="#ffd34d" stroke="#8a6a10" stroke-width="3" stroke-linejoin="round"/>',
    goccia: '<path d="M32 4C22 20 12 30 12 42a20 20 0 0 0 40 0C52 30 42 20 32 4z" fill="#e5484d" stroke="#7a1f22" stroke-width="3" stroke-linejoin="round"/><path d="M22 42a10 10 0 0 0 8 10" stroke="#ffb3b5" stroke-width="3.5" stroke-linecap="round" fill="none"/>',
    ingranaggi: '<circle cx="22" cy="26" r="12" fill="#f2b84b" stroke="#7a5a10" stroke-width="3"/><circle cx="22" cy="26" r="4" fill="#7a5a10"/><path d="M22 8v6M22 38v6M4 26h6M34 26h6M9 13l4 4M31 35l4 4M9 39l4-4M31 17l4-4" stroke="#7a5a10" stroke-width="4" stroke-linecap="round"/><circle cx="44" cy="44" r="9" fill="#4ab0a0" stroke="#1f5a52" stroke-width="3"/><circle cx="44" cy="44" r="3" fill="#1f5a52"/><path d="M44 31v4M44 53v4M31 44h4M53 44h4" stroke="#1f5a52" stroke-width="4" stroke-linecap="round"/>',
    puzzle: '<path d="M8 8h18a6 6 0 1 1 12 0h18v18a6 6 0 1 0 0 12v18H38a6 6 0 1 0-12 0H8V38a6 6 0 1 1 0-12z" fill="#7fb36a" stroke="#2e4a26" stroke-width="3" stroke-linejoin="round"/><path d="M32 8v48M8 32h48" stroke="#2e4a26" stroke-width="2" stroke-dasharray="3 3"/>',
    ripeti: '<path d="M12 30a20 20 0 0 1 34-14l4-6v18H32l7-6a12 12 0 0 0-19 8z" fill="#4a90e2" stroke="#1d3a6a" stroke-width="3" stroke-linejoin="round"/><path d="M52 34a20 20 0 0 1-34 14l-4 6V36h18l-7 6a12 12 0 0 0 19-8z" fill="#9a7ad8" stroke="#3a2a6a" stroke-width="3" stroke-linejoin="round"/>',
    bilancia: '<path d="M32 8v46M18 56h28M10 18h44" stroke="#5a4632" stroke-width="4" stroke-linecap="round"/><path d="M4 36l6-18 6 18a6 6 0 0 1-12 0zM48 36l6-18 6 18a6 6 0 0 1-12 0z" fill="#f2b84b" stroke="#5a4632" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="8" r="4" fill="#5a4632"/>',
    bastone: '<path d="M14 58L46 10" stroke="#8a5a34" stroke-width="7" stroke-linecap="round"/><path d="M44 12l10-8-2 12z" fill="#e8dcc0" stroke="#5a4632" stroke-width="2.5" stroke-linejoin="round"/>',
    scudo: '<path d="M32 4l22 8c0 24-8 38-22 48C18 50 10 36 10 12z" fill="#a8763e" stroke="#4a2e1c" stroke-width="3" stroke-linejoin="round"/><path d="M24 14v34M40 14v34" stroke="#6a4420" stroke-width="2.5"/>',
    capra: '<path d="M16 50l2-14c-6-2-8-8-6-12l10 0 8-6 18 4c4 2 6 6 6 12l-2 16" fill="#f1ece0" stroke="#5a5040" stroke-width="3" stroke-linejoin="round"/><path d="M16 22c-4-6-2-14 6-16M22 20c0-8 6-12 12-10" stroke="#7a6a50" stroke-width="3.5" stroke-linecap="round" fill="none"/><circle cx="16" cy="28" r="2" fill="#2a2a20"/>',
    sasso: '<path d="M6 50c0-14 10-28 24-30 16-2 28 12 28 30z" fill="#9a9a9a" stroke="#4a4a4a" stroke-width="3" stroke-linejoin="round"/><path d="M20 34l8 4M36 30l6 6" stroke="#6a6a6a" stroke-width="2.5" stroke-linecap="round"/>',
    stella: '<path d="M32 4l8 18 20 2-15 13 5 20-18-11-18 11 5-20L4 24l20-2z" fill="#ffd34d" stroke="#8a6a10" stroke-width="3" stroke-linejoin="round"/>',
    scuola: '<path d="M4 24L32 10l28 14-28 14z" fill="#4a90e2" stroke="#1d3a6a" stroke-width="3" stroke-linejoin="round"/><path d="M14 30v14c10 8 26 8 36 0V30" fill="#9cc6f2" stroke="#1d3a6a" stroke-width="3" stroke-linejoin="round"/><path d="M56 26v18" stroke="#f2b84b" stroke-width="3" stroke-linecap="round"/><circle cx="56" cy="46" r="3" fill="#f2b84b"/>',
    mappa: '<path d="M4 12l18-6 20 6 18-6v46l-18 6-20-6-18 6z" fill="#f6e7c8" stroke="#5a4632" stroke-width="3" stroke-linejoin="round"/><path d="M22 6v46M42 12v46" stroke="#c9a77a" stroke-width="2.5"/><path d="M12 40c6-6 14 4 22-6s12-4 16-10" stroke="#e5484d" stroke-width="3" stroke-dasharray="4 4" fill="none" stroke-linecap="round"/><circle cx="50" cy="22" r="4" fill="#e5484d"/>',
    mano: '<path d="M20 56V30l-6-10c-2-4 3-7 6-4l6 8V10c0-4 6-4 6 0v14-18c0-4 6-4 6 0v18-14c0-4 6-4 6 0v16-10c0-4 6-4 6 0v24c0 10-6 16-16 16h-4c-6 0-10-2-12-4z" fill="#d9a07a" stroke="#6a3a1c" stroke-width="3" stroke-linejoin="round"/>',
    luna: '<path d="M40 6a26 26 0 1 0 18 40A22 22 0 0 1 40 6z" fill="#e8ecff" stroke="#5a6a9a" stroke-width="3" stroke-linejoin="round"/>',
    sole: '<circle cx="32" cy="32" r="12" fill="#ffd34d" stroke="#8a6a10" stroke-width="3"/><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M12 52l6-6M46 18l6-6" stroke="#f2a01b" stroke-width="4" stroke-linecap="round"/>',
    polmoni: '<path d="M32 6v22M32 22c-4 4-8 6-10 6M32 22c4 4 8 6 10 6" stroke="#5a3a52" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M22 16c-10 0-16 14-16 30 0 8 6 12 12 10 6-2 8-6 8-14V20c0-2-2-4-4-4zM42 16c10 0 16 14 16 30 0 8-6 12-12 10-6-2-8-6-8-14V20c0-2 2-4 4-4z" fill="#f48fb1" stroke="#8a3a52" stroke-width="3" stroke-linejoin="round"/>',
    fiocco: '<path d="M32 4v56M8 18l48 28M8 46l48-28" stroke="#4a90e2" stroke-width="5" stroke-linecap="round"/><path d="M24 8l8 8 8-8M24 56l8-8 8 8M6 28l11-2-4-10M58 36l-11 2 4 10M6 36l11 2-4 10M58 28l-11-2 4-10" stroke="#4a90e2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    lucchetto: '<rect x="12" y="28" width="40" height="30" rx="6" fill="#8a8aa0" stroke="#3a3a4a" stroke-width="3"/><path d="M20 28v-8a12 12 0 0 1 24 0v8" stroke="#3a3a4a" stroke-width="4" fill="none"/><circle cx="32" cy="42" r="4" fill="#3a3a4a"/>'
  };

  window.Icone = {
    svg: function (nome, classe) {
      return '<svg class="icona ' + (classe || "") + '" viewBox="0 0 64 64" aria-hidden="true">' + (I[nome] || I.stella) + "</svg>";
    },
    ha: function (nome) { return !!I[nome]; },
    svgInterno: function (nome) { return I[nome] || I.stella; }
  };
})();
