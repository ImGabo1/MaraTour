"""Genera los PNG de la PWA a partir del diseño de icons/icon.svg.

Uso (desde la raíz del repo):  python3 frontend/scripts/generate-icons.py
Requiere: pip install playwright && playwright install chromium
Si cambias el logo, edita este archivo y public/icons/icon.svg y vuelve a ejecutarlo.
"""
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent.parent / "public" / "icons"

GRADIENT = (
    '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
    '<stop offset="0" stop-color="#17909F"/><stop offset="1" stop-color="#0B4F5A"/>'
    "</linearGradient></defs>"
)


def art(scale: float) -> str:
    """Sol y olas, escalados hacia el centro (para la zona segura del icono maskable)."""
    return (
        f'<g transform="translate(256 256) scale({scale}) translate(-256 -256)">'
        '<circle cx="256" cy="212" r="64" fill="#F2A33A"/>'
        '<g fill="none" stroke="#FBF4E8" stroke-width="22" stroke-linecap="round">'
        '<path d="M132 304c31-38 62 38 124 0s93 38 124 0"/>'
        '<path d="M132 364c31-38 62 38 124 0s93 38 124 0"/>'
        "</g></g>"
    )


def svg(radius: int, scale: float) -> str:
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">'
        f'{GRADIENT}<rect width="512" height="512" rx="{radius}" fill="url(#bg)"/>{art(scale)}</svg>'
    )


VARIANTS = {
    "icon-192.png": (192, svg(104, 1.0), True),
    "icon-512.png": (512, svg(104, 1.0), True),
    # Maskable y Apple: sin esquinas redondeadas ni transparencia; contenido en la zona segura
    "icon-maskable-512.png": (512, svg(0, 0.78), False),
    "apple-touch-icon.png": (180, svg(0, 0.86), False),
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, (size, markup, transparent) in VARIANTS.items():
            page = browser.new_page(viewport={"width": size, "height": size})
            page.set_content(
                f"<style>html,body{{margin:0;background:transparent}}svg{{display:block;width:{size}px;height:{size}px}}</style>{markup}"
            )
            page.screenshot(path=str(OUT / name), omit_background=transparent)
            page.close()
            print("✔", name)
        browser.close()


if __name__ == "__main__":
    main()
