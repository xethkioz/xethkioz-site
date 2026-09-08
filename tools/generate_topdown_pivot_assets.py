from pathlib import Path
from PIL import Image, ImageDraw
import random

random.seed(2150)
OUT = Path('assets/topdown/generated')
OUT.mkdir(parents=True, exist_ok=True)

W,H=2048,1400
INK=(10,14,24,255); GRASS=(41,105,68,255); GRASS2=(62,132,79,255); PATH=(151,122,77,255)
WATER=(40,119,166,255); WATER2=(92,184,210,255); STONE=(72,82,94,255); MOSS=(71,138,78,255)
VIO=(151,84,235,255); CYAN=(76,211,236,255); ORANGE=(245,111,47,255); WHITE=(236,241,248,255)


def rect(d, box, fill): d.rectangle(box, fill=fill)

def crystal(d,x,y,s=1):
    d.polygon([(x,y-8*s),(x+6*s,y),(x+3*s,y+9*s),(x-4*s,y+9*s),(x-6*s,y)],fill=VIO)
    d.line((x,y-7*s,x,y+7*s),fill=CYAN,width=max(1,s))

def tree(d,x,y,s=1):
    d.rectangle((x-5*s,y-2*s,x+5*s,y+13*s),fill=(74,49,38,255))
    for ox,oy,r,c in [(-13,-12,12,(28,86,57,255)),(0,-20,16,(35,107,67,255)),(15,-11,12,(51,129,77,255)),(0,-3,14,(42,118,72,255))]:
        d.ellipse((x+(ox-r)*s,y+(oy-r)*s,x+(ox+r)*s,y+(oy+r)*s),fill=c)

def ruin(d,x,y,w,h):
    d.rectangle((x,y,x+w,y+h),fill=STONE)
    d.rectangle((x+3,y+3,x+w-3,y+7),fill=(100,112,122,255))
    for xx in range(x+8,x+w,16): d.line((xx,y+8,xx,y+h),fill=(53,62,73,255))
    for yy in range(y+14,y+h,14): d.line((x,yy,x+w,yy),fill=(55,64,76,255))

