import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
import json
from pathlib import Path

WXR_FILE = "docs/migration/export-all.xml"

NS = {
    "wp": "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
}

def main():
    tree = ET.parse(WXR_FILE)
    root = tree.getroot()

    post_types = defaultdict(lambda: {
        "count": 0,
        "meta_keys": Counter(),
        "taxonomies": Counter(),
        "statuses": Counter(),
    })

    channel = root.find("channel")
    for item in channel.findall("item"):
        wp = item.find("wp:post_type", NS)
        status_el = item.find("wp:status", NS)
        if wp is None:
            continue

        post_type = wp.text or ""
        status = (status_el.text or "") if status_el is not None else ""

        data = post_types[post_type]
        data["count"] += 1
        data["statuses"][status] += 1

        # meta keys
        for meta in item.findall("wp:postmeta", NS):
            key_el = meta.find("wp:meta_key", NS)
            if key_el is not None and key_el.text:
                data["meta_keys"][key_el.text] += 1

        # taxonomies
        for cat in item.findall("category"):
            tax = cat.get("domain")
            if tax:
                data["taxonomies"][tax] += 1

    # Готовим компактный JSON
    summary = {}
    for pt, data in post_types.items():
        summary[pt] = {
            "count": data["count"],
            "statuses": data["statuses"],
            "meta_keys": data["meta_keys"].most_common(),
            "taxonomies": data["taxonomies"].most_common(),
        }

    out_path = Path("wxr-summary.json")
    out_path.write_text(
        json.dumps(summary, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"written {out_path}")


if __name__ == "__main__":
    main()
