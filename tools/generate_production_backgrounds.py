from pathlib import Path
from PIL import Image, ImageDraw
import random, math

OUT = Path("assets/production/generated")
OUT.mkdir(parents=True, exist_ok=True)
W,H = 640,360
random.seed(2150)

# Izrdralar production palette (locked art direction)
INK=(7,10,20,255); DEEP=(16,26,50,255); BLUE=(24,57,90,255); BLUE2=(37,83,111,255)
GREEN0=(16,67,55,255); GREEN1=(23,107,89,255); GREEN2=(79,174,114,255)
VIO=(155,92,255,255); VIO2=(217,140,255,255); CYAN=(69,201,232,255)
ORANGE=(255,155,74,255); STONE=(55,68,82,255); STONE2=(91,109,121,255)
WOOD=(77,49,43,255); WOOD2=(111,72,48,255); CREAM=(225,215,183,255)


def lerp(a,b,t): return int(a*(1-t)+b*t)
def gradient(im, top, bottom, y0=0, y1=None):
    y1 = im.height if y1 is None else y1
    d=ImageDraw.Draw(im)
    for y in range(y0,y1):
        t=(y-y0)/max(1,y1-y0-1)
        c=tuple(lerp(top[i],bottom[i],t) for i in range(3))+(255,)
        d.line((0,y,W,y),fill=c)


def poly(d,pts,fill): d.polygon([(int(x),int(y)) for x,y in pts],fill=fill)
def glow_crystal(d,x,y,s=1,col=VIO):
    # halo first
    for r,a in [(13*s,18),(9*s,28),(6*s,45)]:
        d.ellipse((x-r,y-r,x+r,y+r),fill=(col[0],col[1],col[2],a))
    poly(d,[(x,y-10*s),(x+6*s,y-2*s),(x+4*s,y+10*s),(x-5*s,y+10*s),(x-7*s,y-2*s)],col)
    poly(d,[(x,y-8*s),(x+2*s,y-2*s),(x,y+6*s),(x-2*s,y-2*s)],(235,245,255,255))


def tree_back(d,x,base,s=1):
    trunk=(44,37,43,255)
    d.rectangle((x-5*s,base-64*s,x+5*s,base),fill=trunk)
    for ox,oy,rx,ry,c in [(-18,-65,24,18,GREEN0),(8,-78,30,22,GREEN1),(30,-61,22,17,GREEN0),(-6,-48,30,19,GREEN1)]:
        d.ellipse((x+(ox-rx)*s,base+(oy-ry)*s,x+(ox+rx)*s,base+(oy+ry)*s),fill=c)


def tree_front(d,x,base,s=1):
    trunk=(49,35,40,255)
    d.rectangle((x-8*s,base-92*s,x+8*s,base),fill=trunk)
    d.rectangle((x-23*s,base-74*s,x-4*s,base-66*s),fill=trunk)
    d.rectangle((x+4*s,base-68*s,x+25*s,base-60*s),fill=trunk)
    for ox,oy,rx,ry,c in [(-30,-102,35,26,GREEN0),(5,-116,42,30,GREEN1),(43,-98,32,24,GREEN0),(-7,-76,42,27,GREEN1),(35,-72,31,22,GREEN2)]:
        d.ellipse((x+(ox-rx)*s,base+(oy-ry)*s,x+(ox+rx)*s,base+(oy+ry)*s),fill=c)
    # little highlights
    for _ in range(18):
        px=x+random.randint(-45,48)*s; py=base-random.randint(70,130)*s
        d.rectangle((px,py,px+random.randint(1,3)*s,py+random.randint(1,2)*s),fill=(102,192,126,180))