def make_world():
    im=Image.new('RGBA',(W,H),GRASS); d=ImageDraw.Draw(im)
    # grass variation
    for y in range(0,H,16):
        for x in range(0,W,16):
            c=GRASS if (x//16+y//16)%3 else GRASS2
            d.rectangle((x,y,x+15,y+15),fill=c)
            if random.random()<0.16: d.point((x+random.randrange(2,14),y+random.randrange(2,14)),fill=(104,166,92,255))
    # river
    d.rounded_rectangle((1150,-40,1500,H+40),radius=90,fill=WATER)
    for yy in range(20,H,28): d.line((1170,yy,1480,yy+random.choice([-2,0,2])),fill=WATER2,width=2)
    # main road network
    d.rounded_rectangle((80,610,1110,790),radius=70,fill=PATH)
    d.rounded_rectangle((880,160,1050,1200),radius=60,fill=PATH)
    d.rounded_rectangle((1450,700,1970,860),radius=55,fill=PATH)
    # clearings
    d.ellipse((150,120,760,560),fill=(54,122,76,255))
    d.ellipse((1480,120,1980,620),fill=(48,115,73,255))
    d.ellipse((130,880,810,1330),fill=(55,124,76,255))
    # bridges
    d.rectangle((1128,680,1522,748),fill=(109,79,51,255))
    for xx in range(1136,1518,18): d.line((xx,684,xx,744),fill=(162,119,70,255),width=5)
    # ruins and shrine
    for args in [(330,240,110,85),(550,1010,150,95),(1600,260,130,110),(1710,1020,170,120)]: ruin(d,*args)
    ruin(d,930,500,120,120)
    crystal(d,990,550,3)
    # forest clusters
    for _ in range(170):
        x=random.randrange(30,W-30); y=random.randrange(35,H-35)
        if 820<x<1080 or 1110<x<1535 or 560<y<830: continue
        tree(d,x,y,random.choice([1,1,1,2]))
    # crystal pockets
    for _ in range(36): crystal(d,random.randrange(70,W-70),random.randrange(70,H-70),random.choice([1,1,2]))
    # edges vignette
    for i in range(14): d.rectangle((i,i,W-1-i,H-1-i),outline=(5,9,16,20+i*3))
    im.save(OUT/'izrdalar_node1_topdown.png')


def make_sprite(name, body, accent, hair=(40,32,29,255), old=False, hood=False, pet=False, enemy=False):
    if pet:
        im=Image.new('RGBA',(32,32),(0,0,0,0)); d=ImageDraw.Draw(im)
        d.ellipse((5,10,24,25),fill=body); d.polygon([(6,13),(8,3),(13,11)],fill=body); d.polygon([(20,11),(24,3),(26,15)],fill=body)
        d.ellipse((11,14,13,16),fill=WHITE); d.ellipse((18,14,20,16),fill=WHITE); d.polygon([(22,22),(31,17),(28,28)],fill=accent)
        im.save(OUT/f'{name}.png'); return
    if enemy:
        im=Image.new('RGBA',(32,32),(0,0,0,0)); d=ImageDraw.Draw(im)
        d.ellipse((5,7,27,28),fill=body); d.rectangle((8,12,24,23),fill=accent); d.rectangle((10,14,12,16),fill=WHITE); d.rectangle((20,14,22,16),fill=WHITE)
        im.save(OUT/f'{name}.png'); return
    im=Image.new('RGBA',(32,48),(0,0,0,0)); d=ImageDraw.Draw(im)
    skin=(224,177,136,255) if not old else (210,180,155,255)
    d.ellipse((10,5,22,17),fill=skin)
    if hood:
        d.pieslice((7,1,25,21),180,360,fill=(22,22,28,255)); d.rectangle((7,9,10,20),fill=(22,22,28,255)); d.rectangle((22,9,25,20),fill=(22,22,28,255))
    else:
        d.rectangle((8,3,24,8),fill=hair)
        if old: d.rectangle((7,4,10,17),fill=(230,230,226,255)); d.rectangle((22,4,25,17),fill=(230,230,226,255))
    d.rectangle((8,18,24,37),fill=body); d.rectangle((8,18,24,22),fill=accent)
    d.rectangle((5,21,9,34),fill=body); d.rectangle((23,21,27,34),fill=body)
    d.rectangle((9,37,14,46),fill=(33,35,42,255)); d.rectangle((18,37,23,46),fill=(33,35,42,255))
    if old:
        d.rectangle((11,21,21,34),fill=(212,201,163,255)); d.rectangle((23,24,28,30),fill=(92,129,74,255))
    im.save(OUT/f'{name}.png')

make_world()
make_sprite('traveler_male',(38,43,55,255),VIO)
make_sprite('traveler_female',(50,43,62,255),VIO,hair=(66,42,39,255))
make_sprite('xethkioz',ORANGE,(255,188,69,255),pet=True)
make_sprite('alexis',(25,26,31,255),VIO,hood=True)
make_sprite('ashley',(104,50,94,255),(235,103,182,255),hair=(133,58,94,255))
make_sprite('fermin',(70,79,86,255),ORANGE,hair=(86,62,44,255))
make_sprite('gael',(55,102,62,255),(111,195,91,255),hair=(120,84,50,255))
make_sprite('isabella',(65,39,79,255),VIO,hair=(62,31,74,255))
make_sprite('elida',(91,83,67,255),(124,166,93,255),old=True)
make_sprite('mob_goblin',(61,132,70,255),(38,78,41,255),enemy=True)
make_sprite('mob_slime',(74,154,109,255),(125,210,145,255),enemy=True)
make_sprite('mob_spirit',(88,72,136,255),(170,115,236,255),enemy=True)
print('Top-down pivot assets generated')
