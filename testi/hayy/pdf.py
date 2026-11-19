import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox","--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width":794,"height":1123})
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file:///home/claude/testo/hayy2.html")
        await pg.wait_for_function("document.body.dataset.pronto", timeout=20000)
        print("pagine", await pg.evaluate("document.body.dataset.pronto"), errs)
        await pg.pdf(path="/home/claude/testo/Hayy ibn Yaqzan - la storia e i diritti umani.pdf", width="210mm", height="297mm", print_background=True, prefer_css_page_size=True)
        await b.close()
asyncio.run(main())
