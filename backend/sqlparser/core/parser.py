from core.tokens import TokenType

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.current = 0
        self.errors = []

    def parse(self):
        """Entry point for parsing. Supports single or nested statements."""
        if self.is_at_end(): return False
        
        token_type = self.peek()['type']
        success = False
        
        if token_type == TokenType.SELECT: success = self.select_stmt()
        elif token_type == TokenType.INSERT: success = self.insert_stmt()
        elif token_type == TokenType.UPDATE: success = self.update_stmt()
        elif token_type == TokenType.DELETE: success = self.delete_stmt()
        elif token_type == TokenType.CREATE: success = self.create_stmt()
        else:
            self.errors.append(f"Unrecognized statement start: {self.peek()['value']}")
            return False
        if success and not self.is_at_end() and not self.check(TokenType.SEMICOLON):
            self.errors.append(f"Syntax error: Unexpected tokens: '{self.peek()['value']}'")
            return False

        return success and len(self.errors) == 0

    def select_stmt(self):
        """Parses SELECT with support for scalar subqueries and derived tables."""
        self.advance() 
        if not self.column_item(): return False
        
        while self.match(TokenType.COMMA):
            if not self.column_item():
                self.errors.append("Expected identifier or subquery after comma")
                return False

        if not self.consume(TokenType.FROM, "Missing required 'FROM' clause"): return False
        
        if self.match(TokenType.LPAREN):
            if not self.select_stmt(): return False
            if not self.consume(TokenType.RPAREN, "Missing ')' after derived table"): return False

            self.match(TokenType.AS)
            self.match(TokenType.IDENTIFIER) 
        elif not self.match(TokenType.IDENTIFIER, TokenType.BACKTICK_IDENTIFIER):
            self.errors.append("Expected table name or subquery after FROM")
            return False

        if self.match(TokenType.WHERE):
            if not self.expression(): return False

        if self.match(TokenType.GROUP):
            if not self.consume(TokenType.BY, "Expected 'BY' after 'GROUP'"): return False

            if not self.match(TokenType.IDENTIFIER, TokenType.BACKTICK_IDENTIFIER):
                self.errors.append("Expected column name after GROUP BY")
                return False
            while self.match(TokenType.COMMA):
                if not self.match(TokenType.IDENTIFIER, TokenType.BACKTICK_IDENTIFIER):
                    self.errors.append("Expected column name after comma in GROUP BY")
                    return False

        if self.match(TokenType.HAVING):
            if not self.expression(): return False
            
        return True

    def column_item(self):
        """Helper to handle a single column or a scalar subquery."""

        if self.match(TokenType.LPAREN):
            if not self.select_stmt(): return False
            if not self.consume(TokenType.RPAREN, "Missing ')' after scalar subquery"): return False

            if self.match(TokenType.AS): self.match(TokenType.IDENTIFIER)
            return True

        if self.match(TokenType.MAX, TokenType.MIN, TokenType.AVG, TokenType.SUM, TokenType.COUNT):
            if not self.consume(TokenType.LPAREN, "Expected '(' after aggregate function"): 
                return False
            self.match(TokenType.DISTINCT)
            if not self.match(TokenType.IDENTIFIER, TokenType.ASTERISK, TokenType.BACKTICK_IDENTIFIER):
                self.errors.append("Expected column name in aggregate function")
                return False
            if not self.consume(TokenType.RPAREN, "Expected ')' after aggregate function"): 
                return False
            if self.match(TokenType.AS): self.match(TokenType.IDENTIFIER)
            return True

        return self.match(TokenType.ASTERISK, TokenType.IDENTIFIER, TokenType.BACKTICK_IDENTIFIER, TokenType.DISTINCT)

    def expression(self):
        """Handles comparisons where the right side can be a value or a subquery."""
        if not self.match(TokenType.IDENTIFIER, TokenType.BACKTICK_IDENTIFIER): return False
        if not self.match(TokenType.EQUALS, TokenType.GREATER, TokenType.LESS, TokenType.NOT_EQUALS, TokenType.LIKE):
            return False

        if self.match(TokenType.LPAREN):
            if not self.select_stmt(): return False
            return self.consume(TokenType.RPAREN, "Missing ')' after expression subquery")
        
        self.advance()
        return True

    def insert_stmt(self):
        self.advance()
        self.consume(TokenType.INTO, "Expected 'INTO'")
        self.consume(TokenType.IDENTIFIER, "Expected table name")
        self.consume(TokenType.VALUES, "Expected 'VALUES'")
        self.consume(TokenType.LPAREN, "Expected '('")
        while not self.check(TokenType.RPAREN) and not self.is_at_end():
            self.advance()
            self.match(TokenType.COMMA)
        return self.consume(TokenType.RPAREN, "Expected ')'")

    def update_stmt(self):
        self.advance()
        self.consume(TokenType.IDENTIFIER, "Expected table name")
        self.consume(TokenType.SET, "Expected 'SET'")
        self.consume(TokenType.IDENTIFIER, "Expected identifier")
        self.consume(TokenType.EQUALS, "Expected '='")
        self.advance()
        if self.match(TokenType.WHERE): self.expression()
        return True

    def create_stmt(self):
        self.advance()
        self.consume(TokenType.TABLE, "Expected 'TABLE'")
        self.consume(TokenType.IDENTIFIER, "Expected table name")
        return self.consume(TokenType.LPAREN, "Expected '('")

    def delete_stmt(self):
        self.advance()
        self.consume(TokenType.FROM, "Expected 'FROM'")
        self.consume(TokenType.IDENTIFIER, "Expected table name")
        if self.match(TokenType.WHERE): self.expression()
        return True

    def match(self, *types):
        for t in types:
            if self.check(t):
                self.advance()
                return True
        return False

    def consume(self, type, message):
        if self.check(type): return self.advance()
        self.errors.append(message)
        return None

    def check(self, type):
        return not self.is_at_end() and self.peek()['type'] == type

    def peek(self): return self.tokens[self.current]

    def advance(self):
        if not self.is_at_end(): self.current += 1
        return self.tokens[self.current - 1]

    def is_at_end(self): return self.peek()['type'] == TokenType.EOF