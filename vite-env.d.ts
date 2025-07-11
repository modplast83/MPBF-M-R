/// <reference types="vite/client" />

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