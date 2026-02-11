import {ConflictError} from "../exceptions/conflictError.js";
import { v4 as uuid } from "uuid";
import {validate} from "../validations/validation.js";
import {
  createUserRepository,
  findUserByEmailRepository,
  getUserByEmailRepository
} from "../databases/repositories/userRepository.js";
import pool from "../databases/index.js";
import config from "../config/config.js";
import bcrypt from 'bcrypt';
import {NotFoundError} from "../exceptions/notFoundError.js";
import jwt from "../utils/jwt.js";
import {generateInitials} from "../utils/generateInitials.js";
import {OAuth2Client} from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerService = async (payload) => {
  const user = validate.auth.register(payload);

  const emailExists = await findUserByEmailRepository(user.email, pool);
  if(emailExists) {
    throw new ConflictError('Email Already Exists')
  }

  user.id = uuid();
  user.avatarInitial = generateInitials(user.fullname);
  user.password = await bcrypt.hash(user.password, config.bcryptSalt);
  user.authProvider = 'cridential';

  await createUserRepository(user, pool)
}

export const loginService = async (payload) => {
  const user = validate.auth.login(payload)

  const currentUser = await getUserByEmailRepository(user.email, pool);
  if(!currentUser) {
    throw new NotFoundError('Email or Password is wrong')
  }
  if(currentUser.auth_provider === 'google') {
    throw new NotFoundError('Email or Password is wrong')
  }

  const passwordValid = await bcrypt.compare(user.password, currentUser.password);
  if(!passwordValid) {
    throw new NotFoundError('Email or Password is wrong')
  }

  const payloadJwt = {
    id: currentUser.id,
    fullname: currentUser.fullname,
    email: currentUser.email,
    avatar_initial: currentUser.avatar_initial
  }

  return jwt.signToken(payloadJwt);
  }

export const loginGoogleService = async (payload) => {
  validate.auth.loginGoogle(payload);
  const ticket = await googleClient.verifyIdToken({
    idToken: payload.credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const googlePayload = ticket.getPayload();
  const { email, name } = googlePayload;

  let user = await getUserByEmailRepository(email, pool);

  if (!user) {
    const newId = uuid();
    const newUser = {
      id: newId,
      email: email,
      fullname: name,
      password: null,
      avatarInitial: generateInitials(name),
      authProvider: 'google'
    };
    await createUserRepository(newUser, pool);
    user = newUser;
  }

  const payloadJwt = {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    avatar_initial: user.avatarInitial || user.avatar_initial
  };

  return jwt.signToken(payloadJwt);
}