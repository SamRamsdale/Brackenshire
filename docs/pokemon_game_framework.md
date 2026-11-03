# POKÉMON-STYLE RPG GAME FRAMEWORK BLUEPRINT (SUMMER ENGINE COMPATIBLE)

## 1. System Architecture & State Machine
The game operates on an asynchronous main loop shifting between two core isolated states: Overworld Grid Explorer and Isolated Turn-Based Battle.

### 1.1 Overworld State
- Grid-Based Movement: 2D movement locked to a discrete layout.
- Collision Detection: Interaction with special collision vectors labeled "Tall Grass".
- Encounter Trigger: Moving inside "Tall Grass" triggers a random step check. If `randf() < encounter_chance`, capture player position parameters, pause the overworld scene, and push the Battle State onto the engine stack.

### 1.2 Battle State
- Saves the player's vector state and loads a separate graphical arena scene.
- Instantiates a `BattleContext` object containing: Active Player Creature, Active Enemy Creature, Player Party Array, and Environmental Modifiers.
- Listens strictly for discrete menu input flags: `[FIGHT, PACK, SWITCH, RUN]`.
- On state termination (Win/Loss/Escape), safely destructs the `BattleContext` cache and resumes the Overworld scene tree.

---

## 2. Creature & Move Data Schema (JSON Format)
All creature metadata, status loops, and combat move arrays must strictly parse through the following unified structures.

```json
{
  "creature_database": {
    "C001": {
      "name": "Pyroshell",
      "types": ["Fire"],
      "base_stats": { "hp": 45, "attack": 49, "defense": 49, "speed": 45 },
      "movepool_level_up": [
        { "level": 1, "move_id": "M001" },
        { "level": 5, "move_id": "M002" }
      ],
      "evolution": { "trigger": "level", "threshold": 16, "target_id": "C002" }
    }
  },
  "move_database": {
    "M001": {
      "name": "Tackle",
      "type": "Normal",
      "category": "Physical",
      "power": 40,
      "accuracy": 100,
      "max_pp": 35
    },
    "M002": {
      "name": "Ember",
      "type": "Fire",
      "category": "Special",
      "power": 40,
      "accuracy": 100,
      "max_pp": 25
    }
  }
}
```

---

## 3. Summer Engine Route Encounter Tables
Each route or distinct zone maps custom arrays determining the layout of wild creature levels and probability distributions.

```json
{
  "zone_tables": {
    "Route_01": {
      "level_range": [2, 5],
      "pools": {
        "Common": { "chance": 0.60, "ids": ["C001", "C004"] },
        "Uncommon": { "chance": 0.35, "ids": ["C007"] },
        "Rare": { "chance": 0.05, "ids": ["C010"] }
      }
    }
  }
}
```

---

## 4. Turn-Based Combat, PP Tracking, & Damage Math

### 4.1 4-Move Capacity & Power Points (PP)
- Each creature instance is limited to a maximum array size of 4 active items in its runtime `learned_moves` tracker.
- If a creature levels up and unlocks a 5th move, the system must trigger a UI interrupt state forcing the player to select a move ID to forget, or reject the new move.
- Every move tracks its current `runtime_pp` state. If a move's `runtime_pp == 0`, that menu option is flagged disabled.

### 4.2 Core Damage Calculation Formula
When a move hits successfully (determined by evaluating `randi() % 100 < Move.accuracy`), the exact structural integer damage subtracted from target health points uses this formula:

Damage = ((((2 * Level / 5) + 2) * Power * (Attack / Defense)) / 50 + 2) * STAB * TypeModifier * RandomMultiplier

- **Attack / Defense Matching:** Use physical stat properties if `Move.category == "Physical"`; use special parameters if `Move.category == "Special"`.
- **Same-Type Attack Bonus (STAB):** If `Move.type` is inside the attacker's `Creature.types` array, `STAB = 1.5`. Otherwise, `STAB = 1.0`.
- **TypeModifier:** Multipliers calculated by reading the elemental matrix grid (`0.0x` Immune, `0.5x` Not Very Effective, `1.0x` Neutral, `2.0x` Super Effective).
- **RandomMultiplier:** A floating-point variance scalar generated natively per move sequence: `randf_range(0.85, 1.00)`.

---

## 5. Progression & Obedience State Tracking

### 5.1 Gym Badge Array
- Tracked globally inside the player profile data structures via a boolean state array: `gym_badges = [false, false, false, false, false, false, false, false]`.
- Earning specific badge indices updates the global environment flags, allowing overworld traversal using Hidden Machines (HMs).

### 5.2 Traded Obedience Logic Trigger
- Every creature tracking object tracks an origin flag: `is_traded: bool`.
- The player data profile maps an integer parameter variable: `max_obedience_level`. This parameter updates dynamically as gym badge flags change:
  - 0 Badges: Level 10
  - 1 Badge: Level 20
  - 2 Badges: Level 30 (scaling up to Level 100 at 8 Badges).
- **The Check Rule:** If a creature combat turn executes where `is_traded == true` AND `current_level > max_obedience_level`, perform a turn control interrupt test:
  ```gdscript
  if randf() < 0.50:
      print("The creature ignored orders/fell asleep!")
      # Intercept action phase and consume state execution turn
  ```

---

## 6. Dynamic Capture & Collection Management

### 6.1 The Catch Rate Formula
When an item category "Capture Ball" is deployed from the inventory array during an active Battle State against a wild target creature instance, evaluate this catch chance logic:

CatchValue = ((3 * HP_Max - 2 * HP_Current) / (3 * HP_Max)) * BaseCatchRate * ItemModifier * StatusModifier

- `BaseCatchRate`: An integer property bounded inside each species metadata structure (ranges `1` to `255`).
- `ItemModifier`: Multiplier determined by the item ID used (e.g., Standard Ball = `1.0`, Great Ball = `1.5`, Ultra Ball = `2.0`).
- `StatusModifier`: Dynamic boost condition check (Healthy = `1.0`, Poison/Burn/Paralysis = `1.5`, Sleep/Freeze = `2.0`).

If a randomized 8-bit integer check evaluates less than or equal to the computed `CatchValue`, the capture success sequence fires.

### 6.2 Party Array Routing Real-Time Logic
The player data layer maintains an active party array object capped at a strict upper boundary limit of 6 creature references.
- On capture success evaluation:
  ```text
  IF length(PlayerProfile.active_party) < 6:
      APPEND CapturedCreatureInstance -> PlayerProfile.active_party
      DISPLAY "Creature added to your active party."
  ELSE:
      APPEND CapturedCreatureInstance -> PlayerProfile.storage_boxes[CurrentBoxIndex]
      DISPLAY "Your party is full! Creature transferred to storage box."
  ```
