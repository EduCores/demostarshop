import { NextRequest, NextResponse } from "next/server";
import { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from "transbank-sdk";

function getWebpayOptions() {
  const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
  const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
  const env = process.env.WEBPAY_ENV === "production" ? Environment.Production : Environment.Integration;
  return new Options(commerceCode, apiKey, env);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body.token_ws || body.tokenWs || body.token || new URL(req.url).searchParams.get("token_ws");

    if (!token) {
      return NextResponse.json({ error: "Falta token_ws" }, { status: 400 });
    }

    const options = getWebpayOptions();
    const tx = new WebpayPlus.Transaction(options);
    const commitResponse = await tx.commit(token);

    return NextResponse.json(commitResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error confirmando transacción Webpay";
    console.error("[WebPay commit] ", msg, err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Soporta también GET ?token_ws=... (redirige Transbank hace GET)
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token_ws");
  if (!token) return NextResponse.json({ error: "Falta token_ws" }, { status: 400 });

  try {
    const options = getWebpayOptions();
    const tx = new WebpayPlus.Transaction(options);
    const commitResponse = await tx.commit(token);
    return NextResponse.json(commitResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error confirmando Webpay (GET)";
    console.error("[WebPay commit GET] ", msg, err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
