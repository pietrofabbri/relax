"""Gioca tutto il livello 1 da solo, come farebbe un ragazzo, su un telefono simulato (844x390).

Uso:  python3 strumenti/test_livello1.py [percorso index.html] [cartella foto]
Serve Playwright con Chrome. Il test fallisce se compare un errore JavaScript,
se una tappa resta ferma più di 60 secondi o se il finale non arriva.
"""
import asyncio, os, sys, time
from playwright.async_api import async_playwright

RADICE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGINA = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RADICE, "index.html")
FOTO = sys.argv[2] if len(sys.argv) > 2 else "/tmp/foto_test"
CHROME = "/usr/bin/google-chrome"

STATO = """(() => {
  const L = window.Livello1, vis = id => !document.getElementById(id).classList.contains('nascosto');
  const d = L.debug(), m = d.mondo, h = d.hayyRef;
  const sch = (x, y) => d.aSchermo(x, y);
  const bottoni = [...document.querySelectorAll('#pannello-azioni button')].map(b => b.textContent);
  return {
    tappa: d.tappa, obiettivo: vis('suggerimento') ? document.getElementById('suggerimento').textContent : '',
    cattura: vis('cattura'), pannello: vis('pannello'), bottoni, testoPannello: document.getElementById('pannello').innerText,
    campo: !!document.querySelector('#pannello input'),
    hayy: [h.x, h.salto], hayySch: sch(h.x, 660),
    oggetto: m.oggetto ? sch(m.oggetto.x, m.oggetto.y) : null,
    animali: Object.fromEntries(Object.entries(m.animali).map(([k, a]) => [k, {fatto: a.fatto, s: sch(a.x, 700)}])),
    ostacoli: m.ostacoli.map(o => [o.x, o.passato]),
    cocco: m.cocco ? m.cocco.stato : null,
    cerva: sch(d.cerva.x, 750),
    bastone: m.bastone && m.bastone.visibile ? sch(m.bastone.x, 770) : null,
    sasso: sch(m.sasso.x, 760), capra2: sch(m.capra2.x, 700), hayyCorpo: sch(h.x, 660),
    fuoco: h.equip.fuoco, forza: h.fuocoForza, calore: vis('btn-calore'),
    spiaggia: sch(4200, 700), grotta: m.grottaLuce
  };
})()"""


