import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(pwd: string) {
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scryptAsync(pwd, salt, 64)) as Buffer;

    return `${buffer.toString("hex")}.${salt}`;
  }

  static async compare(storedPwd: string, suppliedPwd: string) {
    const [hashedPwd, salt] = storedPwd.split(".");
    const buffer = (await scryptAsync(suppliedPwd, salt, 64)) as Buffer;

    return buffer.toString("hex") === hashedPwd;
  }
}
