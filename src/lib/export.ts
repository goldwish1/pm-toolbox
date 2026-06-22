import type {
  TemplateField,
  MatrixConfig,
  TableConfig,
  TreeConfig,
  TimelineConfig,
  TemplateType,
} from "./tools";

// ── Form ──────────────────────────────────────────────────────

export function formToMarkdown(
  values: Record<string, string>,
  fields: TemplateField[],
  toolName: string
): string {
  const lines: string[] = [`# ${toolName}\n`];
  lines.push("| 字段 | 内容 |");
  lines.push("|------|------|");
  for (const field of fields) {
    const value = values[field.key] || "（待填写）";
    const cell = value.replace(/\n/g, "<br>");
    lines.push(`| ${field.label} | ${cell} |`);
  }
  lines.push("");
  return lines.join("\n");
}

export function formToFeishu(
  values: Record<string, string>,
  fields: TemplateField[],
  toolName: string
): string {
  const lines: string[] = [];
  lines.push(`# ${toolName}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  const textFields = fields.filter((f) => f.type === "text");
  if (textFields.length > 0) {
    for (const field of textFields) {
      const value = values[field.key] || "（待填写）";
      lines.push(`**${field.label}**：${value}`);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  const textareaFields = fields.filter((f) => f.type === "textarea");
  for (const field of textareaFields) {
    const value = values[field.key] || "（待填写）";
    lines.push(`## ${field.label}`);
    lines.push("");
    const paragraphs = value.split("\n").filter(Boolean);
    if (paragraphs.length > 0) {
      for (const p of paragraphs) {
        lines.push(p);
        lines.push("");
      }
    } else {
      lines.push("（待填写）");
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

export function formToHTML(
  values: Record<string, string>,
  fields: TemplateField[],
  toolName: string
): string {
  const rows = fields
    .map((field) => {
      const value = values[field.key] || '<span style="color:#d1d5db">（待填写）</span>';
      const cell = value.replace(/\n/g, "<br>");
      return `<tr>
<td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;font-weight:500;color:#6b7280;font-size:13px;width:110px;vertical-align:top">${field.label}</td>
<td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;color:#1f2937;font-size:13px;line-height:1.6">${cell}</td>
</tr>`;
    })
    .join("");

  return wrapCard(toolName, rows);
}

// ── Matrix ─────────────────────────────────────────────────────

export function matrixToMarkdown(
  values: Record<string, string>,
  config: MatrixConfig,
  toolName: string
): string {
  const lines: string[] = [`# ${toolName}\n`];
  // Header row
  lines.push(`|  | ${config.colLabels.join(" | ")} |`);
  lines.push(`|${config.colLabels.map(() => "---|").join("")}---|`);
  for (let ri = 0; ri < config.rowLabels.length; ri++) {
    const cells = config.colLabels.map((_, ci) => {
      const cell = config.cells.find((c) => c.row === ri && c.col === ci);
      if (!cell) return "";
      const v = values[cell.key] || "（待填写）";
      return v.replace(/\n/g, "<br>");
    });
    lines.push(`| **${config.rowLabels[ri]}** | ${cells.join(" | ")} |`);
  }
  lines.push("");
  return lines.join("\n");
}

export function matrixToFeishu(
  values: Record<string, string>,
  config: MatrixConfig,
  toolName: string
): string {
  const lines: string[] = [];
  lines.push(`# ${toolName}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Use a markdown table for Feishu
  lines.push(`|  | ${config.colLabels.join(" | ")} |`);
  lines.push(`|${config.colLabels.map(() => "---|").join("")}---|`);
  for (let ri = 0; ri < config.rowLabels.length; ri++) {
    const cells = config.colLabels.map((_, ci) => {
      const cell = config.cells.find((c) => c.row === ri && c.col === ci);
      if (!cell) return "";
      const v = values[cell.key] || "（待填写）";
      return v.replace(/\n/g, "<br>");
    });
    lines.push(`| **${config.rowLabels[ri]}** | ${cells.join(" | ")} |`);
  }
  lines.push("");

  return lines.join("\n");
}

export function matrixToHTML(
  values: Record<string, string>,
  config: MatrixConfig,
  toolName: string
): string {
  const headerCells = config.colLabels
    .map((l) => `<th style="padding:8px 12px;font-weight:500;color:#6b7280;font-size:12px;text-align:center;border-bottom:1px solid #e5e7eb">${l}</th>`)
    .join("");
  const headerRow = `<tr><th style="padding:8px 12px;font-weight:500;color:#6b7280;font-size:12px;text-align:center;border-bottom:1px solid #e5e7eb"></th>${headerCells}</tr>`;

  const bodyRows = config.rowLabels
    .map((rl, ri) => {
      const cells = config.colLabels.map((_, ci) => {
        const cell = config.cells.find((c) => c.row === ri && c.col === ci);
        if (!cell) return '<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;font-size:12px"></td>';
        const v = values[cell.key] || '<span style="color:#d1d5db">（待填写）</span>';
        return `<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#1f2937;font-size:12px;line-height:1.5">${v.replace(/\n/g, "<br>")}</td>`;
      });
      return `<tr><td style="padding:8px 12px;font-weight:500;color:#6b7280;font-size:12px;border-bottom:1px solid #f3f4f6">${rl}</td>${cells.join("")}</tr>`;
    })
    .join("");

  const table = `<table style="border-collapse:collapse;width:100%"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
  return wrapCard(toolName, table);
}

// ── Table ──────────────────────────────────────────────────────

export function tableToMarkdown(
  values: Record<string, string>,
  config: TableConfig,
  toolName: string
): string {
  const lines: string[] = [`# ${toolName}\n`];
  const { columns } = config;

  // Header
  lines.push(`| ${columns.map((c) => c.label).join(" | ")} |`);
  lines.push(`|${columns.map(() => "---|").join("")}`);

  // Determine row count from values
  const rowCount = getRowCount(values, columns.map((c) => c.key));
  for (let ri = 0; ri < rowCount; ri++) {
    const cells = columns.map((c) => {
      const v = values[`${c.key}_${ri}`] || "（待填写）";
      return v.replace(/\n/g, "<br>");
    });
    lines.push(`| ${cells.join(" | ")} |`);
  }
  lines.push("");
  return lines.join("\n");
}

