import { readdirSync } from 'fs';
import { resolve, join, extname } from 'path';

export async function loadCommands(commands, dir = './commands') {
  const fullPath = resolve(dir);
  const entries = readdirSync(fullPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = join(fullPath, entry.name);

    if (entry.isDirectory()) {
      await loadCommands(commands, entryPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      try {
        const mod = await import(`file://${entryPath}`);
        // Single command export
        if (mod.name && mod.execute) {
          commands.set(mod.name, { execute: mod.execute });
        }
        // Multiple exports (e.g., moderation.js exports ban, kick, etc.)
        for (const key of Object.keys(mod)) {
          if (key.endsWith('Name') && key !== 'name') {
            const base = key.replace('Name', '');
            const execKey = `${base}Exec`;
            if (mod[execKey]) {
              commands.set(mod[key], { execute: mod[execKey] });
            }
          }
        }
      } catch (e) {
        console.error(`Failed to load command ${entryPath}:`, e.message);
      }
    }
  }
}
