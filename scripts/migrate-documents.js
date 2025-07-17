#!/usr/bin/env node

import { spawn } from 'child_process';

// Run drizzle-kit push and automatically select the first option (create table)
const child = spawn('npm', ['run', 'db:push'], { stdio: ['pipe', 'inherit', 'inherit'] });

child.stdin.write('\n'); // Select the first option (create table)
child.stdin.end();

child.on('close', (code) => {
  console.log(`Migration completed with code ${code}`);
  process.exit(code);
});