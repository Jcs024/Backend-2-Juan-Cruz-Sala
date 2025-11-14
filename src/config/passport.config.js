import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import local from "passport-local";
import userModel from "../models/userModel.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          const user = await userModel.findOne({ email });
          if (user) {
            return done(null, false, { message: "User already exists" });
          }

          const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Invalid password" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => {
            let token = null;
            if (req && req.cookies) {
              token = req.cookies["jwt"];
            }
            return token;
          },
        ]),
        secretOrKey: process.env.JWT_SECRET || "jwt_secret",
      },
      async (payload, done) => {
        try {
          const user = await userModel.findById(payload.id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => {
            let token = null;
            if (req && req.cookies) {
              token = req.cookies["jwt"];
            } else if (req && req.headers.authorization) {
              token = req.headers.authorization.replace("Bearer ", "");
            }
            return token;
          },
        ]),
        secretOrKey: process.env.JWT_SECRET || "jwt_secret",
      },
      async (payload, done) => {
        try {
          const user = await userModel.findById(payload.id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
