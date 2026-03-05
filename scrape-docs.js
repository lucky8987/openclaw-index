const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://docs.openclaw.ai';
const outputDir = path.join(__dirname, 'docs');

const pages = [
  "zh-CN",
  "zh-CN/AGENTS",
  "zh-CN/automation/auth-monitoring",
  "zh-CN/automation/cron-jobs",
  "zh-CN/automation/cron-vs-heartbeat",
  "zh-CN/automation/gmail-pubsub",
  "zh-CN/automation/hooks",
  "zh-CN/automation/poll",
  "zh-CN/automation/troubleshooting",
  "zh-CN/automation/webhook",
  "zh-CN/brave-search",
  "zh-CN/channels/bluebubbles",
  "zh-CN/channels/broadcast-groups",
  "zh-CN/channels/channel-routing",
  "zh-CN/channels/discord",
  "zh-CN/channels/feishu",
  "zh-CN/channels/googlechat",
  "zh-CN/channels/grammy",
  "zh-CN/channels/group-messages",
  "zh-CN/channels/groups",
  "zh-CN/channels/imessage",
  "zh-CN/channels",
  "zh-CN/channels/line",
  "zh-CN/channels/location",
  "zh-CN/channels/matrix",
  "zh-CN/channels/mattermost",
  "zh-CN/channels/msteams",
  "zh-CN/channels/nextcloud-talk",
  "zh-CN/channels/nostr",
  "zh-CN/channels/pairing",
  "zh-CN/channels/signal",
  "zh-CN/channels/slack",
  "zh-CN/channels/telegram",
  "zh-CN/channels/tlon",
  "zh-CN/channels/troubleshooting",
  "zh-CN/channels/twitch",
  "zh-CN/channels/whatsapp",
  "zh-CN/channels/zalo",
  "zh-CN/channels/zalouser",
  "zh-CN/cli/acp",
  "zh-CN/cli/agent",
  "zh-CN/cli/agents",
  "zh-CN/cli/approvals",
  "zh-CN/cli/browser",
  "zh-CN/cli/channels",
  "zh-CN/cli/config",
  "zh-CN/cli/configure",
  "zh-CN/cli/cron",
  "zh-CN/cli/dashboard",
  "zh-CN/cli/devices",
  "zh-CN/cli/directory",
  "zh-CN/cli/dns",
  "zh-CN/cli/docs",
  "zh-CN/cli/doctor",
  "zh-CN/cli/gateway",
  "zh-CN/cli/health",
  "zh-CN/cli/hooks",
  "zh-CN/cli",
  "zh-CN/cli/logs",
  "zh-CN/cli/memory",
  "zh-CN/cli/message",
  "zh-CN/cli/models",
  "zh-CN/cli/node",
  "zh-CN/cli/nodes",
  "zh-CN/cli/onboard",
  "zh-CN/cli/pairing",
  "zh-CN/cli/plugins",
  "zh-CN/cli/reset",
  "zh-CN/cli/sandbox",
  "zh-CN/cli/security",
  "zh-CN/cli/sessions",
  "zh-CN/cli/setup",
  "zh-CN/cli/skills",
  "zh-CN/cli/status",
  "zh-CN/cli/system",
  "zh-CN/cli/tui",
  "zh-CN/cli/uninstall",
  "zh-CN/cli/update",
  "zh-CN/cli/voicecall",
  "zh-CN/cli/webhooks",
  "zh-CN/concepts/agent",
  "zh-CN/concepts/agent-loop",
  "zh-CN/concepts/agent-workspace",
  "zh-CN/concepts/architecture",
  "zh-CN/concepts/compaction",
  "zh-CN/concepts/context",
  "zh-CN/concepts/features",
  "zh-CN/concepts/markdown-formatting",
  "zh-CN/concepts/memory",
  "zh-CN/concepts/messages",
  "zh-CN/concepts/model-failover",
  "zh-CN/concepts/model-providers",
  "zh-CN/concepts/models",
  "zh-CN/concepts/multi-agent",
  "zh-CN/concepts/oauth",
  "zh-CN/concepts/presence",
  "zh-CN/concepts/queue",
  "zh-CN/concepts/retry",
  "zh-CN/concepts/session",
  "zh-CN/concepts/session-pruning",
  "zh-CN/concepts/session-tool",
  "zh-CN/concepts/streaming",
  "zh-CN/concepts/system-prompt",
  "zh-CN/concepts/timezone",
  "zh-CN/concepts/typebox",
  "zh-CN/concepts/typing-indicators",
  "zh-CN/concepts/usage-tracking",
  "zh-CN/date-time",
  "zh-CN/debug/node-issue",
  "zh-CN/diagnostics/flags",
  "zh-CN/experiments/onboarding-config-protocol",
  "zh-CN/experiments/plans/cron-add-hardening",
  "zh-CN/experiments/plans/group-policy-hardening",
  "zh-CN/experiments/plans/openresponses-gateway",
  "zh-CN/experiments/proposals/model-config",
  "zh-CN/experiments/research/memory",
  "zh-CN/gateway/authentication",
  "zh-CN/gateway/background-process",
  "zh-CN/gateway/bonjour",
  "zh-CN/gateway/bridge-protocol",
  "zh-CN/gateway/cli-backends",
  "zh-CN/gateway/configuration",
  "zh-CN/gateway/configuration-examples",
  "zh-CN/gateway/discovery",
  "zh-CN/gateway/doctor",
  "zh-CN/gateway/gateway-lock",
  "zh-CN/gateway/health",
  "zh-CN/gateway/heartbeat",
  "zh-CN/gateway",
  "zh-CN/gateway/local-models",
  "zh-CN/gateway/logging",
  "zh-CN/gateway/multiple-gateways",
  "zh-CN/gateway/network-model",
  "zh-CN/gateway/openai-http-api",
  "zh-CN/gateway/openresponses-http-api",
  "zh-CN/gateway/pairing",
  "zh-CN/gateway/protocol",
  "zh-CN/gateway/remote",
  "zh-CN/gateway/remote-gateway-readme",
  "zh-CN/gateway/sandbox-vs-tool-policy-vs-elevated",
  "zh-CN/gateway/sandboxing",
  "zh-CN/gateway/security",
  "zh-CN/gateway/tailscale",
  "zh-CN/gateway/tools-invoke-http-api",
  "zh-CN/gateway/troubleshooting",
  "zh-CN/help/debugging",
  "zh-CN/help/environment",
  "zh-CN/help/faq",
  "zh-CN/help",
  "zh-CN/help/scripts",
  "zh-CN/help/testing",
  "zh-CN/help/troubleshooting",
  "zh-CN/install/ansible",
  "zh-CN/install/bun",
  "zh-CN/install/development-channels",
  "zh-CN/install/docker",
  "zh-CN/install/exe-dev",
  "zh-CN/install/fly",
  "zh-CN/install/gcp",
  "zh-CN/install/hetzner",
  "zh-CN/install",
  "zh-CN/install/installer",
  "zh-CN/install/macos-vm",
  "zh-CN/install/migrating",
  "zh-CN/install/nix",
  "zh-CN/install/node",
  "zh-CN/install/northflank",
  "zh-CN/install/railway",
  "zh-CN/install/render",
  "zh-CN/install/uninstall",
  "zh-CN/install/updating",
  "zh-CN/logging",
  "zh-CN/network",
  "zh-CN/nodes/audio",
  "zh-CN/nodes/camera",
  "zh-CN/nodes/images",
  "zh-CN/nodes",
  "zh-CN/nodes/location-command",
  "zh-CN/nodes/media-understanding",
  "zh-CN/nodes/talk",
  "zh-CN/nodes/troubleshooting",
  "zh-CN/nodes/voicewake",
  "zh-CN/perplexity",
  "zh-CN/pi",
  "zh-CN/pi-dev",
  "zh-CN/platforms/android",
  "zh-CN/platforms/digitalocean",
  "zh-CN/platforms",
  "zh-CN/platforms/ios",
  "zh-CN/platforms/linux",
  "zh-CN/platforms/mac/bundled-gateway",
  "zh-CN/platforms/mac/canvas",
  "zh-CN/platforms/mac/child-process",
  "zh-CN/platforms/mac/dev-setup",
  "zh-CN/platforms/mac/health",
  "zh-CN/platforms/mac/icon",
  "zh-CN/platforms/mac/logging",
  "zh-CN/platforms/mac/menu-bar",
  "zh-CN/platforms/mac/peekaboo",
  "zh-CN/platforms/mac/permissions",
  "zh-CN/platforms/mac/release",
  "zh-CN/platforms/mac/remote",
  "zh-CN/platforms/mac/signing",
  "zh-CN/platforms/mac/skills",
  "zh-CN/platforms/mac/voice-overlay",
  "zh-CN/platforms/mac/voicewake",
  "zh-CN/platforms/mac/webchat",
  "zh-CN/platforms/mac/xpc",
  "zh-CN/platforms/macos",
  "zh-CN/platforms/oracle",
  "zh-CN/platforms/raspberry-pi",
  "zh-CN/platforms/windows",
  "zh-CN/plugins/agent-tools",
  "zh-CN/plugins/manifest",
  "zh-CN/plugins/voice-call",
  "zh-CN/plugins/zalouser",
  "zh-CN/prose",
  "zh-CN/providers/anthropic",
  "zh-CN/providers/bedrock",
  "zh-CN/providers/claude-max-api-proxy",
  "zh-CN/providers/deepgram",
  "zh-CN/providers/github-copilot",
  "zh-CN/providers/glm",
  "zh-CN/providers",
  "zh-CN/providers/minimax",
  "zh-CN/providers/models",
  "zh-CN/providers/moonshot",
  "zh-CN/providers/ollama",
  "zh-CN/providers/openai",
  "zh-CN/providers/opencode",
  "zh-CN/providers/openrouter",
  "zh-CN/providers/qianfan",
  "zh-CN/providers/qwen",
  "zh-CN/providers/synthetic",
  "zh-CN/providers/venice",
  "zh-CN/providers/vercel-ai-gateway",
  "zh-CN/providers/xiaomi",
  "zh-CN/providers/zai",
  "zh-CN/refactor/clawnet",
  "zh-CN/refactor/exec-host",
  "zh-CN/refactor/outbound-session-mirroring",
  "zh-CN/refactor/plugin-sdk",
  "zh-CN/refactor/strict-config",
  "zh-CN/reference/AGENTS.default",
  "zh-CN/reference/RELEASING",
  "zh-CN/reference/api-usage-costs",
  "zh-CN/reference/credits",
  "zh-CN/reference/device-models",
  "zh-CN/reference/rpc",
  "zh-CN/reference/session-management-compaction",
  "zh-CN/reference/templates/AGENTS",
  "zh-CN/reference/templates/BOOT",
  "zh-CN/reference/templates/BOOTSTRAP",
  "zh-CN/reference/templates/HEARTBEAT",
  "zh-CN/reference/templates/IDENTITY",
  "zh-CN/reference/templates/SOUL",
  "zh-CN/reference/templates/TOOLS",
  "zh-CN/reference/templates/USER",
  "zh-CN/reference/test",
  "zh-CN/reference/token-use",
  "zh-CN/reference/transcript-hygiene",
  "zh-CN/reference/wizard",
  "zh-CN/security/formal-verification",
  "zh-CN/start/bootstrapping",
  "zh-CN/start/docs-directory",
  "zh-CN/start/getting-started",
  "zh-CN/start/hubs",
  "zh-CN/start/lore",
  "zh-CN/start/onboarding",
  "zh-CN/start/openclaw",
  "zh-CN/start/setup",
  "zh-CN/start/showcase",
  "zh-CN/start/wizard",
  "zh-CN/tools/agent-send",
  "zh-CN/tools/apply-patch",
  "zh-CN/tools/browser",
  "zh-CN/tools/browser-linux-troubleshooting",
  "zh-CN/tools/browser-login",
  "zh-CN/tools/chrome-extension",
  "zh-CN/tools/clawhub",
  "zh-CN/tools/creating-skills",
  "zh-CN/tools/elevated",
  "zh-CN/tools/exec",
  "zh-CN/tools/exec-approvals",
  "zh-CN/tools/firecrawl",
  "zh-CN/tools",
  "zh-CN/tools/llm-task",
  "zh-CN/tools/lobster",
  "zh-CN/tools/multi-agent-sandbox-tools",
  "zh-CN/tools/plugin",
  "zh-CN/tools/reactions",
  "zh-CN/tools/skills",
  "zh-CN/tools/skills-config",
  "zh-CN/tools/slash-commands",
  "zh-CN/tools/subagents",
  "zh-CN/tools/thinking",
  "zh-CN/tools/web",
  "zh-CN/tts",
  "zh-CN/vps",
  "zh-CN/web/control-ui",
  "zh-CN/web/dashboard",
  "zh-CN/web",
  "zh-CN/web/tui",
  "zh-CN/web/webchat"
];

function download(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function mkdirp(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Total pages: ' + pages.length);
  let ok = 0;
  const failed = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const url = baseUrl + '/' + page;
    const rel = page.replace(/^zh-CN\/?/, '');
    const filePath = rel === '' 
      ? path.join(outputDir, 'index.html') 
      : path.join(outputDir, rel + '.html');

    mkdirp(path.dirname(filePath));

    try {
      const data = await download(url);
      fs.writeFileSync(filePath, data);
      ok++;
      if (ok % 10 === 0) {
        console.log('  Done: ' + ok + ' / ' + pages.length);
      }
    } catch (e) {
      failed.push(page);
      console.log('  FAIL: ' + page + ' - ' + e.message);
    }
    await sleep(150);
  }

  console.log('Complete! OK: ' + ok + ', Failed: ' + failed.length);
  if (failed.length > 0) {
    console.log('Failed pages:');
    failed.forEach(f => console.log('  ' + f));
  }
}

main().catch(console.error);
