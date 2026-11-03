# Brackenshire changelog and open items (newest first)

Read with `claude/spritecook-template-set.md` (pipeline, template list), `claude/brackenshire-style-guide.md` (the look), `claude/sprite-sources.md` (where art can come from) and `claude/retro-diffusion-notes.md`. This file is the latest word on status.

## 4 Oct 2026, 16:00: Retro Diffusion batch, rear views now required (preview version 7, project build)
- **Retro Diffusion connected and its free $0.50 spent** ($0.02 left). Two best-tier sheets (18 Beasties, as good as SpriteCook and matching the look) and three cheaper-tier sheets (19 usable after in-house clean-up, plainer). Details, request ids and the recipe: `claude/retro-diffusion-notes.md`. Scripts `rd_slice.py`, `rd_parts.py`, `rd_enhance.py`: `claude/brackenshire-art-tools.md`.
- **Fronts with new art: 48 of 151.** 29 at full quality (11 SpriteCook, 18 Retro best tier), 19 cheaper-tier (first in line for a redo). 103 species still on old art.
- **Sam: "We need the back of all of the beasties for battle."** Rear views are now a requirement, not a nice-to-have. Have a rear view: the three starters (SpriteCook) and the first bird (made in-house from its front). **147 to go.** Until then the player's side shows the mirrored front (new-art species) or the old rear view (old-art species).
- Rough free budget: remaining fronts 103 (13 SpriteCook sheets, 26 credits) plus 147 rear views (about 19 sheets, 38 credits) = about 64 credits, i.e. SpriteCook's November and December allowances, unless a second free source works. Rear views by the sheet are **untested**: run one test sheet (front sheet as the reference, "same creatures, same positions, seen from behind") and get Sam's verdict first.
- **Next free source to try: Recraft** (reported 50 credits a day; `https://mcp.recraft.ai/mcp`, OAuth). Sam has the steps; not connected yet.
- **Skill proposed: `monster-sprite-sheets`** (recipes for best-quality sheets, rear views, cutting, checks, no-spend rules). Shown to Sam twice (second card adds rear views); check `ListSkills` to see whether he saved it.
- In-house painter verdict stands: not good enough for new Beasties ("That one isnt great"). The in-house evolved bird was replaced by the Retro one.

## 4 Oct 2026, 15:00: in-house sprite trial (preview version 5)
- Method and scripts in `claude/brackenshire-inhouse-sprites.md`. Kept only for the first bird's rear view and for small fixes.
- Skills and plugins search: nothing useful that is free beyond what is connected. Sam's own `monster-rpg-builder` skill is enabled (its sprite section describes the old code-drawn pipeline).

## 4 Oct 2026, 14:00: images 19 and 20 are in (preview version 4)
- **Walking (image 19, `b7149228-18ff-4cf6-bef1-310800bf0d7b`).** The sheet drew the hero shorter than the standing template (43 px against 53, same head width), so whole poses could not be swapped in. `tools/walk.py` saves the **legs** of the six poses as strips (`p_legs_f1/f2/b1/b2/l1/l2`); `walkFrame` puts them under the standing body (body dips, arms swing in code). Everyone else gets the same strips with trousers and shoes recoloured by colour (`legStrip`). The code-made legs remain as the fallback.
- **Chapter 1 Beasties (image 20, `f5b1f154-88b8-4724-ae3b-fd39e818f745`, raw version).** `tools/beasts20.py` cuts the eight from the white background and shrinks them to battle size: burrabit, pipwren, buzzlet, crawlie, woolt, cairnling, grimrat, mushlet (`b_<id>_f`). `creatureSprite` uses the **mirrored front** when a species has no back image.
- SpriteCook credits: **0** until about 4 Nov (assumed date; check `get_credit_balance`).

## 4 Oct 2026, 13:00: credit indicator (preview version 3)
- `credits` section plus a line under the controls in the page shell (added by `build.py`): "Art credits: 0 left, 40 more around 4 Nov (N days)". Update `ART_CREDITS` in `src/credits.js` whenever credits are spent or the real refill day is known.

## 4 Oct 2026, afternoon: Sam's first play-through notes (preview version 2)
- **People:** `personHD`: the Professor has a full head of hair; glasses are light steel frames; the bag strap is painted out on everyone except the hero; white clothes shade without a pink tint.
- **Battle animations:** Sam likes them. Leave alone.
- **Orbs:** `orbSprite` replaced by a 24 px glass orb with a ley-energy swirl and a tilted brass ring, tinted per orb type. Original design; keep it clear of any other franchise's ball.
- **Follower movement:** `gaitOf` / `gaitOffset`: Flying and Ghost float, small Beasties (base total under 340) hop, heavy ones lumber with a sway and dust, the rest trot.
- **Losing to a trainer:** fixed in `trainerBattle` (beaten flag only after a win; older saves keep wrongly-set flags).
- **Critical hits:** already in the game (1 in 16, 1 in 8 for high-crit moves, 1.5x damage).
- **Mouse/touch:** `mouse` section; menus register clickable areas with `hot()` while drawing. Point to select, click to confirm, click the battle scene to go back from the move list, right-click = Back, wheel = up/down, click on a message = Confirm. Covered: title, list menus, start menu, party, bag rows, battle action and move menus. `test/mouse.py` plays a battle by mouse only.
- **Interiors:** wood, tile and honeycomb floors, plaster walls with wainscot, windows, tables, counters, red carpet, television; bookshelf, bed, pot plant and doormat cut from the interior template (`tools/interior.py`), standing up via `interiorTall`. Other furniture and floor types use the old art over the new floor.
- **Style question:** Sam asked about simpler, more HeartGold-like sprites; advised to keep the current look. He went with more generated Beasties.
- The first boss fight on the moor (levels 11 and 12) is unchanged.

## Open items
1. **Rear views for 147 Beasties** (test one sheet first; see the 16:00 entry).
2. **Fronts for the 103 species still on old art**, by where Sam is in the game, families together; then redo the 19 cheaper-tier ones.
3. Connect and test Recraft; otherwise SpriteCook credits from about 4 Nov.
4. Move the build to the main artifact once Sam approves (needs the full read of the live file first; see the template-set doc).
5. Interiors: machines, gym planters, statues, ice, metal, stone, carpet floors still old art; walls could be taller.
6. Outdoor tiles still old: cobbles, bridge, sand, snow, forest floor, caves, cliffs, graves, mushrooms. Special buildings still old. Window glow at night for template buildings.
7. Clickable areas for the remaining screens (journal, storage, shop, type guide, summary pages).
