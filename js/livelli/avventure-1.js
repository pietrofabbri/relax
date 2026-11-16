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

    /* 1 — Il bosco: correre, saltare, usare il bastone. Si impara che correndo il fiato cala. */
    bosco: {
      inizio: 520, fine: 5400, larghezza: 5700, traguardo: "cerva", ora: 1,
      buche: [[760, 960], [1640, 1880], [2860, 3060], [4260, 4560]],
      piattaforme: [
        { x: 1690, y: 650, w: 140 },
        { x: 3900, y: 600, w: 170 },
        { x: 4300, y: 640, w: 200, tipo: "mobile", ampX: 0, ampY: 90, periodo: 3.2 }
      ],
      muri: [{ x: 3500, h: 170, w: 110 }, { x: 3640, h: 260, w: 110 }],
      rovi: [{ x: 2560 }],
      spine: [[3200, 3320]],
      molle: [{ x: 4800, y: 770 }],
      palme: [2100, 2300, 3350],
      nemici: [
        { tipo: "granchio", x: 1200, da: 1040, a: 1440 },
        { tipo: "granchio", x: 2350, da: 2200, a: 2480, vel: 1.3 },
        { tipo: "granchio", x: 4000, y: 600, da: 3930, a: 4040 },
        { tipo: "riccio", x: 5000, da: 4920, a: 5200 }
      ],
      semi: [].concat(fila(400, 700, 75, 700), arco(860, 640, 5), fila(1060, 1440, 95, 700), arco(1760, 560, 5),
        fila(2650, 2800, 75, 700), arco(2960, 620, 5), fila(3360, 3460, 50, 520), fila(4620, 4740, 60, 700)),
      frammenti: [[1760, 450], [3640, 440], [4880, 230]],
      cuori: [[3960, 500]],
      frutti: [[2700, 580]]
    },

    /* 2 — La scogliera: piattaforme che si muovono e che crollano, vespe, ricci. */
    scogliera: {
      inizio: 520, fine: 6100, larghezza: 6400, traguardo: "cerva", ora: 1.3,
      buche: [[700, 1500], [2300, 3000], [4500, 4860]],
      piattaforme: [
        { x: 800, y: 680, w: 170, tipo: "mobile", ampX: 110, periodo: 3.4 },
        { x: 1140, y: 600, w: 150 },
        { x: 1330, y: 690, w: 150, tipo: "mobile", ampX: 0, ampY: 110, periodo: 2.6, ph: 1 },
        { x: 1900, y: 600, w: 180 },
        { x: 2350, y: 690, w: 130, tipo: "crolla" },
        { x: 2560, y: 620, w: 130, tipo: "crolla" },
        { x: 2780, y: 690, w: 130, tipo: "crolla" },
        { x: 2620, y: 400, w: 120 },
        { x: 4560, y: 650, w: 220, tipo: "mobile", ampX: 90, periodo: 2.8 },
        { x: 5250, y: 580, w: 160 },
        { x: 5500, y: 430, w: 140 }
      ],
      muri: [{ x: 3500, h: 200, w: 120 }, { x: 5800, h: 150, w: 120 }],
      rovi: [{ x: 4100 }],
      spine: [[3700, 3900], [5300, 5560]],
      molle: [{ x: 2480, y: 770 }],
      palme: [1700, 3300],
      nemici: [
        { tipo: "vespa", x: 1150, y: 520, ampX: 140, ampY: 50, vel: 1.4 },
        { tipo: "granchio", x: 1950, y: 600, da: 1910, a: 2070 },
        { tipo: "vespa", x: 3200, y: 600, ampX: 200, ampY: 70 },
        { tipo: "riccio", x: 3300, da: 3100, a: 3420 },
        { tipo: "vespa", x: 4700, y: 500, ampX: 160, ampY: 90, vel: 1.6 },
        { tipo: "riccio", x: 5000, da: 4900, a: 5200, vel: 1.4 },
        { tipo: "granchio", x: 5950, da: 5880, a: 6060 }
      ],
      semi: [].concat(fila(350, 600, 80, 700), fila(820, 940, 60, 600), fila(1150, 1260, 55, 520), fila(1920, 2060, 70, 520),
        arco(2680, 300, 5), fila(3100, 3400, 75, 700), fila(4580, 4760, 60, 570), fila(5260, 5390, 65, 480)),
      frammenti: [[1400, 380], [2680, 320], [5560, 330]],
      cuori: [[3500, 520]],
      frutti: [[1960, 480], [4300, 600]]
    },

    /* 3 — La notte: Hayy ha il fuoco e le piume dell'aquila (doppio salto). Si accendono fuochi per ripartire. */
    notte: {
      inizio: 520, fine: 7000, larghezza: 7300, traguardo: "fuoco", ora: 2.4, buio: 0.15,
      buche: [[1300, 1700], [2700, 3150], [4400, 4820], [5900, 6300]],
      piattaforme: [
        { x: 720, y: 620, w: 160 },
        { x: 1440, y: 590, w: 130, tipo: "crolla" },
        { x: 2900, y: 640, w: 140, tipo: "mobile", ampX: 120, periodo: 3 },
        { x: 3700, y: 470, w: 150 },
        { x: 4520, y: 600, w: 120, tipo: "crolla" },
        { x: 4700, y: 470, w: 120, tipo: "crolla" },
        { x: 6020, y: 600, w: 160, tipo: "mobile", ampX: 0, ampY: 140, periodo: 2.4 }
      ],
      muri: [{ x: 2200, h: 380, w: 130 }, { x: 5300, h: 200, w: 120 }, { x: 5440, h: 340, w: 120 }],
      rovi: [{ x: 3500 }, { x: 6600 }],
      spine: [[1900, 2080], [3900, 4150], [6450, 6520]],
      molle: [{ x: 3800, y: 770 }],
      palme: [1000, 5000],
      nemici: [
        { tipo: "riccio", x: 1050, da: 950, a: 1200 },
        { tipo: "vespa", x: 1500, y: 450, ampX: 120, ampY: 60, vel: 1.5 },
        { tipo: "granchio", x: 2450, da: 2320, a: 2620, vel: 1.4 },
        { tipo: "vespa", x: 3300, y: 560, ampX: 180, ampY: 80 },
        { tipo: "riccio", x: 4250, da: 4180, a: 4360, vel: 1.5 },
        { tipo: "vespa", x: 4620, y: 380, ampX: 140, ampY: 50, vel: 1.8 },
        { tipo: "granchio", x: 5650, da: 5560, a: 5760, vel: 1.6 },
        { tipo: "riccio", x: 6800, da: 6700, a: 6920, vel: 1.3 }
      ],
      piume: [790, 520],
      fuochi: [1220, 2600, 4380, 5800],
      semi: [].concat(fila(350, 600, 80, 700), arco(1500, 520, 6), fila(2240, 2240, 1, 330), arco(2925, 560, 6),
        fila(3700, 3840, 70, 400), arco(4610, 420, 6), fila(5340, 5460, 60, 380), arco(6100, 480, 6)),
      frammenti: [[2200, 250], [3780, 180], [4760, 300]],
      cuori: [[5440, 380]],
      frutti: [[2400, 650], [5100, 650]]
    }
  };
})();
