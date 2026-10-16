import argparse
import os
from core.validator import validate_sql
from core.utils import save_json, save_sql, save_txt, format_text

def split_statements(sql):
    statements = []
    current_stmt = []
    in_single_quote = False
    in_double_quote = False
    in_backtick = False
    i = 0
    while i < len(sql):
        char = sql[i]
        
        if char == "'" and not in_double_quote and not in_backtick:
            if i + 1 < len(sql) and sql[i+1] == "'":
                current_stmt.append("''")
                i += 2
                continue
            in_single_quote = not in_single_quote
        elif char == '"' and not in_single_quote and not in_backtick:
            if i + 1 < len(sql) and sql[i+1] == '"':
                current_stmt.append('""')
                i += 2
                continue
            in_double_quote = not in_double_quote
        elif char == '`' and not in_single_quote and not in_double_quote:
            in_backtick = not in_backtick
        elif char == ';' and not in_single_quote and not in_double_quote and not in_backtick:
            stmt = "".join(current_stmt).strip()
            if stmt:
                statements.append(stmt)
            current_stmt = []
            i += 1
            continue
        
        current_stmt.append(char)
        i += 1
        
    stmt = "".join(current_stmt).strip()
    if stmt:
        statements.append(stmt)
    return statements

def main():
    parser = argparse.ArgumentParser(description="SQL Validator CLI")
    parser.add_argument("--query", help="SQL query string")
    parser.add_argument("--file", nargs='+', help="SQL file input(s)")
    parser.add_argument("--folder", help="Directory containing SQL files")
    parser.add_argument("--dialect", default="ansi", help="SQL dialect (ansi, mysql, etc.)")
    parser.add_argument("--output", help="Output file path (.txt, .sql, .json)")
    args = parser.parse_args()

    sources = []
    if args.query:
        sources.append(("Query Argument", args.query))
        #print(args.query)
    
    if args.file:
        for fpath in args.file:
            if os.path.exists(fpath):
                with open(fpath, "r") as f:
                    sources.append((fpath, f.read()))
            else:
                print(f"File not found: {fpath}")

    if args.folder:
        if os.path.isdir(args.folder):
            for root, _, files in os.walk(args.folder):
                for file in files:
                    if file.lower().endswith(".sql"):
                        fpath = os.path.join(root, file)
                        try:
                            with open(fpath, "r") as f:
                                sources.append((fpath, f.read()))
                        except Exception as e:
                            print(f"Error reading file {fpath}: {e}")
        else:
            print(f"Directory not found: {args.folder}")

    if not sources:
        print("Provide --query or --file")
        print("Provide --query, --file, or --folder")
        return
    print(sources)
    full_report = []
    results = []
    print("\n--- VALIDATION RESULT ---")

    for source_name, sql_content in sources:
        statements = split_statements(sql_content)
        for idx, stmt in enumerate(statements):
            print(stmt)
            result = validate_sql(stmt, dialect=args.dialect)
            output_text = format_text(result)
            
            header = f"\nSource: {source_name} (Statement {idx + 1})"
            print(header)
            print(stmt)
            print(output_text)
            
            full_report.append(header)
            full_report.append(stmt)
            full_report.append(output_text)
            results.append({
                "source": source_name,
                "statement": stmt,
                "result": result
            })

    if args.output:
        ext = os.path.splitext(args.output)[1].lower()
        if ext == ".json":
            save_json(results, args.output)
        elif ext == ".sql":
            save_sql(results, args.output)
        elif ext == ".txt":
            save_txt(results, args.output)
    else:
        print(f"Output Not Saved")

if __name__ == "__main__":
    main()
