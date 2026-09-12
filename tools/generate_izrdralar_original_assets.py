from pathlib import Path
from PIL import Image, ImageDraw
import math

ROOT = Path("assets/izrdralar_original/generated")
FX = ROOT / "fx"
LIGHT = ROOT / "lighting"
UI = ROOT / "ui"
ITEMS = ROOT / "items"

INK = (10, 10, 15, 255)
WETLAND = (41, 73, 61, 255)
VIOLET = (139, 92, 246, 255)
VIOLET_HI = (196, 181, 253, 255)
AMBER = (255, 140, 66, 255)
WHITE = (240, 240, 245, 255)
CYAN = (90, 210, 220, 255)
MOSS = (104, 184, 112, 255)
TRANSPARENT = (0, 0, 0, 0)


def ensure_dirs():
    for directory in (FX, LIGHT, UI, ITEMS):
        directory.mkdir(parents=True, exist_ok=True)


def radial_mask(size, inner, outer):
    image = Image.new("L", (size, size), 0)
    pixels = image.load()
    center = (size - 1) / 2.0
    radius = max(1.0, size / 2.0)
    for y in range(size):
        for x in range(size):
            distance = math.hypot(x - center, y - center) / radius
            if distance <= inner:
                value = 255
            elif distance >= outer:
                value = 0
            else:
                value = int(255 * (outer - distance) / (outer - inner))
            pixels[x, y] = max(0, min(255, value))
    return image


def save_lighting():
    for name, size, inner, outer in (
        ("soft_prism_64.png", 64, 0.18, 1.0),
        ("warm_refuge_64.png", 64, 0.12, 1.0),
        ("forest_moon_128.png", 128, 0.08, 1.0),
    ):
        mask = radial_mask(size, inner, outer)
        color = AMBER if "refuge" in name else (VIOLET if "prism" in name else CYAN)
        image = Image.new("RGBA", (size, size), color)
        image.putalpha(mask)
        image.save(LIGHT / name)


def save_fx():
    image = Image.new("RGBA", (128, 64), TRANSPARENT)
    draw = ImageDraw.Draw(image)
    for index, color in enumerate((VIOLET, WHITE, AMBER, CYAN)):
        cx = 16 + index * 32
        cy = 32
        draw.ellipse((cx - 5, cy - 5, cx + 5, cy + 5), fill=color)
        for ray in range(8):
            angle = math.tau * ray / 8.0
            start = (cx + int(math.cos(angle) * 7), cy + int(math.sin(angle) * 7))
            end = (cx + int(math.cos(angle) * (11 + index * 2)), cy + int(math.sin(angle) * (11 + index * 2)))
            draw.line((start, end), fill=color, width=1)
        if index == 1:
            draw.arc((cx - 13, cy - 13, cx + 13, cy + 13), 205, 335, fill=VIOLET_HI, width=2)
        if index == 3:
            draw.arc((cx - 13, cy - 13, cx + 13, cy + 13), 0, 360, fill=color, width=2)
    image.save(FX / "feedback_strip_16x16.png")

    telegraph = Image.new("RGBA", (64, 64), TRANSPARENT)
    draw = ImageDraw.Draw(telegraph)
    draw.ellipse((8, 8, 55, 55), outline=AMBER, width=2)
    draw.ellipse((16, 16, 47, 47), outline=VIOLET_HI, width=1)
    for ray in range(8):
        angle = math.tau * ray / 8.0
        draw.line((31 + int(math.cos(angle) * 23), 31 + int(math.sin(angle) * 23), 31 + int(math.cos(angle) * 30), 31 + int(math.sin(angle) * 30)), fill=AMBER, width=2)
    telegraph.save(FX / "boss_telegraph_prism.png")

    aura = Image.new("RGBA", (64, 64), TRANSPARENT)
    aura_color = Image.new("RGBA", (64, 64), VIOLET)
    aura_color.putalpha(radial_mask(64, 0.22, 0.96).point(lambda value: int(value * 0.32)))
    aura.alpha_composite(aura_color)
    ImageDraw.Draw(aura).ellipse((18, 18, 45, 45), outline=VIOLET_HI, width=2)
    aura.save(FX / "xethkioz_resonance_aura.png")


def save_ui():
    panel = Image.new("RGBA", (96, 32), INK)
    draw = ImageDraw.Draw(panel)
    draw.rectangle((1, 1, 94, 30), outline=VIOLET, width=1)
    draw.line((4, 5, 91, 5), fill=VIOLET_HI, width=1)
    draw.rectangle((6, 11, 90, 25), fill=(20, 35, 34, 255))
    draw.rectangle((8, 14, 48, 16), fill=MOSS)
    draw.rectangle((8, 19, 34, 21), fill=AMBER)
    panel.save(UI / "hud_panel_96x32.png")


def save_items():
    sheet = Image.new("RGBA", (128, 16), TRANSPARENT)
    draw = ImageDraw.Draw(sheet)
    for index, color in enumerate((VIOLET, AMBER, CYAN, MOSS, WHITE, WETLAND, (180, 80, 120, 255), (120, 92, 210, 255))):
        x = index * 16
        draw.rectangle((x + 5, 3, x + 10, 12), fill=color)
        draw.point((x + 4, 8), fill=WHITE)
        draw.point((x + 11, 8), fill=WHITE)
        draw.point((x + 8, 2), fill=VIOLET_HI)
        draw.point((x + 8, 13), fill=INK)
    sheet.save(ITEMS / "item_glyphs_16x16.png")


if __name__ == "__main__":
    ensure_dirs()
    save_lighting()
    save_fx()
    save_ui()
    save_items()
    print("Original Izrdralar visual base generated.")
