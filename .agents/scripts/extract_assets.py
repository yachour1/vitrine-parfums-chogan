from pathlib import Path
import fitz
from PIL import Image, ImageDraw
import io
doc=fitz.open(".local/conversation-workspace/files/attached_assets/Brochure_Parfum_Chogan_1791656172589.pdf")
out=Path("artifacts/parfums/public/images")
out.mkdir(parents=True,exist_ok=True)
seen=set()
thumbs=[]
for n in [2,5,8,12,14,18,23,24]:
    for image in doc[n-1].get_images(full=True):
        xref,mask,w,h=image[:4]
        if xref in seen or max(w,h)<500: continue
        seen.add(xref)
        pix=fitz.Pixmap(doc,xref)
        if mask: pix=fitz.Pixmap(pix,fitz.Pixmap(doc,mask))
        im=Image.open(io.BytesIO(pix.tobytes("png")))
        im.thumbnail((1400,1400))
        filename=f"brochure-p{n}-{xref}.webp"
        im.save(out/filename,quality=88)
        thumbs.append((filename,im.copy()))
sheet=Image.new("RGB",(1000,((len(thumbs)+3)//4)*260),"#eeeae3")
draw=ImageDraw.Draw(sheet)
for i,(name,im) in enumerate(thumbs):
    im.thumbnail((230,225))
    x,y=(i%4)*250,(i//4)*260
    sheet.paste(im,(x,y),im if im.mode=="RGBA" else None)
    draw.text((x,y+235),name,fill="black")
sheet.save("generated-artifacts/brochure/assets.jpg")
print([name for name,_ in thumbs])
