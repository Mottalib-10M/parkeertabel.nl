/**
 * Adres → zone. L'adresse tapée part vers la Locatieserver de PDOK (Kadaster, API publique) qui rend la commune et
 * les coordonnées ; la zone est trouvée dans le navigateur par point-dans-polygone sur la géométrie du Nationaal
 * Parkeer Register (public/data/geo/<stad>.json). Là où le registre n'a pas de géométrie (ZONDER_KAART : Utrecht, Maastricht),
 * on le dit sous le champ et après la recherche et on laisse choisir la zone dans la liste. Le résultat recharge la rekenhulp avec ?stad=…&zone=….
 */
import { useState } from 'react';
import { zoneAt } from '../../lib/engine/parking';
import type { Lang } from '../../lib/format';
import { VOORBEELD, ZONDER_KAART } from '../../lib/adres-voorbeeld';

const GEM: Record<string, string> = { "'s-Gravenhage": 'den-haag', "'s-Hertogenbosch": 'den-bosch', 'Den Haag': 'den-haag' };
const slugOf = (g: string) => GEM[g] ?? g.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
const KNOWN = ['amsterdam', 'utrecht', 'rotterdam', 'den-haag', 'groningen', 'eindhoven', 'leiden', 'den-bosch', 'haarlem', 'maastricht', 'nijmegen', 'arnhem', 'breda', 'delft', 'zwolle', 'amersfoort', 'tilburg', 'almere', 'enschede', 'apeldoorn', 'dordrecht', 'alkmaar', 'zaanstad', 'amstelveen'];

/** `stay` : rester sur la page (pages de sujet : gratis, dagkaart, naheffing) au lieu d'aller à la page de la ville. */
interface Props { lang: Lang; target: string; cityLinks?: Record<string, string>; stay?: boolean }
export default function AdresZoeker({ lang, target, cityLinks = {}, stay = false }: Props) {
  const nl = lang === 'nl';
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState('');
  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim().length < 4) { setMsg(nl ? 'Typ een straat met huisnummer en plaats.' : 'Type a street with house number and town.'); return; }
    setBusy(true); setMsg(''); setLink('');
    try {
      const u = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?rows=1&fq=type:adres&q=${encodeURIComponent(q)}`;
      const r = await (await fetch(u)).json();
      const d = r?.response?.docs?.[0];
      if (!d) { setMsg(nl ? 'Adres niet gevonden. Controleer de schrijfwijze.' : 'Address not found. Check the spelling.'); return; }
      const slug = slugOf(d.gemeentenaam ?? '');
      if (!KNOWN.includes(slug)) { setMsg(nl ? `${d.weergavenaam}: deze gemeente staat (nog) niet op deze site.` : `${d.weergavenaam}: this municipality is not (yet) on this site.`); return; }
      const m = /POINT\(([-\d.]+) ([-\d.]+)\)/.exec(d.centroide_ll ?? '');
      let zone: string | null = null;
      if (m) { const geo = await (await fetch(`/data/geo/${slug}.json`)).json(); zone = zoneAt(geo, [Number(m[1]), Number(m[2])]); }
      const base = stay ? target : (cityLinks[slug] ?? target);
      const qs = `?stad=${slug}${zone ? `&zone=${encodeURIComponent(zone)}` : ''}`;
      if (zone) { window.location.assign(`${base}${qs}#rekenhulp`); return; }
      setMsg(nl ? `${d.weergavenaam}: geen betaald-parkeerzone gevonden op dit punt, of de gemeente levert geen kaart aan het register. Kies de zone in de lijst van de rekenhulp.` : `${d.weergavenaam}: no paid-parking zone found at this point, or the municipality supplies no map to the register. Pick the zone from the calculator's list.`);
      setLink(`${base}${qs}#rekenhulp`);
    } catch { setMsg(nl ? 'De adreszoeker van PDOK reageert niet. Kies de zone in de lijst.' : 'The PDOK address search is not responding. Pick the zone from the list.'); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={go} className="rounded-xl border border-navy-200 bg-navy-50 p-3" role="search">
      <label htmlFor={`adres-${lang}`} className="block text-sm font-medium text-navy-800">{nl ? 'Weet u uw zone niet? Zoek op adres' : 'Not sure of your zone? Search by address'}</label>
      <div className="mt-1 flex gap-2">
        <input id={`adres-${lang}`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={VOORBEELD.adres} aria-describedby={`adres-${lang}-hulp`} autoComplete="street-address" className="min-h-12 w-full min-w-0 rounded-lg border border-navy-300 bg-white px-3 text-base text-navy-900" />
        <button type="submit" disabled={busy} className="min-h-12 shrink-0 rounded-lg bg-accent-700 px-4 font-semibold text-white hover:bg-accent-800">{nl ? 'Zoek' : 'Search'}</button>
      </div>
      <p id={`adres-${lang}-hulp`} className="mt-0.5 text-xs leading-tight text-navy-600">{nl ? `Bijv. ${VOORBEELD.adres}. ${ZONDER_KAART.join(' en ')}: kies de zone in de lijst (geen kaart).` : `E.g. ${VOORBEELD.adres}. ${ZONDER_KAART.join(' and ')}: pick the zone from the list (no map).`}</p>
      {msg && <p className="mt-2 text-sm text-navy-800" aria-live="polite">{msg}{link && <> <a href={link} className="font-medium text-accent-700 underline">{nl ? 'Open de rekenhulp van deze stad' : "Open this city's calculator"}</a></>}</p>}
    </form>
  );
}
