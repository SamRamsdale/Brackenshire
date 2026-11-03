# Brackenshire Beastie art guide (for redrawing species)

You are redrawing creature sprites for a HeartGold/SoulSilver-style monster-catching game called Brackenshire
(a fictional, British-countryside-flavoured region). The player's complaint: the Beasties looked samey, and
all shared the same face. Goal: every species must look **individually unique**, polished and clean, at the
quality of official handheld monster games, while being **100% original designs**.

## Hard rules
- **Original designs only.** Do not recreate or closely imitate any existing Pokémon, Digimon, Yo-kai or any
  other franchise character. Base designs on real animals, plants, objects and British folklore, pushed into a
  fresh fantasy creature. If a design starts to resemble a famous monster, change the silhouette/colours.
- Keep each species' **concept, name, types and journal entry** (the `dex` text in the species definition).
  You may lightly tweak the `dex` text only if your design changes a detail it mentions (use `dex:` in BEAST).
- Only write to **your own file** `src/art/<batch>.js`. Never edit any other file.
- Wrap your whole file in an IIFE: `(() => { ... })();` All batch files are concatenated into one script, so
  top-level `const`/`function` names would collide. `BEAST(...)` is global and is how you register designs.
- Evolution families share colours and signature traits, but each stage must add new features (not just be
  bigger). Final forms should look powerful and elaborate; first forms cute and simple.

## Where things are
- Species data (names, types, dex text, old palettes, old draw code): `src/creatures.js` (first 28 species) and
  `src/sp1.js`..`src/sp4.js` (`SP('id', 'Name', ['Type'], ...)`). Evolutions: `evo: [level, 'nextId']`.
- Renderer: `src/render.js` (read the API section below instead of the code if you like).
- Shared parts: `K` in `src/kit.js`, `K2` in `src/art0.js`.
- **Reference quality**: `src/art/a_starters.js` (9 starter designs). Read it before starting.

## Workflow
1. Read `src/art/a_starters.js`, then the old definitions of your species (for concept, types, dex, palette).
2. Write designs in your file with `BEAST('id', { pal: {...}, keep: [...], sh: <hue shift>, draw(g) { ... } })`.
3. Render a contact sheet and LOOK at it (use the Read tool on the PNG):
   `cd /home/claude/game && python3 test/art.py "ids=id1,id2,id3&files=src/art/<batch>.js&s=3&c=3" test/<batch>_sheet.png`
   The sheet shows: the 80px front sprite at 3x; the back view (top right) and the shiny variant (below it) at
   half size; the 24px overworld follower (bottom right corner of the big sprite). Console errors are printed.
   Use `&mode=big&c=2&s=5` to inspect a couple of sprites up close.
4. Iterate until every sprite is clean, readable and distinct. Expect 3-6 passes per batch.
5. Finish by rendering your whole batch in one sheet and checking it one last time.

## Coordinate system
- Design space is 64x64 units; the sprite is rendered at 80px (1 unit = 1.25px) in battle, 64px in menus,
  32/28px icons and 24px as the overworld follower. Draw once; it scales.
- Creatures face the **viewer's left** in a 3/4 view (their near eye is on the left, the far eye smaller/right).
- Feet/base rest on **y ≈ 59-61**. Keep everything inside x 2..62, y 2..62 (the outline needs 1px).
- Size by stage: first forms ~55-65% of the frame height, middle ~75-85%, finals ~90-100%. Big heavy finals
  can fill the frame width. Single-stage creatures: size them by how imposing they are.
- Angles for K helpers are degrees clockwise from straight up.

## Drawing API (`g` is passed to draw; palette colours are `g.P.a`, `g.P.b`...)
Shapes are painted in order (painter's algorithm). Every solid shape gets automatic lighting (light from the
top-left), colour ramps, a dark outer outline, and a softer contour line where it overlaps things drawn
earlier. Primitives return a part id.
- `g.e(cx, cy, rx, ry, col, o)` ellipse. `g.c(cx, cy, r, col, o)` circle. `g.re(cx, cy, rx, ry, ang, col, o)` rotated ellipse.
- `g.l(x1, y1, x2, y2, r, col, o)` capsule (limb/stick).
- `g.tube([x0,y0, x1,y1, ...], r0, r1, col, o)` smooth tapered curve through points (tails, necks, horns, tentacles, vines).
- `g.p([x0,y0, x1,y1, ...], col, o)` polygon (ears, spikes, beaks, fins, plates) with bevelled shading.
- `g.fur(cx, cy, rx, ry, col, {n, amp, a0, a1})` ellipse with tufted/spiky edge (n tufts, amp 0.1-0.4; optional
  angle range a0..a1 in degrees, 0 = right, 90 = down, -90 = up) for manes, ruffs, fluffy cheeks, feathers.
