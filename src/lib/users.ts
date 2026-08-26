import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  rut?: string;
  telefono?: string;
  direccion?: string;
  empresa?: string;
  rutEmpresa?: string;
  passwordHash: string;
  role: "B2C" | "B2B";
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]", "utf-8");
}

export function getAllUsers(): StoredUser[] {
  ensureFile();
  const raw = fs.readFileSync(USERS_FILE, "utf-8");
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: {
  email: string;
  password: string;
  name: string;
  rut?: string;
  telefono?: string;
  direccion?: string;
  empresa?: string;
  rutEmpresa?: string;
  role?: "B2C" | "B2B";
}): StoredUser {
  const users = getAllUsers();
  const exists = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
  if (exists) throw new Error("El email ya está registrado");

  const passwordHash = bcrypt.hashSync(data.password, 10);
  const user: StoredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    email: data.email.toLowerCase(),
    name: data.name,
    rut: data.rut,
    telefono: data.telefono,
    direccion: data.direccion,
    empresa: data.empresa,
    rutEmpresa: data.rutEmpresa,
    passwordHash,
    role: data.role || "B2C",
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  return user;
}

export function verifyUser(email: string, password: string): StoredUser | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  const ok = bcrypt.compareSync(password, user.passwordHash);
  return ok ? user : null;
}
