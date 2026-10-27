"""
Generates valid PNG icons for SAVI browser extension without external dependencies.
Uses Python standard library zlib and struct to encode RGBA PNG files.
"""

import os
import zlib
import struct


def make_png(width: int, height: int, rgba_bytes: bytes) -> bytes:
    def chunk(tag: bytes, data: bytes) -> bytes:
        crc = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)

    header = b"\x89PNG\r\n\x1a\n"
    ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))

    # Add filter byte (0x00 = None) at the beginning of each scanline
    scanlines = bytearray()
    row_bytes = width * 4
    for y in range(height):
        scanlines.append(0)
        scanlines.extend(rgba_bytes[y * row_bytes : (y + 1) * row_bytes])

    compressed = zlib.compress(bytes(scanlines))
    idat = chunk(b"IDAT", compressed)
    iend = chunk(b"IEND", b"")
    return header + ihdr + idat + iend


def create_savi_icon(size: int) -> bytes:
    raw = bytearray()
    center = size / 2.0
    radius = size * 0.44

    for y in range(size):
        for x in range(size):
            dx = x - center
            dy = y - center
            dist = (dx * dx + dy * dy) ** 0.5

            if dist <= radius:
                # Dark cyan/navy intelligence gradient with cyan core
                factor = dist / radius
                r = int(10 + (1 - factor) * 30)
                g = int(245 * (1 - factor * 0.4))
                b = int(255)
                # Outer ring accent
                if dist >= radius - 2:
                    r, g, b = 0, 245, 255
                a = 255
            else:
                r, g, b, a = 0, 0, 0, 0
            raw.extend([r, g, b, a])

    return make_png(size, size, bytes(raw))


def main():
    icons_dir = os.path.join(os.path.dirname(__file__), "..", "extension", "icons")
    os.makedirs(icons_dir, exist_ok=True)

    for sz in [16, 48, 128]:
        png_data = create_savi_icon(sz)
        out_path = os.path.join(icons_dir, f"icon{sz}.png")
        with open(out_path, "wb") as f:
            f.write(png_data)
        print(f"Generated {out_path} ({len(png_data)} bytes)")


if __name__ == "__main__":
    main()
