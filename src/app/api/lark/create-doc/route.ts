import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "title and content required" },
        { status: 400 }
      );
    }

    const result = execSync(
      `lark doc create "${title.replace(/"/g, '\\"')}" --stdin`,
      {
        input: content,
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    const parsed = JSON.parse(result);
    return NextResponse.json({ url: parsed.url, token: parsed.token });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
