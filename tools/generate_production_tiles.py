from pathlib import Path
from PIL import Image, ImageDraw
import random

OUT = Path("assets/v08/generated")
OUT.mkdir(parents=True, exist_ok=True)
random.seed(2150)

INK=(16,24,29,255); SOIL=(42,66,59,255); SOIL2=(51,78,66,255); STONE=(52,72,70,255)
STONE2=(72,94,84,255); MOSS=(53,139,83,255); MOSS2=(91,184,104,255); ROOT=(86,59,46,255)
VIO=(145,82,220,255); CYAN=(63,184,198,255)

# 32x32 ground fill: dark organic soil + embedded stone/root details.
g=Image.new("RGBA",(32,32),SOIL); d=ImageDraw.Draw(g)
for y in range(0,32,8):
    d.line((0,y,31,y),fill=(35,56,52,255))
for _ in range(26):
    x=random.randrange(1,30); y=random.randrange(3,30)
    if random.random()<0.55:
        d.rectangle((x,y,min(31,x+random.randrange(2,6)),min(31,y+random.randrange(1,3))),fill=random.choice([SOIL2,STONE,STONE2]))
for _ in range(5):
    x=random.randrange(2,29); y=random.randrange(7,28)
    d.line((x,y,min(31,x+random.randrange(4,9)),min(31,y+random.randrange(2,7))),fill=ROOT,width=1)
# rare prism flecks
for x,y,c in [(7,13,VIO),(24,24,CYAN)]: d.rectangle((x,y,x+1,y+2),fill=c)
g.save(OUT/"ground_tile.png")

# 32x16 platform/top lip: grass/moss readable from a distance, stone below.
p=Image.new("RGBA",(32,16),(0,0,0,0)); d=ImageDraw.Draw(p)
d.rectangle((0,5,31,15),fill=STONE)
d.rectangle((0,7,31,15),fill=(44,65,62,255))
d.rectangle((0,3,31,7),fill=MOSS)
d.rectangle((0,1,31,4),fill=MOSS2)
# irregular grass silhouette
for x in range(0,32,3):
    h=random.choice([1,2,2,3,4])
    d.line((x,3,x+1,max(0,3-h)),fill=random.choice([MOSS,MOSS2]),width=1)
# rock cracks/roots
for x in (5,14,25): d.line((x,8,x+3,13),fill=INK,width=1)
d.line((9,6,13,11),fill=ROOT,width=1)
p.save(OUT/"platform_tile.png")

print("Production Izrdralar terrain tiles generated")