async def main():
    os.makedirs(FOTO, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox", "--autoplay-policy=no-user-gesture-required"])
        ctx = await b.new_context(viewport={"width": 844, "height": 390}, device_scale_factor=2, has_touch=True, is_mobile=True)
        pg = await ctx.new_page()
        errori = []
        pg.on("pageerror", lambda e: errori.append(str(e)))
        pg.on("console", lambda m: errori.append(m.text) if m.type in ("error", "warning") else None)
        await pg.goto("file://" + PAGINA)
        await pg.wait_for_timeout(800)
        await pg.screenshot(path=f"{FOTO}/00-titolo.png")

        mouse = pg.mouse
        premuto = False
        tappa_vista, inizio_tappa, foto_fatte = None, time.time(), set()
        fiori, calore_toccati = 0, set()
        ultimo_salto = 0
        misura_fatta = False

        async def tocca(x, y):
            await mouse.click(x, y)

        while True:
            s = await pg.evaluate(STATO)
            if s["tappa"] != tappa_vista:
                print(f"{time.strftime('%H:%M:%S')} tappa: {s['tappa']}")
                tappa_vista, inizio_tappa = s["tappa"], time.time()
            if time.time() - inizio_tappa > 90:
                await pg.screenshot(path=f"{FOTO}/bloccato.png")
                raise SystemExit(f"BLOCCATO nella tappa {s['tappa']}: obiettivo={s['obiettivo']!r} hayy={s['hayy']} errori={errori}")
            chiave = (s["tappa"], s["obiettivo"])
            if s["obiettivo"] and chiave not in foto_fatte:
                foto_fatte.add(chiave)
                await pg.wait_for_timeout(400)
                await pg.screenshot(path=f"{FOTO}/{len(foto_fatte):02d}-{s['tappa']}.png")

            # finestre e didascalie prima di tutto
            if s["pannello"]:
                if premuto:
                    await mouse.up(); premuto = False
                if "Imparare è un diritto" in s["testoPannello"]:
                    await pg.screenshot(path=f"{FOTO}/99-finale.png")
                    print("FINALE raggiunto")
                    break
                if s["campo"]:
                    await pg.fill("#pannello input", "36")
                    await pg.click("#pannello-azioni button:has-text('Ok')")
                    misura_fatta = True
                elif "Via" in s["bottoni"]:
                    await pg.click("#pannello-azioni button:has-text('Via')")
                elif s["bottoni"]:
                    await pg.click("#pannello-azioni button:last-child")
                await pg.wait_for_timeout(250)
                continue
            if s["cattura"]:
                await tocca(420, 200)
                await pg.wait_for_timeout(200)
                continue

            t, ob = s["tappa"], s["obiettivo"]
            if not ob:
                if premuto and t != "fuoco":
                    await mouse.up(); premuto = False
                await pg.wait_for_timeout(60)
                continue

            if t == "segui":
                await tocca(800, 330)
            elif t == "animali":
                if s["oggetto"]:
                    o, h = s["oggetto"], s["hayyCorpo"]
                    await mouse.move(o["x"], o["y"]); await mouse.down()
                    for i in range(1, 11):
                        await mouse.move(o["x"] + (h["x"] - o["x"]) * i / 10, o["y"] + (h["y"] - o["y"]) * i / 10)
                        await pg.wait_for_timeout(20)
                    await mouse.up()
                    await pg.wait_for_timeout(500)
                else:
                    for k, a in s["animali"].items():
                        if not a["fatto"]:
                            x = min(830, max(10, a["s"]["x"]))
                            await tocca(x, a["s"]["y"])
                            break
                    await pg.wait_for_timeout(700)
            elif t == "corsa":
                hx, salto = s["hayy"]
                for ox, passato in s["ostacoli"]:
                    if not passato and 40 < ox - hx < 130 and salto < 1 and time.time() - ultimo_salto > 0.4:
                        await tocca(420, 200); ultimo_salto = time.time()
                await pg.wait_for_timeout(25)
                continue
            elif t == "cocchi":
                if s["cocco"] == "cade":
                    await pg.wait_for_timeout(250)
                    await tocca(420, 200)
                await pg.wait_for_timeout(30)
                continue
            elif t == "cerva":
                c = s["cerva"]
                if "fiori" in ob.lower() or "fior" in ob.lower():
                    if premuto:
                        await mouse.up(); premuto = False
                    await tocca(c["x"] - 60 + fiori * 50, c["y"]); fiori += 1
                    await pg.wait_for_timeout(400)
                elif not premuto:
                    await mouse.move(c["x"], c["y"]); await mouse.down(); premuto = True
            elif t == "fuoco":
                if s["bastone"]:
                    if premuto:
                        await mouse.up(); premuto = False
                    await tocca(s["bastone"]["x"], s["bastone"]["y"])
                    await pg.wait_for_timeout(500)
                elif not premuto:
                    await mouse.move(420, 200); await mouse.down(); premuto = True
            elif t == "calore":
                if premuto:
                    await mouse.up(); premuto = False
                for nome in ("sasso", "capra2", "hayyCorpo"):
                    if nome not in calore_toccati:
                        await tocca(s[nome]["x"], s[nome]["y"]); calore_toccati.add(nome)
                        await pg.wait_for_timeout(2000)
                        break
            elif t == "alba":
                await tocca(min(830, s["spiaggia"]["x"]), 330)
            await pg.wait_for_timeout(150)

        await b.close()
        print("misura del battito provata:", misura_fatta)
        reali = [e for e in errori if "favicon" not in e]
        print("errori:", reali)
        if reali:
            raise SystemExit(1)


asyncio.run(main())
