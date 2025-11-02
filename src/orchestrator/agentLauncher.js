const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = process.env.AGENT_CONFIG_PATH || path.resolve(process.cwd(), 'config/agent-mesh.json');

function parseArgs(argv) {
  const args = { configPath: DEFAULT_CONFIG };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--agent' || key === '-a') {
      args.agentId = argv[i + 1];
      i += 1;
    } else if (key === '--config' || key === '-c') {
      args.configPath = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function resolveAgentDefinition(configPath, agentId) {
  const absolute = path.isAbsolute(configPath) ? configPath : path.resolve(process.cwd(), configPath);
  const raw = fs.readFileSync(absolute, 'utf8');
  const config = JSON.parse(raw);
  const definition = config.agents.find((agent) => agent.id === agentId);

  if (!definition) {
    throw new Error(`Agent definition for ${agentId} not found in ${absolute}`);
  }

  return definition;
}

async function launch() {
  const args = parseArgs(process.argv.slice(2));
  const agentId = args.agentId || process.env.AGENT_ID;

  if (!agentId) {
    throw new Error('Agent ID not provided via --agent or AGENT_ID environment variable.');
  }

  const definition = resolveAgentDefinition(args.configPath, agentId);
  const runtime = definition.runtime || {};

  if (!runtime.module) {
    throw new Error(`Runtime module not specified for agent ${agentId}`);
  }

  const modulePath = path.isAbsolute(runtime.module)
    ? runtime.module
    : path.resolve(process.cwd(), runtime.module);

  const agentModule = require(modulePath);
  let AgentConstructor = null;

  if (runtime.export && agentModule[runtime.export]) {
    AgentConstructor = agentModule[runtime.export];
  } else if (agentModule.default) {
    AgentConstructor = agentModule.default;
  } else if (typeof agentModule === 'function') {
    AgentConstructor = agentModule;
  } else if (agentModule.Agent) {
    AgentConstructor = agentModule.Agent;
  } else {
    const exportsList = Object.keys(agentModule);
    if (exportsList.length === 1 && typeof agentModule[exportsList[0]] === 'function') {
      AgentConstructor = agentModule[exportsList[0]];
    }
  }

  if (typeof AgentConstructor !== 'function') {
    throw new Error(`Unable to resolve agent class for ${agentId} from module ${modulePath}`);
  }

  const agent = new AgentConstructor(definition, runtime.options || {});

  const shutdown = async (reason) => {
    try {
      await agent.stop(reason);
    } catch (error) {
      console.error(`[AgentLauncher] Failed to stop agent ${agentId}:`, error.message);
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  try {
    await agent.start();
  } catch (error) {
    console.error(`[AgentLauncher] Agent ${agentId} failed to start:`, error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  launch().catch((error) => {
    console.error('[AgentLauncher] Fatal error', error.message);
    process.exit(1);
  });
}

module.exports = { launch };
