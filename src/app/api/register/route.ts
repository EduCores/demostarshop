import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, rut, telefono, direccion, empresa, rutEmpresa, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Faltan campos: email, password, name" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "La clave debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const user = createUser({ email, password, name, rut, telefono, direccion, empresa, rutEmpresa, role });

    const { passwordHash: _, ...safeUser } = user as unknown as Record<string, unknown>;

    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al registrar";
    const status = msg.includes("ya está registrado") ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
