import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  TrainFront,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Smartphone,
  Clock,
  LifeBuoy,
  Truck,
  ShieldCheck,
  FileText,
  Lightbulb,
  Wrench,
  Ruler,
  ShieldAlert,
} from "lucide-react";
import "./globals.css";
import Link from "next/link";
import { Header } from "@/components/modules/Header";
import { CartDrawer } from "@/components/modules/CartDrawer";
import { FloatingButtons } from "@/components/modules/FloatingButtons";
import { Toaster } from "@/components/ui/toast";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Starshop | Distribuidor Mayorista Herramientas, LED e Instrumentos",
  description: "Starshop - Líder en distribución masiva de herramientas, iluminación LED, instrumentos de medición y artículos eléctricos. Envíos a todo Chile. Venta mayorista B2B.",
  keywords: ["herramientas", "led", "iluminacion", "multimetro", "starshop", "chile"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-[#F5F5F5] dark:bg-zinc-950`}>
        <Providers>
          <Header />
          <CartDrawer />
          <FloatingButtons />
          <Toaster />
          <main className="min-h-screen max-w-full overflow-x-hidden">{children}</main>
          <footer className="bg-[#232F3E] text-white mt-12">
            <div className="container py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
              {/* Marca */}
              <div>
                <Link href="/" className="inline-flex items-baseline text-[26px] font-black tracking-tight leading-none select-none mb-3 notranslate" translate="no">
                  <span className="text-[#fbffff]">ST</span>
                  <span className="star-slot" aria-hidden>
                    <span className="star-ghost">A</span>
                    <span className="star-float">
                      <img src="/star2.svg" alt="" className="star-logo star-anim-show" />
                    </span>
                  </span>
                  <span className="text-[#fbffff]">R</span>
                  <span className="text-[#fdd817]">SHOP</span>
                </Link>
                <p className="text-zinc-300 leading-relaxed">
                  Distribuidor masivo de herramientas, iluminación LED y artículos eléctricos. Más de 15 años
                  abasteciendo a contratistas e industrias.
                </p>
                <p className="mt-3">© 2026 Starshop SpA. Todos los derechos reservados.</p>
              </div>

              {/* Ayuda + Categorías */}
              <div>
                <h4 className="font-bold mb-3">Ayuda</h4>
                <ul className="space-y-2.5 text-zinc-300">
                  {[
                    { Icon: LifeBuoy, label: "Centro de Ayuda" },
                    { Icon: Truck, label: "Envíos & Retiros" },
                    { Icon: ShieldCheck, label: "Garantías SEC" },
                    { Icon: FileText, label: "Cotizaciones B2B" },
                  ].map(({ Icon, label }) => (
                    <li key={label}>
                      <a href="#" className="flex items-center gap-2.5 hover:text-white hover:underline">
                        <Icon className="h-[18px] w-[18px] shrink-0 text-[#FFD814]" />
                        <span>{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <h5 className="font-bold mt-5 mb-3">Categorías</h5>
                <ul className="space-y-2.5 text-zinc-300">
                  {[
                    { Icon: Lightbulb, label: "Iluminación LED" },
                    { Icon: Wrench, label: "Herramientas" },
                    { Icon: Ruler, label: "Instrumentos de Medición" },
                    { Icon: ShieldAlert, label: "Seguridad Eléctrica" },
                  ].map(({ Icon, label }) => (
                    <li key={label}>
                      <a href="#" className="flex items-center gap-2.5 hover:text-white hover:underline">
                        <Icon className="h-[18px] w-[18px] shrink-0 text-[#FFD814]" />
                        <span>{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h4 className="font-bold mb-3">Contacto</h4>
                <ul className="space-y-3 text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <MapPin className="h-[18px] w-[18px] shrink-0 text-[#FFD814]" />
                    <span>Jecar Nehgme 70 - Santiago</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <TrainFront className="h-[18px] w-[18px] shrink-0 text-[#FFD814]" />
                    <span>Metro: República</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-[18px] w-[18px] shrink-0 text-[#FFD814]" />
                    <a href="mailto:ventas@starshop.cl" className="hover:text-white hover:underline">
                      ventas@starshop.cl
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-[18px] w-[18px] shrink-0 text-[#FFD814]" />
                    <a href="tel:+56226972072" className="hover:text-white hover:underline">
                      22 697 2072
                    </a>
                    <span className="text-zinc-500">(Fijo)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <MessageCircle className="h-[18px] w-[18px] shrink-0 text-[#FFD814]" />
                    <a href="https://wa.me/56993301557" className="hover:text-white hover:underline">
                      +56 9 9330 1557
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Smartphone className="h-[18px] w-[18px] shrink-0 text-[#FFD814]" />
                    <a href="https://wa.me/56989005158" className="hover:text-white hover:underline">
                      +56 9 8900 5158
                    </a>
                  </li>
                </ul>
              </div>

              {/* Horario */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Clock className="h-[18px] w-[18px] shrink-0 text-[#FFD814]" />
                  Horario Atención
                </h4>
                <ul className="space-y-2.5 text-zinc-300">
                  <li className="flex items-center justify-between gap-4">
                    <span>Lun - Jue</span>
                    <span className="text-white font-medium">10:00 - 18:00h</span>
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span>Vie</span>
                    <span className="text-white font-medium">10:00 - 16:00h</span>
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span>Sáb - Dom</span>
                    <span>Cerrado</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-[#131921] py-4 text-center text-xs text-zinc-400">
              Pagos seguros: WebPay • Transferencia • Factura B2B • Certificación SEC disponible en productos
              seleccionados
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
