import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

function getMpClient() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en env");
  return new MercadoPagoConfig({ accessToken: token });
}

export async function POST(req: NextRequest) {
  try {
    const { items, payer, externalReference, notificationUrl, backUrls } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Faltan items para la preferencia" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    const client = getMpClient();
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((it: { title: string; quantity: number; unit_price: number }, idx: number) => ({
          id: `starshop-${idx}`,
          title: it.title,
          quantity: it.quantity,
          unit_price: Number(it.unit_price),
          currency_id: "CLP",
        })),
        payer: payer || undefined,
        external_reference: externalReference || undefined,
        back_urls: backUrls || {
          success: `${origin}/checkout/success?gateway=mercadopago`,
          failure: `${origin}/checkout/success?gateway=mercadopago&status=failure`,
          pending: `${origin}/checkout/success?gateway=mercadopago&status=pending`,
        },
        auto_return: "approved",
        notification_url: notificationUrl || `${origin}/api/mercadopago/webhook`,
      },
    });

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error creando preferencia MercadoPago";
    console.error("[MercadoPago create] ", msg, err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
