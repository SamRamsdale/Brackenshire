# SpriteCook art: template set, pipeline and status (checkpoint 4 Oct 2026, midday)

**Read this first for any art work.** It replaces the "SpriteCook art pilot" section of `claude/brackenshire-design-notes.md`.

## Decisions from Sam
- He does not like the old code-drawn sprites, people or world visuals. Story, maps and layout must not change.
- **Spend no money.** SpriteCook free plan only (40 credits a month). **4 credits left** this month; ask before spending them.
- SpriteCook makes a small **template set**; everything else is derived from it in-house. Sam approved the look of the templates.
- Keep creatures a surprise: never describe or name them to Sam (starters are fine to call fire/water/grass starter).

## Where things stand
- `Brackenshire/brackenshire.html` in this project is the **new build** (new art layer in, regression passes).
- **Preview artifact** (new art, own save, no cloud save): https://claude.ai/artifact/8szYgjVPzFPectrShCBCzf  (republish the same local file path within a session, or pass this URL from a new one).
- **Main game artifact** https://claude.ai/artifact/2uXu92jFG891PcrbFaXNtW is still the OLD look. It was not overwritten because Sam had not yet seen the new art in play, and because publishing to it from a new session requires Reading the whole 13,000-line live file first (about 1 MB). Once Sam approves the preview, do that read and publish the project build there so his save carries over. The project build also contains a few small bug fixes from 3 Oct that were never published (font comma, battle turn order after a faint, trainers walking back to their post, map onEnter).
- Waiting on Sam: his verdict on the preview and the before/after image.

## What the new art layer does (sections `assets`, `doll`, `hd` near the end of the script, before `boot`)
- `assets`: `ASSET_SRC` = name -> [density, base64 palette PNG]. `loadAssets()` fills `IMG` before the game starts (`window.__ready` is set after).
- Density: a canvas with `.hd = 2` holds art at two art pixels per game pixel; `blit()` and `lw()/lh()` handle it. The screen scale `P` is kept even so this stays crisp.
- **Beasties:** `creatureSprite` is wrapped. Species with `b_<id>_f` / `b_<id>_b` images use them (front, back, shiny by hue shift, silhouette, small sizes scaled down). Done: the three starters only. All other species still use the old code-drawn art.
- **Ground:** `HDT` holds double-density tile painters (grass, moor grass, path, water with banks, tall grass, heather, flowers, sign, boulder, tree/lamp/stone bases, fence, wall, hedge). Any tile without a painter falls back to the old 1x tile. The grass, moor and tall-grass palettes were changed to the template colours, so old tiles blend.
- **Tall scenery:** oak (taller in-house version), pine, lamp, standing stone from the template sheet.
- **Buildings:** `BUILD_ART` maps cottage, house (roof recoloured per `b.roof`), wayhouse, mill, lab, gym (roof recoloured per `b.roof`), shop to template art, drawn in the entity layer, bottom-aligned to the footprint, with hedge filling any spare footprint. Lab and gym were made in-house from the tall SpriteCook pair (widened, roof flattened). Special buildings (museum, power, lighthouse, beacon, church, oak, castle, league) are still old code-drawn.
- **People:** the hero uses the template images (front, back, side; walk frames are made by lifting legs). Every other look in `LOOKS` is built by `personHD()` from the hero template: `DOLL` region maps (cap, hair, skin, jacket, stripe, strap, trousers, shoes) are recoloured per look, plus long hair, bun, hood, beard, glasses, apron, coat, veil. The four villager images (prof, mum, rival, grunt) are used as portraits in the intro and trainer battle intros (`PORTRAIT`).
- These apply game-wide wherever the same tile, building or look appears, so later chapters are already partly converted.

