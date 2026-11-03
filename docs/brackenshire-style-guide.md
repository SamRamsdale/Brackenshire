# Brackenshire art style guide (the look Sam approved on 4 Oct 2026)

Use this for every new piece of art so the whole game stays consistent. The approved look is the SpriteCook template set; the image files are stored in `claude/brackenshire-template-images.md` and the status and pipeline are in `claude/spritecook-template-set.md`.

## The look in one paragraph
Cosy British-countryside pixel art in the style of a Nintendo DS era monster-collecting RPG: hand-pixelled, a dark (not black) 1-pixel outline on every object, 3 to 4 tone colour ramps, crisp shading lit from the top-left, no anti-aliasing, warm saturated colours, lots of small texture (roof tiles, stonework, fur tufts, leaf clumps). Characters are chibi: a large head, about two and a half heads tall. Creatures are cute and round as first forms, sleeker and more dramatic as later forms.

## Rules that keep it consistent
1. **Derive, don't invent.** New art must come from the template set: use a template image directly, recolour or reshape one in-house, or (only with Sam's say-so, credits are scarce) generate a new SpriteCook image with the exact settings below and an existing template as the style reference.
2. **Never spend money.** SpriteCook free credits only, and ask Sam before using them.
3. **Two pixel sizes only.** Small things (people, trees, props, ground, follower) are drawn at double density: 2 art pixels per game pixel (`.hd = 2`), 32 art px per map tile. Big things (buildings, lamp, standing stones, battle sprites, menus, text) are 1 art pixel per game pixel. Never scale pixel art by a non-whole factor at run time; if a size has to change, resample it in-house from the largest version available and re-quantise.
4. **Sizes.** Person about 30 x 53 art px (double density). Tree no wider than about 44 art px so forest corridors stay clear. A building's art is as wide as its map footprint (16 game px per tile), sits on the footprint's bottom edge and may rise above it. Beastie battle sprites fit an 80 px box (front) and a 96 px box (back).
5. **Light from the top-left**, shadows to the bottom-right, soft dark-green ground shadow under anything that stands on grass.
6. **People are all made from the hero template** (`personHD`), so they share one body, one outline weight and one shading. A character only differs by colours, hair style and add-ons. Do not mix in characters drawn another way for the walking sprites.
7. **Creatures stay a surprise.** Never describe or name them to Sam (fire, water and grass starter is fine).
8. Story, maps, layout and collision never change for art reasons. If art does not fit a footprint, fit the art (resize, or fill the gap with hedge), not the map.

## Palette (hex)
- Grass: base `#7f9c2b`, dark `#6f8c27`, light `#92ae37`, blade shadow `#56751f`. Tall-grass ground is the same about 10% darker.
- Moor grass: base `#7b8838`, dark `#66742c`, light `#929f48`. Heather: purple tufts (hue about 300, lightness lifted) on a dull olive base.
- Path: base `#dcb65c`, speckle `#cda64c` and `#ecca76`, pebble `#b89242` / `#e8cc84`, rim against grass `#b48c3c` then `#cba24a`.
- Water: base `#3c7ea8`, ripple `#5797bd`, sparkle `#a4d6ea` / `#7fbcd8`, shoreline `#234a66` then `#62a4c8`; earth bank `#5e4222` then `#8a6436`.
- Ground shadow: `rgba(30,50,20,.28)`.
- Outline for in-house shapes: mix the local colour 62 to 68% towards `#1a1022`.
- Skin `#f6cfa6`. Hero: cap red, jacket blue with a yellow stripe, navy trousers, red trainers (taken from the template; never recolour the hero).

## SpriteCook settings that produced the templates
`generate_game_art`, `model: gpt-image-2`, `quality: low` (2 credits), `pixel: true`, transparent background (scenes: `bg_mode: include`, `smart_crop: false`).
- Creatures: style "Nintendo DS era handheld RPG battle sprite, hand-pixelled, clean dark 1px outline, limited palette with 3-4 tone colour ramps, crisp cel shading lit from the top-left, no anti-aliasing"; theme "cosy British countryside fantasy creatures"; front view "three-quarter front view facing left"; back view made with `reference_asset_id` = the front and "rear-view battle sprite, the camera is positioned at its back, looks toward the upper right". Pass the fire starter front (`e0595c8b-279b-482a-bcd0-9d68b37e55d3`) as `style_asset_ids`.
- World and people: style "Nintendo DS era handheld monster-collecting RPG overworld sprite (or building / tileset), hand-pixelled, clean dark 1px outline, limited palette, crisp shading lit from the top-left, no anti-aliasing"; theme "cosy British countryside village"; "classic three-quarter top-down view".
- Several objects per image ("sprite sheet ... arranged in a grid with clear gaps") stretches credits and slices cleanly.
- Output size cannot be controlled. When an exact size matters, get the raw 1024 px version and shrink it in-house.

## What each kind of art is derived from
| Kind | Source |
|---|---|
| Hero | template 9 (four directions), walk frames made in code |
| Every other person | hero template recoloured by `personHD` from the `LOOKS` table |
| Portraits in the intro and trainer intros | template 10 (prof, mum, rival, grunt); others use their walking sprite |
| Grass, path, water, tall grass | painted in code with the palette above, matched to template 8 |
| Trees, hedge, fence, wall, sign, lamp, boulder, standing stone, flowers, postbox | template 12 |
| Cottage, brick house, rest house, shop, mill | templates 7 and 13 |
| Lab, gym | in-house from the tall pair (image 18), widened with a flatter roof |
| Starters | templates 1 to 6 |
| Indoor rooms (to do) | match template 14 |
| Moorland (in progress) | match template 15 |
| Later-form Beasties (to do) | match template 11 |
