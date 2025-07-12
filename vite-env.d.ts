/// <reference types="vite/client" />
/// <reference types="node" />

// Vite module type definitions
declare module "vite" {
  export interface UserConfig {
    plugins?: any[];
    resolve?: {
      alias?: Record<string, string>;
    };
    root?: string;
    build?: {
      outDir?: string;
      emptyOutDir?: boolean;
    };
    server?: any;
    define?: Record<string, any>;
    css?: any;
    esbuild?: any;
    optimizeDeps?: any;
    ssr?: any;
    worker?: any;
    base?: string;
    mode?: string;
    logLevel?: string;
    clearScreen?: boolean;
    envDir?: string;
    envPrefix?: string | string[];
    appType?: string;
    experimental?: any;
  }

  export interface Plugin {
    name: string;
    config?: (config: UserConfig, env: { command: string; mode: string }) => UserConfig | null | void;
    configResolved?: (config: UserConfig) => void;
    configureServer?: (server: any) => void;
    buildStart?: (options: any) => void;
    buildEnd?: (error?: Error) => void;
    generateBundle?: (options: any, bundle: any) => void;
    closeBundle?: () => void;
    [key: string]: any;
  }

  export function defineConfig(config: UserConfig | ((env: { command: string; mode: string }) => UserConfig)): UserConfig;
  export function loadEnv(mode: string, envDir: string, prefixes?: string | string[]): Record<string, string>;
  export function createServer(config?: UserConfig): Promise<any>;
  export function build(config?: UserConfig): Promise<any>;
  export function preview(config?: UserConfig): Promise<any>;
  export function resolveConfig(config: UserConfig, command: string, defaultMode?: string): Promise<any>;
  export function optimizeDeps(config: UserConfig): Promise<any>;
  export function createLogger(level?: string, options?: any): any;
  export function mergeConfig(defaults: UserConfig, overrides: UserConfig): UserConfig;
  export function searchForWorkspaceRoot(current: string, root?: string): string;
  export function normalizePath(id: string): string;
  export function transformWithEsbuild(code: string, filename: string, options?: any): Promise<any>;
  export function send(req: any, res: any, content: string | Buffer, type: string, options?: any): void;
  
  // Re-export commonly used types
  export type { UserConfig as InlineConfig };
  export type { Plugin as PluginOption };
}

// Vite plugin type declarations
declare module "@vitejs/plugin-react" {
  export default function react(options?: any): any;
}

declare module "@replit/vite-plugin-runtime-error-modal" {
  export default function runtimeErrorOverlay(options?: any): any;
}

declare module "@replit/vite-plugin-shadcn-theme-json" {
  export default function themePlugin(options?: any): any;
}

declare module "@replit/vite-plugin-cartographer" {
  export function cartographer(options?: any): any;
}

// Node.js path module type definitions for vite.config.ts
declare module "path" {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
  export function isAbsolute(path: string): boolean;
  export function relative(from: string, to: string): string;
  export function normalize(path: string): string;
  export const sep: string;
  export const delimiter: string;
  export const posix: any;
  export const win32: any;
  export default {
    resolve,
    join,
    dirname,
    basename,
    extname,
    isAbsolute,
    relative,
    normalize,
    sep,
    delimiter,
    posix,
    win32
  };
}

// Extended ImportMeta interface for Node.js compatibility
interface ImportMeta {
  url: string;
  dirname: string;
  filename: string;
  resolve?(specifier: string): string;
}

// Node.js process global type definitions
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      PORT?: string;
      DATABASE_URL?: string;
      REPL_ID?: string;
      [key: string]: string | undefined;
    }
  }
  
  var process: {
    env: NodeJS.ProcessEnv;
    argv: string[];
    cwd(): string;
    exit(code?: number): never;
    platform: string;
    version: string;
  };
}

// Also declare process for module scope (needed for vite.config.ts)
declare var process: {
  env: {
    NODE_ENV?: 'development' | 'production' | 'test';
    PORT?: string;
    DATABASE_URL?: string;
    REPL_ID?: string;
    [key: string]: string | undefined;
  };
  argv: string[];
  cwd(): string;
  exit(code?: number): never;
  platform: string;
  version: string;
};