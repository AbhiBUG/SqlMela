from core.dialects.base import BaseDialect
from core.dialects.mysql import MySQLDialect
from core.lexer import Lexer
from core.parser import Parser

DIALECTS = {
    'ansi': BaseDialect,
    'mysql': MySQLDialect
}

def validate_sql(query, dialect="ansi"):
    if not query.strip():
        return {"valid": False, "errors": ["Empty query"], "warnings": []}

    dialect_obj = DIALECTS.get(dialect, BaseDialect)()
    lexer = Lexer(query, dialect_obj)
    tokens = lexer.tokenize()
    
    parser = Parser(tokens)
    is_valid = parser.parse()
    
    return {
        "valid": is_valid and len(parser.errors) == 0,
        "errors": parser.errors,
        "warnings": [],
        "statement_type": tokens[0]['type'].name if tokens else "UNKNOWN",
        "dialect": "MySQL" if dialect == "mysql" else "ANSI SQL"
    }