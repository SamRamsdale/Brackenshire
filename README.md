# Brackenshire

A Beastie-catching adventure for the browser. Sam's own game.

## Play
Open `brackenshire.html` in a browser (double-click it). No install needed.

## Look through the Beasties
Open `beastie-journal.html` (double-click it) to flip through every Beastie's front and back sprite, the way the game draws them.
Names stay hidden until you press "Show names". It is rebuilt by `build.py` from the game's own code, so new sprites appear in it automatically.

## Change it
The game's code lives in `src/`, one file per section, joined in the order listed in `src/ORDER`.

1. Edit files in `src/`.
2. Run `python3 build.py` to rebuild `brackenshire.html` and `beastie-journal.html`.
3. Commit `src/` and both rebuilt pages.

## Notes
`docs/` holds the design notes, changelog, style guide and art tools from earlier work.
Start with `docs/brackenshire-changelog.md` (latest status) and `docs/brackenshire-design-notes.md` (Sam's choices and rules).
Keep the Beasties a surprise: refer to them by Journal number in notes and pull requests.

## Art
The sprite workshop is in `tools/` (see `tools/README.md`): unpack sprites to `art/out/`, check them with
`tools/check_sprites.py`, preview them in the game with `tools/preview.py`, and pack them back with `tools/build_assets.py`.
