/*
 * Livello 1 — le tre prove "platform" (motore: js/avventura.js).
 * Coordinate: il suolo è a y = 790; un salto sale di circa 250, il doppio salto (piume) di circa 440,
 * una foglia elastica di circa 540. Una buca larga più di 360 si passa solo col doppio salto.
 *
 * Campi: inizio, fine, larghezza, traguardo ("cerva" | "fuoco"), buio (0-1), piumeSubito,
 *  buche [[da, a]], piattaforme [{x, y, w, tipo: pietra|mobile|crolla, ampX, ampY, periodo, ph}],
 *  muri [{x, h, w}], rovi [{x}], spine [[da, a]], molle [{x, y}], palme [x],
 *  nemici [{tipo: granchio|vespa|riccio, x, y, da, a, vel, ampX, ampY}],
 *  semi [[x, y]], frammenti [[x, y]] (tre: insieme danno la carta d'oro), cuori [[x, y]], frutti [[x, y]],
 *  piume [x, y], fuochi [x] (si accendono passando: lì si riparte)
 */
(function () {
  "use strict";

  function fila(da, a, passo, y) { var r = []; for (var x = da; x <= a; x += passo) r.push([x, y]); return r; }
  function arco(cx, y, n) { var r = []; for (var i = 0; i < n; i++) { var f = i / (n - 1); r.push([cx - 120 + f * 240, y - Math.sin(f * Math.PI) * 130]); } return r; }

  window.AVVENTURE1 = {

    /* 1 — Il bosco (facile): prima solo correre e saltare, poi un granchio, poi il bastone.
       Il corpo: solo il fiato. */
    bosco: {
      inizio: 520, fine: 5200, larghezza: 5500, traguardo: "cerva", ora: 1, cuori0: 5, corpo: ["fiato"],
      buche: [[1100, 1250], [2500, 2680], [3900, 4080]],
      piattaforme: [
        { x: 2520, y: 660, w: 140 },
        { x: 3300, y: 640, w: 200 }
      ],
      muri: [{ x: 1700, h: 120, w: 110 }],
      rovi: [{ x: 3000 }],
      molle: [{ x: 4500, y: 770 }],
      palme: [2100],
      nemici: [
        { tipo: "granchio", x: 1950, da: 1850, a: 2050, vel: 0.7 },
        { tipo: "granchio", x: 4250, da: 4180, a: 4380, vel: 0.8 }
      ],
      semi: [].concat(fila(700, 1000, 75, 700), arco(1175, 620, 5), fila(1400, 1600, 70, 700), fila(1700, 1700, 1, 580),
        arco(2590, 560, 5), fila(3300, 3480, 60, 540), arco(3990, 620, 5), fila(4600, 4900, 75, 700)),
      frammenti: [[2590, 470], [3400, 430], [4560, 260]],
      cuori: [[3400, 540]],
      frutti: [[2300, 600], [3700, 600]]
    },

    /* 2 — La scogliera (media): piattaforme che si muovono e che crollano, qualche vespa.
       Il corpo: fiato e calma (se ti colpiscono ti agiti: fermati e respira). */
    scogliera: {
      inizio: 520, fine: 5600, larghezza: 5900, traguardo: "cerva", ora: 1.3, cuori0: 4, corpo: ["fiato", "calma"], crolla: 1,
      buche: [[1000, 1500], [2600, 3100], [4300, 4560]],
      piattaforme: [
        { x: 1080, y: 680, w: 200, tipo: "mobile", ampX: 80, periodo: 4 },
        { x: 1300, y: 640, w: 170 },
        { x: 2000, y: 620, w: 180 },
        { x: 2640, y: 690, w: 150, tipo: "crolla" },
        { x: 2860, y: 650, w: 150, tipo: "crolla" },
        { x: 2780, y: 430, w: 130 },
        { x: 4330, y: 660, w: 200, tipo: "mobile", ampX: 50, periodo: 3.6 },
        { x: 5000, y: 600, w: 160 }
      ],
      muri: [{ x: 3500, h: 160, w: 120 }],
      rovi: [{ x: 3900 }],
      spine: [[4800, 4900]],
      molle: [{ x: 2700, y: 770 }],
      palme: [1800],
      nemici: [
        { tipo: "vespa", x: 1700, y: 560, ampX: 120, ampY: 40, vel: 0.9 },
        { tipo: "granchio", x: 2050, y: 620, da: 2020, a: 2140, vel: 0.7 },
        { tipo: "riccio", x: 3300, da: 3200, a: 3420, vel: 0.7 },
        { tipo: "vespa", x: 4700, y: 520, ampX: 140, ampY: 50, vel: 1 }
      ],
      semi: [].concat(fila(700, 950, 80, 700), fila(1100, 1250, 50, 600), fila(1320, 1440, 60, 560), fila(2020, 2160, 70, 540),
        arco(2840, 330, 5), fila(3600, 3800, 70, 700), fila(4350, 4500, 50, 580), fila(5020, 5140, 60, 520)),
      frammenti: [[1400, 470], [2840, 340], [5080, 420]],
      cuori: [[3500, 540]],
      frutti: [[2300, 600], [4100, 600]]
    },

    /* 3 — La notte dei fuochi (più difficile, ma con tanti aiuti): piume d'aquila per il doppio salto.
       Il corpo: fiato, calma e calore (lontano dai fuochi si ha freddo: accendili e scaldati). */
    notte: {
      inizio: 520, fine: 6400, larghezza: 6700, traguardo: "fuoco", ora: 2.4, buio: 0.1, cuori0: 4, corpo: ["fiato", "calma", "calore"], crolla: 1, freddo: 0.03,
      buche: [[1500, 1800], [3000, 3340], [4700, 5020]],
      piattaforme: [
        { x: 820, y: 640, w: 180 },
        { x: 1580, y: 620, w: 150, tipo: "crolla" },
        { x: 3100, y: 650, w: 160, tipo: "mobile", ampX: 70, periodo: 3.4 },
        { x: 3900, y: 500, w: 170 },
        { x: 4780, y: 620, w: 150, tipo: "crolla" }
      ],
      muri: [{ x: 2400, h: 340, w: 130 }, { x: 5500, h: 200, w: 120 }],
      rovi: [{ x: 3650 }],
      spine: [[4300, 4420]],
      molle: [{ x: 4000, y: 770 }],
      palme: [1200],
      nemici: [
        { tipo: "granchio", x: 2150, da: 2050, a: 2280, vel: 0.8 },
        { tipo: "vespa", x: 3500, y: 560, ampX: 120, ampY: 50, vel: 0.9 },
        { tipo: "riccio", x: 4500, da: 4460, a: 4640, vel: 0.8 },
        { tipo: "granchio", x: 5900, da: 5800, a: 6050, vel: 0.9 }
      ],
      piume: [900, 540],
      fuochi: [700, 1950, 2900, 4150, 5300],
      semi: [].concat(fila(1000, 1400, 80, 700), arco(1650, 560, 5), fila(2400, 2400, 1, 380), arco(3170, 560, 5),
        fila(3900, 4040, 70, 430), arco(4860, 560, 5), fila(5600, 5800, 70, 700)),
      frammenti: [[2400, 280], [3980, 230], [5500, 480]],
      cuori: [[2650, 600]],
      frutti: [[2700, 640], [5200, 640]]
    }
  };
})();
