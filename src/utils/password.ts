import bcrypt from "bcrypt";

/**
 * Hashes the given password
 * @param password The password to hash
 * @returns A Promise that resolves to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Salt rounds for hashing
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compares the given password with the hashed password
 * @param password The password to compare
 * @param hashedPassword The hashed password to compare against
 * @returns A Promise that resolves to true if the password matches, otherwise false
 */
export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
