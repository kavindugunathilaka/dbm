import { NextResponse, type NextRequest } from "next/server";

// Password-protects internal tools (/tools/*) with HTTP Basic Auth.
// Set TOOLS_USER and TOOLS_PASSWORD in the hosting environment (Vercel → Settings → Environment Variables).
// Demo mode: if they are NOT set, the tools are open to anyone with the link.
export function proxy(req: NextRequest) {
  const user = process.env.TOOLS_USER;
  const pass = process.env.TOOLS_PASSWORD;
  if (!user || !pass) return NextResponse.next();

  {
    const header = req.headers.get("authorization") ?? "";
    const [scheme, encoded] = header.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const i = decoded.indexOf(":");
      if (i > -1 && safeEqual(decoded.slice(0, i), user) && safeEqual(decoded.slice(i + 1), pass)) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="DBM tools", charset="UTF-8"', "X-Robots-Tag": "noindex" },
  });
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const config = { matcher: ["/tools/:path*"] };
