from pathlib import Path

import qrcode


def generate_store_qr(store_uuid: str, domain_url: str) -> str:
    output_dir = Path("backend/app/static/qr")
    output_dir.mkdir(parents=True, exist_ok=True)
    url = f"{domain_url}/customer/{store_uuid}"
    image = qrcode.make(url)
    path = output_dir / f"{store_uuid}.png"
    image.save(path)
    return str(path)
