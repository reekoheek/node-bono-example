const path = require('path');
const Umzug = require('umzug');
const { spawnSync } = require('child_process');
const umzug = new Umzug({});

function logUmzugEvent (eventName) {
  return function (name, migration) {
    console.info(`${name} ${eventName}`);
  };
}
umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated', logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted', logUmzugEvent('reverted'));

async function cmdStatus () {
  let executed = (await umzug.executed()).map(m => {
    m.name = path.basename(m.file, '.js');
    return m;
  });
  let pending = (await umzug.pending()).map(m => {
    m.name = path.basename(m.file, '.js');
    return m;
  });

  const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
  const status = {
    current: current,
    executed: executed.map(m => m.file),
    pending: pending.map(m => m.file),
  };

  console.info(JSON.stringify(status, null, 2));

  return { executed, pending };
}

function cmdUp () {
  return umzug.up();
}

async function cmdNext () {
  let { pending } = await cmdStatus();
  if (pending.length === 0) {
    throw new Error('No pending migrations');
  }
  const next = pending[0].name;
  return umzug.up({ to: next });
}

function cmdDown () {
  return umzug.down({ to: 0 });
}

async function cmdPrev () {
  let { executed } = await cmdStatus();
  if (executed.length === 0) {
    throw new Error('Already at initial state');
  }
  const prev = executed[executed.length - 1].name;
  return umzug.down({ to: prev });
}

function cmdReset () {
  // TODO: reset procedures here!

  spawnSync('rm', ['-rf', './files', './umzug.json']);
}

(async () => {
  const cmd = (process.argv[2] || '').trim();
  try {
    switch (cmd) {
      case 'status':
        await cmdStatus();
        break;

      case 'up':
        await cmdUp();
        break;

      case 'next':
        await cmdNext();
        break;

      case 'down':
        await cmdDown();
        break;

      case 'prev':
        await cmdPrev();
        break;

      case 'reset':
        await cmdReset();
        break;

      default:
        console.info(`Invalid cmd: ${cmd}`);
        console.info(`Usage: node migrate.js [status|up|down|next|prev|reset]`);
        process.exit(1);
    }

    console.info('OK');
  } catch (err) {
    console.info(`ERR cmd:${cmd.toUpperCase()}`);
    console.info(err);
  }

  if (cmd !== 'status' && cmd !== 'reset') {
    await cmdStatus();
  }
})();
