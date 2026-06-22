/**
 * lark-bridge.mjs — 本地 HTTP 代理，将飞书导出请求转发给 lark CLI
 *
 * 使用方式：
 *   1. 确保已安装 lark CLI 并扫码登录（lark login）
 *   2. node lark-bridge.mjs
 *   3. 在网页上点击"导出到飞书"
 *
 * 依赖：lark CLI（feishu-personal skill）
 */

import { createServer } from "http";
import { execSync } from "child_process";

const PORT = parseInt(process.env.PORT || "3456", 10);

createServer((req, res) => {
  // CORS 头，允许前端跨域请求
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/create-doc") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    try {
      const { title, content } = JSON.parse(body);
      if (!title || !content) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "title and content required" }));
        return;
      }

      // 调用 lark CLI 创建飞书文档
      // 内容通过 stdin 传入，避免 shell 转义问题
      const result = execSync(
        `lark doc create "${title.replace(/"/g, '\\"')}" --stdin`,
        {
          input: content,
          encoding: "utf-8",
          maxBuffer: 10 * 1024 * 1024,
        }
      );

      const parsed = JSON.parse(result);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ url: parsed.url, token: parsed.token }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: msg }));
    }
  });
}).listen(PORT, () => {
  console.log(`✅ lark-bridge ready on http://localhost:${PORT}`);
  console.log(`   前端导出到飞书时将通过此端口创建文档`);
});
