from core.tokens import TokenType


class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.current = 0
        self.errors = []

    # =========================
    # ENTRY POINT
    # =========================

    def parse(self):
        if self.is_at_end():
            return False

        token_type = self.peek()['type']
        success = False

        if token_type == TokenType.SELECT:
            success = self.select_stmt()
        elif token_type == TokenType.INSERT:
            success = self.insert_stmt()
        elif token_type == TokenType.UPDATE:
            success = self.update_stmt()
        elif token_type == TokenType.DELETE:
            success = self.delete_stmt()
        elif token_type == TokenType.CREATE:
            success = self.create_stmt()
        else:
            self.errors.append(
                f"Unrecognized statement start: {self.peek()['value']}")
            return False

        if success and not self.is_at_end() and not self.check(TokenType.SEMICOLON):
            self.errors.append(
                f"Syntax error: Unexpected tokens: '{self.peek()['value']}'")
            return False

        return success and len(self.errors) == 0

    # =========================
    # SELECT
    # =========================

    def select_stmt(self):
        self.advance()  # consume SELECT

        # Columns
        if not self.column_item():
            return False

        while self.match(TokenType.COMMA):
            if not self.column_item():
                self.errors.append(
                    "Expected identifier or subquery after comma")
                return False

        # FROM
        if not self.consume(TokenType.FROM, "Missing required 'FROM' clause"):
            return False

        if not self.table_reference():
            return False

        # JOIN (repeatable)
        while self.check(TokenType.JOIN) or \
                self.check(TokenType.INNER) or \
                self.check(TokenType.LEFT) or \
                self.check(TokenType.RIGHT):

            self.match(TokenType.INNER,
                       TokenType.LEFT,
                       TokenType.RIGHT)

            if not self.consume(TokenType.JOIN, "Expected 'JOIN'"):
                return False

            if not self.table_reference():
                return False

            if not self.consume(TokenType.ON, "Expected 'ON' in JOIN"):
                return False

            if not self.expression():
                self.errors.append("Invalid JOIN condition")
                return False

        # WHERE
        if self.match(TokenType.WHERE):
            if not self.expression():
                return False

        # GROUP BY
        if self.match(TokenType.GROUP):
            if not self.consume(TokenType.BY, "Expected 'BY' after GROUP"):
                return False

            if not self.column_reference():
                self.errors.append("Expected column after GROUP BY")
                return False

            while self.match(TokenType.COMMA):
                if not self.column_reference():
                    self.errors.append(
                        "Expected column after comma in GROUP BY")
                    return False

        # HAVING
        if self.match(TokenType.HAVING):
            if not self.expression():
                return False

        return True

    # =========================
    # TABLE REFERENCE
    # =========================

    def table_reference(self):

        # Derived table
        if self.match(TokenType.LPAREN):
            if not self.select_stmt():
                return False

            if not self.consume(TokenType.RPAREN, "Missing ')' after derived table"):
                return False

        # Normal table
        elif not self.match(TokenType.IDENTIFIER,
                            TokenType.BACKTICK_IDENTIFIER):
            self.errors.append(
                "Expected table name or subquery after FROM/JOIN")
            return False

        # Optional alias
        if self.match(TokenType.AS):
            if not self.match(TokenType.IDENTIFIER):
                self.errors.append("Expected alias after AS")
                return False
        else:
            self.match(TokenType.IDENTIFIER)

        return True

    # =========================
    # COLUMN HANDLING
    # =========================

    def column_item(self):

        # Scalar subquery
        if self.match(TokenType.LPAREN):
            if not self.select_stmt():
                return False

            if not self.consume(TokenType.RPAREN,
                                "Missing ')' after scalar subquery"):
                return False

            if self.match(TokenType.AS):
                self.match(TokenType.IDENTIFIER)

            return True

        # Aggregate
        if self.match(TokenType.MAX,
                      TokenType.MIN,
                      TokenType.AVG,
                      TokenType.SUM,
                      TokenType.COUNT):

            if not self.consume(TokenType.LPAREN,
                                "Expected '(' after aggregate function"):
                return False

            self.match(TokenType.DISTINCT)

            if not self.match(TokenType.IDENTIFIER,
                              TokenType.ASTERISK,
                              TokenType.BACKTICK_IDENTIFIER):
                self.errors.append(
                    "Expected column in aggregate function")
                return False

            if not self.consume(TokenType.RPAREN,
                                "Expected ')' after aggregate function"):
                return False

            if self.match(TokenType.AS):
                self.match(TokenType.IDENTIFIER)

            return True

        if self.match(TokenType.ASTERISK):
            return True

        return self.column_reference()

    def column_reference(self):
        if not self.match(TokenType.IDENTIFIER,
                          TokenType.BACKTICK_IDENTIFIER):
            return False

        while self.match(TokenType.DOT):
            if not self.match(TokenType.IDENTIFIER,
                              TokenType.BACKTICK_IDENTIFIER):
                self.errors.append("Expected identifier after '.'")
                return False

        return True

    # =========================
    # EXPRESSIONS
    # =========================

    def expression(self):

        # Left side
        if not self.column_reference():
            return False

        # Operator
        if not self.match(TokenType.EQUALS,
                          TokenType.GREATER,
                          TokenType.LESS,
                          TokenType.NOT_EQUALS,
                          TokenType.LIKE):
            return False

        # Subquery
        if self.match(TokenType.LPAREN):
            if not self.select_stmt():
                return False
            return self.consume(TokenType.RPAREN,
                                "Missing ')' after expression subquery")

        # Right side identifier
        if self.column_reference():
            return True

        # Literal fallback
        self.advance()
        return True

    # =========================
    # OTHER STATEMENTS
    # =========================

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
        self.consume(TokenType.IDENTIFIER, "Expected column name")
        self.consume(TokenType.EQUALS, "Expected '='")
        self.advance()

        if self.match(TokenType.WHERE):
            self.expression()

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

        if self.match(TokenType.WHERE):
            self.expression()

        return True

    # =========================
    # TOKEN HELPERS
    # =========================

    def match(self, *types):
        for t in types:
            if self.check(t):
                self.advance()
                return True
        return False

    def consume(self, type, message):
        if self.check(type):
            return self.advance()
        self.errors.append(message)
        return None

    def check(self, type):
        return not self.is_at_end() and self.peek()['type'] == type

    def peek(self):
        return self.tokens[self.current]

    def advance(self):
        if not self.is_at_end():
            self.current += 1
        return self.tokens[self.current - 1]

    def is_at_end(self):
        return self.peek()['type'] == TokenType.EOF