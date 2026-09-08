#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "third_party" / "tuxemon_public_domain"
OUT.mkdir(parents=True, exist_ok=True)

ASSETS = {
    "superpowers_tilesheet.png": "https://raw.githubusercontent.com/Tuxemon/Tuxemon/development/mods/tuxemon/gfx/tilesets/Superpowers_Tilesheet.png",
    "pacheesi_tiles.png": "https://raw.githubusercontent.com/Tuxemon/Tuxemon/development/mods/tuxemon/gfx/tilesets/Pacheesi%20Tiles.png",
    "cave_tiles_armm1998.png": "https://raw.githubusercontent.com/Tuxemon/Tuxemon/development/mods/tuxemon/gfx/tilesets/Cave_Tiles_by_ArMM1998_(Tuxemon_Style).png",
}

PNG_MAGIC = b"\x89PNG\r\n\x1a\n"


def download(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": "world-of-xethkioz-production-importer/1.0"})
    with urlopen(request, timeout=45) as response:
        data = response.read()
    if not data.startswith(PNG_MAGIC):
        raise RuntimeError(f"Expected PNG from {url}, received {len(data)} bytes")
    if len(data) < 512:
        raise RuntimeError(f"Asset from {url} is unexpectedly small")
    return data


def main() -> None:
    for filename, url in ASSETS.items():
        destination = OUT / filename
        data = download(url)
        destination.write_bytes(data)
        print(f"imported {filename}: {len(data)} bytes")


if __name__ == "__main__":
    main()
