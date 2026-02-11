from .base import BaseDialect
from ..tokens import TokenType

class MySQLDialect(BaseDialect):
    """MySQL specific extensions including backticks and unique keywords."""
    def __init__(self):
        super().__init__()
        self.MYSQL_KEYWORDS = {
            'AUTO_INCREMENT': TokenType.AUTO_INCREMENT, 'ENGINE': TokenType.ENGINE,
            'CHARSET': TokenType.CHARSET, 'COLLATE': TokenType.COLLATE,
            'UNSIGNED': TokenType.UNSIGNED, 'ZEROFILL': TokenType.ZEROFILL,
            'BINARY': TokenType.BINARY, 'VARBINARY': TokenType.VARBINARY,
            'ENUM': TokenType.ENUM, 'FULLTEXT': TokenType.FULLTEXT,
            'SPATIAL': TokenType.SPATIAL, 'PARTITION': TokenType.PARTITION
        }

    def get_keywords(self):
        return {**self.KEYWORDS, **self.MYSQL_KEYWORDS}

    def supports_backticks(self):
        return True