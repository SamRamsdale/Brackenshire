# Retro Diffusion (second sprite source) — notes

**This file is newer than the 15:30 entry in `claude/brackenshire-changelog.md`; read it first for Beastie art status.**

Connected 4 Oct 2026 as a custom connector named "Retro" (`https://mcp.retrodiffusion.ai/mcp`, API key in the connector's request header; never in chat). Tools appear as `mcp__Retro__*`. Sam's rule still applies: **no extra money**. The account has only its free starter balance and no card.

## Budget: spent. $0.02 left of $0.50 (nothing more can be generated)
- Prices (from `estimate_inference_cost`, free): RD Pro $0.18 per image at any size up to 256x256 (takes reference images); RD Plus $0.06; RD Fast $0.03. Edit tools: background remover $0.01; colour reducer, palette converter, pixel correction, k-centroid downscale are free.
- Spent: two RD Pro sheets ($0.36), one RD Plus sheet ($0.06), two RD Fast sheets ($0.06).

## What was learned
- **RD Pro with a reference image is as good as SpriteCook** and matches the approved look: 9 of 9 correct on both sheets, at native battle size.
- **RD Plus and RD Fast without a reference are not**: softer, flatter, smaller sprites with a ground shadow, and only about two thirds of the creatures asked for came out (several wrong or missing). Do not use these tiers for Beasties again.
- Sam asked for the cheaper ones to be brought up to the best quality and the shadows removed. Done in-house as far as it goes (`tools/rd_enhance.py`: shadow off, dark outline, contrast, a recolour or added eyes where the creature was off). They sit acceptably beside the base forms but are plainer than the Pro ones; told him so. Real parity needs a Pro-tier or SpriteCook redo.

## Recipe that worked (best tier)
- `rd_pro__spritesheet`, 256x256, prompt expansion left on, one reference image: a 2x2 sheet of four existing sprites on white (32 colours, about 6 KB of base64 typed into the call; `shots/ref4.png`, `shots/ref4b.png`).
- Prompt pattern: "Monster-collecting RPG creature sprite sheet: nine different creatures arranged in a neat 3 by 3 grid, each one whole and separate with clear gaps, each seen from a three-quarter front view facing left, drawn in exactly the same style as the reference creatures (chunky rounded bodies, large glossy dark eyes with white glints, dark brown outlines, soft warm shading), on a plain white background. Top row: ...; Middle row: ...; Bottom row: ..." with one clause per creature (animal, pose, colours, signature features). Never write "pixel art".
- The workspace cannot download from Retro's storage (network policy), so Sam opens the link and attaches the PNG. Save as `art/rd/rdNN.png`, cut with `tools/rd_slice.py`, then `build_assets.py` and `build.py`. `get_inference_result(request_id)` reissues the 15-minute link for free for about 24 hours.

## Sheets (4 Oct 2026), all in the game (preview version 7, project build)
| File | Tier | request_id | Used as |
|---|---|---|---|
| `rd01.png` | Pro | `367bd2b3-c2bd-464d-b0c6-ff8174976915` | galewing, harehaste, bumbellow, cocoonle, flutterbye, scorchvix, rivotter, thistlehog, ramvolt |
| `rd02.png` | Pro | `a8c156f2-7ba2-4c8f-9a82-65cd59b40c18` | toadcap, blightrat, viperion, moggadon, wickmoth, brockling, hollowl, foalet, grimpup |
| `rd03.png` | Plus | `16f774df-d833-4ce7-8796-dcdf5751b9fe` | martip, vespermaus (body recoloured purple), flitter, scurrip, puffseed (eyes added), fawnet, slimble, crowlet. No spinnet |
| `rd04.png` | Fast | `3313c71f-85f9-4c3a-8ac3-6e7eef8669a5` | pucklet, postling (face added), moggle, nutbolt (face added), calfling, gullnip. No plugpup, kindlet, addersnip |
| `rd05.png` | Fast | `ffabbcbd-78d8-4a16-a8a6-8dd8e30392f7` | pinchet, sealby (recoloured white), jellop, pitmole, glintle. No zapeel, pebblit, cairnback, or starter finals (came out wrong) |

**Beasties with new art: 48 of 151** (20 SpriteCook or RD Pro quality before this batch, plus 9 RD Pro and 19 cleaned cheaper-tier). The 19 cheaper-tier ones are the first candidates to redo when better credits are available. Regression and mouse tests pass.
