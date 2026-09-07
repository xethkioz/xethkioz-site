from pathlib import Path
from PIL import Image, ImageDraw
import random

OUT = Path("assets/v08/generated")
OUT.mkdir(parents=True, exist_ok=True)
random.seed(2150)

P = {
    "ink": (8, 10, 20, 255),
    "night": (15, 29, 53, 255),
    "sky": (47, 77, 116, 255),
    "sky2": (93, 116, 151, 255),
    "mist": (142, 178, 194, 255),
    "violet": (152, 78, 255, 255),
    "violet2": (203, 117, 255, 255),
    "cyan": (68, 218, 255, 255),
    "orange": (255, 132, 52, 255),
    "gold": (255, 201, 91, 255),
    "leaf": (32, 103, 79, 255),
    "leaf2": (56, 145, 93, 255),
    "leaf3": (95, 185, 111, 255),
    "bark": (71, 50, 58, 255),
    "stone": (62, 76, 91, 255),
    "stone2": (92, 111, 118, 255),
    "water": (47, 150, 205, 255),
    "water2": (109, 220, 239, 255),
    "skin": (224, 174, 130, 255),
    "white": (240, 243, 255, 255),
    "red": (207, 53, 76, 255),
    "green": (58, 171, 101, 255),
}

def px(name, w, h, bg=(0,0,0,0)):
    return Image.new("RGBA", (w,h), bg), ImageDraw.Draw(Image.new("RGBA", (1,1)))

def save(im, name):
    im.save(OUT / name)

def poly(d, pts, fill, outline=None):
    d.polygon(pts, fill=fill)
    if outline:
        d.line(pts + [pts[0]], fill=outline, width=1)

def crystal(d, x, y, s=1, col=None):
    c = col or P["violet"]
    poly(d, [(x,y-9*s),(x+5*s,y-1*s),(x+3*s,y+8*s),(x-4*s,y+8*s),(x-6*s,y-1*s)], c, P["ink"])
    poly(d, [(x,y-7*s),(x+2*s,y-1*s),(x,y+6*s),(x-2*s,y-1*s)], P["white"])
    d.point((x-1*s,y-5*s), fill=P["cyan"])

def cloud(d,x,y,scale=1):
    c=(188,205,220,255)
    for ox,oy,r in [(0,3,5),(6,0,6),(13,2,5),(18,4,4)]:
        d.rectangle((x+(ox-r)*scale,y+(oy-r)*scale,x+(ox+r)*scale,y+(oy+r)*scale), fill=c)

def tree(d,x,ground,scale=1,front=False):
    trunk=P["bark"]
    d.rectangle((x-5*scale,ground-46*scale,x+5*scale,ground), fill=trunk)
    d.rectangle((x-10*scale,ground-38*scale,x-4*scale,ground-33*scale), fill=trunk)
    d.rectangle((x+4*scale,ground-35*scale,x+13*scale,ground-30*scale), fill=trunk)
    cols=[P["leaf"],P["leaf2"],P["leaf3"]]
    for i,(ox,oy,r) in enumerate([(-15,-52,13),(0,-61,17),(15,-50,14),(-4,-42,14)]):
        c=cols[(i+(1 if front else 0))%3]
        d.rectangle((x+(ox-r)*scale,ground+(oy-r)*scale,x+(ox+r)*scale,ground+(oy+r)*scale), fill=c)
        if r>13:
            d.rectangle((x+(ox-r+4)*scale,ground+(oy-r-2)*scale,x+(ox+r-5)*scale,ground+(oy-r+2)*scale), fill=cols[min(2,i+1)])

def ruin(d,x,base,scale=1):
    st=P["stone"]
    hi=P["stone2"]
    d.rectangle((x,base-46*scale,x+28*scale,base), fill=st)
    d.rectangle((x+4*scale,base-40*scale,x+24*scale,base-34*scale), fill=hi)
    d.rectangle((x+8*scale,base-32*scale,x+20*scale,base), fill=P["night"])
    d.arc((x+8*scale,base-39*scale,x+20*scale,base-25*scale),180,360, fill=hi, width=max(1,scale))
    for yy in range(base-44*scale,base,8*scale):
        d.line((x,yy,x+28*scale,yy), fill=(43,56,69,255))
    d.line((x+14*scale,base-46*scale,x+14*scale,base), fill=(43,56,69,255))

