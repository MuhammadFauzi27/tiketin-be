export const findUserByEmailRepository = async (email, db) => {
  const query = {
    text: `SELECT email FROM users WHERE email = $1`,
    values: [email]
  }

  const result = await db.query(query);

  return result.rowCount != 0 ? true : false;
}

export const createUserRepository = async ({id, fullname, email, password, avatarInitial, authProvider}, db) => {
  const query = {
    text: `INSERT INTO users(id, fullname, email, password, avatar_initial, auth_provider) VALUES ($1, $2, $3, $4, $5, $6)`,
    values: [id, fullname, email, password, avatarInitial, authProvider]
  }

  await db.query(query);
}

export const getUserByEmailRepository = async (email, db) => {
  const query = {
    text: `SELECT id, fullname, password, email, auth_provider, avatar_initial FROM users WHERE email = $1`,
    values: [email]
  }

  const result = await db.query(query);
  return result.rows[0];
}