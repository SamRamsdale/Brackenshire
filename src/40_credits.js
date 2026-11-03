// ---- credits ----

// ================= ART CREDIT NOTE =================
// A small line under the controls saying when the free SpriteCook credits come back, so Sam knows when more
// Beasties can be made. The game cannot ask SpriteCook, so this is worked out from what was known when it was built:
// the account was opened and the credits used up on 4 Oct 2026, and the free plan gives 40 credits every month.
const ART_CREDITS = { left: 0, perMonth: 40, day: 4, usedUp: [2026, 9, 4] };   // month is 0-based: 9 = October
function creditNote() {
  const el = document.getElementById('credits'); if (!el) return;
  const now = new Date(), first = new Date(ART_CREDITS.usedUp[0], ART_CREDITS.usedUp[1] + 1, ART_CREDITS.day);
  const fmt = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (now < first) { const days = Math.max(1, Math.ceil((first - now) / 864e5)); el.textContent = `Art credits: ${ART_CREDITS.left} left · ${ART_CREDITS.perMonth} more around ${fmt(first)} (${days} day${days === 1 ? '' : 's'})`; }
  else el.textContent = `Art credits: ${ART_CREDITS.perMonth} should be back (they refill around the ${ART_CREDITS.day}th) · ask Claude for more Beasties`;
}
creditNote(); setInterval(creditNote, 3600e3);