## Still to do (in rough order)
1. Sam's feedback on the preview; fix what he dislikes.
2. Interiors (floors, walls, furniture) are still old 1x art; template 15 (cottage interior) is the style target.
3. Remaining ground tiles as double-density painters: cobbles `=`, bridge `p`/`w`, sand `s`, snow `n`/`v`, forest floor `g`, cave tiles, cliffs `^`/`V`/`K`, graves `G`, mushrooms `u`, interior tiles.
4. Special buildings, and window glow at night for template buildings (`b.windows` is empty for them).
5. Beasties: 148 species still code-drawn. Options with no money: restyle the code renderer towards the templates, or use each month's free credits (about 20 images) for the most-seen species first. Template 12 shows the "evolved, cool" look.
6. Then: read the live main artifact and publish there.

## Template images (SpriteCook project "Brackenshire", id 484f19d6-1b99-431c-8c4e-15301d678ee6)
The workspace cannot download from api.spritecook.ai; Sam downloads and attaches files. Fresh links: `get_asset_metadata(asset_id)` (links expire after an hour). Settings that worked: `generate_game_art`, `model: gpt-image-2`, `quality: low` (2 credits), `pixel: true`. Size requests are only hints: characters come out about 52 px tall, sheet buildings about 80 px wide, a lone building about 120 px, whatever is asked. For an exact size, have Sam download the **raw** (1024 px) version and shrink it in-house (see `tools/tall_buildings.py`).

| No. | What | asset_id |
|---|---|---|
| 1, 2 | fire starter front, back | e0595c8b-279b-482a-bcd0-9d68b37e55d3, 4f9401ec-539c-4d46-ac72-96f35982bf0f |
| 3, 4 | water starter front, back | 8ba96b1c-36b7-43db-9bdd-d9666e6385e4, 1728d63a-8071-40ba-bbf9-d3aef2a5a220 |
| 5, 6 | grass starter front, back | 0adf7b04-7040-47bd-9bcf-10c3aeb9127d, 72333b9d-952e-4251-81f4-b1c79827456b |
| 7 | hero, front | 960e6c77-35d3-4c10-a4ce-1873062850b1 |
| 8 | thatched cottage | 2bb22f87-93ea-46d8-a213-7c1b186fc71d |
| 9 | village scene | ddbf808d-1480-472f-b0aa-826b7fb6960a |
| 10 | hero, four directions | 884d8dc3-0b68-4618-99e4-8260fd019c8b |
| 11 | four villagers | bce37448-20dd-4626-b873-273b7c45460a |
| 12 | evolved Beastie (not used in the game yet) | 223c4dd3-ead7-4f0a-a021-b2018599702d |
| 13 | scenery objects | b746c6d0-e09f-48eb-aa5c-fc752f19d223 |
| 14 | buildings (house, rest house, shop, mill) | d675358c-592e-4c64-b4ce-5db7d5411836 |
| 15 | cottage interior scene (style target, not used yet) | f00a9bf1-54df-4730-82b7-b13ce607b57c |
| 16 | moor scene (style target) | 0feb8623-5fcb-4e02-9de6-4f385b62f2ce |
| 17 | lab and gym, short (Sam: too short; not used) | 1138d3c3-ade0-4453-966f-1104ffb4df87 |
| 18 | lab and gym, tall (Sam: too tall; the in-house middle version is made from its raw image) | ebcb1600-a314-41ed-8f2e-c7370d24a69b |

In `art/tpl/` the files are numbered in the order Sam attached them: up01-06 starters, up07 cottage, up08 village scene, up09 hero four directions, up10 villagers, up11 evolved Beastie, up12 scenery, up13 buildings, up14 interior, up15 moor, up16 hero front, up17 short lab/gym, up18_raw tall lab/gym.

## Rebuilding and testing
Scripts are in `claude/brackenshire-art-tools.md`. Split the build into `src/` on the `// ---- name ----` markers (keep `_order.txt` and `_preamble.txt`), edit, `python3 build.py`, syntax-check, then `python3 test/regress.py brackenshire.html out.png` must print ALL PASS (new game, walking, menus, wild battle, trainer battle, map change, every map draws, no errors). `test/at.py` screenshots any map position; `test/sheet.py` renders a canvas built in page JS (used for the people contact sheet).