def make_bg(name, dark=1.0):
    w,h=320,180
    im=Image.new("RGBA",(w,h),P["night"])
    d=ImageDraw.Draw(im)
    # layered pixel sky
    bands=[(0,35,(24,45,76,255)),(35,70,(45,72,110,255)),(70,110,(74,102,137,255)),(110,180,(93,121,141,255))]
    for y0,y1,c in bands:
        c=tuple(int(v*dark) if i<3 else v for i,v in enumerate(c))
        d.rectangle((0,y0,w,y1),fill=c)
    # moon and stars
    d.ellipse((245,10,274,39),fill=(213,222,233,255))
    d.ellipse((253,7,279,35),fill=bands[0][2])
    for _ in range(36):
        x=random.randrange(8,w-8); y=random.randrange(7,72)
        d.point((x,y),fill=random.choice([P["white"],P["cyan"],P["violet2"]]))
    cloud(d,42,34,1); cloud(d,112,25,1)
    # distant mountains
    poly(d,[(0,112),(45,55),(89,112)],(38,68,92,255))
    poly(d,[(52,112),(112,48),(168,112)],(45,78,101,255))
    poly(d,[(130,112),(202,42),(270,112)],(51,82,105,255))
    poly(d,[(225,112),(286,58),(320,100),(320,112)],(37,65,89,255))
    # distant prismatic citadel
    for x,hh,ww in [(188,62,12),(202,82,18),(219,54,10),(231,72,14)]:
        d.rectangle((x,112-hh,x+ww,112),fill=(51,58,84,255))
        d.rectangle((x+ww//2-1,112-hh-13,x+ww//2+1,112-hh),fill=P["violet"])
        if hh>60:
            d.rectangle((x+3,112-hh+11,x+5,112-hh+20),fill=P["cyan"])
    # river + waterfall
    d.rectangle((0,119,w,180),fill=(24,73,96,255))
    poly(d,[(0,142),(75,132),(145,147),(213,130),(320,144),(320,180),(0,180)],P["water"])
    for yy in range(146,179,7):
        d.line((0,yy,320,yy+random.choice([-1,0,1])),fill=P["water2"],width=1)
    d.rectangle((153,101,169,145),fill=P["water2"])
    d.rectangle((156,103,163,145),fill=P["white"])
    # ruins / bridge
    ruin(d,28,128,1); ruin(d,278,125,1)
    d.rectangle((116,122,211,128),fill=P["stone"])
    for xx in range(120,210,18):
        d.rectangle((xx,128,xx+5,142),fill=P["stone2"])
    # trees and foreground vegetation
    tree(d,18,145,1,True); tree(d,80,141,1,False); tree(d,303,146,1,True)
    for x in range(0,320,8):
        if random.random()<0.7:
            d.rectangle((x,156-random.randrange(2,7),x+2,158),fill=random.choice([P["leaf"],P["leaf2"],P["leaf3"]]))
    # crystals / mushrooms
    for x,y,s,c in [(64,144,1,P["violet"]),(105,151,1,P["cyan"]),(248,142,1,P["violet2"]),(292,151,1,P["cyan"])]:
        crystal(d,x,y,s,c)
    for x,y,c in [(87,151,P["cyan"]),(94,154,P["violet2"]),(264,153,P["cyan"])]:
        d.rectangle((x-1,y,x+1,y+5),fill=(220,220,190,255)); d.rectangle((x-5,y-2,x+5,y+1),fill=c)
    # pixel vignette
    for i in range(8):
        a=int(10+i*3)
        d.rectangle((i,i,w-1-i,h-1-i),outline=(3,5,12,a))
    save(im,name)

make_bg("izrdalar_bg.png",1.0)
make_bg("menu_bg.png",0.72)
make_bg("creator_bg.png",0.62)

# tiles
def tile_ground():
    im=Image.new("RGBA",(64,48),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rectangle((0,5,63,47),fill=(55,78,82,255))
    d.rectangle((0,0,63,8),fill=(57,134,83,255))
    d.rectangle((0,0,63,3),fill=(105,198,112,255))
    for x in range(0,64,8):
        d.line((x,10,x,47),fill=(38,55,63,255))
    for y in range(12,48,9):
        d.line((0,y,63,y),fill=(43,61,69,255))
    for x in [5,19,31,46,58]:
        d.rectangle((x,2,x+2,10+random.randrange(2,10)),fill=P["leaf2"])
    save(im,"ground_tile.png")

def tile_platform():
    im=Image.new("RGBA",(64,24),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rectangle((0,6,63,23),fill=(59,76,86,255))
    d.rectangle((0,3,63,8),fill=(57,139,86,255))
    d.rectangle((0,1,63,4),fill=(102,196,111,255))
    for x in range(0,64,12): d.line((x,9,x,23),fill=(39,52,61,255))
    for x in [4,22,39,54]: d.rectangle((x,2,x+1,10+random.randrange(3,8)),fill=P["leaf2"])
    save(im,"platform_tile.png")

tile_ground(); tile_platform()

# sprites
def outline_poly(d,pts,fill): poly(d,pts,fill,P["ink"])

def traveler():
    im=Image.new("RGBA",(32,48),(0,0,0,0)); d=ImageDraw.Draw(im)
    # cape and hood
    outline_poly(d,[(8,16),(16,8),(24,16),(27,39),(5,39)],(176,143,100,255))
    outline_poly(d,[(9,16),(16,11),(23,16),(21,24),(11,24)],(110,83,66,255))
    d.rectangle((13,17,19,23),fill=P["skin"]); d.point((15,19),fill=P["ink"]); d.point((18,19),fill=P["ink"])
    # tunic
    outline_poly(d,[(10,24),(22,24),(24,38),(8,38)],(35,57,68,255))
    d.rectangle((14,25,18,35),fill=(34,118,106,255)); crystal(d,16,31,1,P["cyan"])
    d.rectangle((9,38,14,46),fill=(28,31,42,255)); d.rectangle((18,38,23,46),fill=(28,31,42,255))
    save(im,"traveler.png")

def alexis():
    im=Image.new("RGBA",(32,48),(0,0,0,0)); d=ImageDraw.Draw(im)
    # black toga hoodie silhouette
    outline_poly(d,[(7,14),(15,7),(23,14),(27,42),(5,42)],(24,27,34,255))
    outline_poly(d,[(10,14),(16,10),(22,14),(20,22),(12,22)],(38,41,49,255))
    d.rectangle((13,16,19,22),fill=P["skin"]); d.rectangle((14,21,18,23),fill=(76,48,38,255))
    d.line((8,29,24,29),fill=(98,70,48,255),width=2)
    # lantern
    d.line((24,26,29,23),fill=(115,84,52,255),width=1)
    d.rectangle((26,23,31,34),fill=(73,54,44,255)); d.rectangle((27,25,30,32),fill=P["gold"]); d.point((28,27),fill=P["white"])
    d.rectangle((8,41,13,47),fill=(14,16,21,255)); d.rectangle((20,41,25,47),fill=(14,16,21,255))
    save(im,"alexis.png")

def ashley():
    im=Image.new("RGBA",(32,48),(0,0,0,0)); d=ImageDraw.Draw(im)
    # teen bard, smaller silhouette
    d.rectangle((11,11,21,21),fill=P["skin"])
    # pink hair locks
    outline_poly(d,[(8,10),(13,5),(21,7),(25,13),(23,25),(18,20),(12,25),(8,20)],(237,91,168,255))
    d.rectangle((12,13,20,20),fill=P["skin"]); d.point((14,16),fill=P["ink"]); d.point((19,16),fill=P["ink"])
    outline_poly(d,[(9,23),(22,23),(24,38),(8,38)],(130,58,150,255))
    # lute
    d.ellipse((16,25,28,36),fill=(163,91,55,255),outline=P["ink"]); d.line((23,27,30,20),fill=(97,62,45,255),width=2)
    d.line((19,28,24,33),fill=P["gold"],width=1)
    d.rectangle((9,38,13,47),fill=(55,39,80,255)); d.rectangle((19,38,23,47),fill=(55,39,80,255))
    # music notes
    d.point((27,12),fill=P["cyan"]); d.point((29,10),fill=P["violet2"]); d.line((28,8,28,13),fill=P["violet2"],width=1)
    save(im,"ashley.png")

def xeth():
    im=Image.new("RGBA",(32,32),(0,0,0,0)); d=ImageDraw.Draw(im)
    # mystical small dragon
    outline_poly(d,[(6,18),(9,10),(16,7),(23,10),(26,17),(23,24),(12,25)],(224,220,255,255))
    outline_poly(d,[(9,12),(4,7),(6,18)],(153,84,244,255)); outline_poly(d,[(22,12),(28,7),(26,19)],(153,84,244,255))
    outline_poly(d,[(8,23),(3,27),(12,26)],P["orange"])
    d.rectangle((14,10,19,14),fill=(245,235,255,255)); d.point((18,11),fill=(224,57,91,255))
    d.rectangle((14,18,17,22),fill=P["violet"]); d.point((15,19),fill=P["white"])
    save(im,"xethkioz.png")

def goblin():
    im=Image.new("RGBA",(32,40),(0,0,0,0)); d=ImageDraw.Draw(im)
    outline_poly(d,[(7,9),(15,5),(24,9),(27,19),(23,28),(8,28),(4,18)],(83,142,73,255))
    poly(d,[(5,11),(0,8),(6,16)],(76,126,65,255),P["ink"]); poly(d,[(24,10),(31,7),(25,17)],(76,126,65,255),P["ink"])
    d.rectangle((9,12,22,20),fill=(92,153,78,255)); d.point((12,14),fill=P["gold"]); d.point((20,14),fill=P["gold"])
    d.line((13,19,19,19),fill=P["ink"],width=1)
    d.rectangle((9,27,14,38),fill=(64,49,39,255)); d.rectangle((18,27,23,38),fill=(64,49,39,255))
    d.line((22,24,30,15),fill=(111,80,50,255),width=2)
    save(im,"goblin.png")

traveler(); alexis(); ashley(); xeth(); goblin()

# portraits: deliberately hand-drawn larger versions for dialogue
def portrait_alexis():
    im=Image.new("RGBA",(64,64),(11,14,24,255)); d=ImageDraw.Draw(im)
    outline_poly(d,[(5,56),(10,18),(30,5),(53,20),(60,58)],(22,24,32,255))
    d.ellipse((19,15,45,45),fill=P["skin"],outline=P["ink"])
    poly(d,[(17,19),(25,11),(42,12),(48,21),(41,18),(34,21),(25,17)],(29,26,30,255),P["ink"])
    d.point((27,29),fill=P["ink"]); d.point((39,29),fill=P["ink"])
    d.line((28,38,39,38),fill=(80,46,38,255),width=2); d.line((25,36,30,45),fill=(68,42,36,255),width=2); d.line((43,36,38,45),fill=(68,42,36,255),width=2)
    save(im,"alexis_portrait.png")

def portrait_ashley():
    im=Image.new("RGBA",(64,64),(17,13,31,255)); d=ImageDraw.Draw(im)
    d.ellipse((17,13,47,47),fill=P["skin"],outline=P["ink"])
    poly(d,[(12,20),(20,7),(39,6),(53,19),(50,42),(42,28),(35,18),(25,30),(14,40)],(236,92,168,255),P["ink"])
    d.point((27,29),fill=P["ink"]); d.point((39,29),fill=P["ink"]); d.arc((29,33,39,40),0,180,fill=(144,52,89,255),width=1)
    d.ellipse((17,7,24,14),fill=(245,212,223,255)); d.point((19,9),fill=P["gold"])
    save(im,"ashley_portrait.png")

portrait_alexis(); portrait_ashley()
print(f"Generated v0.8 assets in {OUT}")
