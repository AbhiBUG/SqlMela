from core.tokens import TokenType

class Lexer:
    def __init__(self, text, dialect):
        self.text = text
        self.pos = 0
        self.dialect = dialect
        self.tokens = []
        self.keywords = self.dialect.get_keywords()

    def tokenize(self):
        while self.pos < len(self.text):
            char = self.text[self.pos]
            if char.isspace():
                self.pos += 1
                continue
            if char == '-' and self.peek_char() == '-':
                while self.pos < len(self.text) and self.text[self.pos] != '\n':
                    self.pos += 1
                continue

            if char == '(': self.add_token(TokenType.LPAREN, '(')
            elif char == ')': self.add_token(TokenType.RPAREN, ')')
            elif char == '*': self.add_token(TokenType.ASTERISK, '*')
            elif char == ',': self.add_token(TokenType.COMMA, ',')
            elif char == '.': self.add_token(TokenType.DOT, '.')
            elif char == ';': self.add_token(TokenType.SEMICOLON, ';')
            elif char == '=': self.add_token(TokenType.EQUALS, '=')
            elif char == '>': self.add_token(TokenType.GREATER, '>')
            elif char == '<':
                if self.peek_char() == '>':
                    self.pos += 1
                    self.add_token(TokenType.NOT_EQUALS, '<>')
                else:
                    self.add_token(TokenType.LESS, '<')
            elif char == '`' and self.dialect.supports_backticks():
                self.handle_backtick()
            elif char.isalpha() or char == '_': self.handle_identifier()
            elif char.isdigit(): self.handle_number()
            elif char == "'": self.handle_string()
            else: self.pos += 1
        
        self.tokens.append({'type': TokenType.EOF, 'value': ''})
        return self.tokens

    def peek_char(self):
        return self.text[self.pos + 1] if self.pos + 1 < len(self.text) else None

    def add_token(self, type, value):
        self.tokens.append({'type': type, 'value': value})
        self.pos += 1

    def handle_identifier(self):
        start = self.pos
        while self.pos < len(self.text) and (self.text[self.pos].isalnum() or self.text[self.pos] == '_'):
            self.pos += 1
        word = self.text[start:self.pos].upper()
        self.tokens.append({'type': self.keywords.get(word, TokenType.IDENTIFIER), 'value': word})

    def handle_backtick(self):
        start = self.pos
        self.pos += 1
        while self.pos < len(self.text) and self.text[self.pos] != '`':
            self.pos += 1
        self.pos += 1
        self.tokens.append({'type': TokenType.BACKTICK_IDENTIFIER, 'value': self.text[start:self.pos]})

    def handle_string(self):
        start = self.pos
        self.pos += 1
        while self.pos < len(self.text) and self.text[self.pos] != "'":
            self.pos += 1
        self.pos += 1
        self.tokens.append({'type': TokenType.STRING, 'value': self.text[start:self.pos]})

    def handle_number(self):
        start = self.pos
        while self.pos < len(self.text) and self.text[self.pos].isdigit():
            self.pos += 1
        self.tokens.append({'type': TokenType.NUMBER, 'value': self.text[start:self.pos]})