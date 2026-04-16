import type { NextRequest } from "next/server";
import pkcs11js from "pkcs11js"; // Это работает на сервере

export async function GET(request: NextRequest) {
  const pkcs11 = new pkcs11js.PKCS11();
  pkcs11.load("путь/к/libcryptcp.so или .dll");

  // ... ваша логика ЭЦП

  return Response.json({ success: true });
}