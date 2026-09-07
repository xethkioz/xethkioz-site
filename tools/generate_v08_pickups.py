from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path("assets/v08/generated")
OUT.mkdir(parents=True, exist_ok=True)
INK=(8,10,20,255); VIOLET=(154,75,255,255); VIOLET2=(211,125,255,255); CYAN=(74,221,255,255)
WHITE=(244,244,255,255); GOLD=(255,198,78,255); ORANGE=(255,118,42,255); GREEN=(71,174,92,255)
STONE=(69,65,89,255); DARK=(20,17,36,255)

def save(im,name): im.save(OUT/name)

def crystal():
    im=Image.new('RGBA',(24,32),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.polygon([(12,1),(21,11),(17,29),(7,29),(3,11)],fill=VIOLET,outline=INK)
    d.polygon([(12,3),(16,11),(12,25),(8,11)],fill=VIOLET2)
    d.line((12,3,12,25),fill=WHITE,width=1); d.point((10,7),fill=CYAN)
    save(im,'crystal.png')

def food():
    im=Image.new('RGBA',(28,28),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.ellipse((4,6,23,25),fill=(205,55,66,255),outline=INK,width=2)
    d.rectangle((13,2,15,8),fill=(93,63,38,255)); d.polygon([(15,5),(23,3),(20,9)],fill=GREEN,outline=INK)
    d.rectangle((8,11,18,14),fill=(238,102,92,255)); d.point((10,9),fill=WHITE)
    save(im,'food.png')

def chest():
    im=Image.new('RGBA',(36,30),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rectangle((3,10,32,27),fill=(111,63,38,255),outline=INK,width=2)
    d.rounded_rectangle((4,3,31,15),radius=4,fill=(161,90,45,255),outline=INK,width=2)
    d.rectangle((16,11,20,23),fill=GOLD,outline=INK); d.point((18,15),fill=WHITE)
    d.line((5,17,31,17),fill=(74,42,31,255),width=1)
    save(im,'chest.png')

def exit_portal():
    im=Image.new('RGBA',(40,58),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rectangle((4,4,35,55),fill=(43,30,66,255),outline=INK,width=2)
    d.rectangle((9,9,30,51),fill=DARK,outline=VIOLET,width=2)
    for x,y in [(6,10),(34,15),(5,45),(34,48)]: d.rectangle((x-2,y-2,x+2,y+2),fill=VIOLET2)
    d.polygon([(20,13),(25,28),(20,45),(15,28)],fill=ORANGE,outline=INK)
    d.line((20,17,20,40),fill=GOLD,width=2)
    save(im,'exit.png')

def spike():
    im=Image.new('RGBA',(48,20),(0,0,0,0)); d=ImageDraw.Draw(im)
    for i in range(4):
        x=i*12
        d.polygon([(x,18),(x+6,2),(x+12,18)],fill=(170,191,205,255),outline=INK)
        d.line((x+6,5,x+8,15),fill=WHITE,width=1)
    save(im,'spike.png')

crystal(); food(); chest(); exit_portal(); spike()
print('Generated v0.8 pickup assets')
