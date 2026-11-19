import asyncio, json, re, sys, os
from playwright.async_api import async_playwright
DECKS = [("deckA2", "deckA2.py", "Hayy ibn Yaqzan - riferimenti letterari e diritti umani"),
         ("deckB2", "deckB2.py", "Respira - organizzazione del lavoro"),
         ("roadmap", "roadmap.py", "Respira - roadmap disciplinare")]
FONT = """@font-face{font-family:'EB Garamond';src:url(file:///usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf);font-weight:100 900;font-style:normal}
@font-face{font-family:'EB Garamond';src:url(file:///usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf);font-weight:100 900;font-style:italic}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        for d, gen, nome in DECKS:
            root = f"/home/claude/decks/{d}/project"
            order = json.load(open(root + "/deck.json"))["order"]
            blob = {v: k for k, v in re.findall(r'"([\w-]+)":\s*"(/_blob/\w+)"', open(f"/home/claude/decks/{gen}").read())}
            css = open(root + "/deck.css").read()
            body = ""
            for i in order:
                h = open(f"{root}/slides/{i}.html").read()
                for u, n in blob.items():
                    h = h.replace(u, f"file:///home/claude/decks/img/{n}.png")
                if "/_blob/" in h: print("MANCA blob", d, i, re.findall(r"/_blob/\w+", h))
                body += h
            doc = f"""<html><head><meta charset="utf-8"><style>{FONT}
@page {{ size: 1920px 1080px; margin: 0 }}
body {{ margin: 0 }} section {{ width: 1920px; height: 1080px; box-sizing: border-box; position: relative; overflow: hidden; page-break-after: always; break-after: page }}
aside {{ display: none }} {css}</style></head><body>{body}</body></html>"""
            open("/tmp/_pdf.html", "w").write(doc)
            await pg.goto("file:///tmp/_pdf.html"); await pg.wait_for_timeout(1500)
            out = f"/home/claude/decks/pdf/{nome}.pdf"
            await pg.pdf(path=out, width="1920px", height="1080px", print_background=True, prefer_css_page_size=True)
            print(out, len(order), "pagine", os.path.getsize(out)//1024, "KB")
        await b.close()
asyncio.run(main())
