"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setErr("Email o clave incorrectos");
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {registered && <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded p-3">¡Cuenta creada! Ahora inicia sesión.</div>}

      <form onSubmit={onSubmit} className="mt-6 space-y-4 bg-white dark:bg-zinc-900 border rounded-lg p-6">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input name="email" type="email" required className="mt-1" placeholder="empresa@correo.cl" />
        </div>
        <div>
          <label className="text-sm font-medium">Clave</label>
          <Input name="password" type="password" required className="mt-1" />
        </div>

        {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{err}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>

        <p className="text-sm text-center text-zinc-500">
          ¿No tienes cuenta? <Link href="/registro" className="text-[#FF3B30] hover:underline">Crear cuenta</Link>
        </p>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-black">Iniciar sesión</h1>
      <p className="text-sm text-zinc-500 mt-1">Los usuarios quedan en <code>data/users.json</code> (ver respuesta anterior).</p>

      <Suspense fallback={<div className="mt-6 text-sm text-zinc-500">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
