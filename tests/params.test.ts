/** Chaque montant de vergunning et de naheffing affiché est retrouvé mot pour mot dans la verordening officielle
 *  (XML du CVDR téléchargé le 2026-11-13, data-raw/cvdr). Un montant tapé de travers fait échouer le test. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import P from '../src/data/params-2026.json';
const texte = (f: string) => readFileSync(new URL(`../data-raw/cvdr/${f}.xml`, import.meta.url), 'utf8')
  .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8364;|&euro;/g, '€').replace(/&#[0-9]+;/g, (m) => String.fromCharCode(Number(m.slice(2, -1)))).replace(/\s+/g, ' ');
describe('montants lus dans les verordeningen', () => {
  for (const [slug, s] of Object.entries(P.steden)) it(slug, () => { const t = texte(s.file); for (const q of s.q) expect(t, `${slug}: « ${q} »`).toContain(q); });
  it('maximum wettelijk', () => expect(texte(P.naheffingMax.file)).toContain(P.naheffingMax.q));
});