- `g.dot(x, y, r, col)` flat dot (freckles, sparkles). 
- Options `o`: `{ ring: false }` = marking (no contour, inherits shading of what it covers);
  `{ shade: false }` flat colour; `{ mat: 'soft'|'fur'|'gloss'|'metal'|'stone'|'glow' }` material
  (`glow` = flames/energy, barely shaded; `gloss`/`metal` add highlights); `{ gloss: true }`;
  `{ line: false }` = don't draw a contour where this part overlaps earlier parts (seamless joins);
  `{ lt, dk, oc }` override light/shade/outline colours; `{ depth }` flatten/round the lighting (default 1).
- `g.on(ids, () => {...})` paint markings clipped to earlier parts (bellies, stripes, spots, patches, socks):
  anything drawn inside only lands on those parts' pixels and follows their shading. Pass one id or an array.
- `g.group(() => {...})` shapes drawn inside merge with no internal contour lines between them.
- `g.back` is true when drawing the back view (the image is mirrored for you and faces are skipped
  automatically). Wrap **face-only markings** (muzzle patches, masks, face stripes) in `if (!g.back)` so the back
  view doesn't show an eyeless face. You may also draw back-only details (`if (g.back) ...`).
- `g.small` (size < 40) and `g.tiny` (< 30): skip fussy details at small sizes if they turn to noise.

### Faces (flat features, drawn last; skipped automatically for the back view)
- `g.eye(x, y, r, type, o)` / `g.eyes(x1, x2, y, r, type, o)` (second eye placed at x2, `o.far` scales it,
  `o.dy` shifts it). Types:
  - `cute` big glossy dark eye with coloured lower iris (babies)  · `bead` small shiny bead · `dot` tiny dot
  - `round` white eye, big coloured iris, pupil, glint (friendly) · `star` round with a star glint (sparkly/fairy)
  - `sharp` almond eye with heavy upper lid slanting to the inner corner (cool/fierce; `slit: true` for a slit pupil)
  - `angry` round with a slanted lid of skin colour (`lid: colour`) · `sleepy` half-closed lid (`lid: colour`)
  - `happy` closed ^ arc · `closed` sleeping curve · `slit` reptile eye (yellow, slit pupil; `sc:` recolours it)
  - `glow` glowing eye with no pupil (`iris:` colour) · `glowcool` glowing almond (`sc:` colour) · `hollow`
    dark socket with a small glowing pupil (`iris:`) · `compound` faceted insect eye (`iris:` colour)
  - `button` shiny black button (dolls/objects)
  - Options: `iris: '#hex'` (vary it! amber, green, violet, teal, red, gold...), `side: -1 | 1` (left/right eye,
    sets which way slants face), `look: -1..1` (pupil direction; default looks left), `brow: 1` (angry brow) or
    `brow: -1` (worried), `browCol`, `lash: true` (lashes), `lid`, `sc`.
- `g.visor(x1, x2, y, h, col)` a single glowing visor band (robots, masks).
- `g.mo(type, x, y, w, o)` mouth, centred at x, y, width w (typically 3-6 units). Types: `line smile frown smirk
  cat fang fangs open roar grin teeth o tongue beak` (`o.h` height for open/roar/grin/teeth; `o.fx` fang offset;
  `beak` takes `o.dir`, `o.c1`, `o.c2` for a small beak).
- `g.nose(x, y, type, {s})` types `dot button pink tri nostrils`; `s` scales it.
- `g.blush(x, y, r)` rosy cheek · `g.cheek(x, y, r, col)` coloured cheek pouch/patch (e.g. electric cheeks)
- `g.whiskers(x, y, dir, n, len, col)` thin whiskers (dir -1 = pointing left).

