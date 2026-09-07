from pathlib import Path
from PIL import Image, ImageDraw

OUT=Path('assets/v09/generated'); OUT.mkdir(parents=True,exist_ok=True)


def forest_guardian():
    im=Image.new('RGBA',(64,64),(0,0,0,0)); d=ImageDraw.Draw(im)
    bark=(88,61,42,255); moss=(52,126,70,255); glow=(170,100,255,255); dark=(42,31,34,255)
    d.rectangle([18,20,46,53],fill=bark); d.rectangle([14,31,50,48],fill=bark)
    d.polygon([(18,23),(10,12),(23,18),(28,5),(34,19),(48,10),(44,25)],fill=moss)
    d.rectangle([14,48,25,62],fill=dark); d.rectangle([39,48,50,62],fill=dark)
    d.ellipse([22,25,29,32],fill=glow); d.ellipse([36,25,43,32],fill=glow)
    d.line([(12,35),(3,29)],fill=moss,width=4); d.line([(52,35),(61,29)],fill=moss,width=4)
    for p in [(20,15),(32,9),(44,17),(28,42),(40,39)]: d.rectangle([p[0],p[1],p[0]+3,p[1]+6],fill=glow)
    im.save(OUT/'boss_forest_guardian.png')


def plains_sentinel():
    im=Image.new('RGBA',(64,64),(0,0,0,0)); d=ImageDraw.Draw(im)
    metal=(80,103,117,255); stone=(107,96,78,255); glow=(83,222,235,255); dark=(38,49,59,255)
    d.rectangle([19,13,45,52],fill=metal); d.rectangle([14,24,50,46],fill=stone)
    d.rectangle([22,8,42,17],fill=dark); d.rectangle([25,19,39,25],fill=glow)
    d.rectangle([10,28,18,50],fill=metal); d.rectangle([46,28,54,50],fill=metal)
    d.rectangle([20,50,29,63],fill=dark); d.rectangle([35,50,44,63],fill=dark)
    d.line([(8,30),(2,21)],fill=glow,width=2); d.line([(56,30),(62,21)],fill=glow,width=2)
    d.rectangle([29,30,35,42],fill=glow)
    im.save(OUT/'boss_plains_sentinel.png')


def cism_archon():
    im=Image.new('RGBA',(64,64),(0,0,0,0)); d=ImageDraw.Draw(im)
    robe=(64,35,82,255); armor=(100,77,119,255); glow=(210,92,255,255); dark=(24,20,31,255)
    d.polygon([(32,4),(17,20),(12,54),(52,54),(47,20)],fill=robe)
    d.rectangle([20,18,44,42],fill=armor); d.polygon([(22,18),(32,7),(42,18)],fill=dark)
    d.ellipse([25,21,30,27],fill=glow); d.ellipse([34,21,39,27],fill=glow)
    d.rectangle([16,30,22,53],fill=dark); d.rectangle([42,30,48,53],fill=dark)
    d.line([(14,27),(4,18)],fill=glow,width=3); d.line([(50,27),(60,18)],fill=glow,width=3)
    d.ellipse([28,34,36,42],outline=glow,width=2)
    for x,y in [(9,12),(52,10),(8,44),(54,43)]: d.polygon([(x,y+6),(x+3,y),(x+6,y+6),(x+3,y+9)],fill=glow)
    im.save(OUT/'boss_cism_archon.png')

forest_guardian(); plains_sentinel(); cism_archon()
print('Generated v0.9 demo boss assets')
