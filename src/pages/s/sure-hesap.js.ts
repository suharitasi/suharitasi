// /s/sure-hesap.js — tarayıcı betikleri (hesap-ceza.js, karar-motoru.js) için süre hesabı modülü.
// Kaynak tek: src/data/sure-hesap.js (bu uç dosyayı olduğu gibi sunar).
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';

export const GET: APIRoute = () =>
  new Response(readFileSync('src/data/sure-hesap.js', 'utf8'), {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  });
