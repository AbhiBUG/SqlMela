import session from 'express-session';

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'my_session_secret',
  resave: true,
  saveUninitialized: false,
  name: 'manfra.io',
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 // 1 hour
  }
});

export default sessionConfig;
