# Where Brackenshire's sprites can come from (checked 4 Oct 2026)

Sam's rule: no extra money. Figures below marked "reported" come from third-party guides and may be out of date; check before relying on them.

| Source | Connected? | Free allowance | Notes |
|---|---|---|---|
| SpriteCook | Yes (custom connector) | 40 credits a month; 0 left until about 4 Nov | The approved look. 2 credits per sheet of eight. See `claude/spritecook-template-set.md` |
| Retro Diffusion | Yes (custom connector "Retro") | One-off $0.50, now spent ($0.02 left) | RD Pro sheets with a reference image matched the look very well. See `claude/retro-diffusion-notes.md` |
| Recraft | **Next to try** | Reported 50 credits a day, reset daily; 1 credit per raster image | Hosted connector `https://mcp.recraft.ai/mcp`, OAuth sign-in (no key), works as a claude.ai custom connector; uses the same credits as the Recraft app. Free-plan images are public and have no commercial licence (fine for a personal game). Not a pixel-art specialist: expect to run its output through our shrink, palette and outline step like the SpriteCook raws. Unknown until tried: style match, and whether the workspace can download its images |
| Scenario | Not yet | Reported 50 credits a day, no card | Hosted connector `https://mcp.scenario.com/mcp`, OAuth. Not confirmed that the free plan can use the connector, or that claude.ai is a supported client. Personal and evaluation use only on free |
| PixelLab | No | One-off trial | Its connector/API is reported to need a paid plan, so skip |
| ChatGPT / Gemini apps | Cannot be connected | A few images a day in their own apps | Sam would generate there and attach the image; a fallback only |
| In-house painter | n/a | Free | Sam's verdict: not good enough for new Beasties ("That one isnt great"). Keep for rear views and fixes only. `claude/brackenshire-inhouse-sprites.md` |

Setup pattern for any hosted connector: Customize > Connectors > Add > Add custom connector, name and URL; OAuth ones ask Sam to sign in, key-based ones need a request header `Authorization: Bearer <key>` (a connector cannot be edited after adding; remove and re-add). Keys never go in chat.
