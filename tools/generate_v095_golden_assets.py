from pathlib import Path
from PIL import Image, ImageDraw
import random

random.seed(2150)
OUT08 = Path('assets/v08/generated')
OUT95 = Path('assets/v095/generated')
OUT08.mkdir(parents=True, exist_ok=True)
OUT95.mkdir(parents=True, exist_ok=True)

INK=(7,9,18,255); DEEP=(11,18,37,255); NIGHT=(19,31,57,255)
VIO=(124,64,220,255); VIO2=(185,94,255,255); CYAN=(62,213,242,255)
ORANGE=(255,126,48,255); GOLD=(255,206,103,255)
LEAF0=(20,72,61,255); LEAF1=(31,105,76,255); LEAF2=(60,145,93,255); LEAF3=(98,184,112,255)
BARK=(55,37,43,255); STONE=(50,61,76,255); STONE2=(80,94,108,255)
WATER=(33,111,159,255); WATER2=(86,190,222,255); SKIN=(222,169,129,255)
WHITE=(235,239,249,255); BLACK=(13,15,22,255); PINK=(214,73,151,255)


def poly(d, pts, fill, outline=None, width=1):
    d.polygon(pts, fill=fill)
    if outline:
        d.line(pts+[pts[0]], fill=outline, width=width)


def crystal(d,x,y,s=1,col=VIO):
    poly(d,[(x,y-10*s),(x+6*s,y-2*s),(x+4*s,y+10*s),(x-5*s,y+10*s),(x-7*s,y-2*s)],col,INK,1)
    poly(d,[(x,y-8*s),(x+2*s,y-2*s),(x,y+7*s),(x-2*s,y-2*s)],WHITE)
    d.rectangle((x-1*s,y-6*s,x+1*s,y-3*s),fill=CYAN)


def tree(d,x,ground,s=1,front=False):
    trunk=BARK
    d.rectangle((x-8*s,ground-92*s,x+8*s,ground),fill=trunk)
    d.rectangle((x-20*s,ground-75*s,x-4*s,ground-65*s),fill=trunk)
    d.rectangle((x+4*s,ground-70*s,x+24*s,ground-60*s),fill=trunk)
    clusters=[(-34,-103,28),(0,-122,36),(37,-102,30),(-10,-79,30),(28,-76,26)]
    cols=[LEAF0,LEAF1,LEAF2,LEAF3]
    for i,(ox,oy,r) in enumerate(clusters):
        c=cols[(i+(1 if front else 0))%len(cols)]
        d.rectangle((x+(ox-r)*s,ground+(oy-r)*s,x+(ox+r)*s,ground+(oy+r)*s),fill=c)
        d.rectangle((x+(ox-r+7)*s,ground+(oy-r-4)*s,x+(ox+r-8)*s,ground+(oy-r+2)*s),fill=cols[min(3,(i+2)%4)])
    # vines
    for off in (-24,14,31):
        d.line((x+off*s,ground-118*s,x+(off+3)*s,ground-58*s),fill=(37,116,72,255),width=max(1,s))


