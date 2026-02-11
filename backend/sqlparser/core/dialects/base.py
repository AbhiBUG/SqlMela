from ..tokens import TokenType

class BaseDialect:
    """Base ANSI SQL definitions."""
    KEYWORDS = {
        'SELECT': TokenType.SELECT, 'FROM': TokenType.FROM, 'WHERE': TokenType.WHERE,
        'INSERT': TokenType.INSERT, 'INTO': TokenType.INTO, 'VALUES': TokenType.VALUES,
        'UPDATE': TokenType.UPDATE, 'SET': TokenType.SET, 'DELETE': TokenType.DELETE,
        'CREATE': TokenType.CREATE, 'TABLE': TokenType.TABLE, 'DROP': TokenType.DROP,
        'ALTER': TokenType.ALTER, 'ADD': TokenType.ADD, 'COLUMN': TokenType.COLUMN,
        'AND': TokenType.AND, 'OR': TokenType.OR, 'NOT': TokenType.NOT, 
        'NULL': TokenType.NULL, 'IS': TokenType.IS, 'IN': TokenType.IN,
        'LIKE': TokenType.LIKE, 'BETWEEN': TokenType.BETWEEN, 'JOIN': TokenType.JOIN,
        'INNER': TokenType.INNER, 'LEFT': TokenType.LEFT, 'RIGHT': TokenType.RIGHT,
        'OUTER': TokenType.OUTER, 'ON': TokenType.ON, 'AS': TokenType.AS,
        'GROUP': TokenType.GROUP, 'BY': TokenType.BY, 'HAVING': TokenType.HAVING,
        'ORDER': TokenType.ORDER, 'ASC': TokenType.ASC, 'DESC': TokenType.DESC,
        'LIMIT': TokenType.LIMIT, 'DISTINCT': TokenType.DISTINCT,
        'AVG': TokenType.AVG, 'MAX': TokenType.MAX,
        'COUNT': TokenType.COUNT, 'SUM': TokenType.SUM,
        'MIN': TokenType.MIN, 'DISTINCT': TokenType.DISTINCT
    }

    def get_keywords(self):
        return self.KEYWORDS

    def supports_backticks(self):
        return False