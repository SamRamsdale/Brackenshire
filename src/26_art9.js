// ---- art9 ----
// apply the art entries to the species table
for (const id in ART) { const a = ART[id], sp = SPECIES[id]; if (!sp) continue; if (a.pal) sp.pal = a.pal; if (a.keep) sp.keep = a.keep; if (a.sh !== undefined) sp.sh = a.sh; if (a.draw) sp.art = a.draw; if (a.dex) sp.dex = a.dex; }