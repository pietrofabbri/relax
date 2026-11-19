import asyncio, sys, os, re, json
from playwright.async_api import async_playwright
root=sys.argv[1]; out=sys.argv[2]; gen=sys.argv[3]
ids=json.load(open(root+"/project/deck.json"))["order"]
if len(sys.argv)>4: ids=sys.argv[4].split(",")
src=open(gen).read()
blob={v:k for k,v in re.findall(r'"([\w-]+)":\s*"(/_blob/\w+)"',src)}
css=open(root+"/project/deck.css").read()
os.makedirs(out,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox","--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width":1920,"height":1080})
        res=[]
        for i in ids:
            html=open(f"{root}/project/slides/{i}.html").read()
            for u,n in blob.items(): html=html.replace(u,f"file:///home/claude/decks/img/{n}.png")
            doc=f"<html><head><style>body{{margin:0}} section{{width:1920px;height:1080px;box-sizing:border-box;position:relative;overflow:hidden}} aside{{display:none}} {css}</style></head><body>{html}</body></html>"
            open("/tmp/_r.html","w").write(doc)
            await pg.goto("file:///tmp/_r.html"); await pg.wait_for_timeout(150)
            h = await pg.evaluate("""()=>{const s=document.querySelector('section');let m=0;for(const c of s.querySelectorAll('*')){if(c.closest('.fonte')||c.closest('aside'))continue;const r=c.getBoundingClientRect();if(r.width>0)m=Math.max(m,r.bottom)};return m}""")
            res.append((i,round(h)))
            await pg.screenshot(path=f"{out}/{i}.png")
        print([r for r in res if r[1]>930] or "ok", len(res)); await b.close()
asyncio.run(main())