def ruin_tower(d,x,base,w=38,h=100):
    d.rectangle((x,base-h,x+w,base),fill=STONE)
    d.rectangle((x+4,base-h+7,x+w-5,base-h+13),fill=STONE2)
    for yy in range(base-h+18,base,14): d.line((x,yy,x+w,yy),fill=(37,46,59,255),width=2)
    for xx in range(x+9,x+w,13): d.line((xx,base-h,xx,base),fill=(37,46,59,255),width=1)
    # broken top
    poly(d,[(x,base-h),(x+8,base-h-12),(x+15,base-h-4),(x+25,base-h-18),(x+w,base-h)],STONE,INK)
    # luminous slit
    d.rectangle((x+w//2-2,base-h+24,x+w//2+2,base-h+47),fill=(42,72,91,255))
    d.rectangle((x+w//2-1,base-h+27,x+w//2+1,base-h+43),fill=CYAN)


def mountain(d, pts, c, snow=False):
    poly(d,pts,c)
    if snow:
        top=pts[1]
        x,y=top
        poly(d,[(x,y),(x-15,y+18),(x-4,y+14),(x+5,y+21),(x+17,y+17)],(168,183,202,255))


def sky_gradient(im, top, bottom):
    d=ImageDraw.Draw(im)
    h=im.height
    for y in range(h):
        t=y/max(1,h-1)
        c=tuple(int(top[i]*(1-t)+bottom[i]*t) for i in range(3))+(255,)
        d.line((0,y,im.width,y),fill=c)


def make_world_bg(path, mode='game'):
    W,H=640,360
    im=Image.new('RGBA',(W,H),DEEP)
    if mode=='menu':
        sky_gradient(im,(16,25,54),(73,84,111))
    elif mode=='creator':
        sky_gradient(im,(12,20,44),(55,70,96))
    else:
        sky_gradient(im,(18,34,67),(82,112,143))
    d=ImageDraw.Draw(im)

    # stars / prism sparks
    for _ in range(120):
        x=random.randrange(W); y=random.randrange(8,160)
        c=random.choice([WHITE,CYAN,VIO2,(146,171,208,255)])
        d.point((x,y),fill=c)
        if random.random()<0.10: d.point((x+1,y),fill=c)

    # giant moon/planet
    d.ellipse((478,18,568,108),fill=(184,170,203,255))
    d.ellipse((490,22,574,104),fill=(119,94,155,255))
    for _ in range(12):
        cx=random.randrange(500,560); cy=random.randrange(35,92); r=random.randrange(2,7)
        d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(142,118,174,255))

    # distant mountains
    mountain(d,[(0,235),(105,105),(218,235)],(29,53,82,255),True)
    mountain(d,[(100,235),(240,86),(378,235)],(35,60,89,255),True)
    mountain(d,[(290,235),(430,112),(560,235)],(31,55,82,255))
    mountain(d,[(455,235),(570,126),(640,204),(640,235)],(27,48,75,255))

    # future ruins / citadel on horizon
    base=214
    for x,w,h in [(356,32,105),(393,44,142),(441,28,116),(474,53,165),(536,27,99)]:
        ruin_tower(d,x,base,w,h)
        d.line((x+w//2,base-h-18,x+w//2,base-h-45),fill=VIO2,width=2)
        d.point((x+w//2,base-h-48),fill=WHITE)
    # prismatic fissure beams
    for bx in (411,485):
        d.line((bx,15,bx-8,211),fill=(96,55,176,190),width=3)
        d.line((bx+3,18,bx+1,211),fill=(192,91,255,180),width=1)

    # mist bands
    for yy in (174,196,219):
        d.rectangle((0,yy,W,yy+4),fill=(135,166,186,28))

    # river basin
    d.rectangle((0,245,W,H),fill=(21,71,102,255))
    poly(d,[(0,286),(104,267),(191,287),(293,265),(385,289),(493,260),(640,282),(640,360),(0,360)],WATER)
    for yy in range(289,357,10):
        for x in range((yy*3)%31,W,57):
            d.line((x,yy,min(W-1,x+28),yy+random.choice([-1,0,1])),fill=WATER2,width=1)

    # waterfall and bridge
    d.rectangle((286,192,326,285),fill=(57,159,197,255))
    d.rectangle((294,192,307,285),fill=(184,232,238,255))
    d.rectangle((312,192,319,285),fill=(102,205,225,255))
    d.rectangle((228,245,365,254),fill=STONE)
    d.rectangle((228,245,365,248),fill=STONE2)
    for xx in range(236,360,25): d.rectangle((xx,254,xx+7,279),fill=STONE)

    # foreground cliffs
    poly(d,[(-20,292),(112,282),(158,297),(198,293),(222,305),(222,360),(-20,360)],(38,55,54,255))
    poly(d,[(420,300),(486,286),(553,293),(640,281),(660,360),(420,360)],(38,55,54,255))
    d.line((0,290,110,281,158,296,198,292),fill=LEAF3,width=6)
    d.line((423,298,486,285,553,292,640,280),fill=LEAF3,width=6)

    # trees framing scene
    tree(d,48,307,1,True); tree(d,137,296,1,False); tree(d,597,304,1,True)
    if mode!='creator': tree(d,520,294,1,False)

    # ruins embedded in foreground
    ruin_tower(d,178,300,30,65); ruin_tower(d,401,302,26,55)

    # crystals and flora
    for x,y,s,c in [(20,292,2,VIO2),(86,287,1,CYAN),(151,295,2,VIO),(209,300,1,CYAN),(390,301,1,VIO2),(456,290,2,VIO),(565,293,1,CYAN),(625,283,2,VIO2)]:
        crystal(d,x,y,s,c)
    for _ in range(120):
        x=random.randrange(W); y=random.randrange(276,349)
        if random.random()<.65:
            d.rectangle((x,y,x+1,y+random.randrange(2,7)),fill=random.choice([LEAF1,LEAF2,LEAF3,(91,91,157,255)]))

    # menu-specific hero + Xethkioz silhouette
    if mode=='menu':
        draw_traveler(d,155,277,'male',0,scale=2)
        draw_xeth(d,205,291,scale=2)
        # warm rim light
        for r,a in [(21,38),(15,62),(9,105)]:
            d.ellipse((195-r,280-r,195+r,280+r),outline=(255,121,45,a),width=2)
    if mode=='creator':
        # keep the right side calmer for creator panels
        d.rectangle((348,0,640,360),fill=(7,10,23,75))

    # vignette frame
    for i in range(9):
        alpha=20+i*5
        d.rectangle((i,i,W-1-i,H-1-i),outline=(3,5,12,alpha))

    im.save(path)


def draw_traveler(d,x,y,gender='male',palette=0,scale=1):
    # x=center, y=feet. Original ~28x46 pixels.
    skin=[(229,179,138,255),(202,148,111,255),(165,115,87,255),(238,194,157,255)][palette%4]
    coat=[(52,40,65,255),(76,43,39,255),(28,66,66,255),(71,57,32,255)][palette%4]
    accent=[VIO2,ORANGE,CYAN,GOLD][palette%4]
    hair=(39,31,32,255)
    # cloak
    poly(d,[(x-12*scale,y-29*scale),(x,y-40*scale),(x+12*scale,y-29*scale),(x+15*scale,y-7*scale),(x+9*scale,y-2*scale),(x-13*scale,y-4*scale)],(42,32,56,255),INK,scale)
    # body
    d.rectangle((x-8*scale,y-26*scale,x+8*scale,y-7*scale),fill=coat)
    d.rectangle((x-8*scale,y-26*scale,x+8*scale,y-22*scale),fill=accent)
    # head
    d.rectangle((x-6*scale,y-39*scale,x+6*scale,y-27*scale),fill=skin)
    # hair / hood silhouette
    if gender=='female':
        d.rectangle((x-8*scale,y-43*scale,x+8*scale,y-36*scale),fill=hair)
        d.rectangle((x-9*scale,y-38*scale,x-5*scale,y-24*scale),fill=hair)
        d.rectangle((x+5*scale,y-38*scale,x+9*scale,y-24*scale),fill=hair)
    else:
        poly(d,[(x-8*scale,y-39*scale),(x-5*scale,y-46*scale),(x,y-42*scale),(x+4*scale,y-47*scale),(x+9*scale,y-39*scale),(x+6*scale,y-35*scale),(x-7*scale,y-35*scale)],hair,INK,scale)
    d.rectangle((x-1*scale,y-33*scale,x,y-32*scale),fill=INK)
    d.rectangle((x+4*scale,y-33*scale,x+5*scale,y-32*scale),fill=INK)
    # arms, legs, boots
    d.rectangle((x-12*scale,y-24*scale,x-8*scale,y-10*scale),fill=BLACK)
    d.rectangle((x+8*scale,y-24*scale,x+12*scale,y-10*scale),fill=BLACK)
    d.rectangle((x-7*scale,y-7*scale,x-2*scale,y),fill=(27,31,40,255))
    d.rectangle((x+2*scale,y-7*scale,x+7*scale,y),fill=(27,31,40,255))
    d.rectangle((x-8*scale,y-2*scale,x-1*scale,y+1*scale),fill=(22,18,21,255))
    d.rectangle((x+1*scale,y-2*scale,x+8*scale,y+1*scale),fill=(22,18,21,255))
    # prism
    crystal(d,x,y-17*scale,max(1,scale//2),CYAN)


def draw_xeth(d,x,y,scale=1):
    # fox-like original companion, orange flame guardian
    orange=(245,103,38,255); light=(255,181,68,255)
    poly(d,[(x-13*scale,y-8*scale),(x-8*scale,y-18*scale),(x-3*scale,y-10*scale),(x+5*scale,y-13*scale),(x+11*scale,y-5*scale),(x+8*scale,y)],orange,INK,scale)
    poly(d,[(x-10*scale,y-18*scale),(x-11*scale,y-29*scale),(x-4*scale,y-21*scale)],orange,INK,scale)
    poly(d,[(x+2*scale,y-15*scale),(x+7*scale,y-25*scale),(x+9*scale,y-13*scale)],orange,INK,scale)
    d.rectangle((x-6*scale,y-16*scale,x-4*scale,y-14*scale),fill=WHITE)
    d.point((x-5*scale,y-15*scale),fill=INK)
    # tail flame
    poly(d,[(x+7*scale,y-6*scale),(x+20*scale,y-14*scale),(x+15*scale,y-25*scale),(x+27*scale,y-17*scale),(x+22*scale,y-4*scale)],light,INK,scale)


def sprite_traveler(name,gender,palette=0):
    im=Image.new('RGBA',(48,64),(0,0,0,0)); d=ImageDraw.Draw(im)
    draw_traveler(d,24,59,gender,palette,1)
    im.save(OUT95/name)


def family_sprite(name, role, age_group, primary, secondary, hood=False):
    im=Image.new('RGBA',(48,64),(0,0,0,0)); d=ImageDraw.Draw(im)
    x=24; feet=59
    scale=1
    h={'adult':47,'teen':42,'young':35}[age_group]
    head_y=feet-h+5
    if hood:
        poly(d,[(8,feet-10),(12,head_y-8),(24,head_y-15),(36,head_y-8),(41,feet-10)],(21,23,30,255),INK)
        d.rectangle((19,head_y-4,29,head_y+8),fill=SKIN)
    else:
        d.rectangle((18,head_y,30,head_y+12),fill=SKIN)
        hair=PINK if name=='Ashley' else (45,34,31,255)
        d.rectangle((16,head_y-5,32,head_y+2),fill=hair)
        if name in ('Ashley','Isabella'):
            d.rectangle((15,head_y,18,head_y+16),fill=hair); d.rectangle((30,head_y,33,head_y+16),fill=hair)
    body_top=head_y+12
    d.rectangle((15,body_top,33,feet-10),fill=primary)
    d.rectangle((14,body_top+5,34,body_top+8),fill=secondary)
    d.rectangle((16,feet-10,21,feet),fill=BLACK); d.rectangle((27,feet-10,32,feet),fill=BLACK)
    # role prop
    if role=='bard':
        d.ellipse((28,body_top+6,43,body_top+21),fill=(145,79,46,255),outline=INK); d.line((37,body_top+7,45,body_top-4),fill=(94,59,40,255),width=2)
    elif role=='warrior':
        d.rectangle((34,body_top-2,40,feet-7),fill=STONE2); d.line((36,body_top-8,42,body_top+3),fill=WHITE,width=2)
    elif role=='archer':
        d.arc((3,body_top-7,18,feet-4),270,90,fill=(155,101,54,255),width=2); d.line((11,body_top-5,11,feet-7),fill=(222,202,157,255),width=1)
    elif role=='chaos':
        crystal(d,38,body_top+3,1,VIO2); crystal(d,9,body_top+11,1,VIO)
    elif role=='guide':
        d.rectangle((35,body_top+7,43,body_top+22),fill=(87,61,42,255)); d.rectangle((37,body_top+9,41,body_top+19),fill=GOLD)
    elif role=='sage':
        d.line((37,body_top-6,40,feet-4),fill=(101,78,50,255),width=2); d.ellipse((36,body_top-11,42,body_top-5),fill=(92,201,123,255))
    im.save(OUT95/(name.lower()+'.png'))


# Rich 640x360 art replaces the old 320x180 temporary scenery.
make_world_bg(OUT08/'izrdalar_bg.png','game')
make_world_bg(OUT08/'menu_bg.png','menu')
make_world_bg(OUT08/'creator_bg.png','creator')

sprite_traveler('traveler_male.png','male',0)
sprite_traveler('traveler_female.png','female',0)

family_sprite('Alexis','guide','adult',(24,27,34,255),(92,54,144,255),hood=True)
family_sprite('Ashley','bard','teen',(132,55,147,255),(232,91,168,255))
family_sprite('Fermin','warrior','teen',(83,94,109,255),(177,51,52,255))
family_sprite('Isabella','chaos','young',(92,43,133,255),VIO2)
family_sprite('Gael','archer','young',(53,111,70,255),(180,133,67,255))
family_sprite('Elida','sage','adult',(210,190,156,255),(84,150,103,255))

print('v0.9.5 golden assets generated')