def ruin(d,x,base,w,h):
    d.rectangle((x,base-h,x+w,base),fill=STONE)
    d.rectangle((x+4,base-h+6,x+w-4,base-h+10),fill=STONE2)
    for yy in range(base-h+18,base,14): d.line((x,yy,x+w,yy),fill=(38,49,62,255),width=2)
    for xx in range(x+10,x+w,14): d.line((xx,base-h,xx,base),fill=(38,49,62,255),width=1)
    poly(d,[(x,base-h),(x+7,base-h-12),(x+15,base-h-5),(x+24,base-h-17),(x+w,base-h)],STONE)
    # future light slit
    d.rectangle((x+w//2-2,base-h+18,x+w//2+2,base-h+45),fill=(27,56,77,255))
    d.rectangle((x+w//2-1,base-h+22,x+w//2+1,base-h+41),fill=CYAN)


def mountain_layer(d,base,peaks,color):
    pts=[(0,base)]
    for x,y in peaks: pts.append((x,y))
    pts.append((W,base)); pts.append((W,H)); pts.append((0,H))
    poly(d,pts,color)


def fog(d,y,alpha=30):
    d.rectangle((0,y,W,y+5),fill=(160,190,205,alpha))
    for x in range(-20,W,55):
        d.ellipse((x,y-4,x+90,y+8),fill=(150,183,199,max(4,alpha//2)))


def traveler_back(d,x,y,s=1):
    # Original traveler seen from behind, no facial detail.
    cloak=(38,31,55,255); scarf=(118,47,70,255); dark=(23,27,37,255); hair=(34,28,29,255)
    d.ellipse((x-7*s,y-45*s,x+7*s,y-31*s),fill=hair)
    for px,py in [(-8,-42),(-4,-48),(1,-44),(5,-49),(9,-41)]:
        d.rectangle((x+px*s,y+py*s,x+(px+3)*s,y+(py+5)*s),fill=hair)
    poly(d,[(x-12*s,y-32*s),(x+12*s,y-32*s),(x+18*s,y-4*s),(x+7*s,y),(x-15*s,y-3*s)],cloak)
    d.rectangle((x-11*s,y-31*s,x+11*s,y-26*s),fill=scarf)
    d.rectangle((x-7*s,y-4*s,x-2*s,y+7*s),fill=dark); d.rectangle((x+3*s,y-4*s,x+8*s,y+7*s),fill=dark)
    # backpack
    d.rectangle((x-14*s,y-27*s,x-7*s,y-10*s),fill=(78,55,43,255))
    d.rectangle((x-13*s,y-24*s,x-8*s,y-21*s),fill=(142,92,48,255))


def xeth(d,x,y,s=1):
    flame=(248,107,38,255); light=(255,189,75,255)
    # halo
    d.ellipse((x-18*s,y-18*s,x+18*s,y+18*s),fill=(255,132,55,24))
    poly(d,[(x-12*s,y-5*s),(x-7*s,y-15*s),(x-2*s,y-8*s),(x+6*s,y-11*s),(x+12*s,y-3*s),(x+7*s,y+2*s)],flame)
    poly(d,[(x-9*s,y-14*s),(x-10*s,y-24*s),(x-3*s,y-17*s)],flame)
    poly(d,[(x+5*s,y-10*s),(x+10*s,y-20*s),(x+12*s,y-8*s)],flame)
    poly(d,[(x+9*s,y-3*s),(x+22*s,y-11*s),(x+17*s,y-21*s),(x+29*s,y-14*s),(x+23*s,y)],light)
    d.rectangle((x-5*s,y-13*s,x-3*s,y-11*s),fill=(245,250,255,255))


def add_distant_city(d):
    base=218
    for x,w,h in [(370,25,77),(401,37,118),(447,24,94),(478,46,140),(532,23,83)]:
        ruin(d,x,base,w,h)
        d.line((x+w//2,base-h-12,x+w//2,base-h-32),fill=VIO,width=2)


def world_scene(mode):
    im=Image.new("RGBA",(W,H),DEEP); gradient(im,(13,26,58),(68,92,125))
    d=ImageDraw.Draw(im,"RGBA")
    # sky stars / prism dust
    for _ in range(90):
        x=random.randrange(W); y=random.randrange(8,155)
        c=random.choice([(218,231,255,150),(92,211,238,130),(182,113,255,130)])
        d.point((x,y),fill=c)
    # moon
    d.ellipse((505,24,577,96),fill=(173,165,205,210)); d.ellipse((517,27,583,92),fill=(99,89,145,180))
    # back mountains
    mountain_layer(d,238,[(0,224),(85,108),(177,228),(252,91),(351,231),(442,119),(530,228),(605,137),(640,210)],(24,47,75,255))
    mountain_layer(d,255,[(0,241),(104,171),(203,247),(318,151),(424,249),(544,165),(640,237)],(31,64,82,255))
    add_distant_city(d)
    # fissure beams
    for bx in (428,496):
        d.line((bx,22,bx-10,216),fill=(125,72,222,110),width=4)
        d.line((bx+2,22,bx+2,216),fill=(224,128,255,140),width=1)
    fog(d,205,24); fog(d,231,20)
    # valley and river
    poly(d,[(0,238),(85,229),(155,247),(224,236),(295,252),(386,234),(455,250),(550,231),(640,248),(640,360),(0,360)],(18,66,75,255))
    poly(d,[(0,287),(92,274),(182,291),(275,270),(377,293),(488,269),(640,287),(640,360),(0,360)],(28,106,139,255))
    for yy in range(291,356,11):
        for x in range((yy*7)%43,W,61): d.line((x,yy,min(W-1,x+28),yy),fill=(78,179,205,130),width=1)
    # waterfalls
    for x,w,top in [(284,34,191),(335,17,222)]:
        d.rectangle((x,top,x+w,286),fill=(70,180,212,170)); d.rectangle((x+7,top,x+11,286),fill=(195,237,245,180))
    # middle vegetation / ruins
    tree_back(d,95,285,1); tree_back(d,175,289,1); tree_back(d,559,286,1)
    ruin(d,204,286,31,70); ruin(d,393,288,27,62)
    # foreground cliffs
    poly(d,[(-20,300),(90,288),(145,299),(212,291),(237,304),(237,360),(-20,360)],(38,58,52,255))
    poly(d,[(430,303),(489,289),(552,296),(640,284),(660,360),(430,360)],(38,58,52,255))
    d.line((0,297,90,287,145,298,210,290),fill=(79,170,103,255),width=6)
    d.line((434,300,489,288,552,295,640,283),fill=(79,170,103,255),width=6)
    tree_front(d,45,306,1); tree_front(d,603,304,1)
    for x,y,s,c in [(18,296,2,VIO),(104,289,1,CYAN),(190,292,1,VIO2),(414,294,1,CYAN),(510,293,2,VIO),(625,285,1,VIO2)]: glow_crystal(d,x,y,s,c)

    if mode == "menu":
        # left side remains readable for UI; hero sits on right third like approved cover.
        d.rectangle((0,0,245,H),fill=(4,7,18,60))
        traveler_back(d,468,291,2)
        xeth(d,520,286,2)
    elif mode == "creator":
        # calmer center so the animated preview remains readable.
        d.rectangle((0,0,W,H),fill=(6,9,22,35))
        d.rectangle((208,58,432,332),fill=(5,8,20,58))
    elif mode == "node1":
        # bring the forest closer; no baked actors/UI.
        tree_front(d,132,312,1); tree_front(d,501,306,1)
        ruin(d,320,305,38,89)
        fog(d,252,16)

    # vignette
    for i in range(8): d.rectangle((i,i,W-1-i,H-1-i),outline=(2,4,11,18+i*5))
    return im


def refuge_scene():
    im=Image.new("RGBA",(W,H),(27,18,18,255)); d=ImageDraw.Draw(im,"RGBA")
    # timber walls
    gradient(im,(42,28,28),(66,39,27))
    d=ImageDraw.Draw(im,"RGBA")
    for x in range(0,W,64): d.rectangle((x,0,x+7,H),fill=(49,31,29,255))
    for y in (68,170,300): d.rectangle((0,y,W,y+7),fill=(73,45,34,255))
    # back stone hearth
    d.rectangle((253,70,388,275),fill=(55,54,52,255)); d.rectangle((266,86,375,274),fill=(35,28,27,255))
    d.rectangle((276,174,365,273),fill=(20,15,16,255))
    # fire glow
    for r,a in [(70,22),(48,32),(30,48)]: d.ellipse((320-r,220-r,320+r,220+r),fill=(255,125,47,a))
    poly(d,[(301,257),(312,215),(323,247),(335,201),(350,259)],(248,105,35,255))
    poly(d,[(310,257),(322,226),(332,251),(340,223),(344,258)],(255,197,75,255))
    # shelves
    for x0,x1 in [(26,212),(428,616)]:
        d.rectangle((x0,64,x1,263),fill=(56,35,31,255))
        for yy in (95,140,186,230): d.rectangle((x0+8,yy,x1-8,yy+5),fill=WOOD2)
        for yy in (70,106,151,197):
            xx=x0+14
            while xx<x1-14:
                bw=random.randint(5,9); bh=random.randint(15,29)
                col=random.choice([(96,66,46,255),(68,92,58,255),(86,60,91,255),(113,74,49,255)])
                d.rectangle((xx,yy+30-bh,xx+bw,yy+30),fill=col)
                xx += bw+random.randint(2,5)
    # central alchemy table
    d.rectangle((75,270,216,282),fill=WOOD2); d.rectangle((88,282,99,333),fill=WOOD); d.rectangle((192,282,203,333),fill=WOOD)
    for x,c,h in [(98,VIO,20),(123,CYAN,26),(153,ORANGE,18),(181,(79,174,114,255),23)]:
        d.rectangle((x,247,x+10,270),fill=(184,215,208,180)); d.rectangle((x+2,270-h,x+8,268),fill=c)
    # hanging herbs
    for x in (78,112,454,487,524):
        d.line((x,20,x,61),fill=(70,107,66,255),width=2)
        for yy in range(27,58,8): d.ellipse((x-5,yy,x+1,yy+5),fill=(75,137,78,255))
    # rugs and floor
    d.rectangle((0,318,W,360),fill=(51,31,28,255))
    d.rectangle((224,302,418,345),fill=(67,35,47,255)); d.rectangle((233,309,409,338),outline=(151,82,80,255),width=3)
    # crystals / warm lamps
    glow_crystal(d,47,285,1,VIO); glow_crystal(d,585,277,1,CYAN)
    for x in (235,404):
        d.rectangle((x,104,x+6,130),fill=(90,59,42,255)); d.ellipse((x-5,92,x+11,108),fill=(255,171,67,100)); d.rectangle((x,96,x+6,106),fill=ORANGE)
    # foreground vignette
    for i in range(8): d.rectangle((i,i,W-1-i,H-1-i),outline=(2,3,8,16+i*5))
    return im


if __name__ == "__main__":
    world_scene("menu").save(OUT/"menu_bg_production.png")
    world_scene("creator").save(OUT/"creator_bg_production.png")
    world_scene("node1").save(OUT/"node1_bg_production.png")
    refuge_scene().save(OUT/"refuge_bg_production.png")
    print("Production backgrounds generated: menu, creator, node1, refuge")
