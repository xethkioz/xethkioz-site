from pathlib import Path
from PIL import Image, ImageDraw
import random

OUT = Path('assets/v09/generated')
OUT.mkdir(parents=True, exist_ok=True)
random.seed(2150)


def px_bg(path, mode):
    w,h = 320,180
    if mode == 'plains':
        sky=(64,122,164,255); far=(42,88,93,255); mid=(35,82,65,255); ground=(28,65,44,255); glow=(111,231,190,255)
    else:
        sky=(47,49,91,255); far=(42,38,72,255); mid=(47,42,61,255); ground=(31,35,42,255); glow=(176,96,238,255)
    im=Image.new('RGBA',(w,h),sky)
    d=ImageDraw.Draw(im)
    for i in range(18):
        x=random.randrange(0,w); y=random.randrange(8,72); rw=random.randrange(8,28)
        c=(255,255,255,18 if mode=='plains' else 10)
        d.rectangle([x,y,x+rw,y+2],fill=c)
    for i in range(12):
        x=i*32-10; peak=80-random.randrange(0,28)
        d.polygon([(x,128),(x+20,peak),(x+48,128)],fill=far)
    for i in range(8):
        x=18+i*41+random.randrange(-6,7); top=random.randrange(78,118)
        d.rectangle([x,top,x+5,135],fill=mid)
        if i%2==0:
            d.rectangle([x+1,top-10,x+4,top],fill=mid); d.point((x+2,top-12),fill=glow)
    d.rectangle([0,132,w,145],fill=(25,88,105,150) if mode=='plains' else (52,42,86,150))
    for x in range(0,w,7): d.line([(x,136),(x+4,136)],fill=(100,216,224,80) if mode=='plains' else (177,111,243,70),width=1)
    d.rectangle([0,146,w,179],fill=ground)
    for i in range(34):
        x=random.randrange(0,w); ht=random.randrange(2,13); d.line([(x,146),(x-1,146-ht)],fill=glow,width=1)
    for i in range(7):
        x=random.randrange(12,w-12); y=random.randrange(130,155); hh=random.randrange(4,11)
        d.polygon([(x,y),(x+3,y-hh),(x+6,y),(x+3,y+3)],fill=glow)
    im.save(OUT/path)


def prop_tree():
    im=Image.new('RGBA',(48,72),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rectangle([21,30,27,71],fill=(63,42,31,255)); d.rectangle([18,43,30,49],fill=(76,49,34,255))
    for cx,cy,r in [(23,18,15),(12,26,11),(34,27,12),(24,7,9)]:
        d.rectangle([cx-r,cy-r//2,cx+r,cy+r//2],fill=(31,97,62,255)); d.rectangle([cx-r+3,cy-r//2+2,cx+r-2,cy+r//2-3],fill=(47,142,82,255))
    for p in [(9,25),(30,12),(38,27),(19,3)]: d.point(p,fill=(160,92,244,255))
    im.save(OUT/'quebracho_prop.png')


def prop_ruin():
    im=Image.new('RGBA',(64,72),(0,0,0,0)); d=ImageDraw.Draw(im)
    stone=(74,78,88,255); dark=(45,48,58,255); glow=(126,72,212,255)
    d.rectangle([6,28,14,71],fill=stone); d.rectangle([50,24,58,71],fill=stone)
    d.rectangle([10,18,54,27],fill=stone); d.rectangle([15,12,49,18],fill=dark); d.rectangle([20,25,44,29],fill=dark)
    d.arc([14,20,50,59],180,360,fill=stone,width=5); d.line([(32,13),(32,23)],fill=glow,width=2); d.point((32,10),fill=glow)
    for y in range(32,68,9): d.line([(7,y),(13,y-3)],fill=dark); d.line([(51,y-2),(57,y+1)],fill=dark)
    im.save(OUT/'ruin_arch_prop.png')


def prop_crystals():
    im=Image.new('RGBA',(36,32),(0,0,0,0)); d=ImageDraw.Draw(im)
    cols=[(124,70,225,255),(88,184,235,255),(202,115,255,255)]
    for i,(x,h) in enumerate([(5,18),(13,26),(22,20),(29,13)]):
        c=cols[i%len(cols)]; d.polygon([(x,29),(x+4,29-h),(x+8,29),(x+4,31)],fill=c); d.line([(x+4,29-h),(x+4,26)],fill=(235,227,255,255))
    im.save(OUT/'crystal_cluster_prop.png')


def mob_goblin():
    im=Image.new('RGBA',(32,32),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.polygon([(7,10),(3,6),(9,7),(12,4),(18,5),(23,8),(29,7),(25,12)],fill=(91,174,89,255))
    d.rectangle([8,10,24,21],fill=(75,146,74,255)); d.rectangle([10,21,15,29],fill=(55,82,59,255)); d.rectangle([19,21,24,29],fill=(55,82,59,255))
    d.rectangle([7,17,25,21],fill=(91,55,40,255)); d.point((12,13),fill=(255,239,130,255)); d.point((20,13),fill=(255,239,130,255))
    im.save(OUT/'mob_goblin.png')


def mob_scout():
    im=Image.new('RGBA',(32,32),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.polygon([(6,11),(2,7),(9,8),(12,5),(18,6),(25,9),(29,8),(25,13)],fill=(121,198,97,255))
    d.rectangle([9,11,23,20],fill=(102,176,82,255)); d.rectangle([11,20,14,29],fill=(50,76,62,255)); d.rectangle([20,20,23,29],fill=(50,76,62,255))
    d.line([(24,16),(31,10)],fill=(111,76,44,255),width=2); d.line([(26,13),(30,17)],fill=(211,191,126,255),width=1)
    d.point((13,14),fill=(255,243,140,255)); d.point((20,14),fill=(255,243,140,255))
    im.save(OUT/'mob_scout.png')


def mob_slime():
    im=Image.new('RGBA',(32,32),(0,0,0,0)); d=ImageDraw.Draw(im)
    body=(75,187,170,255); light=(126,235,220,255); dark=(38,112,115,255)
    d.rectangle([6,18,26,25],fill=body); d.rectangle([8,13,24,22],fill=body); d.rectangle([11,9,21,18],fill=light)
    d.rectangle([7,25,12,28],fill=dark); d.rectangle([20,25,25,28],fill=dark); d.point((13,18),fill=(25,49,57,255)); d.point((20,18),fill=(25,49,57,255))
    im.save(OUT/'mob_slime.png')


def mob_beetle():
    im=Image.new('RGBA',(32,32),(0,0,0,0)); d=ImageDraw.Draw(im)
    shell=(138,104,180,255); dark=(67,57,92,255); glow=(235,157,255,255)
    d.ellipse([6,7,26,25],fill=shell); d.rectangle([15,8,17,25],fill=dark); d.rectangle([9,22,23,28],fill=dark)
    d.line([(8,16),(2,12)],fill=dark,width=2); d.line([(24,16),(30,12)],fill=dark,width=2); d.line([(10,24),(4,29)],fill=dark,width=2); d.line([(22,24),(28,29)],fill=dark,width=2)
    d.point((12,13),fill=glow); d.point((21,13),fill=glow)
    im.save(OUT/'mob_beetle.png')

px_bg('izrdalar_plains_bg.png','plains')
px_bg('first_cism_bg.png','cism')
prop_tree(); prop_ruin(); prop_crystals()
mob_goblin(); mob_scout(); mob_slime(); mob_beetle()
print('Generated v0.9 demo scenic assets and starter mobs')
