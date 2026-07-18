import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool, sql } from '../../config/db.js';
import { env } from '../../config/env.js';

/**
 * Look up a user by username.
 */
async function findUserByUsername(username) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('username', sql.VarChar, username)
    .query(
      `SELECT TOP 1 IdAt, IdUsr, Users, password
       FROM MA_User
       WHERE Users = @username`
    );
  const row = result.recordset[0];
  if (!row) return null;

  // Normalize MA_User columns to the shape the rest of the service expects.
  return {
    IDs: row.IdAt,
    IdUser: row.IdUsr,
    Username: row.Users,
    Password: row.password,
    FullName: row.Users,
    Role: null,
  };
}

/**
 * Verify credentials and issue a JWT.
 * Supports both bcrypt hashes and (legacy) plaintext passwords.
 */
export async function login(username, password) {
  const user = await findUserByUsername(username);
  if (!user) {
    const err = new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    err.status = 401;
    err.expose = true;
    throw err;
  }

  const stored = user.Password || '';
  const isBcrypt = /^\$2[aby]\$/.test(stored);
  const ok = isBcrypt
    ? await bcrypt.compare(password, stored)
    : stored === password;

  if (!ok) {
    const err = new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    err.status = 401;
    err.expose = true;
    throw err;
  }

  const payload = {
    sub: user.IDs,
    idUser: user.IdUser,
    username: user.Username,
    fullName: user.FullName,
    role: user.Role,
  };

  const token = jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

  return {
    token,
    user: {
      ids: user.IDs,
      idUser: user.IdUser,
      username: user.Username,
      fullName: user.FullName,
      role: user.Role,
    },
  };
}
