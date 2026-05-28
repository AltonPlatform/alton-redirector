import { resolveLocale } from "./i18n";
import { renderPage } from "./template";

export interface Env {
  APP_STORE_URL: string;
  GOOGLE_PLAY_URL: string;
  API_URL: string;
  HOME_URL: string;
}

const REF_CODE_PATTERN = /^[A-Za-z0-9]{3,20}$/;

function extractRefCode(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length !== 2 || segments[0] !== "ref") {
    return null;
  }

  const refCode = segments[1];
  return REF_CODE_PATTERN.test(refCode) ? refCode : null;
}

function notFound(): Response {
  return new Response("Not Found", { status: 404 });
}

function badRequest(): Response {
  return new Response("Invalid referral code", { status: 400 });
}

function getClientIp(request: Request): string | null {
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) return cfIp.trim();

  const forwarded = request.headers.get("X-Forwarded-For");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return null;
}

async function proxyReferralClick(
  request: Request,
  env: Env
): Promise<Response> {
  const rawBody = await request.text();
  const clientIp = getClientIp(request);

  let body: string;
  try {
    const payload = JSON.parse(rawBody) as Record<string, unknown>;
    if (clientIp) {
      payload.client_ip = clientIp;
    }
    body = JSON.stringify(payload);
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(`${env.API_URL}/referral/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "upstream failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/favicon.ico" && request.method === "GET") {
      return Response.redirect(`${env.HOME_URL}/favicon.ico`, 302);
    }

    if (url.pathname === "/referral/click" && request.method === "POST") {
      return proxyReferralClick(request, env);
    }

    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (url.pathname === "/") {
      return Response.redirect(env.HOME_URL, 302);
    }

    const refCode = extractRefCode(url.pathname);

    if (refCode === null) {
      if (url.pathname.startsWith("/ref/")) {
        return badRequest();
      }
      return notFound();
    }

    const locale = resolveLocale(request.headers.get("Accept-Language"));

    const html = renderPage({
      refCode,
      appStoreUrl: env.APP_STORE_URL,
      googlePlayUrl: env.GOOGLE_PLAY_URL,
      homeUrl: env.HOME_URL,
      locale,
    });

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  },
};
