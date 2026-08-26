"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegistroPage() {
  const router = useRouter();
  const [isB2B, setIsB2B] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      rut: String(fd.get("rut") || ""),
      telefono: String(fd.get("telefono") || ""),
      direccion: String(fd.get("direccion") || ""),
      role: isB2B ? "B2B" : "B2C",
    };
    if (isB2B) {
      payload.empresa = String(fd.get("empresa") || "");
      payload.rutEmpresa = String(fd.get("rutEmpresa") || "");
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al registrar");
      router.push("/login?registered=1");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-xl">
      <h1 className="text-2xl font-black">Crear cuenta</h1>
      <p className="text-sm text-zinc-500 mt-1">
        Hoy se guarda en <code>data/users.json</code> (local). En PaaS irá a PostgreSQL.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 bg-white dark:bg-zinc-900 border rounded-lg p-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isB2B} onChange={(e) => setIsB2B(e.target.checked)} />
          Soy empresa (B2B) — pide datos de facturación
        </label>

        <div>
          <label className="text-sm font-medium">Nombre / Razón Social *</label>
          <Input name="name" required className="mt-1" placeholder="Starshop SpA" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Email *</label>
            <Input name="email" type="email" required className="mt-1" placeholder="empresa@correo.cl" />
          </div>
          <div>
            <label className="text-sm font-medium">Clave * (mín. 6)</label>
            <Input name="password" type="password" required className="mt-1" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">RUT / DNI</label>
            <Input name="rut" className="mt-1" placeholder="76.123.456-7" />
          </div>
          <div>
            <label className="text-sm font-medium">Teléfono</label>
            <Input name="telefono" className="mt-1" placeholder="+56 9 8765 4321" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Dirección</label>
          <Input name="direccion" className="mt-1" placeholder="Av. Matta 1234" />
        </div>

        {isB2B && (
          <div className="border rounded-lg p-3 bg-amber-50 dark:bg-amber-950/20 space-y-3">
            <div className="text-sm font-bold">Datos empresa</div>
            <Input name="empresa" placeholder="Razón Social empresa" />
            <Input name="rutEmpresa" placeholder="RUT Empresa" />
          </div>
        )}

        {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{err}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creando..." : "Crear cuenta"}
        </Button>

        <p className="text-sm text-center text-zinc-500">
          ¿Ya tienes cuenta? <Link href="/login" className="text-[#FF3B30] hover:underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
