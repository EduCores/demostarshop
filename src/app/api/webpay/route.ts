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
    const { buyOrder, sessionId, amount, returnUrl } = await req.json();

    if (!buyOrder || !sessionId || !amount || !returnUrl) {
      return NextResponse.json({ error: "Faltan parámetros: buyOrder, sessionId, amount, returnUrl" }, { status: 400 });
    }

    const options = getWebpayOptions();
    const tx = new WebpayPlus.Transaction(options);
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

    return NextResponse.json({ url: response.url, token: response.token });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error creando transacción Webpay";
    console.error("[WebPay create] ", msg, err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
