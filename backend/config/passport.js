import passport from "passport";
import GitHubStrategy from "passport-github2";
import pool from "./db.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "https://sqlmela.onrender.com/auth/github/callback"
    },
    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {

      return done(null, {
        profile,
        accessToken
      });
    }
  )
);

export default passport;