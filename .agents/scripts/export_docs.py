from pathlib import Path
import html
import re

def inline(text):
    text = html.escape(text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    return re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)

def render(text):
    lines=[]
    in_table=False
    for line in text.splitlines():
        if line.startswith("|"):
            if not in_table:
                lines.append('<div class="table"><table>')
                in_table=True
            cells=line.strip("|").split("|")
            if all(re.match(r"^[ :\-]+$",cell) for cell in cells): continue
            lines.append("<tr>"+"".join("<td>"+inline(c.strip())+"</td>" for c in cells)+"</tr>")
            continue
        if in_table:
            lines.append("</table></div>")
            in_table=False
        if not line: continue
        if line.startswith("## "): lines.append("<h2>"+inline(line[3:])+"</h2>")
        elif line.startswith("# "): lines.append("<h1>"+inline(line[2:])+"</h1>")
        elif line.startswith("- "): lines.append('<p class="bullet">• '+inline(line[2:])+"</p>")
        else: lines.append("<p>"+inline(line)+"</p>")
    if in_table: lines.append("</table></div>")
    return "\n".join(lines)

body="".join(render(Path(p).read_text()) for p in ["docs/verification-brochure.md","docs/guide-modification.md"])
out=Path("generated-artifacts/guide-et-verification.html")
out.write_text("""<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vitrine parfums — Guide et vérification</title><style>body{max-width:1000px;margin:60px auto;padding:0 24px;background:#f8f5ed;color:#27241f;font:17px/1.65 system-ui}h1{font:42px/1.2 Georgia;margin:64px 0 30px;border-top:1px solid #b69a6c;padding-top:28px}h2{font:28px Georgia;margin-top:36px}code{font-size:14px;overflow-wrap:anywhere;background:#eee6da;padding:2px 5px}table{border-collapse:collapse;width:100%;font-size:15px}td{border:1px solid #d3c7b7;padding:12px;vertical-align:top}tr:first-child{font-weight:bold;background:#eae1d4}.table{overflow-x:auto}.bullet{margin:8px 0}strong{color:#755126}@media print{body{margin:0;background:white}h1{page-break-before:always}h1:first-child{page-break-before:auto}}</style><main>"""+body+"</main></html>")
print(out)