export function tableToFeishu(
  values: Record<string, string>,
  config: TableConfig,
  toolName: string
): string {
  const lines: string[] = [];
  lines.push(`# ${toolName}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  const { columns } = config;
  lines.push(`| ${columns.map((c) => c.label).join(" | ")} |`);
  lines.push(`|${columns.map(() => "---|").join("")}`);

  const rowCount = getRowCount(values, columns.map((c) => c.key));
  for (let ri = 0; ri < rowCount; ri++) {
    const cells = columns.map((c) => {
      const v = values[`${c.key}_${ri}`] || "（待填写）";
      return v.replace(/\n/g, "<br>");
    });
    lines.push(`| ${cells.join(" | ")} |`);
  }
  lines.push("");

  return lines.join("\n");
}

export function tableToHTML(
  values: Record<string, string>,
  config: TableConfig,
  toolName: string
): string {
  const { columns } = config;
  const headerCells = columns
    .map((c) => `<th style="padding:8px 12px;font-weight:500;color:#6b7280;font-size:12px;text-align:left;border-bottom:1px solid #e5e7eb">${c.label}</th>`)
    .join("");
  const headerRow = `<tr>${headerCells}</tr>`;

  const rowCount = getRowCount(values, columns.map((c) => c.key));
  const bodyRows = Array.from({ length: rowCount }, (_, ri) => {
    const cells = columns
      .map((c) => {
        const v = values[`${c.key}_${ri}`] || '<span style="color:#d1d5db">（待填写）</span>';
        return `<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#1f2937;font-size:12px;line-height:1.5">${v.replace(/\n/g, "<br>")}</td>`;
      })
      .join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  const table = `<table style="border-collapse:collapse;width:100%"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
  return wrapCard(toolName, table);
}

// ── Tree ───────────────────────────────────────────────────────

export function treeToMarkdown(
  values: Record<string, string>,
  config: TreeConfig,
  toolName: string
): string {
  const lines: string[] = [`# ${toolName}\n`];
  const root = values.root || "（待填写）";
  lines.push(`- **${config.rootLabel}**：${root}`);
  for (const level of config.levels) {
    const v = values[level.key] || "（待填写）";
    const items = v.split("\n").filter(Boolean);
    if (items.length > 0) {
      lines.push(`  - **${level.label}**`);
      for (const item of items) {
        lines.push(`    - ${item}`);
      }
    } else {
      lines.push(`  - **${level.label}**：（待填写）`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

export function treeToFeishu(
  values: Record<string, string>,
  config: TreeConfig,
  toolName: string
): string {
  const lines: string[] = [];
  lines.push(`# ${toolName}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  const root = values.root || "（待填写）";
  lines.push(`**${config.rootLabel}**：${root}`);
  lines.push("");

  for (const level of config.levels) {
    lines.push(`## ${level.label}`);
    lines.push("");
    const v = values[level.key] || "（待填写）";
    const items = v.split("\n").filter(Boolean);
    if (items.length > 0) {
      for (const item of items) {
        lines.push(`- ${item}`);
        lines.push("");
      }
    } else {
      lines.push("（待填写）");
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

export function treeToHTML(
  values: Record<string, string>,
  config: TreeConfig,
  toolName: string
): string {
  const parts: string[] = [];

  const root = values.root || "（待填写）";
  parts.push(`<div style="margin-bottom:12px"><span style="font-weight:500;color:#6b7280;font-size:12px">${config.rootLabel}：</span><span style="color:#1f2937;font-size:13px">${root}</span></div>`);

  for (const level of config.levels) {
    const v = values[level.key] || "（待填写）";
    const items = v.split("\n").filter(Boolean);
    if (items.length > 0) {
      const lis = items.map((item) => `<li style="padding:2px 0;color:#1f2937;font-size:12px">${item}</li>`).join("");
      parts.push(`<div style="margin-bottom:8px"><div style="font-weight:500;color:#6b7280;font-size:12px;margin-bottom:4px">${level.label}</div><ul style="margin:0;padding-left:20px">${lis}</ul></div>`);
    } else {
      parts.push(`<div style="margin-bottom:8px"><span style="font-weight:500;color:#6b7280;font-size:12px">${level.label}：</span><span style="color:#d1d5db;font-size:12px">（待填写）</span></div>`);
    }
  }

  return wrapCard(toolName, parts.join(""));
}

// ── Timeline ───────────────────────────────────────────────────

export function timelineToMarkdown(
  values: Record<string, string>,
  _config: TimelineConfig,
  toolName: string
): string {
  const lines: string[] = [`# ${toolName}\n`];
  lines.push("| 日期 | 描述 |");
  lines.push("|------|------|");

  const rowCount = getRowCount(values, ["date", "desc"]);
  for (let ri = 0; ri < rowCount; ri++) {
    const date = values[`date_${ri}`] || "（待填写）";
    const desc = values[`desc_${ri}`] || "（待填写）";
    lines.push(`| ${date} | ${desc} |`);
  }
  lines.push("");
  return lines.join("\n");
}

export function timelineToFeishu(
  values: Record<string, string>,
  _config: TimelineConfig,
  toolName: string
): string {
  const lines: string[] = [];
  lines.push(`# ${toolName}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  lines.push("| 日期 | 描述 |");
  lines.push("|------|------|");

  const rowCount = getRowCount(values, ["date", "desc"]);
  for (let ri = 0; ri < rowCount; ri++) {
    const date = values[`date_${ri}`] || "（待填写）";
    const desc = values[`desc_${ri}`] || "（待填写）";
    lines.push(`| ${date} | ${desc} |`);
  }
  lines.push("");

  return lines.join("\n");
}

export function timelineToHTML(
  values: Record<string, string>,
  _config: TimelineConfig,
  toolName: string
): string {
  const rowCount = getRowCount(values, ["date", "desc"]);
  const rows = Array.from({ length: rowCount }, (_, ri) => {
    const date = values[`date_${ri}`] || '<span style="color:#d1d5db">（待填写）</span>';
    const desc = values[`desc_${ri}`] || '<span style="color:#d1d5db">（待填写）</span>';
    return `<tr>
<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:12px;white-space:nowrap">${date}</td>
<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#1f2937;font-size:12px;line-height:1.5">${desc}</td>
</tr>`;
  }).join("");

  const table = `<table style="border-collapse:collapse;width:100%">
<thead><tr>
<th style="padding:8px 12px;font-weight:500;color:#6b7280;font-size:12px;text-align:left;border-bottom:1px solid #e5e7eb">日期</th>
<th style="padding:8px 12px;font-weight:500;color:#6b7280;font-size:12px;text-align:left;border-bottom:1px solid #e5e7eb">描述</th>
</tr></thead>
<tbody>${rows}</tbody>
</table>`;
  return wrapCard(toolName, table);
}

// ── Helpers ────────────────────────────────────────────────────

function wrapCard(toolName: string, body: string): string {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;max-width:680px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
<div style="padding:12px 20px;border-bottom:1px solid #f3f4f6;background:#f9fafb">
<h2 style="font-size:14px;font-weight:600;color:#111827;margin:0">${toolName}</h2>
</div>
<div style="padding:20px">${body}</div>
</div>`;
}

function getRowCount(values: Record<string, string>, colKeys: string[]): number {
  let maxRow = 0;
  for (const key of colKeys) {
    const pattern = new RegExp(`^${key}_(\\d+)$`);
    for (const k of Object.keys(values)) {
      const m = k.match(pattern);
      if (m) {
        maxRow = Math.max(maxRow, parseInt(m[1], 10) + 1);
      }
    }
  }
  return Math.max(maxRow, 1);
}

// ── Dispatcher ─────────────────────────────────────────────────

export interface ExportContext {
  templateType: TemplateType;
  fields?: TemplateField[];
  matrixConfig?: MatrixConfig;
  tableConfig?: TableConfig;
  treeConfig?: TreeConfig;
  timelineConfig?: TimelineConfig;
}

export function generateMarkdown(
  values: Record<string, string>,
  ctx: ExportContext,
  toolName: string
): string {
  switch (ctx.templateType) {
    case "matrix":
      return ctx.matrixConfig ? matrixToMarkdown(values, ctx.matrixConfig, toolName) : "";
    case "table":
      return ctx.tableConfig ? tableToMarkdown(values, ctx.tableConfig, toolName) : "";
    case "tree":
      return ctx.treeConfig ? treeToMarkdown(values, ctx.treeConfig, toolName) : "";
    case "timeline":
      return ctx.timelineConfig ? timelineToMarkdown(values, ctx.timelineConfig, toolName) : "";
    default:
      return ctx.fields ? formToMarkdown(values, ctx.fields, toolName) : "";
  }
}

export function generateFeishuContent(
  values: Record<string, string>,
  ctx: ExportContext,
  toolName: string
): string {
  switch (ctx.templateType) {
    case "matrix":
      return ctx.matrixConfig ? matrixToFeishu(values, ctx.matrixConfig, toolName) : "";
    case "table":
      return ctx.tableConfig ? tableToFeishu(values, ctx.tableConfig, toolName) : "";
    case "tree":
      return ctx.treeConfig ? treeToFeishu(values, ctx.treeConfig, toolName) : "";
    case "timeline":
      return ctx.timelineConfig ? timelineToFeishu(values, ctx.timelineConfig, toolName) : "";
    default:
      return ctx.fields ? formToFeishu(values, ctx.fields, toolName) : "";
  }
}

export function generateHTML(
  values: Record<string, string>,
  ctx: ExportContext,
  toolName: string
): string {
  switch (ctx.templateType) {
    case "matrix":
      return ctx.matrixConfig ? matrixToHTML(values, ctx.matrixConfig, toolName) : "";
    case "table":
      return ctx.tableConfig ? tableToHTML(values, ctx.tableConfig, toolName) : "";
    case "tree":
      return ctx.treeConfig ? treeToHTML(values, ctx.treeConfig, toolName) : "";
    case "timeline":
      return ctx.timelineConfig ? timelineToHTML(values, ctx.timelineConfig, toolName) : "";
    default:
      return ctx.fields ? formToHTML(values, ctx.fields, toolName) : "";
  }
}
