var C = "#8A3324", V = "#2F8F86", B = "#3d5a9a";
var MAPPE = {
  andalus: { vista: [-11, 42.5, 4, 29.5], punti: [
    { lon: -3.14, lat: 37.3, nome: "Guadix", sotto: "nasce Ibn Ṭufayl", grande: true },
    { lon: -3.6, lat: 37.18, nome: "Granada", dx: -18, dy: 34, ancora: "end" },
    { lon: -4.78, lat: 37.88, nome: "Cordova", dx: -18, ancora: "end" },
    { lon: -5.99, lat: 37.39, nome: "Siviglia", dx: -18, dy: 30, ancora: "end", sotto: "sede di corte" },
    { lon: -5.6, lat: 35.85, nome: "Ceuta e Tangeri", dx: -18, dy: 10, ancora: "end" },
    { lon: -7.99, lat: 31.63, nome: "Marrakech", sotto: "capitale almohade; muore Ibn Ṭufayl", grande: true }],
    etichette: [{ lon: -4.2, lat: 39.6, testo: "AL-ANDALUS", dim: 40 }, { lon: -6.5, lat: 33.4, testo: "MAROCCO", dim: 36 }, { lon: 0.5, lat: 36.4, testo: "Mar Mediterraneo", mare: true, dim: 30 }, { lon: -9.7, lat: 35, testo: "Oceano Atlantico", mare: true, dim: 26 }] },
  filosofi: { vista: [-12, 47, 70, 22], punti: [
    { lon: -3.14, lat: 37.3, nome: "Ibn Ṭufayl", sotto: "Guadix, XII sec.", colore: C, grande: true, dy: 34 },
    { lon: -0.9, lat: 41.65, nome: "Ibn Bājja", sotto: "Saragozza, XI–XII sec.", colore: B },
    { lon: 44.4, lat: 33.3, nome: "al-Fārābī", sotto: "Baghdad, X sec.", colore: B, dx: -18, ancora: "end" },
    { lon: 59.6, lat: 36.3, nome: "al-Ghazālī", sotto: "Ṭūs, XI–XII sec.", colore: B, dy: 34 },
    { lon: 64.4, lat: 39.8, nome: "Avicenna", sotto: "Bukhara, X–XI sec.", colore: B, dx: -18, ancora: "end" }],
    etichette: [{ lon: 18, lat: 34.6, testo: "Mar Mediterraneo", mare: true, dim: 26 }, { lon: 50, lat: 27.5, testo: "ARABIA E PERSIA", dim: 24 }] },
  isola: { vista: [-12, 47, 95, -14], isola: [79, -5], punti: [
    { lon: -3.6, lat: 37.2, nome: "al-Andalus", sotto: "dove è scritto il libro", grande: true },
    { lon: 79, lat: -5, nome: "L'isola di Hayy", sotto: "luogo immaginario, presso l'equatore", colore: V, grande: true, dx: -20, dy: 44, ancora: "end" }],
    rotte: [{ punti: [[-3.6, 37.2], [8, 37.8], [25, 33.2], [32.5, 32], [33.6, 27.5], [39, 17.5], [44, 12.2], [60, 6], [79, -5]] }],
    etichette: [{ lon: 62, lat: -2, testo: "Oceano Indiano", mare: true, dim: 34 }, { lon: 77, lat: 20, testo: "India", dim: 30 }, { lon: 18, lat: 10, testo: "Africa", dim: 34 }, { lon: 65, lat: 1, testo: "equatore", mare: true, dim: 20 }] },
  manoscritto: { vista: [-12, 58, 42, 26], punti: [
    { lon: 29.9, lat: 31.2, nome: "Alessandria", sotto: "1303: copia del testo con commento in ebraico", dx: -18, dy: 34, ancora: "end" },
    { lon: 36.3, lat: 33.5, nome: "Damasco", sotto: "Edward Pococke padre trova il manoscritto", dx: -18, dy: -38, ancora: "end" },
    { lon: -1.26, lat: 51.75, nome: "Oxford", sotto: "1671: edizione araba e latina", grande: true }],
    rotte: [{ punti: [[36.3, 33.5], [26, 35.5], [15, 37], [5, 40], [-6, 44], [-5, 48.5], [-1.26, 51.75]] }],
    etichette: [{ lon: 18, lat: 34.4, testo: "Mar Mediterraneo", mare: true, dim: 26 }] },
  traduzioni: { vista: [-11, 57.5, 14, 47.5], punti: [
    { lon: -1.26, lat: 51.75, nome: "Oxford", sotto: "1671 · latino (Pococke)", grande: true, dx: -18, ancora: "end", dy: 34 },
    { lon: 0.12, lat: 52.2, nome: "Cambridge", sotto: "1708 · inglese dall'arabo (Ockley)", dy: -60, dx: -10 },
    { lon: 4.9, lat: 52.37, nome: "Paesi Bassi", sotto: "1672 · olandese (Bouwmeester)", colore: B, dy: 44 }],
    etichette: [{ lon: -6, lat: 48.6, testo: "In Inghilterra anche: 1674 Keith · 1686 Ashwell", dim: 22 }, { lon: 3, lat: 55.5, testo: "Mare del Nord", mare: true, dim: 22 }, { lon: 7, lat: 49, testo: "EUROPA", dim: 26 }] },
  mondo: { vista: [-180, 76, 180, -52], punti: [
    { lon: -3.6, lat: 37.2, nome: "1 Hayy", sotto: "al-Andalus", dx: -14, dy: -14, ancora: "end", dim: 34 },
    { lon: 20.7, lat: 38.4, nome: "2 Ulisse", sotto: "Grecia", dy: -24, dim: 34 },
    { lon: 31.2, lat: 30, nome: "3 Sinuhe", sotto: "Egitto", dy: 30, dim: 34 },
    { lon: -89.6, lat: 17.2, nome: "4 Popol Vuh", sotto: "Maya", dim: 34 },
    { lon: -150, lat: -17, nome: "5 Māui", sotto: "Polinesia", dim: 34 },
    { lon: 135.2, lat: 35.7, nome: "6 Urashima", sotto: "Giappone", dx: -16, dy: -30, ancora: "end", dim: 34 },
    { lon: -8.4, lat: 11.4, nome: "7 Sundiata", sotto: "Mali", dx: -16, dy: 34, ancora: "end", dim: 34 }],
    etichette: [{ lon: -40, lat: 25, testo: "Oceano Atlantico", mare: true, dim: 40 }, { lon: 75, lat: -20, testo: "Oceano Indiano", mare: true, dim: 40 }, { lon: -140, lat: 10, testo: "Oceano Pacifico", mare: true, dim: 40 }] }
};
