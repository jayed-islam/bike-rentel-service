import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrpt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_sccess_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expirse_id: process.env.JWT_EXPIRSE_IN,
};