### Shared parts
- `K.pt(x, y, ang, d)` point at distance d along angle. `K.leaf(g, x, y, ang, len, w, col, vein)`,
  `K.wing(g, x, y, ang, len, w, col, col2, n)` feathered wing, `K.batwing(g, x, y, dir, span, h, col, mem)`,
  `K.bugwing(g, cx, cy, rx, ry, ang, col, vein)`, `K.horn(g, x, y, ang, len, w, col, curl)`,
  `K.crystal(g, x, y, w, h, ang, col)`, `K.spikes(g, cx, cy, r, a0, a1, n, len, col, w)`,
  `K.bushy(g, x, y, ang, len, w, col, tip)`, `K.earR(g, x, y, r, col, inner)` round ear.
- `K2.ear(g, x, y, ang, len, w, col, inner, tip)` pointed ear/fin with inner and tip colours (returns id).
- `K2.flame(g, x, y, h, w, ang, outer, mid, core, {licks})` layered flame (ang 0 = pointing up, 180 = down).
- `K2.ruff(g, cx, cy, rx, ry, col, n, amp, a0, a1, o)` tufted mane/ruff. `K2.claws(g, x, y, n, span, len, dir, col)`.
- `K2.toes(g, x, y, n, span, col)` toe lines. `K2.zig(g, x1, y1, x2, y2, n, h, col)` row of spikes along a line.
- `K2.stripes(g, ids, x0, y0, x1, y1, ang, gap, width, col)` stripes clipped to parts.
- `K2.spots(g, ids, [[x, y, r], ...], col)` spots clipped to parts.
- Helpers: `mix(c1, c2, t)`, `lt(c, t)` lighter, `dk(c, t)` darker (all hex colours; **always use hex strings**).

## Design checklist (every species)
- A **distinctive silhouette**: readable as a black shape. Pose with character (sitting, prowling, rearing,
  hovering, coiled...). Avoid every creature being a round blob with two ellipse feet.
- A **distinctive face**: choose the eye type, iris colour, mouth and nose deliberately to express personality.
  No two species in a family should have identical faces, and avoid reusing the same combo across the batch.
- **Details that tell the story** of the dex entry (props, markings, textures: stripes, spots, scales, bark,
  feathers, crystal facets, cracks, patches).
- **Depth**: draw far-side limbs/wings first in a darker colour (`mix(col, '#1a1030', .3)`), near side last.
- **Colour**: 3-6 palette colours, one clear accent. Good contrast between body and markings. Keep the old
  palette's general identity unless it was weak. Check the shiny version (hue-shifted by `sh` degrees, skipping
  `keep` keys) looks good too; keep whites/creams/metals in `keep`.
- **Clean pixels**: no stray one-pixel bits, no mushy overlaps, no details smaller than ~1.5 units at 80px.
  Check the 24px follower still reads as the creature.
- Back view: no eyeless faces (wrap face markings in `if (!g.back)`).

## Example (from the starters)
```js
BEAST('cindle', {
  pal: { a: '#ec6a3a', b: '#fff2dc', c: '#ffd650', d: '#ff8c2e', e: '#6e2c26', f: '#ffcf96' }, keep: ['b', 'f'], sh: 175,
  draw(g) {
    const { a, b, c, d, e, f } = g.P;
    g.tube([38, 56, 48, 54, 54, 46, 54, 36], 3.4, 6.2, a, { mat: 'fur' });   // tail
    K2.flame(g, 54.5, 32, 10, 5.2, 12, d, c, '#fff6c8');                    // ember tip
    const body = g.e(31, 49, 10.5, 10.5, a);
    g.on(body, () => g.e(26.5, 51, 6.2, 9, b));                             // chest bib marking
    K2.ear(g, 19.5, 26, -30, 14, 5.4, a, f, e);                              // ears behind the head
    const head = g.e(29.5, 31.5, 12.5, 11, a);
    if (!g.back) g.on([head], () => g.e(22.5, 36, 7, 5, b));                // muzzle (front only)
    g.eye(23.4, 31.2, 3.15, 'round', { iris: '#e8901a', side: -1, look: -.5 });
    g.eye(34.4, 30.6, 2.9, 'round', { iris: '#e8901a', side: 1, look: -.5 });
    g.nose(17.6, 34.6, 'button', { s: 1.15 });
    g.mo('fang', 21.5, 38.2, 4.4);
    g.blush(18.8, 36.8, 1.6);
  }
});
```
