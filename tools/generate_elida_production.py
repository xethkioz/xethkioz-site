from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path("assets/production/generated")
OUT.mkdir(parents=True, exist_ok=True)

TRANSPARENT = (0,0,0,0)
INK = (18,18,27,255)
SKIN = (216,171,139,255)
SKIN_SHADOW = (176,128,106,255)
WHITE_HAIR = (222,225,217,255)
HAIR_SHADOW = (150,157,157,255)
CREAM = (232,219,180,255)
GREEN = (69,111,77,255)
GREEN_DARK = (42,73,55,255)
BROWN = (96,61,45,255)
BROWN_DARK = (56,38,35,255)
AMBER = (232,151,61,255)
VIOLET = (142,83,204,255)
CYAN = (78,202,208,255)
GLASS = (177,217,210,255)


def rect(d, xy, fill):
    d.rectangle(tuple(int(v) for v in xy), fill=fill)


def elida_sprite():
    """48x64 production sprite: elderly apothecary/alchemist, readable at gameplay scale."""
    im = Image.new("RGBA", (48,64), TRANSPARENT)
    d = ImageDraw.Draw(im)

    # shadow / feet
    d.ellipse((12,57,37,62), fill=(10,12,18,95))
    rect(d,(15,51,22,58),BROWN_DARK); rect(d,(27,51,34,58),BROWN_DARK)

    # long skirt and apron
    d.polygon([(14,34),(34,34),(38,55),(10,55)], fill=GREEN_DARK)
    d.polygon([(17,34),(31,34),(33,53),(15,53)], fill=CREAM)
    rect(d,(22,34,25,53),(209,195,157,255))

    # torso / shawl
    rect(d,(15,24,33,37),GREEN)
    d.polygon([(13,25),(24,20),(35,25),(31,33),(17,33)], fill=CREAM)
    rect(d,(12,27,16,42),SKIN_SHADOW); rect(d,(32,27,36,42),SKIN_SHADOW)

    # satchel + herb/vial belt
    rect(d,(34,35,41,47),BROWN)
    rect(d,(35,36,40,39),AMBER)
    rect(d,(18,34,21,40),VIOLET); rect(d,(22,34,25,40),CYAN); rect(d,(26,34,29,40),AMBER)
    rect(d,(18,33,29,35),BROWN_DARK)

    # head
    rect(d,(17,11,31,25),SKIN)
    rect(d,(16,14,18,22),SKIN_SHADOW); rect(d,(30,14,32,22),SKIN_SHADOW)
    # nose + age lines
    rect(d,(23,17,25,19),SKIN_SHADOW)
    rect(d,(19,20,21,20),SKIN_SHADOW); rect(d,(27,20,29,20),SKIN_SHADOW)
    rect(d,(20,22,28,22),(134,88,79,255))
    # eyes
    rect(d,(19,16,20,17),INK); rect(d,(28,16,29,17),INK)

    # white hair, bun and small apothecary scarf
    rect(d,(15,8,33,14),WHITE_HAIR)
    rect(d,(14,12,18,23),WHITE_HAIR); rect(d,(30,12,34,23),WHITE_HAIR)
    rect(d,(17,7,31,10),HAIR_SHADOW)
    d.ellipse((28,4,38,13), fill=WHITE_HAIR, outline=INK)
    d.polygon([(15,10),(24,5),(33,10),(30,13),(18,13)], fill=CREAM)
    rect(d,(22,7,26,9),GREEN)

    # small cane / stirring staff
    rect(d,(8,31,10,57),BROWN)
    rect(d,(8,30,14,32),BROWN)

    # herb sprig
    rect(d,(38,26,39,36),GREEN_DARK)
    rect(d,(36,27,38,29),GREEN); rect(d,(39,30,42,32),GREEN); rect(d,(35,33,38,35),GREEN)

    im.save(OUT / "elida_apothecary.png")


def elida_portrait():
    """128x128 dialogue/refuge portrait with unmistakably elderly features."""
    im = Image.new("RGBA", (128,128), (8,10,17,255))
    d = ImageDraw.Draw(im)

    # subtle alchemy background
    d.ellipse((5,5,123,123), fill=(24,34,30,255), outline=(91,133,93,255), width=3)
    for x,c in [(16,VIOLET),(28,CYAN),(100,AMBER),(111,VIOLET)]:
        rect(d,(x,90,x+8,112),GLASS)
        rect(d,(x+1,98,x+7,111),c)
        rect(d,(x+2,86,x+6,91),CREAM)

    # shoulders / shawl
    d.polygon([(18,126),(26,84),(64,74),(102,84),(112,126)], fill=GREEN_DARK)
    d.polygon([(28,91),(64,77),(99,91),(85,111),(43,111)], fill=CREAM)
    rect(d,(55,97,73,107),BROWN)
    rect(d,(58,99,62,105),VIOLET); rect(d,(64,99,68,105),CYAN); rect(d,(70,99,74,105),AMBER)

    # neck + face
    rect(d,(55,69,73,84),SKIN_SHADOW)
    d.ellipse((37,27,91,82), fill=SKIN, outline=INK, width=2)
    # cheeks and nose
    d.polygon([(62,47),(58,62),(66,63)], fill=SKIN_SHADOW)
    # eyes
    rect(d,(48,49,54,52),INK); rect(d,(74,49,80,52),INK)
    rect(d,(50,50,52,51),(229,233,213,255)); rect(d,(76,50,78,51),(229,233,213,255))
    # eyebrows white/gray
    rect(d,(46,44,55,46),HAIR_SHADOW); rect(d,(72,44,81,46),HAIR_SHADOW)
    # wrinkles: forehead, eyes, mouth
    for y in (37,40): rect(d,(53,y,75,y),SKIN_SHADOW)
    rect(d,(43,54,48,55),SKIN_SHADOW); rect(d,(80,54,85,55),SKIN_SHADOW)
    rect(d,(45,58,49,59),SKIN_SHADOW); rect(d,(79,58,83,59),SKIN_SHADOW)
    rect(d,(51,70,77,71),(130,82,75,255))
    rect(d,(55,74,73,75),SKIN_SHADOW)

    # gray/white hair framing face
    d.pieslice((25,14,103,78),180,360,fill=WHITE_HAIR,outline=INK)
    d.ellipse((75,6,105,34), fill=WHITE_HAIR, outline=INK)
    d.ellipse((82,9,100,26), fill=HAIR_SHADOW)
    rect(d,(31,34,40,71),WHITE_HAIR); rect(d,(88,34,97,71),WHITE_HAIR)
    # head scarf / botanical pin
    d.polygon([(34,29),(63,17),(94,29),(88,35),(41,35)], fill=CREAM)
    rect(d,(59,20,68,27),GREEN)
    d.ellipse((63,18,68,23),fill=AMBER)

    # tiny spectacles to reinforce apothecary silhouette
    d.ellipse((43,47,58,59), outline=(101,78,57,255), width=2)
    d.ellipse((70,47,85,59), outline=(101,78,57,255), width=2)
    rect(d,(58,52,70,53),(101,78,57,255))

    im.save(OUT / "elida_apothecary_portrait.png")


if __name__ == "__main__":
    elida_sprite()
    elida_portrait()
    print("Elida production assets generated: elderly apothecary/alchemist")
