import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isValidCpf, onlyDigits } from "@/lib/cpf";
import { createXPaymentsCharge, isXPaymentsConfigured } from "@/lib/xpayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_BRL = 10;
const MAX_BRL = 6000;

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

function fail(message: string, status = 400, errorCode = "INVALID_REQUEST") {
  return NextResponse.json(
    { success: false, error: message, errorCode },
    { status, headers: { "cache-control": "no-store" } }
  );
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Pedido PIX inválido.");
  }

  const amount = Number(body?.amount);
  const name = clean(body?.name, 120);
  const cpf = onlyDigits(body?.cpf);
  const target = {
    id: clean(body?.target?.id, 80),
    slug: clean(body?.target?.slug, 120),
    title: clean(body?.target?.title, 160),
    category: clean(body?.target?.category, 120),
    type: ["cause", "category", "campaign"].includes(body?.target?.type)
      ? body.target.type
      : "cause",
  };

  if (!Number.isFinite(amount) || amount < MIN_BRL || amount > MAX_BRL) {
    return fail("Escolha um valor entre R$ 10 e R$ 6.000.", 422, "PIX_AMOUNT_OUT_OF_RANGE");
  }
  if (name.length < 3) {
    return fail("Informe o nome completo do pagador.", 422, "PAYER_NAME_REQUIRED");
  }
  if (!isValidCpf(cpf)) {
    return fail("Informe um CPF válido do titular da conta que fará o PIX.", 422, "INVALID_PAYER_DOCUMENT");
  }
  if (body?.ownershipConfirmed !== true) {
    return fail(
      "Confirme que o PIX será pago por uma conta vinculada ao CPF informado.",
      422,
      "PIX_OWNERSHIP_CONFIRMATION_REQUIRED"
    );
  }
  if (!isXPaymentsConfigured("BRL")) {
    return fail("O PIX está temporariamente indisponível.", 503, "PIX_NOT_CONFIGURED");
  }

  const reference = `DONS-BR-${Date.now()}-${randomUUID().slice(0, 8)}`;

  try {
    const charge = await createXPaymentsCharge({
      amountMinor: Math.round(amount * 100),
      currency: "BRL",
      method: "pix",
      orderId: reference,
      customer: { name, fullName: name, document: cpf, taxId: cpf },
      metadata: {
        source: "dons",
        donation_type: "one_time",
        cause_id: target.id || undefined,
        cause_slug: target.slug || undefined,
        cause_title: target.title || undefined,
        cause_category: target.category || undefined,
        support_target_type: target.type,
      },
    });

    const action = charge.action ?? null;
    return NextResponse.json(
      {
        success: true,
        reference: charge.reference ?? reference,
        transactionId: charge.transactionId ?? null,
        status: charge.status ?? "pending",
        method: "pix",
        amount,
        currency: "BRL",
        target,
        action: action
          ? {
              type: "pix",
              copyPaste: action.copyPaste ?? action.pixString ?? null,
              pixString: action.pixString ?? action.copyPaste ?? null,
              qrCode: action.qrCode ?? action.qrCodeBase64 ?? null,
              qrCodeBase64: action.qrCodeBase64 ?? action.qrCode ?? null,
              qrCodeUrl: null,
              expiresAt: action.expiresAt ?? null,
            }
          : null,
      },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (error) {
    console.error("[dons-pix] charge failed", {
      reference,
      targetId: target.id || null,
      amountMinor: Math.round(amount * 100),
    });
    return fail("Não foi possível gerar o PIX agora. Tente novamente.", 502, "PIX_REQUEST_FAILED");
  }
}
