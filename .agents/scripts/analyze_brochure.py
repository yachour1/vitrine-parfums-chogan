from pathlib import Path
import fitz
from PIL import Image, ImageOps, ImageDraw
import zxingcpp

source = Path(".local/conversation-workspace/files/attached_assets/Brochure_Parfum_Chogan_1791656172589.pdf")
out = Path("generated-artifacts/brochure")
out.mkdir(parents=True, exist_ok=True)
doc = fitz.open(source)
texts = []
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5))
    pix.save(str(out / f"page-{i+1:02}.png"))
    texts.append(f"\n=== PAGE {i+1} ===\n{page.get_text()}")
    if i == 0:
        for code in zxingcpp.read_barcodes(Image.open(out / "page-01.png")):
            print("QR:", code.text)
for start in range(0, len(doc), 4):
    sheet = Image.new("RGB", (1400, 1980), "#dddddd")
    for offset in range(4):
        idx = start + offset
        if idx >= len(doc):
            break
        im = Image.open(out / f"page-{idx+1:02}.png")
        im.thumbnail((690, 950))
        x, y = (offset % 2) * 700, (offset // 2) * 990
        sheet.paste(im, (x, y + 30))
        ImageDraw.Draw(sheet).text((x+12, y+8), f"PAGE {idx+1}", fill="black")
    sheet.save(out / f"sheet-{start//4+1}.jpg")
(out / "text.txt").write_text("".join(texts))
print("Rendered", len(doc), "pages.")
