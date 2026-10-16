from enum import Enum, auto

class TokenType(Enum):

    SELECT = auto(); FROM = auto(); WHERE = auto(); INSERT = auto(); INTO = auto()
    VALUES = auto(); UPDATE = auto(); SET = auto(); DELETE = auto(); CREATE = auto()
    TABLE = auto(); DROP = auto(); ALTER = auto(); ADD = auto(); COLUMN = auto()
    AND = auto(); OR = auto(); NOT = auto(); NULL = auto(); IS = auto(); IN = auto()
    LIKE = auto(); BETWEEN = auto(); JOIN = auto(); INNER = auto(); LEFT = auto()
    RIGHT = auto(); OUTER = auto(); ON = auto(); AS = auto(); GROUP = auto()
    BY = auto(); HAVING = auto(); ORDER = auto(); ASC = auto(); DESC = auto()
    LIMIT = auto(); DISTINCT = auto(); COUNT = auto(); SUM = auto(); AVG = auto()
    MAX = auto(); MIN = auto()
    

    AUTO_INCREMENT = auto(); ENGINE = auto(); CHARSET = auto(); COLLATE = auto()
    UNSIGNED = auto(); ZEROFILL = auto(); BINARY = auto(); VARBINARY = auto()
    ENUM = auto(); FULLTEXT = auto(); SPATIAL = auto(); PARTITION = auto()


    IDENTIFIER = auto(); STRING = auto(); NUMBER = auto(); BACKTICK_IDENTIFIER = auto()
    

    # ASTERISK = auto(); COMMA = auto(); SEMICOLON = auto(); LPAREN = auto()
    # RPAREN = auto(); EQUALS = auto(); GREATER = auto(); LESS = auto()
    # BANG = auto(); NOT_EQUALS = auto()
    
    ASTERISK = auto(); COMMA = auto(); SEMICOLON = auto(); LPAREN = auto()
    RPAREN = auto(); EQUALS = auto(); GREATER = auto(); LESS = auto()
    BANG = auto(); NOT_EQUALS = auto(); DOT = auto()

    EOF = auto(); UNKNOWN = auto()