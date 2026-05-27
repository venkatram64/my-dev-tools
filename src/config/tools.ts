export interface Tool {
  href: string;
  label: string;
}

export const tools: Tool[] = [
  { href: "/uuid-generator", label: "UUID" },
  { href: "/password-generator", label: "Password" },
  { href: "/hash-generator", label: "Hash" },
  { href: "/json-formatter", label: "JSON" },
  { href: "/base64-encoder", label: "Base64" },
  { href: "/json-yaml", label: "JSON↔YAML" },
  { href: "/character-counter", label: "Char Count" },
  { href: "/regex-tester", label: "Regex" },
  { href: "/text-case-converter", label: "Case" },
  { href: "/jwt-decoder", label: "JWT" },
  { href: "/timestamp-converter", label: "Timestamp" },
  { href: "/cron-explainer", label: "Cron" },
];
