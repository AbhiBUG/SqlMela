import json
import os
from datetime import datetime

OUTPUT_DIR = "output"

def format_text(result):
    lines = []
    lines.append(f"-- DIALECT: {result.get('dialect', 'Unknown')}")
    lines.append(f"-- STATEMENT TYPE: {result.get('statement_type', 'Unknown')}")
    lines.append(f"-- VALID: {result['valid']}")
    if result["errors"]:
        lines.append(f"\n-- ERRORS:")
        for e in result["errors"]:
            lines.append(f"--  - {e}")
    if result["warnings"]:
        lines.append(f"\n-- WARNINGS:")
        for w in result["warnings"]:
            lines.append(f"--  - {w}")
    return "\n".join(lines)

def save_json(results, filepath):
    output_data = []
    for res in results:
        item = {
            "source": res["source"],
            "statement": res["statement"],
            "valid": res["result"]["valid"],
            "errors": res["result"]["errors"],
            "warnings": res["result"]["warnings"],
            "dialect": res["result"].get("dialect"),
            "statement_type": res["result"].get("statement_type")
        }
        output_data.append(item)
    with open(filepath, "w") as f:
        json.dump(output_data, f, indent=2)
    print(f"\nOutput saved to: {filepath}")

def save_sql(results, filepath):
    with open(filepath, "w") as f:
        for res in results:
            f.write(f"-- Source: {res['source']}\n")
            f.write(format_text(res["result"]))
            f.write(f"\n{res['statement']};\n\n")
    print(f"\nOutput saved to: {filepath}")

def save_txt(results, filepath):
    with open(filepath, "w") as f:
        for res in results:
            f.write(f"Source: {res['source']}\n")
            f.write(f"{res['statement']}\n")
            f.write(format_text(res["result"]))
            f.write("\n" + "-"*30 + "\n")
    print(f"\nOutput saved to: {filepath}")
