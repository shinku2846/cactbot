<!-- Disable MD024, duplicate headers are under different subheaders -->
<!-- Disable MD033, no inline HTML for anchors on headings and diagrams -->
<!-- markdownlint-disable MD024 MD033 -->
# Log Lines and Triggers

This is intended to be a comprehensive guide to log lines
for folks who want to write ACT triggers for ff14.

This guide was last updated for:

- [FF14](https://na.finalfantasyxiv.com/lodestone/special/patchnote_log/) Patch 6.58
- [FFXIV Plugin](https://github.com/ravahn/FFXIV_ACT_Plugin/releases) Patch 2.7.0.1
- [OverlayPlugin](https://github.com/OverlayPlugin/OverlayPlugin/releases) Patch 0.19.28

## TOC

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Data Flow](#data-flow)
  - [Viewing logs after a fight](#viewing-logs-after-a-fight)
  - [Importing an old fight](#importing-an-old-fight)
  - [Importing into ffxivmon](#importing-into-ffxivmon)
- [Glossary of Terms](#glossary-of-terms)
  - [Network Data](#network-data)
  - [Network Log Lines](#network-log-lines)
  - [Parsed Log Lines](#parsed-log-lines)
  - [Game Log Lines](#game-log-lines)
  - [Object/Actor/Entity/Mob/Combatant](#objectactorentitymobcombatant)
  - [Object ID](#object-id)
  - [Ability ID](#ability-id)
  - [Status Effect ID](#status-effect-id)
  - [Instance Content ID](#instance-content-id)
- [FFXIV Plugin Log Lines](#ffxiv-plugin-log-lines)
  - [Line 00 (0x00): LogLine](#line-00-0x00-logline)
    - [Structure](#structure)
    - [Regexes](#regexes)
    - [Examples](#examples)
    - [Don't Write Triggers Against Game Log Lines](#dont-write-triggers-against-game-log-lines)
  - [Line 01 (0x01): ChangeZone](#line-01-0x01-changezone)
    - [Structure](#structure-1)
    - [Regexes](#regexes-1)
    - [Examples](#examples-1)
  - [Line 02 (0x02): ChangePrimaryPlayer](#line-02-0x02-changeprimaryplayer)
    - [Structure](#structure-2)
    - [Regexes](#regexes-2)
    - [Examples](#examples-2)
  - [Line 03 (0x03): AddCombatant](#line-03-0x03-addcombatant)
    - [Structure](#structure-3)
    - [Regexes](#regexes-3)
    - [Examples](#examples-3)
  - [Line 04 (0x04): RemoveCombatant](#line-04-0x04-removecombatant)
    - [Structure](#structure-4)
    - [Regexes](#regexes-4)
    - [Examples](#examples-4)
  - [Line 11 (0x0B): PartyList](#line-11-0x0b-partylist)
    - [Structure](#structure-5)
    - [Regexes](#regexes-5)
    - [Examples](#examples-5)
  - [Line 12 (0x0C): PlayerStats](#line-12-0x0c-playerstats)
    - [Structure](#structure-6)
    - [Regexes](#regexes-6)
    - [Examples](#examples-6)
  - [Line 20 (0x14): NetworkStartsCasting](#line-20-0x14-networkstartscasting)
    - [Structure](#structure-7)
    - [Regexes](#regexes-7)
    - [Examples](#examples-7)
    - [Cast Times](#cast-times)
  - [Line 21 (0x15): NetworkAbility](#line-21-0x15-networkability)
    - [Structure](#structure-8)
    - [Regexes](#regexes-8)
    - [Examples](#examples-8)
    - [Action Effects](#action-effects)
    - [Effect Types](#effect-types)
    - [Ability Damage](#ability-damage)
    - [Reflected Damage](#reflected-damage)
    - [Status Effects](#status-effects)
    - [Ability Examples](#ability-examples)
  - [Line 22 (0x16): NetworkAOEAbility](#line-22-0x16-networkaoeability)
  - [Line 23 (0x17): NetworkCancelAbility](#line-23-0x17-networkcancelability)
    - [Structure](#structure-9)
    - [Regexes](#regexes-9)
    - [Examples](#examples-9)
  - [Line 24 (0x18): NetworkDoT](#line-24-0x18-networkdot)
    - [Structure](#structure-10)
    - [Regexes](#regexes-10)
    - [Examples](#examples-10)
  - [Line 25 (0x19): NetworkDeath](#line-25-0x19-networkdeath)
    - [Structure](#structure-11)
    - [Regexes](#regexes-11)
    - [Examples](#examples-11)
  - [Line 26 (0x1A): NetworkBuff](#line-26-0x1a-networkbuff)
    - [Structure](#structure-12)
    - [Regexes](#regexes-12)
    - [Examples](#examples-12)
    - [Refreshes, Overwrites, and Deaths](#refreshes-overwrites-and-deaths)
  - [Line 27 (0x1B): NetworkTargetIcon (Head Marker)](#line-27-0x1b-networktargeticon-head-marker)
    - [Structure](#structure-13)
    - [Regexes](#regexes-13)
    - [Examples](#examples-13)
    - [Head Marker IDs](#head-marker-ids)
    - [Offset Headmarkers](#offset-headmarkers)
  - [Line 28 (0x1C): NetworkRaidMarker (Floor Marker)](#line-28-0x1c-networkraidmarker-floor-marker)
    - [Structure](#structure-14)
    - [Regexes](#regexes-14)
    - [Examples](#examples-14)
    - [Combatant Marker Codes](#combatant-marker-codes)
  - [Line 29 (0x1D): NetworkTargetMarker (Player Marker)](#line-29-0x1d-networktargetmarker-player-marker)
    - [Structure](#structure-15)
    - [Regexes](#regexes-15)
    - [Examples](#examples-15)
    - [Floor Marker Codes](#floor-marker-codes)
  - [Line 30 (0x1E): NetworkBuffRemove](#line-30-0x1e-networkbuffremove)
    - [Structure](#structure-16)
    - [Regexes](#regexes-16)
    - [Examples](#examples-16)
  - [Line 31 (0x1F): NetworkGauge](#line-31-0x1f-networkgauge)
    - [Structure](#structure-17)
    - [Regexes](#regexes-17)
    - [Examples](#examples-17)
  - [Line 32 (0x20): NetworkWorld](#line-32-0x20-networkworld)
  - [Line 33 (0x21): Network6D (Actor Control)](#line-33-0x21-network6d-actor-control)
    - [Structure](#structure-18)
    - [Regexes](#regexes-18)
    - [Examples](#examples-18)
  - [Line 34 (0x22): NetworkNameToggle](#line-34-0x22-networknametoggle)
    - [Structure](#structure-19)
    - [Regexes](#regexes-19)
    - [Examples](#examples-19)
  - [Line 35 (0x23): NetworkTether](#line-35-0x23-networktether)
    - [Structure](#structure-20)
    - [Regexes](#regexes-20)
    - [Examples](#examples-20)
  - [Line 36 (0x24): LimitBreak](#line-36-0x24-limitbreak)
    - [Structure](#structure-21)
    - [Regexes](#regexes-21)
    - [Examples](#examples-21)
  - [Line 37 (0x25): NetworkActionSync](#line-37-0x25-networkactionsync)
    - [Structure](#structure-22)
    - [Regexes](#regexes-22)
    - [Examples](#examples-22)
    - [Tracking Ability Resolution](#tracking-ability-resolution)
    - [HP Values](#hp-values)
    - [Shield %](#shield-)
    - [MP Values](#mp-values)
  - [Line 38 (0x26): NetworkStatusEffects](#line-38-0x26-networkstatuseffects)
    - [Structure](#structure-23)
    - [Regexes](#regexes-23)
    - [Examples](#examples-23)
    - [Data Fields](#data-fields)
  - [Line 39 (0x27): NetworkUpdateHP](#line-39-0x27-networkupdatehp)
    - [Structure](#structure-24)
    - [Regexes](#regexes-24)
    - [Examples](#examples-24)
  - [Line 40 (0x28): Map](#line-40-0x28-map)
    - [Structure](#structure-25)
    - [Regexes](#regexes-25)
    - [Examples](#examples-25)
  - [Line 41 (0x29): SystemLogMessage](#line-41-0x29-systemlogmessage)
    - [Structure](#structure-26)
    - [Regexes](#regexes-26)
    - [Examples](#examples-26)
  - [Line 42 (0x2A): StatusList3](#line-42-0x2a-statuslist3)
    - [Structure](#structure-27)
    - [Regexes](#regexes-27)
    - [Examples](#examples-27)
  - [Line 251 (0xFB): Debug](#line-251-0xfb-debug)
  - [Line 252 (0xFC): PacketDump](#line-252-0xfc-packetdump)
  - [Line 253 (0xFD): Version](#line-253-0xfd-version)
  - [Line 254 (0xFE): Error](#line-254-0xfe-error)
- [OverlayPlugin Log Lines](#overlayplugin-log-lines)
  - [Line 256 (0x100): LineRegistration](#line-256-0x100-lineregistration)
    - [Structure](#structure-28)
    - [Regexes](#regexes-28)
    - [Examples](#examples-28)
  - [Line 257 (0x101): MapEffect](#line-257-0x101-mapeffect)
    - [Structure](#structure-29)
    - [Regexes](#regexes-29)
    - [Examples](#examples-29)
  - [Line 258 (0x102): FateDirector](#line-258-0x102-fatedirector)
    - [Structure](#structure-30)
    - [Regexes](#regexes-30)
    - [Examples](#examples-30)
  - [Line 259 (0x103): CEDirector](#line-259-0x103-cedirector)
    - [Structure](#structure-31)
    - [Regexes](#regexes-31)
    - [Examples](#examples-31)
  - [Line 260 (0x104): InCombat](#line-260-0x104-incombat)
    - [Structure](#structure-32)
    - [Regexes](#regexes-32)
    - [Examples](#examples-32)
  - [Line 261 (0x105): CombatantMemory](#line-261-0x105-combatantmemory)
    - [Structure](#structure-33)
    - [Regexes](#regexes-33)
    - [Examples](#examples-33)
  - [Line 262 (0x106): RSVData](#line-262-0x106-rsvdata)
    - [Structure](#structure-34)
    - [Regexes](#regexes-34)
    - [Examples](#examples-34)
  - [Line 263 (0x107): StartsUsingExtra](#line-263-0x107-startsusingextra)
    - [Structure](#structure-35)
    - [Regexes](#regexes-35)
    - [Examples](#examples-35)
  - [Line 264 (0x108): AbilityExtra](#line-264-0x108-abilityextra)
    - [Structure](#structure-36)
    - [Regexes](#regexes-36)
    - [Examples](#examples-36)
  - [Line 265 (0x109): ContentFinderSettings](#line-265-0x109-contentfindersettings)
    - [Structure](#structure-37)
    - [Regexes](#regexes-37)
    - [Examples](#examples-37)
  - [Line 266 (0x10A): NpcYell](#line-266-0x10a-npcyell)
    - [Structure](#structure-38)
    - [Regexes](#regexes-38)
    - [Examples](#examples-38)
  - [Line 267 (0x10B): BattleTalk2](#line-267-0x10b-battletalk2)
    - [Structure](#structure-39)
    - [Regexes](#regexes-39)
    - [Examples](#examples-39)
  - [Line 268 (0x10C): Countdown](#line-268-0x10c-countdown)
    - [Structure](#structure-40)
    - [Regexes](#regexes-40)
    - [Examples](#examples-40)
  - [Line 269 (0x10D): CountdownCancel](#line-269-0x10d-countdowncancel)
    - [Structure](#structure-41)
    - [Regexes](#regexes-41)
    - [Examples](#examples-41)
  - [Line 270 (0x10E): ActorMove](#line-270-0x10e-actormove)
    - [Structure](#structure-42)
    - [Regexes](#regexes-42)
    - [Examples](#examples-42)
  - [Line 271 (0x10F): ActorSetPos](#line-271-0x10f-actorsetpos)
    - [Structure](#structure-43)
    - [Regexes](#regexes-43)
    - [Examples](#examples-43)
  - [Line 272 (0x110): SpawnNpcExtra](#line-272-0x110-spawnnpcextra)
    - [Structure](#structure-44)
    - [Regexes](#regexes-44)
    - [Examples](#examples-44)
  - [Line 273 (0x111): ActorControlExtra](#line-273-0x111-actorcontrolextra)
    - [Structure](#structure-45)
    - [Regexes](#regexes-45)
    - [Examples](#examples-45)
  - [Line 274 (0x112): ActorControlSelfExtra](#line-274-0x112-actorcontrolselfextra)
    - [Structure](#structure-46)
    - [Regexes](#regexes-46)
    - [Examples](#examples-46)
<!-- AUTO-GENERATED-CONTENT:END -->

## Data Flow

![Alt text](https://g.gravizo.com/source/svg/data_flow?https%3A%2F%2Fraw.githubusercontent.com%2FOverlayPlugin%2Fcactbot%2Fmain%2Fdocs%2FLogGuide.md)

<details>
<summary></summary>
data_flow
  digraph G {
    size ="4,4";
    ff14 [label="ff14 servers"]
    ff14 -> ACT [label="network data"]
    network [label="network log files"]
    ACT [label="ACT + ffxiv plugin",shape=box,penwidth=3]
    ACT -> network [label="write to disk"]
    fflogs
    network -> fflogs [label="upload"]
    network -> ffxivmon [label="import"]
    network -> ACT [label="import"]
    network -> util [label="process"]
    util [label="cactbot util scripts"]
    plugins [label="triggers, ACT plugins"]
    opclients [label="overlays and other clients"]
    ACT -> plugins [label="parsed log lines"]
    ACT -> plugins [label="network log lines"]
    plugins -> opclients [label="OverlayPlugin WebSocket"]
  }
data_flow
</details>

### Viewing logs after a fight

If you have ACT open during a fight, then it will generate logs.
These logs will be trimmed to the start and end of combat.

To see the parsed version of these logs, click on the **Main** tab,
expand the zone you care about,
right click on the encounter you want,
then select **View Logs**.

![view logs screenshot](images/logguide_viewlogs.png)

The **All** entry includes all the encounters in a zone and cannot be viewed.
You must view individual encounters.

The window that pops up has the parsed log lines that triggers can be made against.
This is one way to search through and find the text that you want to make a trigger for.

### Importing an old fight

Sometimes you have to close ACT, but you want to look at old fights.
Or, somebody else sends you a log, and you want to make triggers from it.

To do this, click the **Import/Export** tab,
click on **Import a Log File**,
click on **Select File...**
select the **Network_plugin_date.log** log file,
(where `plugin` and `date` are the FFXIV plugin version and day)
and finally click the **YOU** button.

![import screenshot](images/logguide_import.png)

This will create encounters whose [logs you can view](#viewing-logs-after-a-fight).

### Importing into ffxivmon

If you want to dig into the network data itself, ffxivmon is a great tool.

To create a log file suitable for ffxivmon,
first turn on the **(DEBUG) Dump all Network Data to logfile** setting in ACT.

![dump network data screenshot](images/logguide_dumpnetworkdata.png)

Then, run an encounter in game with ACT running.
Once you're done, import that network log file into ffxivmon.

![ffxivmon import screenshot](images/logguide_ffxivmon_import.png)

Now, you can walk through and investigate the network data directly.

![ffxivmon screenshot](images/logguide_ffxivmon.png)

## Glossary of Terms

### Network Data

This is the raw packet dump sent from ff14 servers to your computer.
This data is processed both by the game itself as well as by the ffxiv plugin to
produce network log lines.

![network data screenshot](images/logguide_networkdata.png)

Folks writing triggers generally do not have to worry about raw packet data and
so this document does not focus very much on this type of data.

### Network Log Lines

These represent the lines that the ffxiv plugin writes to disk in
**Network_22009_20210801.log** files in your log directory.
These lines are still processed and filtered by the ffxiv plugin,
and are (mostly) not raw network data.

Here are some example network log lines:

```log
21|2019-05-31T21:14:56.8980000-07:00|10532971|Tini Poutini|DF9|Fire IV|40002F21|Zombie Brobinyak|150003|3B9D4002|1C|DF98000|0|0|0|0|0|0|0|0|0|0|0|0|104815|348652|12000|12000|1000|1000|-767.7882|156.939|-672.0446|26285|28784|13920|15480|1000|1000|-771.8156|157.1111|-671.3281||8eaa0245ad01981b69fc1af04ea8f9a1
30|2019-05-31T20:02:41.4560000-07:00|6b4|Boost|0.00|1069C23F|Potato Chippy|1069C23F|Potato Chippy|00|3394|3394||4f7b1fa11ec7a2746a8c46379481267c
20|2019-05-31T20:02:41.4660000-07:00|105E3321|Tater Tot|2C9D|Peculiar Light|105E3321|Tater Tot||c375d8a2d1cf48efceccb136584ed250
```

Data on network log lines is separated by vertical braces, i.e. `|`.
Network log lines also contain the hash of that line at the end.
The log line type itself is in decimal, e.g. aoe abilities are on lines that begin with `22|`.
The equivalent [parsed log line](#parsed-log-lines) would be written as the hex type `0x16`, i.e. `NetworkAOEAbility`.

The ffxiv plugin does not write the parsed log lines that plugins interact with
to disk.

The network log lines are used by some tools, such as:

- fflogs uploader
- ffxivmon
- cactbot make_timeline utility

In the past,
cactbot used to use [parsed log lines](#parsed-log-lines) for all triggers
but has switched to using network log lines instead
as they have more information.
Timelines still use parsed log lines for syncing (for now).

If you [import a network log file into ACT](#importing-an-old-fight),
then you can view the parsed log lines for in the fight.

### Parsed Log Lines

These are the log lines that come out of the ffxiv plugin at runtime and are
also exposed to plugins for triggers.
These are what the [View Logs](#viewing-logs-after-a-fight) option in ACT shows.
Most cactbot triggers used network log lines,
but ACT custom triggers use parsed log lines.

Data in parsed log lines is separated by colons, i.e. `:`.
The log line type is in hex.

Here is an example:

```log
[21:16:44.288] 15:10532971:Potato Chippy:9C:Scathe:40001299:Striking Dummy:750003:90D0000:1C:9C8000:0:0:0:0:0:0:0:0:0:0:0:0:2778:2778:0:0:1000:1000:-653.9767:-807.7275:31.99997:26945:28784:6720:15480:1000:1000:-631.5208:-818.5244:31.95173:
```

Parsed log lines lines always start with the time in square brackets.
This time is formatted to be in your local time zone.
The time is followed with a hex value (in this case 0x15) that indicates the type of the line it is.

The rest of the data in the line needs to be interpreted based on what type it is.
See the following sections that describe each line.

### Game Log Lines

A game log line is a specific type of log line with type `00`.
These log lines also appear directly in your chat windows in game,
possibly in the Battle Log tab.
Try to [avoid writing triggers](#dont-write-triggers-against-game-log-lines) using these lines.

See: [Line 00](#line00) for examples.

### Object/Actor/Entity/Mob/Combatant

These are all words used synonymously in this document to refer to an object
in the game that can use abilities and has stats.
This could be the player, Bahamut, Eos, a Striking Dummy.

### Object ID

Object ids are 4 byte identifiers used for all types of objects.

Player ids always start with the byte `10`,
e.g. `1069C23F` or `10532971`.

Enemy and pet ids always start with the byte `40`,
e.g. `4000A848` or `4000A962`.

For `NetworkAOEAbility` lines that don't affect anybody, e.g. a Titan landslide that somehow nobody stands in,
this is represented as hitting the id `E0000000` (and a blank name).

One thing to note is that in most raids,
there are many mobs in the scene with the same name.
For example, in t13, there are about twenty Bahamut Prime mobs in the zone,
most of which are invisible.
You can often differentiate these by HP values (see [AddCombatant](#line03) log lines).
Often these invisible mobs are used as the damaging actors,
which is why in UWU Titan Phase, both Garuda and Titan use Rock Throw to put people in jails.

Entity IDs are not stable identifiers.
Player entity IDs may change if the player DC travels.
NPC entity IDs may change from one pull to the next.
The safest option is to treat entity IDs as being scoped to a single pull.
For NPCs, there are two additional bits of data that can be used to uniquely identify them.
They are available in [Line 03](#line03) and [Line 261](#line261).
The first is BNpcId, which determines the model and other properties of the NPC.
the second is BNpcNameId, which determines the name of the NPC.
Unlike the literal name of the entity, BNpcNameId does not require translation.

### Ability ID

Although ff14 differentiates between abilities and spells,
this document uses these words interchangeably.
All actions taken by a player or an enemy are "abilities" and have a unique 4 byte id.

You can use xivapi.com to look up a particular action, as sometimes these are
listed as "Unknown" from the ffxiv plugin if it hasn't updated yet.
For example, Fire IV has the ability id 0xDF9 = 3577,
so this link will give you more information about it:
<https://xivapi.com/action/3577?columns=ID,Name,Description,ClassJobCategory.Name>

This works for both players and enemies, abilities and spells.

### Status Effect ID

Similarly, status effects have a 2-byte ID.
You can also look these up on xivapi.
Status effects with the 'isPermanent' flag cause the game to hide the duration,
even though the status effect might appear to have a limited duration in the log lines.

### Instance Content ID

Some lines like the [actor control line](#line33) and [SystemLogMessage](#line41)
have a field called `instance`.
This field is a four byte field with two parts,
The first two bytes are the update type (e.g. `8003` is the update type for instanced content,
and `8004` is the same content but with trusts).
The second two bytes are the `InstanceContentType`,
from the [InstanceContent table](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/InstanceContent.csv).

For example, if `instance` is `80034E6C` then `0x4E6C` is the `InstanceContentType`.
`0x4E6C` is 20076 in decimal, and corresponds to Diamond Weapon (Savage): <https://xivapi.com/InstanceContent/20076?pretty=true>.

## FFXIV Plugin Log Lines

<a name="line00"></a>

### Line 00 (0x00): LogLine

These are what this document calls "game log lines".
Because these are not often used for triggers
(other than `0839` and `0044` messages),
the full set of LogTypes is not well-documented.

(Pull requests welcome!)

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=GameLog&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
00|[timestamp]|[code]|[name]|[line]

Parsed Log Line Structure:
[timestamp] ChatLog 00:[code]:[name]:[line]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>00)\|(?<timestamp>[^|]*)\|(?<code>[^|]*)\|(?<name>[^|]*)\|(?<line>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) ChatLog (?<type>00):(?<code>[^:]*):(?<name>[^:]*):(?<line>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
00|2021-04-26T14:12:30.0000000-04:00|0839||You change to warrior.|d8c450105ea12854e26eb687579564df
00|2021-04-26T16:57:41.0000000-04:00|0840||You can now summon the antelope stag mount.|caa3526e9f127887766e9211e87e0e8f
00|2021-04-26T14:17:11.0000000-04:00|0B3A||You defeat the embodiment.|ef3b7b7f1e980f2c08e903edd51c70c7
00|2021-04-26T14:12:30.0000000-04:00|302B||The gravity node uses Forked Lightning.|45d50c5f5322adf787db2bd00d85493d
00|2021-04-26T14:12:30.0000000-04:00|322A||The attack misses.|f9f57724eb396a6a94232e9159175e8c
00|2021-07-05T18:01:21.0000000-04:00|0044|Tsukuyomi|Oh...it's going to be a long night.|1a81d186fd4d19255f2e01a1694c7607
00|2020-02-26T18:59:23.0000000-08:00|0038||cactbot wipe|77364412c17033eb8c87dafe7ce3c665
00|2020-03-10T18:29:02.0000000-07:00|001D|Tini Poutini|Tini Poutini straightens her spectacles for you.|05ca458b4d400d1f878d3c420f962b99

Parsed Log Line Examples:
[14:12:30.000] ChatLog 00:0839::You change to warrior.
[16:57:41.000] ChatLog 00:0840::You can now summon the antelope stag mount.
[14:17:11.000] ChatLog 00:0B3A::You defeat the embodiment.
[14:12:30.000] ChatLog 00:302B::The gravity node uses Forked Lightning.
[14:12:30.000] ChatLog 00:322A::The attack misses.
[18:01:21.000] ChatLog 00:0044:Tsukuyomi:Oh...it's going to be a long night.
[18:59:23.000] ChatLog 00:0038::cactbot wipe
[18:29:02.000] ChatLog 00:001D:Tini Poutini:Tini Poutini straightens her spectacles for you.
```

<!-- AUTO-GENERATED-CONTENT:END -->

#### Don't Write Triggers Against Game Log Lines

There are a number of reasons to avoid basing triggers on game log lines:

- can show up later than parsed log lines (often up to half a second)
- inconsistent text (gains effect vs suffers effect, begins casting vs readies, you vs player name)
- often vague (the attack misses)
- can change spelling at the whim of SquareEnix
- some Dalamud plugins may interfere with chat lines

Instead, the recommendation is to base your triggers on log lines that are not type `0x00`.
Prefer using [NetworkBuff](#line26) line instead of "suffers the effect" game log lines.
Prefer using the [NetworkStartsCasting](#line20) "starts using" line instead of the "readies" or "begins casting" game log lines.

At the moment, there are some cases where you must use game log lines.
However, unless you intend to support non-OverlayPlugin users in your plugin or trigger,
use cases for these are dwindling,
as newer log lines such as FFXIV_ACT_Plugin's [SystemLogMessage](#line41) and OverlayPlugin's [NpcYell](#line266),
[BattleTalk2](#line267), and [Countdown](#line268) have gradually replaced the need for game log lines.

If there are any remaining cases where a 00-line appears,
but no other corresponding log line seems to exist,
please file an issue in the [main OverlayPlugin repository](https://github.com/OverlayPlugin/OverlayPlugin/issues),
so that it can be investigated and potentially added.

Note:
There are examples where [NetworkStartsCasting](#line20) lines show up
after the corresponding `00` "readies" line,
but it is on the order of tens of milliseconds
and does not consistently show up first.
[NetworkAbility](#line21) lines always seem to show up before the `00` "uses" lines.

<a name="line01"></a>

### Line 01 (0x01): ChangeZone

This message is sent when first logging in and whenever the zone is changed.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=ChangeZone&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
01|[timestamp]|[id]|[name]

Parsed Log Line Structure:
[timestamp] Territory 01:[id]:[name]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>01)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) Territory (?<type>01):(?<id>[^:]*):(?<name>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
01|2021-04-26T14:13:17.9930000-04:00|326|Kugane Ohashi|b9f401c0aa0b8bc454b239b201abc1b8
01|2021-04-26T14:22:04.5490000-04:00|31F|Alphascape (V2.0)|8299b97fa36500118fc3a174ed208fe4

Parsed Log Line Examples:
[14:13:17.993] Territory 01:326:Kugane Ohashi
[14:22:04.549] Territory 01:31F:Alphascape (V2.0)
```

<!-- AUTO-GENERATED-CONTENT:END -->

Note that the "name" of the zone is the instance name when available,
or the raw zone name if not.

<a name="line02"></a>

### Line 02 (0x02): ChangePrimaryPlayer

This redundant message follows every [ChangeZone](#line01) message to indicate the name of the player.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=ChangedPlayer&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
02|[timestamp]|[id]|[name]

Parsed Log Line Structure:
[timestamp] ChangePrimaryPlayer 02:[id]:[name]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>02)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) ChangePrimaryPlayer (?<type>02):(?<id>[^:]*):(?<name>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
02|2021-04-26T14:11:31.0200000-04:00|10FF0001|Tini Poutini|5b0a5800460045f29db38676e0c3f79a
02|2021-04-26T14:13:17.9930000-04:00|10FF0002|Potato Chippy|34b657d75218545f5a49970cce218ce6

Parsed Log Line Examples:
[14:11:31.020] ChangePrimaryPlayer 02:10FF0001:Tini Poutini
[14:13:17.993] ChangePrimaryPlayer 02:10FF0002:Potato Chippy
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line03"></a>

### Line 03 (0x03): AddCombatant

This message is sent when a new object is added to the scene or
becomes close enough to the player that they can view its actions.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=AddedCombatant&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
03|[timestamp]|[id]|[name]|[job]|[level]|[ownerId]|[worldId]|[world]|[npcNameId]|[npcBaseId]|[currentHp]|[hp]|[currentMp]|[mp]|[?]|[?]|[x]|[y]|[z]|[heading]

Parsed Log Line Structure:
[timestamp] AddCombatant 03:[id]:[name]:[job]:[level]:[ownerId]:[worldId]:[world]:[npcNameId]:[npcBaseId]:[currentHp]:[hp]:[currentMp]:[mp]:[?]:[?]:[x]:[y]:[z]:[heading]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>03)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<job>[^|]*)\|(?<level>[^|]*)\|(?<ownerId>[^|]*)\|(?<worldId>[^|]*)\|(?<world>[^|]*)\|(?<npcNameId>[^|]*)\|(?<npcBaseId>[^|]*)\|(?<currentHp>[^|]*)\|(?<hp>[^|]*)\|(?<currentMp>[^|]*)\|(?<mp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) AddCombatant (?<type>03):(?<id>[^:]*):(?<name>[^:]*):(?<job>[^:]*):(?<level>[^:]*):(?<ownerId>[^:]*):(?<worldId>[^:]*):(?<world>[^:]*):(?<npcNameId>[^:]*):(?<npcBaseId>[^:]*):(?<currentHp>[^:]*):(?<hp>[^:]*):(?<currentMp>[^:]*):(?<mp>[^:]*)(?::[^:]*){2}:(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
03|2021-06-16T20:46:38.5450000-07:00|10FF0001|Tini Poutini|24|46|0000|28|Jenova|0|0|30460|30460|10000|10000|0|0|-0.76|15.896|0|-3.141593|c0e6f1c201e7285884fb6bf107c533ee
03|2021-06-16T21:35:11.3060000-07:00|4000B364|Catastrophe|00|46|0000|00||5631|6358|57250|57250|0|10000|0|0|0|0|0|-4.792213E-05|9c22c852e1995ed63ff4b71c09b7d1a7
03|2021-06-16T21:35:11.3060000-07:00|4000B363|Catastrophe|00|46|0000|00||5631|6358|57250|57250|0|10000|0|0|0|0|0|-4.792213E-05|9438b02195d9b785e07383bc84b2bf37
03|2021-06-16T21:35:11.3060000-07:00|4000B362|Catastrophe|00|46|0000|00||5631|7305|13165210|13165210|10000|10000|0|0|0|-15|0|-4.792213E-05|1c4bc8f27640fab6897dc90c02bba79d
03|2021-06-16T21:35:11.4020000-07:00|4000B365|Catastrophe|00|46|0000|00||5631|6358|57250|57250|0|10000|0|0|0|0|0|-4.792213E-05|8b3f6cf1939428dd9ab0a319aba44910
03|2021-06-16T21:35:11.4020000-07:00|4000B36a|Catastrophe|00|46|0000|00||5631|6358|57250|57250|0|10000|0|0|0|0|0|-4.792213E-05|b3b3b4f926bcadd8b6ef008232d58922

Parsed Log Line Examples:
[20:46:38.545] AddCombatant 03:10FF0001:Tini Poutini:24:46:0000:28:Jenova:0:0:30460:30460:10000:10000:0:0:-0.76:15.896:0:-3.141593
[21:35:11.306] AddCombatant 03:4000B364:Catastrophe:00:46:0000:00::5631:6358:57250:57250:0:10000:0:0:0:0:0:-4.792213E-05
[21:35:11.306] AddCombatant 03:4000B363:Catastrophe:00:46:0000:00::5631:6358:57250:57250:0:10000:0:0:0:0:0:-4.792213E-05
[21:35:11.306] AddCombatant 03:4000B362:Catastrophe:00:46:0000:00::5631:7305:13165210:13165210:10000:10000:0:0:0:-15:0:-4.792213E-05
[21:35:11.402] AddCombatant 03:4000B365:Catastrophe:00:46:0000:00::5631:6358:57250:57250:0:10000:0:0:0:0:0:-4.792213E-05
[21:35:11.402] AddCombatant 03:4000B36a:Catastrophe:00:46:0000:00::5631:6358:57250:57250:0:10000:0:0:0:0:0:-4.792213E-05
```

<!-- AUTO-GENERATED-CONTENT:END -->

This combatant may be invisible and fake.  The real ones have more HP.
For example, at the start of Deltascape V2.0 you will see messages like the
latter 5 examples above.

In heavy zones (e.g. Eureka), combatants may be culled if there are too many
things nearby.
Usually other players are culled first, but mobs can be as well.
Eureka NMs (and S ranks) solve this by having a flag on them
that allows them to be seen via AddCombatant message from anywhere in the zone,
which is why it is possible to write triggers for when these pop.

<a name="line04"></a>

### Line 04 (0x04): RemoveCombatant

This message is sent when an object is removed from the scene, either because
the player has moved too far away from it, it has died, or the player has
changed zones.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=RemovedCombatant&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
04|[timestamp]|[id]|[name]|[job]|[level]|[owner]|[?]|[world]|[npcNameId]|[npcBaseId]|[currentHp]|[hp]|[currentMp]|[mp]|[?]|[?]|[x]|[y]|[z]|[heading]

Parsed Log Line Structure:
[timestamp] RemoveCombatant 04:[id]:[name]:[job]:[level]:[owner]:[?]:[world]:[npcNameId]:[npcBaseId]:[currentHp]:[hp]:[currentMp]:[mp]:[?]:[?]:[x]:[y]:[z]:[heading]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>04)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<job>[^|]*)\|(?<level>[^|]*)\|(?<owner>[^|]*)\|(?:[^|]*\|)(?<world>[^|]*)\|(?<npcNameId>[^|]*)\|(?<npcBaseId>[^|]*)\|(?<currentHp>[^|]*)\|(?<hp>[^|]*)\|(?<currentMp>[^|]*)\|(?<mp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) RemoveCombatant (?<type>04):(?<id>[^:]*):(?<name>[^:]*):(?<job>[^:]*):(?<level>[^:]*):(?<owner>[^:]*):[^:]*:(?<world>[^:]*):(?<npcNameId>[^:]*):(?<npcBaseId>[^:]*):(?<currentHp>[^:]*):(?<hp>[^:]*):(?<currentMp>[^:]*):(?<mp>[^:]*)(?::[^:]*){2}:(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
04|2021-07-23T23:01:27.5480000-07:00|10FF0001|Tini Poutini|05|1E|0000|35|Jenova|0|0|816|816|10000|10000|0|0|-66.24337|-292.0904|20.06466|1.789943|4fbfc851937873eacf94f1f69e0e2ba9
04|2021-06-16T21:37:36.0740000-07:00|4000B39C|Petrosphere|00|46|0000|00||6712|7308|0|57250|0|10000|0|0|-16.00671|-0.01531982|0|1.53875|980552ad636f06249f1b5c7a6e675aad

Parsed Log Line Examples:
[23:01:27.548] RemoveCombatant 04:10FF0001:Tini Poutini:05:1E:0000:35:Jenova:0:0:816:816:10000:10000:0:0:-66.24337:-292.0904:20.06466:1.789943
[21:37:36.074] RemoveCombatant 04:4000B39C:Petrosphere:00:46:0000:00::6712:7308:0:57250:0:10000:0:0:-16.00671:-0.01531982:0:1.53875
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line11"></a>

### Line 11 (0x0B): PartyList

This line represents the players currently in the party, and is sent whenever the party makeup changes.

This data is not necessarily sorted in the same order as the in-game party UI.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=PartyList&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
11|[timestamp]|[partyCount]|[id0]|[id1]|[id2]|[id3]|[id4]|[id5]|[id6]|[id7]|[id8]|[id9]|[id10]|[id11]|[id12]|[id13]|[id14]|[id15]|[id16]|[id17]|[id18]|[id19]|[id20]|[id21]|[id22]|[id23]

Parsed Log Line Structure:
[timestamp] PartyList 0B:[partyCount]:[id0]:[id1]:[id2]:[id3]:[id4]:[id5]:[id6]:[id7]:[id8]:[id9]:[id10]:[id11]:[id12]:[id13]:[id14]:[id15]:[id16]:[id17]:[id18]:[id19]:[id20]:[id21]:[id22]:[id23]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>11)\|(?<timestamp>[^|]*)\|(?<partyCount>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) PartyList (?<type>0B):(?<partyCount>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
11|2021-06-16T20:46:38.5450000-07:00|8|10FF0002|10FF0003|10FF0004|10FF0001|10FF0005|10FF0006|10FF0007|10FF0008|
11|2021-06-16T21:47:56.7170000-07:00|4|10FF0002|10FF0001|10FF0003|10FF0004|

Parsed Log Line Examples:
[20:46:38.545] PartyList 0B:8:10FF0002:10FF0003:10FF0004:10FF0001:10FF0005:10FF0006:10FF0007:10FF0008
[21:47:56.717] PartyList 0B:4:10FF0002:10FF0001:10FF0003:10FF0004
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line12"></a>

### Line 12 (0x0C): PlayerStats

This message is sent whenever your player's stats change and upon entering a new zone/instance.

This is only emitted for the local player.
It is not possible to automatically pull other players' stats.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=PlayerStats&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
12|[timestamp]|[job]|[strength]|[dexterity]|[vitality]|[intelligence]|[mind]|[piety]|[attackPower]|[directHit]|[criticalHit]|[attackMagicPotency]|[healMagicPotency]|[determination]|[skillSpeed]|[spellSpeed]|[?]|[tenacity]|[localContentId]

Parsed Log Line Structure:
[timestamp] PlayerStats 0C:[job]:[strength]:[dexterity]:[vitality]:[intelligence]:[mind]:[piety]:[attackPower]:[directHit]:[criticalHit]:[attackMagicPotency]:[healMagicPotency]:[determination]:[skillSpeed]:[spellSpeed]:[?]:[tenacity]:[localContentId]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>12)\|(?<timestamp>[^|]*)\|(?<job>[^|]*)\|(?<strength>[^|]*)\|(?<dexterity>[^|]*)\|(?<vitality>[^|]*)\|(?<intelligence>[^|]*)\|(?<mind>[^|]*)\|(?<piety>[^|]*)\|(?<attackPower>[^|]*)\|(?<directHit>[^|]*)\|(?<criticalHit>[^|]*)\|(?<attackMagicPotency>[^|]*)\|(?<healMagicPotency>[^|]*)\|(?<determination>[^|]*)\|(?<skillSpeed>[^|]*)\|(?<spellSpeed>[^|]*)\|(?:[^|]*\|)(?<tenacity>[^|]*)\|(?<localContentId>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) PlayerStats (?<type>0C):(?<job>[^:]*):(?<strength>[^:]*):(?<dexterity>[^:]*):(?<vitality>[^:]*):(?<intelligence>[^:]*):(?<mind>[^:]*):(?<piety>[^:]*):(?<attackPower>[^:]*):(?<directHit>[^:]*):(?<criticalHit>[^:]*):(?<attackMagicPotency>[^:]*):(?<healMagicPotency>[^:]*):(?<determination>[^:]*):(?<skillSpeed>[^:]*):(?<spellSpeed>[^:]*):[^:]*:(?<tenacity>[^:]*):(?<localContentId>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
12|2021-04-26T14:30:07.4910000-04:00|21|5456|326|6259|135|186|340|5456|380|3863|135|186|2628|1530|380|0|1260|4000174AE14AB6|3c03ce9ee4afccfaae74695376047054
12|2021-04-26T14:31:25.5080000-04:00|24|189|360|5610|356|5549|1431|189|1340|3651|5549|5549|1661|380|1547|0|380|4000174AE14AB6|53b98d383806c5a29dfe33720f514288
12|2021-08-06T10:29:35.3400000-04:00|38|308|4272|4443|288|271|340|4272|1210|2655|288|271|2002|1192|380|0|380|4000174AE14AB6|4ce3eac3dbd0eb1d6e0044425d9e091d

Parsed Log Line Examples:
[14:30:07.491] PlayerStats 0C:21:5456:326:6259:135:186:340:5456:380:3863:135:186:2628:1530:380:0:1260:4000174AE14AB6
[14:31:25.508] PlayerStats 0C:24:189:360:5610:356:5549:1431:189:1340:3651:5549:5549:1661:380:1547:0:380:4000174AE14AB6
[10:29:35.340] PlayerStats 0C:38:308:4272:4443:288:271:340:4272:1210:2655:288:271:2002:1192:380:0:380:4000174AE14AB6
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line20"></a>

### Line 20 (0x14): NetworkStartsCasting

For abilities with cast bars,
this is the log line that specifies that a player or a monster has started casting an ability.
This precedes a [NetworkAbility](#line21),
[NetworkAOEAbility](#line22),
or [NetworkCancelAbility](#line23)
where it uses the ability or is interrupted.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=StartsUsing&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
20|[timestamp]|[sourceId]|[source]|[id]|[ability]|[targetId]|[target]|[castTime]|[x]|[y]|[z]|[heading]

Parsed Log Line Structure:
[timestamp] StartsCasting 14:[sourceId]:[source]:[id]:[ability]:[targetId]:[target]:[castTime]:[x]:[y]:[z]:[heading]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>20)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<id>[^|]*)\|(?<ability>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<castTime>[^|]*)\|(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) StartsCasting (?<type>14):(?<sourceId>[^:]*):(?<source>[^:]*):(?<id>[^:]*):(?<ability>(?:[^:]|: )*?):(?<targetId>[^:]*):(?<target>[^:]*):(?<castTime>[^:]*):(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
20|2021-07-27T12:47:23.1740000-04:00|40024FC4|The Manipulator|F63|Carnage|40024FC4|The Manipulator|4.70|-0.01531982|-13.86256|10.59466|-4.792213E-05|488abf3044202807c62fa32c2e36ee81
20|2021-07-27T12:48:33.5420000-04:00|10FF0001|Tini Poutini|DF0|Stone III|40024FC4|The Manipulator|2.35|-0.06491255|-9.72675|10.54466|-3.141591|2a24845eab5ed48d4f043f7b6269ef70
20|2021-07-27T12:48:36.0460000-04:00|10FF0002|Potato Chippy|BA|Succor|10FF0002|Potato Chippy|1.93|-0.7477417|-5.416992|10.54466|2.604979|99a70e6f12f3fcb012e59b3f098fd69b
20|2021-07-27T12:48:29.7830000-04:00|40024FD0|The Manipulator|13BE|Judgment Nisi|10FF0001|Tini Poutini|3.20|8.055649|-17.03842|10.58736|-4.792213E-05|bc1c3d72782de2199bfa90637dbfa9b8
20|2021-07-27T12:48:36.1310000-04:00|40024FCE|The Manipulator|13D0|Seed Of The Sky|E0000000||2.70|8.055649|-17.03842|10.58736|-4.792213E-05|5377da9551e7ca470709dc08e996bb75

Parsed Log Line Examples:
[12:47:23.174] StartsCasting 14:40024FC4:The Manipulator:F63:Carnage:40024FC4:The Manipulator:4.70:-0.01531982:-13.86256:10.59466:-4.792213E-05
[12:48:33.542] StartsCasting 14:10FF0001:Tini Poutini:DF0:Stone III:40024FC4:The Manipulator:2.35:-0.06491255:-9.72675:10.54466:-3.141591
[12:48:36.046] StartsCasting 14:10FF0002:Potato Chippy:BA:Succor:10FF0002:Potato Chippy:1.93:-0.7477417:-5.416992:10.54466:2.604979
[12:48:29.783] StartsCasting 14:40024FD0:The Manipulator:13BE:Judgment Nisi:10FF0001:Tini Poutini:3.20:8.055649:-17.03842:10.58736:-4.792213E-05
[12:48:36.131] StartsCasting 14:40024FCE:The Manipulator:13D0:Seed Of The Sky:E0000000::2.70:8.055649:-17.03842:10.58736:-4.792213E-05
```

<!-- AUTO-GENERATED-CONTENT:END -->

These lines are usually (but not always) associated with game log lines that either look like
`00:282B:Shinryu readies Earthen Fury.`
or `00:302b:The proto-chimera begins casting The Ram's Voice.`

#### Cast Times

There are some caveats that affect the accuracy of cast times in the log.

For player casts, the log line provides precision to a thousandth of a second.
However, the game itself rounds these to hundredths.

Some boss casts with special animations have a longer effective cast time than what the log says.
P8S's High Concept cast is one such example.
The actual cast bar is much longer than the log would indicate.
This is because the ability actually finishes casting partway through the cast bar,
and the actual damage comes from a different ability.

<a name="line21"></a>

### Line 21 (0x15): NetworkAbility

This is an ability that ends up hitting a single target (possibly the caster's self).
The reason this is worded as "ends up hitting" is that some AOE abilities may only hit a single target,
in which case they still result in this type

For example, in ucob, if Firehorn's fireball in nael phase hits the whole group, it will be a `22/0x16` type.
If one person runs the fireball out and it only hits them, then it is type `21/0x15` because there's only one target.
If your trigger includes the message type,
it is usually best to write your parsed log line regex `1[56]`
and your network log line regex as `2[12]`
to include both possibilities.

Ground AOEs that don't hit anybody are considered [NetworkAOEAbility](#line22) lines.

There are two fields on 21/22 lines that provide information about the number of targets affected.
The `targetCount` field indicates the number of targets.
The `targetIndex` field indicates which target this particular line refers to.
For example, for a 21-line, you would see a `targetIndex` of 0, and a `targetCount` of 1.
For an AoE ability that hits three targets, all three lines would have a `targetCount` of 3,
but the `targetIndex` would be 0, 1, and 2 for the three lines respectively.
Thus, if you want to find all of the 21/22-lines related to a single action usage,
you would do so by collecting 21/22-lines until you see one for which `targetCount - 1 == targetIndex`.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=Ability&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
21|[timestamp]|[sourceId]|[source]|[id]|[ability]|[targetId]|[target]|[flags]|[damage]|[?]|[?]|[?]|[?]|[?]|[?]|[?]|[?]|[?]|[?]|[?]|[?]|[?]|[?]|[targetCurrentHp]|[targetMaxHp]|[targetCurrentMp]|[targetMaxMp]|[?]|[?]|[targetX]|[targetY]|[targetZ]|[targetHeading]|[currentHp]|[maxHp]|[currentMp]|[maxMp]|[?]|[?]|[x]|[y]|[z]|[heading]|[sequence]|[targetIndex]|[targetCount]|[ownerId]|[ownerName]|[effectDisplayType]|[actionId]|[actionAnimationId]|[animationLockTime]|[rotationHex]

Parsed Log Line Structure:
[timestamp] ActionEffect 15:[sourceId]:[source]:[id]:[ability]:[targetId]:[target]:[flags]:[damage]:[?]:[?]:[?]:[?]:[?]:[?]:[?]:[?]:[?]:[?]:[?]:[?]:[?]:[?]:[targetCurrentHp]:[targetMaxHp]:[targetCurrentMp]:[targetMaxMp]:[?]:[?]:[targetX]:[targetY]:[targetZ]:[targetHeading]:[currentHp]:[maxHp]:[currentMp]:[maxMp]:[?]:[?]:[x]:[y]:[z]:[heading]:[sequence]:[targetIndex]:[targetCount]:[ownerId]:[ownerName]:[effectDisplayType]:[actionId]:[actionAnimationId]:[animationLockTime]:[rotationHex]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>2[12])\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<id>[^|]*)\|(?<ability>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<flags>[^|]*)\|(?<damage>[^|]*)\|(?:[^|]*\|){14}(?<targetCurrentHp>[^|]*)\|(?<targetMaxHp>[^|]*)\|(?<targetCurrentMp>[^|]*)\|(?<targetMaxMp>[^|]*)\|(?:[^|]*\|){2}(?<targetX>[^|]*)\|(?<targetY>[^|]*)\|(?<targetZ>[^|]*)\|(?<targetHeading>[^|]*)\|(?<currentHp>[^|]*)\|(?<maxHp>[^|]*)\|(?<currentMp>[^|]*)\|(?<maxMp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|(?<sequence>[^|]*)\|(?<targetIndex>[^|]*)\|(?<targetCount>[^|]*)\|(?<ownerId>[^|]*)\|(?<ownerName>[^|]*)\|(?<effectDisplayType>[^|]*)\|(?<actionId>[^|]*)\|(?<actionAnimationId>[^|]*)\|(?<animationLockTime>[^|]*)\|(?<rotationHex>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) (?:ActionEffect|AOEActionEffect) (?<type>(?:15|16)):(?<sourceId>[^:]*):(?<source>[^:]*):(?<id>[^:]*):(?<ability>(?:[^:]|: )*?):(?<targetId>[^:]*):(?<target>[^:]*):(?<flags>[^:]*):(?<damage>[^:]*)(?::[^:]*){14}:(?<targetCurrentHp>[^:]*):(?<targetMaxHp>[^:]*):(?<targetCurrentMp>[^:]*):(?<targetMaxMp>[^:]*)(?::[^:]*){2}:(?<targetX>[^:]*):(?<targetY>[^:]*):(?<targetZ>[^:]*):(?<targetHeading>[^:]*):(?<currentHp>[^:]*):(?<maxHp>[^:]*):(?<currentMp>[^:]*):(?<maxMp>[^:]*)(?::[^:]*){2}:(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*):(?<sequence>[^:]*):(?<targetIndex>[^:]*):(?<targetCount>[^:]*):(?<ownerId>[^:]*):(?<ownerName>[^:]*):(?<effectDisplayType>[^:]*):(?<actionId>[^:]*):(?<actionAnimationId>[^:]*):(?<animationLockTime>[^:]*):(?<rotationHex>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
21|2021-07-27T12:48:22.4630000-04:00|40024FD1|Steam Bit|F67|Aetherochemical Laser|10FF0001|Tini Poutini|750003|4620000|1B|F678000|0|0|0|0|0|0|0|0|0|0|0|0|36022|36022|5200|10000|0|1000|1.846313|-12.31409|10.60608|-2.264526|16000|16000|8840|10000|0|1000|-9.079163|-14.02307|18.7095|1.416605|0000DE1F|0|1|10780275|Owning Player|01|F67|F67|0.600|12AB|5d60825d70bb46d7fcc8fc0339849e8e
21|2021-07-27T12:46:22.9530000-04:00|10FF0002|Potato Chippy|07|Attack|40024FC5|Right Foreleg|710003|3910000|0|0|0|0|0|0|0|0|0|0|0|0|0|0|378341|380640|8840|10000|0|1000|-6.37015|-7.477235|10.54466|0.02791069|26396|26396|10000|10000|0|1000|-5.443688|-1.163282|10.54466|-2.9113|0000DB6E|0|1|00||01|07|07|0.100|34BC|58206bdd1d0bd8d70f27f3fb2523912b
21|2021-07-27T12:46:21.5820000-04:00|10FF0001|Tini Poutini|03|Sprint|10FF0001|Tini Poutini|1E00000E|320000|0|0|0|0|0|0|0|0|0|0|0|0|0|0|19053|26706|10000|10000|0|1000|-1.210526|17.15058|10.69944|-2.88047|19053|26706|10000|10000|0|1000|-1.210526|17.15058|10.69944|-2.88047|0000DB68|0|1|00||01|03|03|0.100|34BC|29301d52854712315e0951abff146adc
21|2021-07-27T12:47:28.4670000-04:00|40025026|Steam Bit|F6F|Laser Absorption|40024FC4|The Manipulator|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|685814|872320|8840|10000|0|1000|-0.01531982|-13.86256|10.59466|-4.792213E-05|16000|16000|8840|10000|0|1000|0|22.5|10.64999|-3.141593|0000DCEC|0|1|00||01|F6F|F6F|0.100|34BC|0f3be60aec05333aae73a042edb7edb4
21|2021-07-27T12:48:39.1260000-04:00|40024FCE|The Manipulator|13D0|Seed Of The Sky|E0000000||0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|||||||||||16000|16000|8840|10000|0|1000|8.055649|-17.03842|10.58736|-4.792213E-05|0000DE92|0|1|00||01|13D0|13D0|0.100|34BC|ca5594611cf4ca4e276f64f2cfba5ffa

Parsed Log Line Examples:
[12:48:22.463] ActionEffect 15:40024FD1:Steam Bit:F67:Aetherochemical Laser:10FF0001:Tini Poutini:750003:4620000:1B:F678000:0:0:0:0:0:0:0:0:0:0:0:0:36022:36022:5200:10000:0:1000:1.846313:-12.31409:10.60608:-2.264526:16000:16000:8840:10000:0:1000:-9.079163:-14.02307:18.7095:1.416605:0000DE1F:0:1:10780275:Owning Player:01:F67:F67:0.600:12AB
[12:46:22.953] ActionEffect 15:10FF0002:Potato Chippy:07:Attack:40024FC5:Right Foreleg:710003:3910000:0:0:0:0:0:0:0:0:0:0:0:0:0:0:378341:380640:8840:10000:0:1000:-6.37015:-7.477235:10.54466:0.02791069:26396:26396:10000:10000:0:1000:-5.443688:-1.163282:10.54466:-2.9113:0000DB6E:0:1:00::01:07:07:0.100:34BC
[12:46:21.582] ActionEffect 15:10FF0001:Tini Poutini:03:Sprint:10FF0001:Tini Poutini:1E00000E:320000:0:0:0:0:0:0:0:0:0:0:0:0:0:0:19053:26706:10000:10000:0:1000:-1.210526:17.15058:10.69944:-2.88047:19053:26706:10000:10000:0:1000:-1.210526:17.15058:10.69944:-2.88047:0000DB68:0:1:00::01:03:03:0.100:34BC
[12:47:28.467] ActionEffect 15:40025026:Steam Bit:F6F:Laser Absorption:40024FC4:The Manipulator:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:685814:872320:8840:10000:0:1000:-0.01531982:-13.86256:10.59466:-4.792213E-05:16000:16000:8840:10000:0:1000:0:22.5:10.64999:-3.141593:0000DCEC:0:1:00::01:F6F:F6F:0.100:34BC
[12:48:39.126] ActionEffect 15:40024FCE:The Manipulator:13D0:Seed Of The Sky:E0000000::0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:::::::::::16000:16000:8840:10000:0:1000:8.055649:-17.03842:10.58736:-4.792213E-05:0000DE92:0:1:00::01:13D0:13D0:0.100:34BC
```

<!-- AUTO-GENERATED-CONTENT:END -->

| Index | Example        | Explanation                                                     |
|-------|----------------|-----------------------------------------------------------------|
| 0     | 21             | type id (in decimal for network, hex for parsed)                |
| 1     | 10532971       | caster object id                                                |
| 2     | Tini Poutini   | caster name                                                     |
| 3     | 07             | ability id                                                      |
| 4     | Attack         | ability name                                                    |
| 5     | 40001299       | target object id                                                |
| 6     | Striking Dummy | target name                                                     |
| 7-22  | F,E578000      | pairs of action effects (see: [action effects](#action-effects) |
| 23    | 2778           | target current hp                                               |
| 24    | 2778           | target max hp                                                   |
| 25    | 0              | target current mp                                               |
| 26    | 0              | target max mp                                                   |
| 27    | 1000           | unused, formerly target current tp                              |
| 28    | 1000           | unused, formerly target max tp                                  |
| 29    | -653.9767      | target x position                                               |
| 30    | -807.7275      | target y position                                               |
| 31    | 31.99997       | target z position                                               |
| 32    | 66480          | caster current hp                                               |
| 33    | 74095          | caster max hp                                                   |
| 34    | 4560           | caster current mp                                               |
| 35    | 4560           | caster max mp                                                   |
| 36    | 1000           | unused, formerly caster current tp                              |
| 37    | 1000           | unused, formerly caster max tp                                  |
| 38    | -653.0394      | caster x position                                               |
| 39    | -807.9677      | caster y position                                               |
| 40    | 31.99997       | caster z position                                               |
| 41    | 1.423          | caster heading                                                  |
| 42    | 12ABC          | sequential ID                                                   |
| 43    | 0              | target index (0 <= n < target count)                            |
| 44    | 3              | target count                                                    |
| 45    | 1023ABCD       | caster owner object id (or 00 if no owner)                      |
| 46    | Tini Poutini   | caster owner name (or blank if no owner)                        |
| 47    | 01             | effect display type                                             |
| 48    | 07             | action id                                                       |
| 49    | 07             | action animation id                                             |
| 50    | 1.100          | animation lock (seconds)                                        |
| 51    | AB23           | cast angle (in hex)                                             |

Network ability lines are a combination of raw network data
(e.g. the `710003` flags and the `9420000` damage)
and frequently sampled data from memory
(e.g. the `66480` current hp value and `-653.0394` x position).

This means that there's a number of caveats going on to handling all the data in these lines.
The raw network data is subject to change over time from ff14 servers.
Also, the data from memory may be slightly stale and out of date.

#### Action Effects

Each ability may have one or more effects.
These are indicated by the flagsX and damageX fields, between `targetName` and `targetCurHp`.
There are eight pairs, each with a 'flags' field and a 'damage' field.
The damage field is not necessarily always damage.
For example, for a buff application, it indicates which buff ID is about to be applied.

Damage seems to always be the first field if it is present.
However, for anything else, it is bad practice to rely on an effect being in a specific position.
Rather, these should only be treated as an array of pairs, and you should iterate through them to find what you're looking for.
As an example of why you should not hardcode indices, consider the following.

Here we have a use of Aeolian edge:

```log
21|2022-09-13T17:25:12.4790000-07:00|10827569|Name Removed|8CF|Aeolian Edge|4000A062|Hegemone|44714003|37120000|A3D|9F8000|53D|9F8000|11B|8CF8000|0|0|0|0|0|0|0|0|rest of line omitted
                                                                                             | first           | second   | third    | fourth    |
```

Damage (0x03) is in the first position, 0x3d in the second and third, and 0x1b in the fourth.

Now, a use of Aeolian edge under Bloodbath:

```log
21|2022-09-13T17:25:18.8060000-07:00|10827569|Name Removed|8CF|Aeolian Edge|4000A062|Hegemone|44714003|38FD0000|104|AA68000|A3D|9F8000|53D|9F8000|11B|8CF8000|0|0|0|0|0|0|rest of line omitted
                                                                                             | first           | second    | third    | fourth   | fifth     |
```

Notice that the bloodbath self-heal (0x04) is in the second position,
thus shifting the two 0x3d effects and the 0x1b effect over to the third, fourth, and fifth positions.
This is one of the many reasons why hardcoding indices is a bad idea.

On top of that, ordering can of course change at SE's whim.
As such, relying on specific ordering of ability effects is simply a bad idea.

#### Effect Types

The 'flags' field for each pair of values can be further broken down.

The rightmost byte indicates the type of effect:

Damage flags:

- 0x01 = dodge/miss
- 0x03 = damage done
- 0x04 = heal
- 0x05 = blocked damage
- 0x06 = parried damage
- 0x33 = instant death

Non-damage flags:

- 0x02 = fully resisted
- 0x07 = 'invulnerable' message
- 0x08 = 'X has no effect' message
- 0x0a = mp loss ('damage' indicates amount)
- 0x0b = mp gain ('damage' indicates amount)
- 0x0e = status applied to target (see "status effects" below)
- 0x0f = status applied to caster (see "status effects" below)
- 0x10 = status removed
- 0x14 = 'no effect' message related to a particular status effect ('damage >> 16' indicates status effect ID)
- 0x18 = aggro increase

The next byte to the left indicates the 'severity' for damage effects:

- 0x20 = crit damage
- 0x40 = direct hit damage
- 0x60 = crit direct hit damage

The byte to the left of that one indicates the 'severity' for heal effects, and works the same way as damage severity
(though heals can never direct hit). Thus, the combinations would be:

- 0x000004 = heal
- 0x200004 = crit heal

Other bitmasks appear on particular abilities, and can indicate whether bane missed or hit recipients. However, these
all appear ability-specific.

There are many others that are not considered to be important for anything outside of niche purposes, like 0x28 for
mounting.

#### Ability Damage

Damage bitmasks:

- 0x0100 = hallowed, no damage
- 0x4000 = "a lot" of damage

The damage value in an ability usage is not the literal damage, because that would be too easy.

The formula to get from the damage value in the ability log line to the actual damage value is the following.

First, left-extend zeroes to 4 bytes (8 chars), e.g. 2934001 => 02934001, or 1000 => 00001000.

The first two bytes (4 chars) are the damage.

Unless, if there is an 0x00004000 mask, then this implies "a lot" of damage.
In this case, consider the bytes as ABCD, where C is 0x40.
The total damage is calculated as D A B as three bytes together interpreted as an integer.

For example, `423F400F` becomes `0F 42 3F` => 999999

Once you have the damage, the other pieces of interest are the bitmasks above, as well as the severity.

However, there is one more interesting bit here.
The leftmost byte is the percentage of the damage, rounded down,
that came from positional and/or combo bonuses. You can use
[this sheet](https://docs.google.com/spreadsheets/d/1Huvsu-Ic8Fx1eKZ7yWlYmD1vg2N0fnILSKLHmmR21PI/edit#gid=0)
as a reference for creating a positional hit/miss trigger.
It is not necessary to guess and check these, rather, all the needed information can be found on the lodestone.

Note that the battle log text is slightly misleading here - it is **not** `(bonus / base)` as you might expect,
but `(bonus / total)`.
That is, an ability that deals 200 damage if the positional/combo is missed but 300 if it hits would display a bonus of 33% (since one-third of the damage came from the bonus),
not 50% as you might expect.
It is the same value you would see in the in-game battle log (e.g. `Hegemone takes 9129(+61%) damage`).
This is why you will never see a bonus of above 100%, even if the bonus doubles, triples or even quadruples the damage.

For parries/blocks, instead of the bonus,
this value indicates the reduction (treat it as an 8-bit signed integer), e.g. 0xEC => -20%.

#### Reflected Damage

Reflected damage looks like normal damage.
The only way to determine that a damage effect is reflected is that it is preceded by a 1D effect.

#### Status Effects

The leftmost two bytes of the "damage" portion are the status effect ID.

The rightmost byte of the flag is the "value", usually treated as a stack count,
but may be employed for other purposes by specific status effects.

The rest depends on the exact status effect.

For DoTs and the like, the middle two bytes of the "flags" indicate the damage lowbyte and crit lowbyte
(one fixed decimal point, i.e. 200 = 20% crit, but overflows at 25.6%).

For damage dealt/taken modifiers,
the second byte from the right in the flags is a damage taken modifier (e.g. a 10% mit will come as -10, i.e. 246 or 0xF6).
Statuses with two effects, such as Addle/Feint with their magical and physical reduction,
will use one field for each.
You can examine these to find damage down and vulnerability percentages.

#### Ability Examples

1) 18216 damage from Grand Cross Alpha (basic damage)
`16:40001333:Neo Exdeath:242B:Grand Cross Alpha:1048638C:Tater Tot:750003:47280000:1C:80242B:0:0:0:0:0:0:0:0:0:0:0:0:36906:41241:5160:5160:880:1000:0.009226365:-7.81128:-1.192093E-07:16043015:17702272:12000:12000:1000:1000:-0.01531982:-19.02808:0:`

2) 82538 damage from Hyperdrive (0x4000 extra damage mask)
`15:40024FBA:Kefka:28E8:Hyperdrive:106C1DBA:Okonomi Yaki:750003:426B4001:1C:28E88000:0:0:0:0:0:0:0:0:0:0:0:0:35811:62464:4560:4560:940:1000:-0.1586061:-5.753153:0:30098906:31559062:12000:12000:1000:1000:0.3508911:0.4425049:2.384186E-07:`

3) 22109 damage from Grand Cross Omega (:3F:0: shift)
`16:40001333:Neo Exdeath:242D:Grand Cross Omega:1048638C:Tater Tot:3F:0:750003:565D0000:1C:80242D:0:0:0:0:0:0:0:0:0:0:41241:41241:5160:5160:670:1000:-0.3251641:6.526299:1.192093E-07:7560944:17702272:12000:12000:1000:1000:0:19:2.384186E-07:`

4) 15732 crit heal from 3 confession stack Plenary Indulgence (:?13:4C3: shift)
`16:10647D2F:Tako Yaki:1D09:Plenary Indulgence:106DD019:Okonomi Yaki:313:4C3:10004:3D74:0:0:0:0:0:0:0:0:0:0:0:0:7124:40265:14400:9192:1000:1000:-10.78815:11.94781:0:11343:40029:19652:16451:1000:1000:6.336648:7.710004:0:`

5) instant death twister
`16:40004D5D:Twintania:26AB:Twister:10573FDC:Tini Poutini:33:0:1C:26AB8000:0:0:0:0:0:0:0:0:0:0:0:0:43985:43985:5760:5760:910:1000:-8.42179:9.49251:-1.192093E-07:57250:57250:0:0:1000:1000:-8.565645:10.20959:0:`

6) zero damage targetless aoe (E0000000 target)
`16:103AAEE4:Potato Chippy:B1:Miasma II:E0000000::0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0::::::::::19400:40287:17649:17633:1000:1000:-0.656189:-3.799561:-5.960464E-08:`

<a name="line22"></a>

### Line 22 (0x16): NetworkAOEAbility

This is an ability usage in game that ends up hitting multiple actors or no actors at all.

See: [NetworkAbility](#line21) for a discussion of the difference between `NetworkAbility` and `NetworkAOEAbility`.

<a name="line23"></a>

### Line 23 (0x17): NetworkCancelAbility

For abilities with cast bars, this is the log line that specifies that the cast was cancelled either due to movement or an interrupt and it won't go off.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=NetworkCancelAbility&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
23|[timestamp]|[sourceId]|[source]|[id]|[name]|[reason]

Parsed Log Line Structure:
[timestamp] CancelAction 17:[sourceId]:[source]:[id]:[name]:[reason]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>23)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<reason>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) CancelAction (?<type>17):(?<sourceId>[^:]*):(?<source>[^:]*):(?<id>[^:]*):(?<name>[^:]*):(?<reason>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
23|2021-07-27T13:04:38.7790000-04:00|10FF0002|Potato Chippy|408D|Veraero II|Cancelled|dbce3801c08020cb8ae7da9102034131
23|2021-07-27T13:04:39.0930000-04:00|40000132|Garm|D10|The Dragon's Voice|Interrupted|bd936fde66bab0e8cf2874ebd75df77c
23|2021-07-27T13:04:39.1370000-04:00|4000012F||D52|Unknown_D52|Cancelled|8a15bad31745426d65cc13b8e0d50005

Parsed Log Line Examples:
[13:04:38.779] CancelAction 17:10FF0002:Potato Chippy:408D:Veraero II:Cancelled
[13:04:39.093] CancelAction 17:40000132:Garm:D10:The Dragon's Voice:Interrupted
[13:04:39.137] CancelAction 17:4000012F::D52:Unknown_D52:Cancelled
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line24"></a>

### Line 24 (0x18): NetworkDoT

HoT (heal over time) and DoT (damage over time) amounts.
For most DoTs and HoTs,
this line conveys an aggregated tick for every DoT/HoT source on that target from all sources.

The reason why there is such a discrepancy between ACT and fflogs about dots
is that ff14 does not return the exact tick amounts for every active dot.
Instead, if a boss has 20 dots applied to it,
then it returns the total tick amount for all of these dots.
Parsers are left to estimate what the individual dot amounts are.

However, for ground effect DoTs/HoTs, these have their own packets.
This is the only case where the `effectId` is populated.
For these, the `damageType` field is a number id that corresponds to the `AttackType` table.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=NetworkDoT&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
24|[timestamp]|[id]|[name]|[which]|[effectId]|[damage]|[currentHp]|[maxHp]|[currentMp]|[maxMp]|[?]|[?]|[x]|[y]|[z]|[heading]|[sourceId]|[source]|[damageType]|[sourceCurrentHp]|[sourceMaxHp]|[sourceCurrentMp]|[sourceMaxMp]|[?]|[?]|[sourceX]|[sourceY]|[sourceZ]|[sourceHeading]

Parsed Log Line Structure:
[timestamp] DoTHoT 18:[id]:[name]:[which]:[effectId]:[damage]:[currentHp]:[maxHp]:[currentMp]:[maxMp]:[?]:[?]:[x]:[y]:[z]:[heading]:[sourceId]:[source]:[damageType]:[sourceCurrentHp]:[sourceMaxHp]:[sourceCurrentMp]:[sourceMaxMp]:[?]:[?]:[sourceX]:[sourceY]:[sourceZ]:[sourceHeading]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>24)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<which>[^|]*)\|(?<effectId>[^|]*)\|(?<damage>[^|]*)\|(?<currentHp>[^|]*)\|(?<maxHp>[^|]*)\|(?<currentMp>[^|]*)\|(?<maxMp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<damageType>[^|]*)\|(?<sourceCurrentHp>[^|]*)\|(?<sourceMaxHp>[^|]*)\|(?<sourceCurrentMp>[^|]*)\|(?<sourceMaxMp>[^|]*)\|(?:[^|]*\|){2}(?<sourceX>[^|]*)\|(?<sourceY>[^|]*)\|(?<sourceZ>[^|]*)\|(?<sourceHeading>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) DoTHoT (?<type>18):(?<id>[^:]*):(?<name>[^:]*):(?<which>[^:]*):(?<effectId>[^:]*):(?<damage>[^:]*):(?<currentHp>[^:]*):(?<maxHp>[^:]*):(?<currentMp>[^:]*):(?<maxMp>[^:]*)(?::[^:]*){2}:(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*):(?<sourceId>[^:]*):(?<source>[^:]*):(?<damageType>[^:]*):(?<sourceCurrentHp>[^:]*):(?<sourceMaxHp>[^:]*):(?<sourceCurrentMp>[^:]*):(?<sourceMaxMp>[^:]*)(?::[^:]*){2}:(?<sourceX>[^:]*):(?<sourceY>[^:]*):(?<sourceZ>[^:]*):(?<sourceHeading>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
24|2022-07-07T21:59:30.6210000-07:00|10FF0001|Tini Poutini|DoT|3C0|9920|32134|63300|10000|10000|||90.44|87.60|0.00|-3.07|4000F123|Shikigami of the Pyre|5|7328307|7439000|10000|10000|||99.78|104.81|0.00|2.95|549a72f2e53a9dea
24|2023-07-05T20:05:54.6070000-07:00|10FF0006|French Fry|HoT|0|2824|91002|91002|10000|10000|||97.46|101.98|0.00|3.13|10FF0007|Mimite Mite|0|81541|81541|9600|10000|||100.04|110.55|0.00|-3.08|1ea68a0cb73843c7bb51808eeb8e80f8
24|2023-07-05T20:05:55.9400000-07:00|4001AAAF|Pandæmonium|DoT|0|1D1B|43502881|43656896|10000|10000|||100.00|65.00|0.00|0.00|10FF0003|Papas Fritas|FFFFFFFF|77094|77094|9200|10000|||100.16|99.85|0.00|-2.84|5b77b8e553b0ee5797caa1ab87b5a910

Parsed Log Line Examples:
[21:59:30.621] DoTHoT 18:10FF0001:Tini Poutini:DoT:3C0:9920:32134:63300:10000:10000:::90.44:87.60:0.00:-3.07:4000F123:Shikigami of the Pyre:5:7328307:7439000:10000:10000:::99.78:104.81:0.00:2.95
[20:05:54.607] DoTHoT 18:10FF0006:French Fry:HoT:0:2824:91002:91002:10000:10000:::97.46:101.98:0.00:3.13:10FF0007:Mimite Mite:0:81541:81541:9600:10000:::100.04:110.55:0.00:-3.08
[20:05:55.940] DoTHoT 18:4001AAAF:Pandæmonium:DoT:0:1D1B:43502881:43656896:10000:10000:::100.00:65.00:0.00:0.00:10FF0003:Papas Fritas:FFFFFFFF:77094:77094:9200:10000:::100.16:99.85:0.00:-2.84
```

<!-- AUTO-GENERATED-CONTENT:END -->

Ground effect dots get listed separately.

<a name="line25"></a>

### Line 25 (0x19): NetworkDeath

This message corresponds to an actor being defeated and killed.
This usually comes along with a game log message such as `You defeat the worm's heart.`

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=WasDefeated&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
25|[timestamp]|[targetId]|[target]|[sourceId]|[source]

Parsed Log Line Structure:
[timestamp] Death 19:[targetId]:[target]:[sourceId]:[source]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>25)\|(?<timestamp>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) Death (?<type>19):(?<targetId>[^:]*):(?<target>[^:]*):(?<sourceId>[^:]*):(?<source>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
25|2021-07-27T13:11:08.6990000-04:00|10FF0002|Potato Chippy|4000016E|Angra Mainyu|fd3760add061a5d2e23f63003cd7101d
25|2021-07-27T13:11:09.4110000-04:00|10FF0001|Tini Poutini|4000016E|Angra Mainyu|933d5e946659aa9cc493079d4f6934b3
25|2021-07-27T13:11:11.6840000-04:00|4000016E|Angra Mainyu|10FF0002|Potato Chippy|0b79669140c20f9aa92ad5559be75022
25|2021-07-27T13:13:10.6310000-04:00|400001D1|Queen Scylla|10FF0001|Tini Poutini|8798f2cb87c42fde4601258ae94ffb7f

Parsed Log Line Examples:
[13:11:08.699] Death 19:10FF0002:Potato Chippy:4000016E:Angra Mainyu
[13:11:09.411] Death 19:10FF0001:Tini Poutini:4000016E:Angra Mainyu
[13:11:11.684] Death 19:4000016E:Angra Mainyu:10FF0002:Potato Chippy
[13:13:10.631] Death 19:400001D1:Queen Scylla:10FF0001:Tini Poutini
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line26"></a>

### Line 26 (0x1A): NetworkBuff

This message is the "gains effect" message for players and mobs gaining effects whether they are good or bad.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=GainsEffect&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
26|[timestamp]|[effectId]|[effect]|[duration]|[sourceId]|[source]|[targetId]|[target]|[count]|[targetMaxHp]|[sourceMaxHp]

Parsed Log Line Structure:
[timestamp] StatusAdd 1A:[effectId]:[effect]:[duration]:[sourceId]:[source]:[targetId]:[target]:[count]:[targetMaxHp]:[sourceMaxHp]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>26)\|(?<timestamp>[^|]*)\|(?<effectId>[^|]*)\|(?<effect>[^|]*)\|(?<duration>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<count>[^|]*)\|(?<targetMaxHp>[^|]*)\|(?<sourceMaxHp>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) StatusAdd (?<type>1A):(?<effectId>[^:]*):(?<effect>(?:[^:]|: )*?):(?<duration>[^:]*):(?<sourceId>[^:]*):(?<source>[^:]*):(?<targetId>[^:]*):(?<target>[^:]*):(?<count>[^:]*):(?<targetMaxHp>[^:]*):(?<sourceMaxHp>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
26|2021-04-26T14:36:09.4340000-04:00|35|Physical Damage Up|15.00|400009D5|Dark General|400009D5|Dark General|00|48865|48865|cbcfac4df1554b8f59f343f017ebd793
26|2021-04-26T14:23:38.7560000-04:00|13B|Whispering Dawn|21.00|4000B283|Selene|10FF0002|Potato Chippy|4000016E|00|51893|49487|c7400f0eed1fe9d29834369affc22d3b
26|2021-07-02T21:57:07.9110000-04:00|D2|Doom|9.97|40003D9F||10FF0001|Tini Poutini|00|26396|26396|86ff6bf4cfdd68491274fce1db5677e8
26|2020-04-24T10:00:03.1370000-08:00|8D1|Lightsteeped|39.95|E0000000||10FF0001|Tini Poutini|01|103650|||ba7a8b1ffce9f0f57974de250e9da307

Parsed Log Line Examples:
[14:36:09.434] StatusAdd 1A:35:Physical Damage Up:15.00:400009D5:Dark General:400009D5:Dark General:00:48865:48865
[14:23:38.756] StatusAdd 1A:13B:Whispering Dawn:21.00:4000B283:Selene:10FF0002:Potato Chippy:4000016E:00:51893:49487
[21:57:07.911] StatusAdd 1A:D2:Doom:9.97:40003D9F::10FF0001:Tini Poutini:00:26396:26396
[10:00:03.137] StatusAdd 1A:8D1:Lightsteeped:39.95:E0000000::10FF0001:Tini Poutini:01:103650::
```

<!-- AUTO-GENERATED-CONTENT:END -->

The `source` can be blank here (and there will be two spaces like the above example if that's the case).

This line corresponds to game log lines that look like this:
`00:12af:The worm's heart suffers the effect of Slashing Resistance Down.`
`00:112e:Tini Poutini gains the effect of The Balance.`
`00:08af:You suffer the effect of Burning Chains.`

Although game log lines differentiate between buffs and debuffs,
this `NetworkBuff` line includes all effect types (both positive and negative).

You cannot count on the time remaining to be precise.
In rare cases, the time will already have counted down a tiny bit.
This matters for cases such as ucob Nael phase doom debuffs.

In some cases, the 'stacks' value may indicate other information about the buff.
For example, Mudra will show different "stack" values for different combinations of Mudra.
The only way to ensure that you are getting a "real" stack value is by cross-referencing with game data.
For example, if you see a stack value of '64',
but the status effect in question has a maximum stack count of zero,
then you know it is not a true stack count.

The "Unknown_808" status effect (0x808) uses the 'stacks' field to apply/remove a VFX,
where the count is the VFX ID.

#### Refreshes, Overwrites, and Deaths

If a buff is refreshed early, you will get another 26-line.
You will not get a 30-line indicating that the existing buff has been removed.
When stacks of a buff are added or removed, you may or may not receive a removal for the old stack value.

Most debuffs allow one player to place the debuff on each target.
For some, such as Trick Attack, only one can be on the enemy at a time.
If a buff is overwritten, a 30-line will be generated for the status effect that got overwritten.

Thus, it is sufficient to track buffs using a combination of caster, target, and status effect ID.
A refresh or stack change will have the same caster, target, and status effect,
while an overwrite will generate a 30-line anyway.

When an actor dies, you will get 30-lines for buffs that were removed by it dying.

<a name="line27"></a>

### Line 27 (0x1B): NetworkTargetIcon (Head Marker)

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=HeadMarker&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
27|[timestamp]|[targetId]|[target]|[?]|[?]|[id]

Parsed Log Line Structure:
[timestamp] TargetIcon 1B:[targetId]:[target]:[?]:[?]:[id]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>27)\|(?<timestamp>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?:[^|]*\|){2}(?<id>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) TargetIcon (?<type>1B):(?<targetId>[^:]*):(?<target>[^:]*)(?::[^:]*){2}:(?<id>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
27|2021-04-26T14:17:31.6980000-04:00|10FF0001|Tini Poutini|0000|A9B9|0057|0000|0000|0000|4fb326d8899ffbd4cbfeb29bbc3080f8
27|2021-05-11T13:48:45.3370000-04:00|40000950|Copied Knave|0000|0000|0117|0000|0000|0000|fa2e93fccf397a41aac73a3a38aa7410

Parsed Log Line Examples:
[14:17:31.698] TargetIcon 1B:10FF0001:Tini Poutini:0000:A9B9:0057:0000:0000:0000
[13:48:45.337] TargetIcon 1B:40000950:Copied Knave:0000:0000:0117:0000:0000:0000
```

<!-- AUTO-GENERATED-CONTENT:END -->

The different headmarker IDs (e.g. `0018` or `001A` in the examples above)
are consistent across fights as far as which marker they *visually* represent.
(Correct *resolution* for the marker mechanic may not be.)
For example, `0039` is the meteor marker in Shinryu EX adds phase and the Baldesion Arsenal Ozma fight.
The fields following `id` always appears to be zero in practice,
although the fields before the `id` infrequently have non-zero values.

Note: It's unclear when the head markers disappear.
Maybe one of these fields is a duration time? It's not clear what either of these unknown values mean.

Also, this appears to only be true on later fights.
Turn 5 fireball and conflag headmarkers are actions from Twintania and not `NetworkTargetIcon` lines.
It seems likely this was implemented later and nobody wanted to break old content by updating it to use newer types.

#### Head Marker IDs

ID | Name | Sample Locations | Consistent meaning?
--- | --- | --- | ---
000[1-2, 4] | Prey Circle (orange) | o6s, The Burn boss 2 | Yes
0007 | Green Meteor | t9n/s | N/A
0008 | Ghost Meteor | t9n/s | N/A
0009 | Red Meteor | t9n/s | N/A
000A | Yellow Meteor | t9n/s | N/A
000D | Devour Flower | t6n/s, Sohm Al boss 1 | Yes
000E | Prey Circle (blue) | t6n/s, o7s | No
0010 | Teal Crystal | Ultima Weapon Ultimate |N/A
0011 | Heavenly Laser (red) | t8n/s, e1n | No
0017 | Red Pinwheel | Sohm Al boss 2, Susano N/EX, e3n/s | No
0028 | Earth Shaker | Sephirot N/EX, o4s | Yes
001C | Gravity Puddle | e1n | N/A
001E | Prey Sphere (orange) | Dun Scaith boss 3, o7n/s | No
001F | Prey Sphere (blue) | t10 | N/A
003[2-5] | Sword Markers 1-4 | Ravana N/EX, Twinning boss 1 | N/A
0037 | Red Dorito | Weeping City boss 2, Ridorana boss 1 | Yes
0039 | Purple Spread Circle (large) | Ravana N/EX, Shinryu EX | Yes
003E | Stack Marker (bordered) | o8n/s, Dun Scaith | Yes
0046 | Green Pinwheel | Dun Scaith boss 1, o5n/s | Yes
0048 | Stack Marker | Sephirot | Yes
004B | Acceleration Bomb | Weeping City boss 3, Susano N/EX, o4s | Yes
004C | Purple Fire Circle (large) | e2n/s | Yes
0054 | Thunder Tether (orange) | Titania EX | N/A
0057 | Flare | o4n/s, e2n/s | Yes
005C | Prey (dark) | Dun Scaith boss 3/4, Holminster Switch boss 3 | No
005D | Stack Marker (tank--no border) | Dun Scaith boss 4, e4s | Yes
0060 | Orange Spread Circle (small) | Hades N | Yes
0061 | Chain Tether (orange) | The Vault boss 3, Shinryu N/EX | Yes
0064 | Stack Marker (bordered) | o3s, Ridorana boss 3 | Yes
0065 | Spread Bubble | o3s, Byakko EX | N/A
006E | Levinbolt | Susano EX | N/A
0076 | Prey (dark) | Bahamut Ultimate | N/A
0078 | Orange Spread Circle (large) | Akadaemia Anyder | Yes
007B | Scatter (animated Play symbol) | Rabanastre boss 4 | N/A
007C | Turn Away (animated eye symbol) | Rabanastre boss 4 | N/A
007E | Green Crystal | Shinryu N/EX | No
0083 | Sword Meteor (Tsukuyomi) | Tsukuyomi EX | N/A
0087 | Prey Sphere (blue) | Akadaemia Anyder | N/A
008A | Orange Spread Circle (large) | Innocence N/EX, Orbonne boss 3 | Yes
008B | Purple Spread Circle (small) | Ridorana boss 1, Hades N | Yes
008E | Death From Above | o10s | N/A
008F | Death From Below | o10s | N/A
009[1-8] | Fundamental Synergy Square/Circle | o12s | N/A
00A1 | Stack Marker (bordered) | Titania N/EX | Yes
00A9 | Orange Spread Circle (small) | o11n/s, e3n/s | Yes
00AB | Green Poison Circle | Qitana Ravel | N/A
00AC | Reprobation Tether | Innocence EX | N/A
00AE | Blue Pinwheel | Sohm Al boss 2 | N/A
00B9 | Yellow Triangle (spread) | e4s | N/A
00BA | Orange Square (stack) | e4s |N/A
00BB | Blue Square (big spread) | e4s |N/A
00BD | Purple Spread Circle (giant) | TItania N/EX | Yes
00BF | Granite Gaol | e4s | N/A

#### Offset Headmarkers

Newer content uses 'offset headmarkers' - every headmarker ID is offset by a per-instance value.
You will need to wait until you see the first headmarker in the instance,
and then use this as an offset by which to adjust all the other IDs you see.
There are a few strategies for dealing with this in triggers and trigger platforms:

- Figure out the real ID for the first headmarker you'd see in the instance,
  and use this to calculate the real ID for all other markers in the instance.
- Capture the ID of the first headmarker,
  and subtract this from all subsequent headmarkers,
  resulting in everything using relative values.
- Most mechanics apply their markers in a consistent order,
  so the order of the headmarkers can be used in lieu of the IDs.

Like [RSV](#line262),
SE generally only applies the headmarker obfuscation to new high-end content,
and then removes it later.

<a name="line28"></a>

### Line 28 (0x1C): NetworkRaidMarker (Floor Marker)

This message indicates a floor waymarker was added or deleted.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=NetworkRaidMarker&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
28|[timestamp]|[operation]|[waymark]|[id]|[name]|[x]|[y]|[z]

Parsed Log Line Structure:
[timestamp] WaymarkMarker 1C:[operation]:[waymark]:[id]:[name]:[x]:[y]:[z]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>28)\|(?<timestamp>[^|]*)\|(?<operation>[^|]*)\|(?<waymark>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) WaymarkMarker (?<type>1C):(?<operation>[^:]*):(?<waymark>[^:]*):(?<id>[^:]*):(?<name>[^:]*):(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
28|2021-04-26T19:04:39.1920000-04:00|Delete|7|10FF0001|Tini Poutini|0|0|0|b714a8b5b34ea60f8bf9f480508dc427
28|2021-04-26T19:27:23.5340000-04:00|Add|4|10FF0001|Tini Poutini|76.073|110.588|0|bcf81fb146fe88230333bbfd649eb240

Parsed Log Line Examples:
[19:04:39.192] WaymarkMarker 1C:Delete:7:10FF0001:Tini Poutini:0:0:0
[19:27:23.534] WaymarkMarker 1C:Add:4:10FF0001:Tini Poutini:76.073:110.588:0
```

<!-- AUTO-GENERATED-CONTENT:END -->

#### Combatant Marker Codes

| ID  | Description |
| --- | ----------- |
| 0   | A           |
| 1   | B           |
| 2   | C           |
| 3   | D           |
| 4   | 1           |
| 5   | 2           |
| 6   | 3           |
| 7   | 4           |

<a name="line29"></a>

### Line 29 (0x1D): NetworkTargetMarker (Player Marker)

This message indicates a target marker placed above or removed from a combatant's head by a player.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=NetworkTargetMarker&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
29|[timestamp]|[operation]|[waymark]|[id]|[name]|[targetId]|[targetName]

Parsed Log Line Structure:
[timestamp] SignMarker 1D:[operation]:[waymark]:[id]:[name]:[targetId]:[targetName]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>29)\|(?<timestamp>[^|]*)\|(?<operation>[^|]*)\|(?<waymark>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<targetId>[^|]*)\|(?<targetName>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) SignMarker (?<type>1D):(?<operation>[^:]*):(?<waymark>[^:]*):(?<id>[^:]*):(?<name>[^:]*):(?<targetId>[^:]*):(?<targetName>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
29|2021-06-10T20:15:15.1000000-04:00|Delete|0|10FF0001|Tini Poutini|4000641D||50460af5ff3f8ec9ad03e6953d3d1ba9
29|2021-05-25T22:54:32.5660000-04:00|Add|6|10FF0001|Tini Poutini|10FF0002|Potato Chippy|70a8c8a728d09af83e0a486e8271cc57

Parsed Log Line Examples:
[20:15:15.100] SignMarker 1D:Delete:0:10FF0001:Tini Poutini:4000641D:
[22:54:32.566] SignMarker 1D:Add:6:10FF0001:Tini Poutini:10FF0002:Potato Chippy
```

<!-- AUTO-GENERATED-CONTENT:END -->

#### Floor Marker Codes

| ID  | Description |
| --- | ----------- |
| 0   | Hexagon 1   |
| 1   | Hexagon 2   |
| 2   | Hexagon 3   |
| 3   | Hexagon 4   |
| 4   | Hexagon 5   |
| 5   | Chain 1     |
| 6   | Chain 2     |
| 7   | Chain 3     |
| 8   | Ignore 1    |
| 9   | Ignore 2    |
| 10  | Square      |
| 11  | Circle      |
| 12  | Plus        |
| 13  | Triangle    |

<a name="line30"></a>

### Line 30 (0x1E): NetworkBuffRemove

This is the paired "end" message to the [NetworkBuff](#line26) "begin" message.
This message corresponds to the loss of effects (either positive or negative).

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=LosesEffect&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
30|[timestamp]|[effectId]|[effect]|[?]|[sourceId]|[source]|[targetId]|[target]|[count]

Parsed Log Line Structure:
[timestamp] StatusRemove 1E:[effectId]:[effect]:[?]:[sourceId]:[source]:[targetId]:[target]:[count]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>30)\|(?<timestamp>[^|]*)\|(?<effectId>[^|]*)\|(?<effect>[^|]*)\|(?:[^|]*\|)(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<count>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) StatusRemove (?<type>1E):(?<effectId>[^:]*):(?<effect>(?:[^:]|: )*?):[^:]*:(?<sourceId>[^:]*):(?<source>[^:]*):(?<targetId>[^:]*):(?<target>[^:]*):(?<count>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
30|2021-04-26T14:38:09.6990000-04:00|13A|Inferno|0.00|400009FF|Ifrit-Egi|400009FD|Scylla|00|941742|4933|19164478551c91375dc13d0998365130
30|2021-04-26T14:37:12.8740000-04:00|77B|Summon Order|0.00|400009E8|Eos|400009E8|Eos|01|5810|5810|b1736ae2cf65864623f9779635c361cd
30|2021-04-26T14:23:38.8440000-04:00|BD|Bio II|0.00|10FF0001|Tini Poutini|4000B262|Midgardsormr|00|10851737|51654|e34ec8d3a8db783fe34f152178775804

Parsed Log Line Examples:
[14:38:09.699] StatusRemove 1E:13A:Inferno:0.00:400009FF:Ifrit-Egi:400009FD:Scylla:00:941742:4933
[14:37:12.874] StatusRemove 1E:77B:Summon Order:0.00:400009E8:Eos:400009E8:Eos:01:5810:5810
[14:23:38.844] StatusRemove 1E:BD:Bio II:0.00:10FF0001:Tini Poutini:4000B262:Midgardsormr:00:10851737:51654
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line31"></a>

### Line 31 (0x1F): NetworkGauge

Info about the current player's job gauge.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=NetworkGauge&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
31|[timestamp]|[id]|[data0]|[data1]|[data2]|[data3]

Parsed Log Line Structure:
[timestamp] Gauge 1F:[id]:[data0]:[data1]:[data2]:[data3]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>31)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<data0>[^|]*)\|(?<data1>[^|]*)\|(?<data2>[^|]*)\|(?<data3>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) Gauge (?<type>1F):(?<id>[^:]*):(?<data0>[^:]*):(?<data1>[^:]*):(?<data2>[^:]*):(?<data3>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
31|2019-11-27T23:22:40.6960000-05:00|10FF0001|FA753019|FD37|E9A55201|7F47|f17ea56b26ff020d1c0580207f6f4673
31|2021-04-28T00:26:19.1320000-04:00|10FF0002|BF000018|10035|40006600|00|f31bf7667388ce9b11bd5dd2626c7b99

Parsed Log Line Examples:
[23:22:40.696] Gauge 1F:10FF0001:FA753019:FD37:E9A55201:7F47
[00:26:19.132] Gauge 1F:10FF0002:BF000018:10035:40006600:00
```

<!-- AUTO-GENERATED-CONTENT:END -->

Each of the values after the name represents the memory for the job gauge,
interpreted as a 4 byte integer.
To get back to the original memory, zero pad out to 4 bytes,
and then reverse the bytes (because little endian).

For example, take this line:
`1F:10532971:Tini Poutini:C8000019:FD32:D0DF8C00:7FC0`

Zero extended:
`:C8000019:0000FD32:D0DF8C00:`

Reversed:
`19 00 00 C8 32 FD 00 00 00 8C DF D0`

The first byte is always the job.
The remaining bytes are a copy of the job gauge memory.

This job is `0x19` (or black mage).
Interpreting these [values](https://github.com/goaaats/Dalamud/blob/4ad5bee0c62128315b0a247466d28f42264c3069/Dalamud/Game/ClientState/Structs/JobGauge/BLMGauge.cs) means:

- `short TimeUntilNextPolyglot` = 0x0000 = 0
- `short ElementTimeRemaining` = 0x32C8 = 13000ms
- `byte ElementStance` = 0xFD = -3 (three stacks of ice)
- `byte NumUmbralHearts` = 0x00 = 0
- `byte EnoState` = 0x00 = 0 (no enochian)

There are a number of references for job gauge memory:

  1) [cactbot FFXIVProcess code](https://github.com/OverlayPlugin/cactbot/blob/a4d27eca3628d397cb9f5638fad97191566ed5a1/CactbotOverlay/FFXIVProcessIntl.cs#L267)
  1) [Dalamud code](https://github.com/goaaats/Dalamud/blob/4ad5bee0c62128315b0a247466d28f42264c3069/Dalamud/Game/ClientState/Structs/JobGauge/NINGauge.cs#L15)

Unfortunately, network data about other player's gauge is not sent.
You are unable to see the abilities of other players, only your own.
(This is probably by design to cut down on the amount of network data sent.)

<a name="line32"></a>

### Line 32 (0x20): NetworkWorld

Unused.

<a name="line33"></a>

### Line 33 (0x21): Network6D (Actor Control)

See also: [nari director update documentation](https://xivlogs.github.io/nari/types/director.html)

To control aspects of the user interface, the game sends packets called Actor Controls.
These are broken into 3 types: ActorControl, ActorControlSelf, and ActorControlTarget.
If ActorControl is global, then ActorControlSelf / ActorControlTarget affects individual actor(s).

Actor control commands are identified by a category,
with parameters passed to it as a handler.
DirectorUpdate is a category of ActorControlSelf and is used to control the events inside content for an individual player:

- BGM change
- some cutscenes
- barrier up/down
- fade in/out

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=ActorControl&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
33|[timestamp]|[instance]|[command]|[data0]|[data1]|[data2]|[data3]

Parsed Log Line Structure:
[timestamp] Director 21:[instance]:[command]:[data0]:[data1]:[data2]:[data3]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>33)\|(?<timestamp>[^|]*)\|(?<instance>[^|]*)\|(?<command>[^|]*)\|(?<data0>[^|]*)\|(?<data1>[^|]*)\|(?<data2>[^|]*)\|(?<data3>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) Director (?<type>21):(?<instance>[^:]*):(?<command>[^:]*):(?<data0>[^:]*):(?<data1>[^:]*):(?<data2>[^:]*):(?<data3>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
33|2021-04-26T17:23:28.6780000-04:00|80034E6C|4000000F|B5D|00|00|00|f777621829447c53c82c9a24aa25348f
33|2021-04-26T14:17:31.6980000-04:00|80034E5B|8000000C|16|FFFFFFFF|00|00|b543f3c5c715e93d9de2aa65b8fe83ad
33|2021-04-26T14:18:39.0120000-04:00|80034E5B|40000007|00|01|00|00|7a2b827bbc7a58ecc0c5edbdf14a2c14

Parsed Log Line Examples:
[17:23:28.678] Director 21:80034E6C:4000000F:B5D:00:00:00
[14:17:31.698] Director 21:80034E5B:8000000C:16:FFFFFFFF:00:00
[14:18:39.012] Director 21:80034E5B:40000007:00:01:00:00
```

<!-- AUTO-GENERATED-CONTENT:END -->

See [Instance Content ID](#instance-content-id) for more details about the `instance` parameter.

Wipes on most raids and primals these days can be detected via this regex in 6.2:
`21:........:4000000F:`.
Prior to 6.2, you can use this regex:
`21:........:40000010:`.
However, this does not occur on some older fights,
such as coil turns where there is a zone seal.

Known types:

- Initial commence: `21:content:40000001:time:` (time is the lockout time in seconds)
- Recommence: `21:content:40000006:time:00:00:00`
- Lockout time adjust: `21:content:80000004:time:00:00:00`
- Charge boss limit break: `21:content:8000000C:value1:value2:00:00`
- Music change: `21:content:80000001:value:00:00:00`
- Fade out: `21:content:40000005:00:00:00:00` (wipe)
- Fade in: `21:content:4000000F:00:00:00:00` (always paired with barrier up)
- Barrier up: `21:content:40000011:00:00:00:00` (always comes after fade in)
- Victory: `21:zone:40000003:00:00:00:00`
- Victory (variant/criterion): `21:zone:40000002:00:00:00:00`

Note: cactbot uses "fade in" as the wipe trigger,
but probably should switch to "fade out" after testing.

Still unknown:

- `21:zone:40000007:00:00:00:00`

<a name="line34"></a>

### Line 34 (0x22): NetworkNameToggle

This log message toggles whether the nameplate for a particular entity is visible or not.
This can help you know when a mob is targetable, for example.

The `toggle` value is either `00` (hide nameplate) or `01` (show nameplate).

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=NameToggle&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
34|[timestamp]|[id]|[name]|[targetId]|[targetName]|[toggle]

Parsed Log Line Structure:
[timestamp] NameToggle 22:[id]:[name]:[targetId]:[targetName]:[toggle]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>34)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<targetId>[^|]*)\|(?<targetName>[^|]*)\|(?<toggle>[^|]*)\|

Parsed Log Line Regex:
^(?<type>34)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<targetId>[^|]*)\|(?<targetName>[^|]*)\|(?<toggle>[^|]*)\|
```

#### Examples

```log
Network Log Line Examples:
34|2021-04-26T14:19:48.0400000-04:00|4001C51C|Dragon's Head|4001C51C|Dragon's Head|00|a7248aab1da528bf94faf2f4b1728fc3
34|2021-04-26T14:22:19.1960000-04:00|4000B283|Selene|4000B283|Selene|01|734eef0f5b1b10810af8f7257d738c67

Parsed Log Line Examples:
[14:19:48.040] NameToggle 22:4001C51C:Dragon's Head:4001C51C:Dragon's Head:00
[14:22:19.196] NameToggle 22:4000B283:Selene:4000B283:Selene:01
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line35"></a>

### Line 35 (0x23): NetworkTether

This log line is for tethers between enemies or enemies and players.
This does not appear to be used for player to player skill tethers like dragonsight or cover.
(It can be used for enemy-inflicted player to player tethers such as burning chains in Shinryu N/EX.)

The `id` parameter is an id into the [Channeling table](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/Channeling.csv).

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=Tether&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
35|[timestamp]|[sourceId]|[source]|[targetId]|[target]|[?]|[?]|[id]

Parsed Log Line Structure:
[timestamp] Tether 23:[sourceId]:[source]:[targetId]:[target]:[?]:[?]:[id]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>35)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?:[^|]*\|){2}(?<id>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) Tether (?<type>23):(?<sourceId>[^:]*):(?<source>[^:]*):(?<targetId>[^:]*):(?<target>[^:]*)(?::[^:]*){2}:(?<id>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
35|2021-04-26T17:27:07.0310000-04:00|40003202|Articulated Bit|10FF0001|Tini Poutini|0000|0000|0001|10029769|000F|0000|ad71d456437e6792f68b19dbef9507d5
35|2021-04-27T22:36:58.1060000-04:00|10FF0001|Tini Poutini|4000943B|Bomb Boulder|0000|0000|0007|4000943B|000F|0000|a6adfcdf5dad0ef891deeade4d285eb2
35|2021-06-13T17:41:34.2230000-04:00|10FF0001|Tini Poutini|10FF0002|Potato Chippy|0000|0000|006E|1068E3EF|000F|0000|c022382c6803d1d6c1f84681b7d8db20

Parsed Log Line Examples:
[17:27:07.031] Tether 23:40003202:Articulated Bit:10FF0001:Tini Poutini:0000:0000:0001:10029769:000F:0000
[22:36:58.106] Tether 23:10FF0001:Tini Poutini:4000943B:Bomb Boulder:0000:0000:0007:4000943B:000F:0000
[17:41:34.223] Tether 23:10FF0001:Tini Poutini:10FF0002:Potato Chippy:0000:0000:006E:1068E3EF:000F:0000
```

<!-- AUTO-GENERATED-CONTENT:END -->

The type of tether in the above three lines are `0001`, `0007`, and `006E` respectively.

Like [NetworkTargetIcon (Head Marker)](#line27),
Type is consistent across fights and represents a particular visual style of tether.

There are also a number of examples where tethers are generated in some other way:

- ultima aetheroplasm orbs: NpcSpawn parentActorId set to opposite orb
- t12 redfire orb: NpcSpawn parentActorId set to target
- t13 dark aether orbs: NpcSpawn parentActorId and targetId set to target player
- Suzaku Extreme birbs: who knows
- player to player tethers (dragonsight, cover, fairy tether)

There is currently no log line that indicates that a tether is no longer present.
Some mechanics may periodically "re-apply" the tether, resulting in multiple redundant lines.
If a tether changes (for example, a tether which players must stretch out),
it generates a new log line.

<a name="line36"></a>

### Line 36 (0x24): LimitBreak

This log line is recorded every server tick where limit break energy is generated while in combat in a light or full party.
(Generation is not recorded while at cap.)
It starts at `0x0000` at the beginning of the instance (or encounter in the caseof a single-encounter instance,)
and counts up by `0x00DC` (220 decimal,) until the limit break is used,
or the instance's maximum limit value is reached.
This rate of increase is constant,
but other actions taken can cause extra increments to happen independent of the base increase.
(These other increments occur in the same packet as the base rate, but separately.)

Each limit break bar is `0x2710` (10,000 decimal) units.
Thus, the maximum possible recorded value would be `0x7530`.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=LimitBreak&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
36|[timestamp]|[valueHex]|[bars]

Parsed Log Line Structure:
[timestamp] LimitBreak 24:[valueHex]:[bars]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>36)\|(?<timestamp>[^|]*)\|(?<valueHex>[^|]*)\|(?<bars>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) LimitBreak (?<type>24):(?<valueHex>[^:]*):(?<bars>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
36|2021-04-26T14:20:09.6880000-04:00|6A90|3|88ce578cb8f05d74feb3a7fa155bedc5
36|2021-04-26T14:20:19.6580000-04:00|4E20|2|a3bf154ba550e147d4fbbd4266db4eb9
36|2021-04-26T14:20:23.9040000-04:00|0000|0|703872b50849730773f7b21897698d00
36|2021-04-26T14:22:03.8370000-04:00|0000|1|c85f02ac4780e208357383afb6cbc232

Parsed Log Line Examples:
[14:20:09.688] LimitBreak 24:6A90:3
[14:20:19.658] LimitBreak 24:4E20:2
[14:20:23.904] LimitBreak 24:0000:0
[14:22:03.837] LimitBreak 24:0000:1
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line37"></a>

### Line 37 (0x25): NetworkActionSync

This log line is a sync packet that tells the client to render an action that has previously resolved.
(This can be an animation or text in one of the game text logs.)
It seems that it is emitted at the moment an action "actually happens" in-game,
while the [NetworkAbility](#line21) or [NetworkAOEAbility](#line22) line is emitted before,
at the moment the action is "locked in".

[As Ravahn explains it](https://discordapp.com/channels/551474815727304704/551476873717088279/733336512443187231):

> if I cast a spell, i will get an effectresult packet (line type 21/22) showing the damage amount,
> but the target isnt expected to actually take that damage yet.
> the line 37 has a unique identifier in it which refers back to the 21/22 line and indicates that the damage should now take effect on the target.
> The FFXIV plugin doesn't use these lines currently, they are used by FFLogs.
> It would help though if I did, but ACT doesn't do multi-line parsing very easily,
> so I would need to do a lot of work-arounds."

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=NetworkEffectResult&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
37|[timestamp]|[id]|[name]|[sequenceId]|[currentHp]|[maxHp]|[currentMp]|[maxMp]|[currentShield]|[?]|[x]|[y]|[z]|[heading]

Parsed Log Line Structure:
[timestamp] EffectResult 25:[id]:[name]:[sequenceId]:[currentHp]:[maxHp]:[currentMp]:[maxMp]:[currentShield]:[?]:[x]:[y]:[z]:[heading]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>37)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<sequenceId>[^|]*)\|(?<currentHp>[^|]*)\|(?<maxHp>[^|]*)\|(?<currentMp>[^|]*)\|(?<maxMp>[^|]*)\|(?<currentShield>[^|]*)\|(?:[^|]*\|)(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) EffectResult (?<type>25):(?<id>[^:]*):(?<name>[^:]*):(?<sequenceId>[^:]*):(?<currentHp>[^:]*):(?<maxHp>[^:]*):(?<currentMp>[^:]*):(?<maxMp>[^:]*):(?<currentShield>[^:]*):[^:]*:(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
37|2023-10-31T10:08:51.4080000-07:00|10FF0001|Tini Poutini|0000003A|117941|117941|10000|10000|0||-660.17|-842.23|29.75|-1.61|1500|0|0|01|5B|0|0|10755CA3|19aff167ea86b371
37|2023-10-31T22:11:04.8350000-07:00|10FF0002|Potato Chippy|00005AE1|0|88095|0|10000|0||8.61|15.22|0.00|2.69|1E00|0|0|01|0400002C|0|0|E0000000|ef1e0399980c0f47
37|2023-10-31T22:10:49.5860000-07:00|4000C5B2|Ketuduke|00005AD6|7452804||||||-0.02|-0.02|0.00|1.98|27ee18f38f377d5d

Parsed Log Line Examples:
[10:08:51.408] EffectResult 25:10FF0001:Tini Poutini:0000003A:117941:117941:10000:10000:0::-660.17:-842.23:29.75:-1.61:1500:0:0:01:5B:0:0:10755CA3
[22:11:04.835] EffectResult 25:10FF0002:Potato Chippy:00005AE1:0:88095:0:10000:0::8.61:15.22:0.00:2.69:1E00:0:0:01:0400002C:0:0:E0000000
[22:10:49.586] EffectResult 25:4000C5B2:Ketuduke:00005AD6:7452804::::::-0.02:-0.02:0.00:1.98
```

<!-- AUTO-GENERATED-CONTENT:END -->

#### Tracking Ability Resolution

Unfortunately, it is not trivial to know whether an ability has resolved, ghosted, or is still in-flight.
For one, while the server does tell the client when an action has resolved,
it does not tell the game when an action will not resolve (ghosting).
However, the caster dying or target becoming untargetable is usually a decent indicator that something will not resolve.

Note that AoE abilities may have the same sequence ID for all targets hit.
Thus, you need to key off of both the sequence ID, *and* the target.

Not every action will generate a corresponding 37-line.

#### HP Values

Sometimes, only the current HP is present, rather than current and max.
In this case, it should be assumed that the max HP is unchanged.

Lines [37](#line-37-0x25-networkactionsync),
[38](#line-38-0x26-networkstatuseffects),
and [39](#line-39-0x27-networkupdatehp) are special in that the "current" HP value actually represents an update to HP.
Other lines merely read the value from memory.
That means that these three lines never have stale HP values,
unlike other lines where the ACT plugin may have read values from memory before the game client has actually processed the packet.

#### Shield %

37- and 38-lines have a field for shield percentage. This is the current shield percentage of the target, rounded to
an integer. For example, if you have 3,000 HP worth of shields on a 20,000 hp entity, that would be a 15% shield.

More accurate shield values can sometimes be derived by looking at the sub-fields in 38-lines or 21/22-line action
effects. The effects will contain the least significant byte of the real shield value.

#### MP Values

The 'current MP' can actually be GP or CP rather than MP, if you are on a DoL or DoH class. However, the 'maximum' is
actually hardcoded to 10000 in the FFXIV plugin.

<a name="line38"></a>

### Line 38 (0x26): NetworkStatusEffects

For NPC opponents (and possibly PvP) this log line is generated alongside [NetworkDoT](#line24) lines.
For non-fairy allies, it is generated alongside [NetworkBuff](#line26),
[NetworkBuffRemove](#line30),
and [NetworkActionSync](#line37).

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=StatusEffect&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
38|[timestamp]|[targetId]|[target]|[jobLevelData]|[hp]|[maxHp]|[mp]|[maxMp]|[currentShield]|[?]|[x]|[y]|[z]|[heading]|[data0]|[data1]|[data2]|[data3]|[data4]|[data5]

Parsed Log Line Structure:
[timestamp] StatusList 26:[targetId]:[target]:[jobLevelData]:[hp]:[maxHp]:[mp]:[maxMp]:[currentShield]:[?]:[x]:[y]:[z]:[heading]:[data0]:[data1]:[data2]:[data3]:[data4]:[data5]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>38)\|(?<timestamp>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<jobLevelData>[^|]*)\|(?<hp>[^|]*)\|(?<maxHp>[^|]*)\|(?<mp>[^|]*)\|(?<maxMp>[^|]*)\|(?<currentShield>[^|]*)\|(?:[^|]*\|)(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|(?<data0>[^|]*)\|(?<data1>[^|]*)\|(?<data2>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) StatusList (?<type>26):(?<targetId>[^:]*):(?<target>[^:]*):(?<jobLevelData>[^:]*):(?<hp>[^:]*):(?<maxHp>[^:]*):(?<mp>[^:]*):(?<maxMp>[^:]*):(?<currentShield>[^:]*):[^:]*:(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*):(?<data0>[^:]*):(?<data1>[^:]*):(?<data2>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
38|2021-04-26T14:13:16.2760000-04:00|10FF0001|Tini Poutini|46504615|75407|75407|10000|10000|24|0|-645.238|-802.7854|8|1.091302|1500|3C|0|0A016D|41F00000|E0000000|1E016C|41F00000|E0000000|c1b3e1d63f03a265ffa85f1517c1501e
38|2021-04-26T14:13:16.2760000-04:00|10FF0001||46504621|49890|49890|10000|10000|24|0|||||1500|3C|0|f62dbda5c947fa4c11b63c90c6ee4cd9
38|2021-04-26T14:13:44.5020000-04:00|10FF0002|Potato Chippy|46504621|52418|52418|10000|10000|32|0|99.93127|113.8475|-1.862645E-09|3.141593|200F|20|0|0A016D|41F00000|E0000000|1E016C|41F00000|E0000000|0345|41E8D4FC|10FF0001|0347|80000000|10FF0002|d57fd29c6c4856c091557968667da39d

Parsed Log Line Examples:
[14:13:16.276] StatusList 26:10FF0001:Tini Poutini:46504615:75407:75407:10000:10000:24:0:-645.238:-802.7854:8:1.091302:1500:3C:0:0A016D:41F00000:E0000000:1E016C:41F00000:E0000000
[14:13:16.276] StatusList 26:10FF0001::46504621:49890:49890:10000:10000:24:0:::::1500:3C:0
[14:13:44.502] StatusList 26:10FF0002:Potato Chippy:46504621:52418:52418:10000:10000:32:0:99.93127:113.8475:-1.862645E-09:3.141593:200F:20:0:0A016D:41F00000:E0000000:1E016C:41F00000:E0000000:0345:41E8D4FC:10FF0001:0347:80000000:10FF0002
```

<!-- AUTO-GENERATED-CONTENT:END -->

This line conveys all current status effects on an entity.
This can be useful if a plugin or overlay was started after zoning in.
Like [Line 37](#line-37-0x25-networkactionsync) and [Line 39](#line-39-0x27-networkupdatehp),
the HP value in the line represents an HP change,
rather than a potentially-stale value from memory.

#### Data Fields

This is a variable-length line.
It can expand up to 30 status effects.
Beginning with the field called `data3`, each status effect takes three fields.

The first data field for each trio is the stack count/value in the first two bytes,
and the effect ID in the latter 2 bytes.
i.e. `field & 0xffff` will get you the effect ID,
and `(field & 0xffff0000) >> 16` will get you the stack/value.

The second is the remaining duration as a 32-bit float.
The value may be negative, in which case it should be flipped to positive.
It is possible that this may signify something unknown.
The line formats this as if it were a uint32,
so you will need to parse it as a uint32 and then reinterpret (not convert) it as a single-precision float.

For indefinite status effects, this may read out as a fixed value.
For example, FC buffs will always report a remaining duration of 30 seconds.

The third is the source entity.

For example, given the triplet:

```log
|030499|C1700000|10015678|
```

In the first element, we can see that the entity in question has three stacks of status effect 0x499 (Inner Release).

In the second, we take C1700000 and parse as a 32-bit floating point, giving us -15.
This means the remaining duration is 15 seconds.

The last field indicates that the stats effect originated from entity ID 10015678.

This can be repeated until running out of fields,
minus the checksum that the ACT plugin places at the end of every line.

<a name="line39"></a>

### Line 39 (0x27): NetworkUpdateHP

This line represents passive HP/MP regen ticks.
It conveys the new values for HP/MP.
Like [Line 37](#line-37-0x25-networkactionsync) and [Line 38](#line-38-0x26-networkstatuseffects),
the HP value is an update, rather than a value in memory.

NPCs (other than player pets) generally do not receive these packets,
as they do not have passive HP regen.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=NetworkUpdateHP&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
39|[timestamp]|[id]|[name]|[currentHp]|[maxHp]|[currentMp]|[maxMp]|[?]|[?]|[x]|[y]|[z]|[heading]

Parsed Log Line Structure:
[timestamp] UpdateHp 27:[id]:[name]:[currentHp]:[maxHp]:[currentMp]:[maxMp]:[?]:[?]:[x]:[y]:[z]:[heading]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>39)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<currentHp>[^|]*)\|(?<maxHp>[^|]*)\|(?<currentMp>[^|]*)\|(?<maxMp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) UpdateHp (?<type>27):(?<id>[^:]*):(?<name>[^:]*):(?<currentHp>[^:]*):(?<maxHp>[^:]*):(?<currentMp>[^:]*):(?<maxMp>[^:]*)(?::[^:]*){2}:(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
39|2021-04-26T14:12:38.5160000-04:00|10FF0001|Tini Poutini|178669|191948|10000|10000|0|0|-648.3234|-804.5252|8.570148|1.010669|7ebe348673aa2a11e4036274becabc81
39|2021-04-26T14:13:21.6370000-04:00|10592642|Senor Esteban|54792|54792|10000|10000|0|0|100.268|114.22|-1.837917E-09|3.141593|883da0db11a9c950eefdbcbc50e86eca
39|2021-04-26T14:13:21.6370000-04:00|106F5D49|O'ndanya Voupin|79075|79075|10000|10000|0|0|99.93127|114.2443|-1.862645E-09|-3.141593|8ed73ee57c4ab7159628584e2f4d5243

Parsed Log Line Examples:
[14:12:38.516] UpdateHp 27:10FF0001:Tini Poutini:178669:191948:10000:10000:0:0:-648.3234:-804.5252:8.570148:1.010669
[14:13:21.637] UpdateHp 27:10592642:Senor Esteban:54792:54792:10000:10000:0:0:100.268:114.22:-1.837917E-09:3.141593
[14:13:21.637] UpdateHp 27:106F5D49:O'ndanya Voupin:79075:79075:10000:10000:0:0:99.93127:114.2443:-1.862645E-09:-3.141593
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line40"></a>

### Line 40 (0x28): Map

This line is sent when the map changes.
It will be sent when changing zones,
but is also sent when changing subzones where the map changes
(e.g. crossing a zone line while in a dungeon).

`regionName` and `placeName` are always present,
but `placeNameSub` is optional.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=Map&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
40|[timestamp]|[id]|[regionName]|[placeName]|[placeNameSub]

Parsed Log Line Structure:
[timestamp] ChangeMap 28:[id]:[regionName]:[placeName]:[placeNameSub]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>40)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<regionName>[^|]*)\|(?<placeName>[^|]*)\|(?<placeNameSub>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) ChangeMap (?<type>28):(?<id>[^:]*):(?<regionName>[^:]*):(?<placeName>[^:]*):(?<placeNameSub>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
40|2021-07-30T19:43:08.6270000-07:00|578|Norvrandt|The Copied Factory|Upper Stratum|ee5b5fc06ab4610ef6b4f030fc95c90c
40|2021-07-30T19:46:49.3830000-07:00|575|Norvrandt|Excavation Tunnels||41e6dae1ab1a3fe18ce3754d7c45a5d0
40|2021-07-30T19:49:19.8180000-07:00|192|La Noscea|Mist|Mist Subdivision|f3506f063945500b5e7df2172e2ca4d3

Parsed Log Line Examples:
[19:43:08.627] ChangeMap 28:578:Norvrandt:The Copied Factory:Upper Stratum
[19:46:49.383] ChangeMap 28:575:Norvrandt:Excavation Tunnels:
[19:49:19.818] ChangeMap 28:192:La Noscea:Mist:Mist Subdivision
```

<!-- AUTO-GENERATED-CONTENT:END -->

<a name="line41"></a>

### Line 41 (0x29): SystemLogMessage

This log line is sent when there are system log messages.
As game chat log lines are read from memory in the FFXIV ACT plugin,
[Line 41](#line41) can be sent both before or after the corresponding [Line 00](#line00).
That said, they are usually sequential in the network log,
and so there is no timing advantage to using one over the other,
but the system log message will have a correct timestamp.

```log
[10:38:40.066] SystemLogMessage 29:00:901:619A9200:00:3C
[10:38:39.000] ChatLog 00:0839::Objective accomplished. If applicable, please make sure to submit items within the time limit.

[10:50:13.565] SystemLogMessage 29:8004001E:7DD:FF5FDA02:E1B:00
[10:50:13.000] ChatLog 00:0839::The Theater of One is sealed off!

[10:55:06.000] ChatLog 00:0839::The teleportation crystal glimmers.
[10:55:06.707] SystemLogMessage 29:8004001E:B3A:00:00:E0000000
```

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=SystemLogMessage&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
41|[timestamp]|[instance]|[id]|[param0]|[param1]|[param2]

Parsed Log Line Structure:
[timestamp] SystemLogMessage 29:[instance]:[id]:[param0]:[param1]:[param2]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>41)\|(?<timestamp>[^|]*)\|(?<instance>[^|]*)\|(?<id>[^|]*)\|(?<param0>[^|]*)\|(?<param1>[^|]*)\|(?<param2>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) SystemLogMessage (?<type>29):(?<instance>[^:]*):(?<id>[^:]*):(?<param0>[^:]*):(?<param1>[^:]*):(?<param2>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
41|2021-11-21T10:38:40.0660000-08:00|00|901|619A9200|00|3C|c6fcd8a8b198a5da28b9cfe6a3f544f4
41|2021-11-21T10:50:13.5650000-08:00|8004001E|7DD|FF5FDA02|E1B|00|4eeb89399fce54820eb19e06b4d6d95a
41|2021-11-21T10:55:06.7070000-08:00|8004001E|B3A|00|00|E0000000|1f600f85ec8d36d2b04d233e19f93d39

Parsed Log Line Examples:
[10:38:40.066] SystemLogMessage 29:00:901:619A9200:00:3C
[10:50:13.565] SystemLogMessage 29:8004001E:7DD:FF5FDA02:E1B:00
[10:55:06.707] SystemLogMessage 29:8004001E:B3A:00:00:E0000000
```

<!-- AUTO-GENERATED-CONTENT:END -->

The `id` parameter is an id into the [LogMessage table](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/LogMessage.csv).

id (hex) | Link | Shortened Message
--- | --- | ---
0x2EE | [link](https://xivapi.com/LogMessage/750?pretty=true) | You obtain (an item)
0x7DC | [link](https://xivapi.com/LogMessage/2012?pretty=true) | will be sealed off in X seconds
0x7DD | [link](https://xivapi.com/LogMessage/2013?pretty=true) | is sealed off
0x7DE | [link](https://xivapi.com/LogMessage/2014?pretty=true) | is no longer sealed

The log message itself determines the other parameters.
It seems that `IntegerParameter(1)` in the log message corresponds to `param1`
and `IntegerParameter(2)` corresponds to `param2`.
It is not clear what `param0` does or how other `Parameter` functions work.

Here are two network log lines:

```log
41|2022-01-11T16:28:50.6340000-08:00|80030054|7DC|02|1008|0F|1a1b91bd4bf5d5e1^M
00|2022-01-11T16:28:50.0000000-08:00|0839||The shell mound will be sealed off in 15 seconds!|3a0befeef04e203b^M
```

See [Instance Content ID](#instance-content-id) for more details about the `instance` parameter.
`00830054` represents instanced content for [The Dead Ends](https://xivapi.com/InstanceContent/84?pretty=true).

`7DC` is the `id`, which [corresponds](https://xivapi.com/LogMessage/2012?pretty=true) to:
`"<Clickable(<SheetEn(PlaceName,2,IntegerParameter(1),2,1)\/>)\/> will be sealed off in <Value>IntegerParameter(2)<\/Value> <If(Equal(IntegerParameter(2),1))>second<Else\/>seconds<\/If>!"`

Use the log message itself to determine what `param1` and `param2` mean, if anything.

In this case,
`param1` is `1008`, which from the log message you can determine is a PlaceName id.
Looking this up in the [PlaceName](https://xivapi.com/PlaceName/4104?pretty=true) table gets "Shell Mound".

`param2` is `0x0F`, which from the log message is used for the seconds in the message, i.e. 15 in decimal.

Here's one other example:

```log
41|2022-02-18T22:03:00.5130000-08:00|1B01EA|2EE|C2BD6401|758A|45D530|9efb90e26e3b41c3
00|2022-02-18T22:03:00.0000000-08:00|0BBE||You obtain a little leafman.|51d9427a6354d3af
```

`2EE` is the `id`, which [corresponds](https://xivapi.com/LogMessage/750?pretty=true) to:
`"<Clickable(<If(Equal(ObjectParameter(1),ObjectParameter(2)))>you<Else/><If(PlayerParameter(7))><SheetEn(ObjStr,2,PlayerParameter(7),1,1)/><Else/>ObjectParameter(2)</If></If>)/> <If(Equal(ObjectParameter(1),ObjectParameter(2)))>obtain<Else/>obtains</If> <SheetEn(Item,1,IntegerParameter(1),1,1)/>."`

Here, `param1` is `758A`, which [corresponds](https://xivapi.com/Item/30090?pretty=true) to "Little Leafman" in the `Item` table.
It is unclear how `ObjectParameter` and `PlayerParameter` work here.

Future work:

- What is `param0`? Is it just skipped?
- How do `PlayerParameter` and `ObjectParameter` work in the `LogMessage` table?
- Some log messages don't show as 41 lines, e.g. "You have arrived at a vista" or "Engage!".

<a name="line42"></a>

### Line 42 (0x2A): StatusList3

This line seems to be sent only for the current player and lists some status effects.
More information is needed.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=StatusList3&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
42|[timestamp]|[id]|[name]

Parsed Log Line Structure:
[timestamp] StatusList3 2A:[id]:[name]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>42)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) StatusList3 (?<type>2A):(?<id>[^:]*):(?<name>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
42|2022-06-06T21:57:14.8920000+08:00|10FF0001|Tini Poutini|0A0168|41F00000|E0000000|14016A|41F00000|E0000000|29310030|44835452|10FF0001|4361fffcb50708dd
42|2022-06-06T10:04:52.3370000-07:00|10FF0002|Potato Chippy|037F|0|E0000000|ee5bd3e5dbb46f59
42|2022-06-06T10:09:06.2140000-07:00|10FF0002|Potato Chippy|0|0|0|f988f962f9c768e3

Parsed Log Line Examples:
[21:57:14.892] StatusList3 2A:10FF0001:Tini Poutini:0A0168:41F00000:E0000000:14016A:41F00000:E0000000:29310030:44835452:10FF0001
[10:04:52.337] StatusList3 2A:10FF0002:Potato Chippy:037F:0:E0000000
[10:09:06.214] StatusList3 2A:10FF0002:Potato Chippy:0:0:0
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=StatusList3&lang=en-US) -->

<a name="line251"></a>

### Line 251 (0xFB): Debug

As network log lines, they often have information like this:
`251|2019-05-21T19:11:02.0268703-07:00|ProcessTCPInfo: New connection detected for Process [2644]: 192.168.1.70:49413=>204.2.229.85:55021|909171c500bed915f8d79fc04d3589fa`

Parsed log lines are blank for this type.

<a name="line252"></a>

### Line 252 (0xFC): PacketDump

If the setting to dump all network data to logfiles is turned on,
then ACT will emit all network data into the network log itself.
This can be used to import a network log file into ffxivmon and inspect packet data.

Parsed log lines are blank for this type.

![dump network data screenshot](images/logguide_dumpnetworkdata.png)

<a name="line253"></a>

### Line 253 (0xFD): Version

As network log lines, they usually look like this:
`253|2019-05-21T19:11:02.0268703-07:00|FFXIV PLUGIN VERSION: 1.7.2.12, CLIENT MODE: FFXIV_64|845e2929259656c833460402c9263d5c`

Parsed log lines are blank for this type.

<a name="line254"></a>

### Line 254 (0xFE): Error

These are lines emitted directly by the ffxiv plugin when something goes wrong.

## OverlayPlugin Log Lines

If you are using OverlayPlugin,
it will emit extra log lines that are not part of the ffxiv plugin.
The ids of these lines start at 256 and go up.
Any id between 0-255 is reserved for the ffxiv plugin.

<a name="line256"></a>

### Line 256 (0x100): LineRegistration

This line is emitted into logs when any custom logs are registered with OverlayPlugin.
This is so that it is obvious which log lines and versions to expect for a given log file.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=LineRegistration&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
256|[timestamp]|[id]|[source]|[name]|[version]

Parsed Log Line Structure:
[timestamp] 256 100:[id]:[source]:[name]:[version]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>256)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<source>[^|]*)\|(?<name>[^|]*)\|(?<version>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 256 (?<type>100):(?<id>[^:]*):(?<source>[^:]*):(?<name>[^:]*):(?<version>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
256|2022-10-02T10:15:31.5635165-07:00|257|OverlayPlugin|MapEffect|1|594b867ee2199369
256|2022-10-02T10:15:31.5645159-07:00|258|OverlayPlugin|FateDirector|1|102a238b2495bfd0
256|2022-10-02T10:15:31.5655143-07:00|259|OverlayPlugin|CEDirector|1|35546b48906c41b2

Parsed Log Line Examples:
[10:15:31.563] 256 100:257:OverlayPlugin:MapEffect:1
[10:15:31.564] 256 100:258:OverlayPlugin:FateDirector:1
[10:15:31.565] 256 100:259:OverlayPlugin:CEDirector:1
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=LineRegistration&lang=en-US) -->

<a name="line257"></a>

### Line 257 (0x101): MapEffect

This message is sent to cause a specific visual effect to render
in the game client during instanced content.
MapEffect lines are not tied to any particular actor or action
but may provide visual-based information about how an upcoming mechanic will resolve.

For example,
after Aetheric Polyominoid or Polyominoid Sigma casts in P6S,
MapEffect messages are sent to cause the game client to render  '+' and 'x' effects on specific map tiles,
indicating to the player which tiles will later be rendered unsafe by Polyominous Dark IV.

This can also include things like:

- meteor graphics / bridges breaking in Amaurot
- the eye location in DSR
- P8S torch effects

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=MapEffect&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
257|[timestamp]|[instance]|[flags]|[location]|[data0]|[data1]

Parsed Log Line Structure:
[timestamp] 257 101:[instance]:[flags]:[location]:[data0]:[data1]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>257)\|(?<timestamp>[^|]*)\|(?<instance>[^|]*)\|(?<flags>[^|]*)\|(?<location>[^|]*)\|(?<data0>[^|]*)\|(?<data1>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 257 (?<type>101):(?<instance>[^:]*):(?<flags>[^:]*):(?<location>[^:]*):(?<data0>[^:]*):(?<data1>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
257|2022-09-27T18:03:45.2834013-07:00|800375A9|00020001|09|F3|0000|de00c57494e85e79
257|2022-09-27T18:06:07.7744035-07:00|800375A9|00400020|01|00|0000|72933fe583158786
257|2022-09-29T20:07:48.7330170-07:00|800375A5|00020001|05|00|0000|28c0449a8d0efa7d

Parsed Log Line Examples:
[18:03:45.283] 257 101:800375A9:00020001:09:F3:0000
[18:06:07.774] 257 101:800375A9:00400020:01:00:0000
[20:07:48.733] 257 101:800375A5:00020001:05:00:0000
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=MapEffect&lang=en-US) -->

The `instance` parameter is identical to `instance` in an [actor control line](#line33).
See above for more information.

The `flags` parameter identifies the visual effect that will be rendered in the game.
For example,
in P6S, `00020001` flags equates to a `+`-shaped tile and
`00400020` flags equates to an `x`-shaped tile.
Flags do not appear to be unique across multiple instances:
as the above examples illustrate
the flags `00020001` are used in both P5S and P6S to render completely different visual effects.

That said,
it does appear from initial analysis that when a map effect is rendered,
a second MapEffect line with `00080004` flags is sent at the conclusion of the effect,
which may correspond to removal of the effect.
This appears to be consistent behavior across several fights so far,
but more information is needed.

The `location` parameter indicates the location in the current instance where the effect will be rendered.
Locations are not consistent across instances and appear to be unique to each instance.
E.g., a location of '05' in P6S corresponds to one of the 16 tiles on the map floor,
whereas the '05' location in P5S appears to correspond to different map coordinates.

<a name="line258"></a>

### Line 258 (0x102): FateDirector

This line indicates changes in fates on the map.
This includes when fates are added,
removed,
or their progress has changed.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=FateDirector&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
258|[timestamp]|[category]|[?]|[fateId]|[progress]

Parsed Log Line Structure:
[timestamp] 258 102:[category]:[?]:[fateId]:[progress]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>258)\|(?<timestamp>[^|]*)\|(?<category>[^|]*)\|(?:[^|]*\|)(?<fateId>[^|]*)\|(?<progress>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 258 (?<type>102):(?<category>[^:]*):[^:]*:(?<fateId>[^:]*):(?<progress>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
258|2022-09-19T17:25:59.5582137-07:00|Add|E601|000000DE|00000000|00000000|00000000|00000000|00000000|00000000|c7fd9f9aa7f56d4d
258|2022-08-13T19:46:54.6179420-04:00|Update|203A|00000287|00000000|00000000|00000000|00000000|00000000|6E756F63|bd60bac0189b571e
258|2022-09-24T12:51:47.5867309-07:00|Remove|0000|000000E2|00000000|00000000|00000000|00000000|00000000|00007FF9|043b821dbfe608c5

Parsed Log Line Examples:
[17:25:59.558] 258 102:Add:E601:000000DE:00000000:00000000:00000000:00000000:00000000:00000000
[19:46:54.617] 258 102:Update:203A:00000287:00000000:00000000:00000000:00000000:00000000:6E756F63
[12:51:47.586] 258 102:Remove:0000:000000E2:00000000:00000000:00000000:00000000:00000000:00007FF9
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=FateDirector&lang=en-US) -->

<a name="line259"></a>

### Line 259 (0x103): CEDirector

This line is like [FateDirector](#line258),
but is for Critical Engagements in Bozja.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=CEDirector&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
259|[timestamp]|[popTime]|[timeRemaining]|[?]|[ceKey]|[numPlayers]|[status]|[?]|[progress]

Parsed Log Line Structure:
[timestamp] 259 103:[popTime]:[timeRemaining]:[?]:[ceKey]:[numPlayers]:[status]:[?]:[progress]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>259)\|(?<timestamp>[^|]*)\|(?<popTime>[^|]*)\|(?<timeRemaining>[^|]*)\|(?:[^|]*\|)(?<ceKey>[^|]*)\|(?<numPlayers>[^|]*)\|(?<status>[^|]*)\|(?:[^|]*\|)(?<progress>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 259 (?<type>103):(?<popTime>[^:]*):(?<timeRemaining>[^:]*):[^:]*:(?<ceKey>[^:]*):(?<numPlayers>[^:]*):(?<status>[^:]*):[^:]*:(?<progress>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
259|2022-09-19T18:09:35.7012951-07:00|632912D5|0000|0000|07|01|02|00|00|7F|00|00|4965d513cc7a6dd3
259|2022-09-19T18:09:39.9541413-07:00|63291786|04B0|0000|07|01|03|00|00|00|00|00|6c18aa16678911ca
259|2022-09-19T18:09:46.7556709-07:00|63291786|04AA|0000|07|01|03|00|02|7F|00|00|5bf224d56535513a

Parsed Log Line Examples:
[18:09:35.701] 259 103:632912D5:0000:0000:07:01:02:00:00:7F:00:00
[18:09:39.954] 259 103:63291786:04B0:0000:07:01:03:00:00:00:00:00
[18:09:46.755] 259 103:63291786:04AA:0000:07:01:03:00:02:7F:00:00
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=CEDirector&lang=en-US) -->

<a name="line260"></a>

### Line 260 (0x104): InCombat

This log line tracks in combat state.
`inGameCombat` is whether FFXIV itself considers you in combat.
`inACTCombat` is whether ACT considers you in combat,
which may include other people around you and not yourself
and also takes your ACT encounter settings into consideration.

`isACTChanged` and `isGameChanged` represent whether the state has changed
since the last log line.
This allows triggers to be written for when a particular one changes,
as lines are emitted if either changes.
These are both true the first time the log is written.

OverlayPlugin uses `inACTCombat` to re-split your encounters during import
based on how they were split when they were originally recorded.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=InCombat&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
260|[timestamp]|[inACTCombat]|[inGameCombat]|[isACTChanged]|[isGameChanged]

Parsed Log Line Structure:
[timestamp] 260 104:[inACTCombat]:[inGameCombat]:[isACTChanged]:[isGameChanged]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>260)\|(?<timestamp>[^|]*)\|(?<inACTCombat>[^|]*)\|(?<inGameCombat>[^|]*)\|(?<isACTChanged>[^|]*)\|(?<isGameChanged>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 260 (?<type>104):(?<inACTCombat>[^:]*):(?<inGameCombat>[^:]*):(?<isACTChanged>[^:]*):(?<isGameChanged>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
260|2023-01-03T10:17:15.8240000-08:00|0|0|1|1|7da9e0cfed11abfe
260|2023-01-03T17:51:42.9680000-08:00|1|0|0|1|ae12d0898d923251
260|2023-01-03T17:54:50.0680000-08:00|1|1|1|0|3ba06c97a4cbbf42

Parsed Log Line Examples:
[10:17:15.824] 260 104:0:0:1:1
[17:51:42.968] 260 104:1:0:0:1
[17:54:50.068] 260 104:1:1:1:0
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=InCombat&lang=en-US) -->

<a name="line261"></a>

### Line 261 (0x105): CombatantMemory

OverlayPlugin has a `getCombatants` function which returns the state of combatants in the game.
However, it is hard to know when it is safe to call this function
and know that combatants have moved into position (or changed model or changed heading).
These lines give more granular information when combatants change their status.
Please note that this is still polling memory (so timing may be racy)
and there are some heuristics to not emit too many lines (so data may be imprecise).

For more information,
see the [class definition](https://github.com/OverlayPlugin/OverlayPlugin/blob/main/OverlayPlugin.Core/MemoryProcessors/Combatant/LineCombatant.cs#L27) in OverlayPlugin.

There are three types of this line:

- Add: emits all initial fields for this combatant that have non-default values
- Change: emits all fields that have changed
- Remove: no fields, combatant is being removed

Each line may contain an arbitrary number of field name / value pairs.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=CombatantMemory&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
261|[timestamp]|[change]|[id]

Parsed Log Line Structure:
[timestamp] 261 105:[change]:[id]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>261)\|(?<timestamp>[^|]*)\|(?<change>[^|]*)\|(?<id>[^|]*)\|(?:AggressionStatus\|(?<pairAggressionStatus>[^|]*)\|)?(?:BNpcID\|(?<pairBNpcID>[^|]*)\|)?(?:BNpcNameID\|(?<pairBNpcNameID>[^|]*)\|)?(?:CastBuffID\|(?<pairCastBuffID>[^|]*)\|)?(?:CastDurationCurrent\|(?<pairCastDurationCurrent>[^|]*)\|)?(?:CastDurationMax\|(?<pairCastDurationMax>[^|]*)\|)?(?:CastGroundTargetX\|(?<pairCastGroundTargetX>[^|]*)\|)?(?:CastGroundTargetY\|(?<pairCastGroundTargetY>[^|]*)\|)?(?:CastGroundTargetZ\|(?<pairCastGroundTargetZ>[^|]*)\|)?(?:CastTargetID\|(?<pairCastTargetID>[^|]*)\|)?(?:CurrentCP\|(?<pairCurrentCP>[^|]*)\|)?(?:CurrentGP\|(?<pairCurrentGP>[^|]*)\|)?(?:CurrentHP\|(?<pairCurrentHP>[^|]*)\|)?(?:CurrentMP\|(?<pairCurrentMP>[^|]*)\|)?(?:CurrentWorldID\|(?<pairCurrentWorldID>[^|]*)\|)?(?:Distance\|(?<pairDistance>[^|]*)\|)?(?:EffectiveDistance\|(?<pairEffectiveDistance>[^|]*)\|)?(?:Heading\|(?<pairHeading>[^|]*)\|)?(?:ID\|(?<pairID>[^|]*)\|)?(?:IsCasting1\|(?<pairIsCasting1>[^|]*)\|)?(?:IsCasting2\|(?<pairIsCasting2>[^|]*)\|)?(?:IsTargetable\|(?<pairIsTargetable>[^|]*)\|)?(?:Job\|(?<pairJob>[^|]*)\|)?(?:Level\|(?<pairLevel>[^|]*)\|)?(?:MaxCP\|(?<pairMaxCP>[^|]*)\|)?(?:MaxGP\|(?<pairMaxGP>[^|]*)\|)?(?:MaxHP\|(?<pairMaxHP>[^|]*)\|)?(?:MaxMP\|(?<pairMaxMP>[^|]*)\|)?(?:ModelStatus\|(?<pairModelStatus>[^|]*)\|)?(?:MonsterType\|(?<pairMonsterType>[^|]*)\|)?(?:Name\|(?<pairName>[^|]*)\|)?(?:NPCTargetID\|(?<pairNPCTargetID>[^|]*)\|)?(?:OwnerID\|(?<pairOwnerID>[^|]*)\|)?(?:PartyType\|(?<pairPartyType>[^|]*)\|)?(?:PCTargetID\|(?<pairPCTargetID>[^|]*)\|)?(?:PosX\|(?<pairPosX>[^|]*)\|)?(?:PosY\|(?<pairPosY>[^|]*)\|)?(?:PosZ\|(?<pairPosZ>[^|]*)\|)?(?:Radius\|(?<pairRadius>[^|]*)\|)?(?:Status\|(?<pairStatus>[^|]*)\|)?(?:TargetID\|(?<pairTargetID>[^|]*)\|)?(?:TransformationId\|(?<pairTransformationId>[^|]*)\|)?(?:Type\|(?<pairType>[^|]*)\|)?(?:WeaponId\|(?<pairWeaponId>[^|]*)\|)?(?:WorldID\|(?<pairWorldID>[^|]*)\|)?(?:WorldName\|(?<pairWorldName>[^|]*)\|)?

Parsed Log Line Regex:
(?<timestamp>^.{14}) 261 (?<type>105):(?<change>[^:]*):(?<id>[^:]*):(?:AggressionStatus(?:$|:)(?<pairAggressionStatus>[^:]*)(?:$|:))?(?:BNpcID(?:$|:)(?<pairBNpcID>[^:]*)(?:$|:))?(?:BNpcNameID(?:$|:)(?<pairBNpcNameID>[^:]*)(?:$|:))?(?:CastBuffID(?:$|:)(?<pairCastBuffID>[^:]*)(?:$|:))?(?:CastDurationCurrent(?:$|:)(?<pairCastDurationCurrent>[^:]*)(?:$|:))?(?:CastDurationMax(?:$|:)(?<pairCastDurationMax>[^:]*)(?:$|:))?(?:CastGroundTargetX(?:$|:)(?<pairCastGroundTargetX>[^:]*)(?:$|:))?(?:CastGroundTargetY(?:$|:)(?<pairCastGroundTargetY>[^:]*)(?:$|:))?(?:CastGroundTargetZ(?:$|:)(?<pairCastGroundTargetZ>[^:]*)(?:$|:))?(?:CastTargetID(?:$|:)(?<pairCastTargetID>[^:]*)(?:$|:))?(?:CurrentCP(?:$|:)(?<pairCurrentCP>[^:]*)(?:$|:))?(?:CurrentGP(?:$|:)(?<pairCurrentGP>[^:]*)(?:$|:))?(?:CurrentHP(?:$|:)(?<pairCurrentHP>[^:]*)(?:$|:))?(?:CurrentMP(?:$|:)(?<pairCurrentMP>[^:]*)(?:$|:))?(?:CurrentWorldID(?:$|:)(?<pairCurrentWorldID>[^:]*)(?:$|:))?(?:Distance(?:$|:)(?<pairDistance>[^:]*)(?:$|:))?(?:EffectiveDistance(?:$|:)(?<pairEffectiveDistance>[^:]*)(?:$|:))?(?:Heading(?:$|:)(?<pairHeading>[^:]*)(?:$|:))?(?:ID(?:$|:)(?<pairID>[^:]*)(?:$|:))?(?:IsCasting1(?:$|:)(?<pairIsCasting1>[^:]*)(?:$|:))?(?:IsCasting2(?:$|:)(?<pairIsCasting2>[^:]*)(?:$|:))?(?:IsTargetable(?:$|:)(?<pairIsTargetable>[^:]*)(?:$|:))?(?:Job(?:$|:)(?<pairJob>[^:]*)(?:$|:))?(?:Level(?:$|:)(?<pairLevel>[^:]*)(?:$|:))?(?:MaxCP(?:$|:)(?<pairMaxCP>[^:]*)(?:$|:))?(?:MaxGP(?:$|:)(?<pairMaxGP>[^:]*)(?:$|:))?(?:MaxHP(?:$|:)(?<pairMaxHP>[^:]*)(?:$|:))?(?:MaxMP(?:$|:)(?<pairMaxMP>[^:]*)(?:$|:))?(?:ModelStatus(?:$|:)(?<pairModelStatus>[^:]*)(?:$|:))?(?:MonsterType(?:$|:)(?<pairMonsterType>[^:]*)(?:$|:))?(?:Name(?:$|:)(?<pairName>[^:]*)(?:$|:))?(?:NPCTargetID(?:$|:)(?<pairNPCTargetID>[^:]*)(?:$|:))?(?:OwnerID(?:$|:)(?<pairOwnerID>[^:]*)(?:$|:))?(?:PartyType(?:$|:)(?<pairPartyType>[^:]*)(?:$|:))?(?:PCTargetID(?:$|:)(?<pairPCTargetID>[^:]*)(?:$|:))?(?:PosX(?:$|:)(?<pairPosX>[^:]*)(?:$|:))?(?:PosY(?:$|:)(?<pairPosY>[^:]*)(?:$|:))?(?:PosZ(?:$|:)(?<pairPosZ>[^:]*)(?:$|:))?(?:Radius(?:$|:)(?<pairRadius>[^:]*)(?:$|:))?(?:Status(?:$|:)(?<pairStatus>[^:]*)(?:$|:))?(?:TargetID(?:$|:)(?<pairTargetID>[^:]*)(?:$|:))?(?:TransformationId(?:$|:)(?<pairTransformationId>[^:]*)(?:$|:))?(?:Type(?:$|:)(?<pairType>[^:]*)(?:$|:))?(?:WeaponId(?:$|:)(?<pairWeaponId>[^:]*)(?:$|:))?(?:WorldID(?:$|:)(?<pairWorldID>[^:]*)(?:$|:))?(?:WorldName(?:$|:)(?<pairWorldName>[^:]*)(?:$|:))?(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
261|2023-05-26T21:37:40.5600000-04:00|Add|40008953|BNpcID|3F5A|BNpcNameID|304E|CastTargetID|E0000000|CurrentMP|10000|CurrentWorldID|65535|Heading|-3.1416|Level|90|MaxHP|69200|MaxMP|10000|ModelStatus|18432|Name|Golbez's Shadow|NPCTargetID|E0000000|PosX|100.0000|PosY|100.0000|PosZ|0.0300|Radius|7.5000|Type|2|WorldID|65535|9d9028a8e087e4c3
261|2023-05-26T21:39:41.2920000-04:00|Change|10001234|CurrentMP|2400|Heading|-2.3613|2f5ff0a91385050a
261|2023-05-26T21:39:42.7380000-04:00|Remove|40008AA0|f4b30f181245b5da

Parsed Log Line Examples:
[21:37:40.560] 261 105:Add:40008953:BNpcID:3F5A:BNpcNameID:304E:CastTargetID:E0000000:CurrentMP:10000:CurrentWorldID:65535:Heading:-3.1416:Level:90:MaxHP:69200:MaxMP:10000:ModelStatus:18432:Name:Golbez's Shadow:NPCTargetID:E0000000:PosX:100.0000:PosY:100.0000:PosZ:0.0300:Radius:7.5000:Type:2:WorldID:65535
[21:39:41.292] 261 105:Change:10001234:CurrentMP:2400:Heading:-2.3613
[21:39:42.738] 261 105:Remove:40008AA0
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=CombatantMemory&lang=en-US) -->

<a name="line262"></a>

### Line 262 (0x106): RSVData

Square Enix obfuscates (among other things) ability names, status names, and messages
in current savage and ultimate content in the game data itself.
This is to prevent data mining.
However, as these ability names need to be displayed by the game itself
these ability names are sent as network data upon zoning in.
After the next major patch, the game files will usually contain the real values.

These lines display the currently obfuscated abilities
for the current zone for the current game locale.

Note that `:` characters are not escaped even if the game abilities have a `:` in them.
It is recommended to use the network log line format to parse these lines for that reason.

These values may also contain special unicode character sequences
that the game client will replace with placeholder values,
such as the current player's name.
CR and LF characters are also escaped and will need to be unescaped.
See the logs below for an example.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=RSVData&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
262|[timestamp]|[locale]|[?]|[key]|[value]

Parsed Log Line Structure:
[timestamp] 262 106:[locale]:[?]:[key]:[value]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>262)\|(?<timestamp>[^|]*)\|(?<locale>[^|]*)\|(?:[^|]*\|)(?<key>[^|]*)\|(?<value>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 262 (?<type>106):(?<locale>[^:]*):[^:]*:(?<key>[^:]*):(?<value>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
262|2023-04-21T23:24:05.8320000-04:00|en|0000001C|_rsv_32789_-1_1_0_1_SE2DC5B04_EE2DC5B04|Run: ****mi* (Omega Version)|34159b6f2093e889
262|2023-04-21T23:24:05.9210000-04:00|en|00000031|_rsv_3448_-1_1_1_0_S74CFC3B0_E74CFC3B0|Burning with dynamis inspired by Omega's passion.|ce9d03bb211d894f
262|2023-04-21T23:24:06.0630000-04:00|en|00000051|_rsv_35827_-1_1_0_0_S13095D61_E13095D61|Further testing is required.�����, ���)������ ��, assist me with this evaluation.|38151741aad7fe51

Parsed Log Line Examples:
[23:24:05.832] 262 106:en:0000001C:_rsv_32789_-1_1_0_1_SE2DC5B04_EE2DC5B04:Run: ****mi* (Omega Version)
[23:24:05.921] 262 106:en:00000031:_rsv_3448_-1_1_1_0_S74CFC3B0_E74CFC3B0:Burning with dynamis inspired by Omega's passion.
[23:24:06.063] 262 106:en:00000051:_rsv_35827_-1_1_0_0_S13095D61_E13095D61:Further testing is required.�����, ���)������ ��, assist me with this evaluation.
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=RSVData&lang=en-US) -->

<a name="line263"></a>

### Line 263 (0x107): StartsUsingExtra

This line contains extra data for ActorCast/StartsUsing network data.

This line is always output for a given StartsUsing cast.

If the ability is non-targeted, `x`/`y`/`z`/`heading` will be the source actor's position
and heading data.

If the ability is actor-targeted, then `x`/`y`/`z` will be the target actor's current
position, and `heading` will be the angle from the source actor to the target actor.

If the ability purely targets the ground (such as BLU Bomb Toss), then
`x`/`y`/`z`/`heading` be the position data for the target location.

If the ability purely targets a direction (such as BLU Aqua Breath), then  `x`/`y`/`z`
will be the source actor's position, while `heading` is the direction in which the
ability was cast.

Note that the important part is how the ability is *targeted*, not its actual AoE
type. For example, Pneuma hits everything in a line, as if it were targeting a direction.
However, it is targeted on an actor, and if said actor moves during the cast, then the
cast will "follow" the target. Thus, if the ability has a target (and the target is
neither the caster nor the environment), then the actual location of the target is a
better indication of where it will hit.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=StartsUsingExtra&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
263|[timestamp]|[sourceId]|[id]|[x]|[y]|[z]|[heading]

Parsed Log Line Structure:
[timestamp] 263 107:[sourceId]:[id]:[x]:[y]:[z]:[heading]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>263)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<id>[^|]*)\|(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 263 (?<type>107):(?<sourceId>[^:]*):(?<id>[^:]*):(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
263|2023-11-02T20:53:52.1900000-04:00|10001234|0005|-98.697|-102.359|10.010|1.524|dd76513d3dd59f5a
263|2023-11-02T21:39:18.6200000-04:00|10001234|0085|-6.653|747.154|130.009|2.920|39e0326a5ee47b77
263|2023-11-02T21:39:12.6940000-04:00|40000D6E|8C45|-14.344|748.558|130.009|-3.142|9c7e421d4e93de7c

Parsed Log Line Examples:
[20:53:52.190] 263 107:10001234:0005:-98.697:-102.359:10.010:1.524
[21:39:18.620] 263 107:10001234:0085:-6.653:747.154:130.009:2.920
[21:39:12.694] 263 107:40000D6E:8C45:-14.344:748.558:130.009:-3.142
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=StartsUsingExtra&lang=en-US) -->

<a name="line264"></a>

### Line 264 (0x108): AbilityExtra

This line contains extra data for Ability/NetworkAOEAbility network data.

This line is always output for a given Ability hit, regardless of if that Ability hit had
a corresponding StartsUsing line.

If the ability has no target, or is single-target, the `dataFlag` value will be `0`,
and the `x`/`y`/`z`/`heading` fields will be blank.

If the ability targets the ground, for example `Asylum`/`Sacred Soil`/caster LB3, the
`dataFlag` value will be `1` and the `x`/`y`/`z`/`heading` fields will correspond to the
ground target location and heading of the ability target.

If the ability targets a direction (such as line/cone AoEs), then the `x/y/z` will be the
source actor's position, while `heading` is the direction that the ability is casting
towards.

If there is some sort of error related to parsing this data from the network packet,
`dataFlag` will be `256`, and the `x`/`y`/`z`/`heading` fields will be blank.

`globalEffectCounter` is equivalent to `sequence` field in
[NetworkAbility](#line-21-0x15-networkability) and
[NetworkAOEAbility](#line-22-0x16-networkaoeability).

Note that unlike [StartsUsingExtra](#line-263-0x107-startsusingextra), you do not need
to worry about whether or not there is an actor target, as this represents the final
snapshotted location of the Ability.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=AbilityExtra&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
264|[timestamp]|[sourceId]|[id]|[globalEffectCounter]|[dataFlag]|[x]|[y]|[z]|[heading]

Parsed Log Line Structure:
[timestamp] 264 108:[sourceId]:[id]:[globalEffectCounter]:[dataFlag]:[x]:[y]:[z]:[heading]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>264)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<id>[^|]*)\|(?<globalEffectCounter>[^|]*)\|(?<dataFlag>[^|]*)\|(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 264 (?<type>108):(?<sourceId>[^:]*):(?<id>[^:]*):(?<globalEffectCounter>[^:]*):(?<dataFlag>[^:]*):(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*):(?<heading>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
264|2023-11-02T20:53:56.6450000-04:00|10001234|0005|000003EF|0|||||9f7371fa0e3a42c8
264|2023-11-02T21:39:20.0910000-04:00|10001234|0085|0000533E|1|0.000|0.000|0.000|2.920|2e9ae29c1b65f930
264|2023-11-02T21:39:15.6790000-04:00|40000D6E|8C45|000052DD|1|-14.344|748.558|130.009|2.483|f6b3ffa6c97f0540

Parsed Log Line Examples:
[20:53:56.645] 264 108:10001234:0005:000003EF:0::::
[21:39:20.091] 264 108:10001234:0085:0000533E:1:0.000:0.000:0.000:2.920
[21:39:15.679] 264 108:40000D6E:8C45:000052DD:1:-14.344:748.558:130.009:2.483
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=AbilityExtra&lang=en-US) -->

<a name="line265"></a>

### Line 265 (0x109): ContentFinderSettings

This log line tracks the current Content Finder settings.
`inContentFinderContent` is whether the current zone supports Content Finder settings.

Values for `unrestrictedParty`, `minimalItemLevel`, `silenceEcho`,
`explorerMode`, and `levelSync` are pulled directly from the game.
As of FFXIV patch 6.5.1, a value of `0` indicates that the setting is disabled,
and a value of `1` indicates that it is enabled.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=ContentFinderSettings&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
265|[timestamp]|[zoneId]|[zoneName]|[inContentFinderContent]|[unrestrictedParty]|[minimalItemLevel]|[silenceEcho]|[explorerMode]|[levelSync]

Parsed Log Line Structure:
[timestamp] 265 109:[zoneId]:[zoneName]:[inContentFinderContent]:[unrestrictedParty]:[minimalItemLevel]:[silenceEcho]:[explorerMode]:[levelSync]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>265)\|(?<timestamp>[^|]*)\|(?<zoneId>[^|]*)\|(?<zoneName>[^|]*)\|(?<inContentFinderContent>[^|]*)\|(?<unrestrictedParty>[^|]*)\|(?<minimalItemLevel>[^|]*)\|(?<silenceEcho>[^|]*)\|(?<explorerMode>[^|]*)\|(?<levelSync>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 265 (?<type>109):(?<zoneId>[^:]*):(?<zoneName>[^:]*):(?<inContentFinderContent>[^:]*):(?<unrestrictedParty>[^:]*):(?<minimalItemLevel>[^:]*):(?<silenceEcho>[^:]*):(?<explorerMode>[^:]*):(?<levelSync>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
265|2024-01-04T21:11:46.6810000-05:00|86|Middle La Noscea|False|0|0|0|0|0|00eaa235236e5121
265|2024-01-04T21:12:02.4720000-05:00|40C|Sastasha|True|0|0|0|1|0|2ff0a9f6e1a54176
265|2024-01-04T21:12:35.0540000-05:00|415|the Bowl of Embers|True|1|1|1|0|1|55fdf5241f168a5e

Parsed Log Line Examples:
[21:11:46.681] 265 109:86:Middle La Noscea:False:0:0:0:0:0
[21:12:02.472] 265 109:40C:Sastasha:True:0:0:0:1:0
[21:12:35.054] 265 109:415:the Bowl of Embers:True:1:1:1:0:1
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=ContentFinderSettings&lang=en-US) -->

<a name="line266"></a>

### Line 266 (0x10A): NpcYell

This log line is emitted whenever a NpcYell packet is received from the server,
indicating that an NPC has yelled something (e.g. UCOB Nael quotes).

`npcNameId` and `npcYellId` (both hex values) correspond to IDs
in the [BNpcName](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/BNpcName.csv)
and [NpcYell](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/NpcYell.csv) tables, respectively.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=NpcYell&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
266|[timestamp]|[npcId]|[npcNameId]|[npcYellId]

Parsed Log Line Structure:
[timestamp] 266 10A:[npcId]:[npcNameId]:[npcYellId]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>266)\|(?<timestamp>[^|]*)\|(?<npcId>[^|]*)\|(?<npcNameId>[^|]*)\|(?<npcYellId>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 266 (?<type>10A):(?<npcId>[^:]*):(?<npcNameId>[^:]*):(?<npcYellId>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
266|2024-02-29T15:15:40.5850000-08:00|4001F001|02D2|07AF|8f731e1760bdcfc9
266|2024-02-29T15:15:54.5570000-08:00|4001F002|02D4|07BE|ae0674ec1e496642
266|2024-02-25T16:02:15.0300000-05:00|E0000000|6B10|2B29|65aa9c0faa3d0e16

Parsed Log Line Examples:
[15:15:40.585] 266 10A:4001F001:02D2:07AF
[15:15:54.557] 266 10A:4001F002:02D4:07BE
[16:02:15.030] 266 10A:E0000000:6B10:2B29
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=NpcYell&lang=en-US) -->

<a name="line267"></a>

### Line 267 (0x10B): BattleTalk2

This log line is emitted whenever a BattleTalk2 packet is received from the server,
resulting in popup dialog being displayed during instanced content.

`npcNameId` and `instanceContentTextId` (both hex values) correspond to IDs
in the [BNpcName](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/BNpcName.csv)
and [InstanceContentTextData](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/InstanceContentTextData.csv)
tables, respectively.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=BattleTalk2&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
267|[timestamp]|[npcId]|[instance]|[npcNameId]|[instanceContentTextId]|[displayMs]

Parsed Log Line Structure:
[timestamp] 267 10B:[npcId]:[instance]:[npcNameId]:[instanceContentTextId]:[displayMs]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>267)\|(?<timestamp>[^|]*)\|(?<npcId>[^|]*)\|(?<instance>[^|]*)\|(?<npcNameId>[^|]*)\|(?<instanceContentTextId>[^|]*)\|(?<displayMs>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 267 (?<type>10B):(?<npcId>[^:]*):(?<instance>[^:]*):(?<npcNameId>[^:]*):(?<instanceContentTextId>[^:]*):(?<displayMs>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
267|2024-02-29T16:22:41.4210000-08:00|00000000|80034E2B|02CE|840C|5000|0|2|0|0|6f6ccb784c36e978
267|2024-02-29T16:22:17.9230000-08:00|00000000|80034E2B|02D2|8411|7000|0|2|0|0|be1dee98cdcd67a4
267|2024-02-29T16:23:00.6680000-08:00|4001FFC4|80034E2B|02D5|840F|3000|0|2|0|0|cffef89907b5345b

Parsed Log Line Examples:
[16:22:41.421] 267 10B:00000000:80034E2B:02CE:840C:5000:0:2:0:0
[16:22:17.923] 267 10B:00000000:80034E2B:02D2:8411:7000:0:2:0:0
[16:23:00.668] 267 10B:4001FFC4:80034E2B:02D5:840F:3000:0:2:0:0
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=BattleTalk2&lang=en-US) -->

<a name="line268"></a>

### Line 268 (0x10C): Countdown

This log line is emitted whenever a countdown is started.

`result` is `00` if successful, and non-zero if the attempt to start a countdown failed
(e.g., if a countdown is already in progress, or if combat has started).

Note: Because there is no network packet sent when a countdown completes successfully,
no log line is (or reasonably can be) emitted for the 'Engage!' message.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=Countdown&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
268|[timestamp]|[id]|[worldId]|[countdownTime]|[result]|[name]

Parsed Log Line Structure:
[timestamp] 268 10C:[id]:[worldId]:[countdownTime]:[result]:[name]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>268)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<worldId>[^|]*)\|(?<countdownTime>[^|]*)\|(?<result>[^|]*)\|(?<name>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 268 (?<type>10C):(?<id>[^:]*):(?<worldId>[^:]*):(?<countdownTime>[^:]*):(?<result>[^:]*):(?<name>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
268|2024-02-29T15:19:48.6250000-08:00|10FF0001|0036|13|00|Tini Poutini|0ab734bdbcb55902
268|2024-02-29T15:34:16.4280000-08:00|10FF0002|0036|20|00|Potato Chippy|0ab734bdbcb55902

Parsed Log Line Examples:
[15:19:48.625] 268 10C:10FF0001:0036:13:00:Tini Poutini
[15:34:16.428] 268 10C:10FF0002:0036:20:00:Potato Chippy
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=Countdown&lang=en-US) -->

<a name="line269"></a>

### Line 269 (0x10D): CountdownCancel

This log line is emitted whenever a currently-running countdown is cancelled.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=CountdownCancel&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
269|[timestamp]|[id]|[worldId]|[name]

Parsed Log Line Structure:
[timestamp] 269 10D:[id]:[worldId]:[name]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>269)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<worldId>[^|]*)\|(?<name>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 269 (?<type>10D):(?<id>[^:]*):(?<worldId>[^:]*):(?<name>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
269|2024-02-29T15:19:55.3490000-08:00|10FF0001|0036|Tini Poutini|e17efb9d120adea0
269|2024-02-29T15:34:22.8940000-08:00|10FF0002|0036|Potato Chippy|e17efb9d120adea0

Parsed Log Line Examples:
[15:19:55.349] 269 10D:10FF0001:0036:Tini Poutini
[15:34:22.894] 269 10D:10FF0002:0036:Potato Chippy
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=CountdownCancel&lang=en-US) -->

<a name="line270"></a>

### Line 270 (0x10E): ActorMove

An `ActorMove` packet is sent to instruct the game client to move an actor to a new position
whenever they have been moved.
This can be used, for example, to detect rapid movement which would otherwise be lost
(e.g., in UWU, when Titan turns prior to jumping to indicate the direction of his jump).
The FFXIV client interpolates the actor's movement between the current position and the new position.

Currently, these log lines are emitted only for non-player actors (id >= 0x40000000).

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=ActorMove&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
270|[timestamp]|[id]|[heading]|[?]|[?]|[x]|[y]|[z]

Parsed Log Line Structure:
[timestamp] 270 10E:[id]:[heading]:[?]:[?]:[x]:[y]:[z]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>270)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<heading>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 270 (?<type>10E):(?<id>[^:]*):(?<heading>[^:]*)(?::[^:]*){2}:(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
270|2024-03-02T13:14:37.0430000-08:00|4000F1D3|-2.2034|0002|0014|102.0539|118.1982|0.2136|4601ae28c0b481d8
270|2024-03-02T13:18:30.2960000-08:00|4000F44E|2.8366|0002|0014|98.2391|101.9623|0.2136|2eed500a1505cb03
270|2024-03-02T13:18:30.6070000-08:00|4000F44E|-2.5710|0002|0014|98.2391|101.9318|0.2136|51bc63077eb489f3

Parsed Log Line Examples:
[13:14:37.043] 270 10E:4000F1D3:-2.2034:0002:0014:102.0539:118.1982:0.2136
[13:18:30.296] 270 10E:4000F44E:2.8366:0002:0014:98.2391:101.9623:0.2136
[13:18:30.607] 270 10E:4000F44E:-2.5710:0002:0014:98.2391:101.9318:0.2136
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=ActorMove&lang=en-US) -->

<a name="line271"></a>

### Line 271 (0x10F): ActorSetPos

An `ActorSetPos` packet is sent to instruct the game client to set the position of an actor
with no interpolated movement (for example, in UWU, to set the location of the Ifrit clones).

These log lines are sometimes accompanied by other data (other log lines or network packets)
indicating that an animation should be played if the actor is visible.
For example, the following log lines (or network packets) might be sent
in sequence to have an enemy appear to jump to a new location:

1. A [NetworkAbility](#line-21-0x15-networkability) line with an associated animation
   to make it appear as though the actor is jumping.
2. An `ActorSetPos` line to change the actor's location.
3. Another `NetworkAbility` line (or other packet) with an associated animation to make it
   appear as though the actor has landed.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=ActorSetPos&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
271|[timestamp]|[id]|[heading]|[?]|[?]|[x]|[y]|[z]

Parsed Log Line Structure:
[timestamp] 271 10F:[id]:[heading]:[?]:[?]:[x]:[y]:[z]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>271)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<heading>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 271 (?<type>10F):(?<id>[^:]*):(?<heading>[^:]*)(?::[^:]*){2}:(?<x>[^:]*):(?<y>[^:]*):(?<z>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
271|2024-03-02T13:20:50.9620000-08:00|4000F3B7|-2.3563|00|00|116.2635|116.2635|0.0000|e3fa606a5d0b5d57
271|2024-03-02T13:20:50.9620000-08:00|4000F3B5|-1.5709|00|00|107.0000|100.0000|0.0000|5630c8f4e2ffac77
271|2024-03-02T13:20:50.9620000-08:00|4000F3BB|0.2617|00|00|97.4118|90.3407|0.0000|01d53a3800c6238f

Parsed Log Line Examples:
[13:20:50.962] 271 10F:4000F3B7:-2.3563:00:00:116.2635:116.2635:0.0000
[13:20:50.962] 271 10F:4000F3B5:-1.5709:00:00:107.0000:100.0000:0.0000
[13:20:50.962] 271 10F:4000F3BB:0.2617:00:00:97.4118:90.3407:0.0000
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=ActorSetPos&lang=en-US) -->

<a name="line272"></a>

### Line 272 (0x110): SpawnNpcExtra

This line contains certain data from `NpcSpawn` packets not otherwise made available
through other log lines.

The `tetherId` field is the same as the `id` field used in
[NetworkTether](#line-35-0x23-networktether) lines and corresponds to an id in the
[Channeling table](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/Channeling.csv).

The `animationState` field reflects the initial animation state of the actor
at the time it is spawned, and corresponds to the
[BNpcState table](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/BNpcState.csv).

Note: If the actor spawns with a `tetherId` or `animationState` value, there will not be
a corresponding [NetworkTether](#line-35-0x23-networktether)
or [ActorControlExtra](#line-273-0x111-actorcontrolextra) line to indidicate this information.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=SpawnNpcExtra&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
272|[timestamp]|[id]|[parentId]|[tetherId]|[animationState]

Parsed Log Line Structure:
[timestamp] 272 110:[id]:[parentId]:[tetherId]:[animationState]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>272)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<parentId>[^|]*)\|(?<tetherId>[^|]*)\|(?<animationState>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 272 (?<type>110):(?<id>[^:]*):(?<parentId>[^:]*):(?<tetherId>[^:]*):(?<animationState>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
272|2024-03-02T15:45:44.2260000-05:00|4000226B|E0000000|0000|01|89d2d9b95839548f
272|2024-03-02T15:45:44.2260000-05:00|4000226D|E0000000|0000|01|b5e6a59cc0b2c1f3
272|2024-03-03T01:44:39.5570000-08:00|400838F4|E0000000|0000|00|32d8c0e768aeb0e7

Parsed Log Line Examples:
[15:45:44.226] 272 110:4000226B:E0000000:0000:01
[15:45:44.226] 272 110:4000226D:E0000000:0000:01
[01:44:39.557] 272 110:400838F4:E0000000:0000:00
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=SpawnNpcExtra&lang=en-US) -->

<a name="line273"></a>

### Line 273 (0x111): ActorControlExtra

This line contains certain data from `ActorControl` packets not otherwise made available
through other log lines.

`ActorControlExtra` lines include a numerical `category` field,
which corresponds to the type of actor control being sent from the server.

`param1` through `param4` are attributes whose meaning vary
depending on the actor control category.

The list of categories for which log lines are emitted is necessarily restrictive,
given the volume of data, although more may be added in the future:

| Category Name                   | `category`    |
| ------------------------------- | ------------- |
| SetAnimationState               | 0x003E (62)   |
| DisplayPublicContentTextMessage | 0x0834 (2100) |

- `SetAnimationState` - used to set the animation state of an actor.
  - `param1`, like the `animationState` field in
    [SpawnNpcExtra](#line-272-0x110-spawnnpcextra), corresponds to the
    [BNpcState table](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/BNpcState.csv).
  - `param2` appears to change how an animation of that actor is rendered in-game.
    More information is needed.
- `DisplayPublicContentTextMessage` - Displays a message in the chat log
  - `param1` seems to always be `0x0`
  - `param2` corresponds to an entry in the
    [PublicContentTextData table](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/PublicContentTextData.csv)
  - `param3` and `param4` are optional fields referenced in some messages

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=ActorControlExtra&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
273|[timestamp]|[id]|[category]|[param1]|[param2]|[param3]|[param4]

Parsed Log Line Structure:
[timestamp] 273 111:[id]:[category]:[param1]:[param2]:[param3]:[param4]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>273)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<category>[^|]*)\|(?<param1>[^|]*)\|(?<param2>[^|]*)\|(?<param3>[^|]*)\|(?<param4>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 273 (?<type>111):(?<id>[^:]*):(?<category>[^:]*):(?<param1>[^:]*):(?<param2>[^:]*):(?<param3>[^:]*):(?<param4>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
273|2023-12-05T10:57:43.4770000-08:00|4000A145|003E|1|0|0|0|06e7eff4a949812c
273|2023-12-05T10:58:00.3460000-08:00|4000A144|003E|1|1|0|0|a4af9f90928636a3
273|2024-03-18T20:33:22.7130000-04:00|400058CA|0834|0|848|FA0|0|c862c35712ed4122

Parsed Log Line Examples:
[10:57:43.477] 273 111:4000A145:003E:1:0:0:0
[10:58:00.346] 273 111:4000A144:003E:1:1:0:0
[20:33:22.713] 273 111:400058CA:0834:0:848:FA0:0
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=ActorControlExtra&lang=en-US) -->

<a name="line274"></a>

### Line 274 (0x112): ActorControlSelfExtra

This line contains certain data from `ActorControlSelf` packets not otherwise made available
through other log lines.

`ActorControlSelfExtra` lines include a numerical `category` field,
which corresponds to the type of actor control being sent from the server.

`param1` through `param6` are attributes whose meaning vary
depending on the actor control category.

The list of categories for which log lines are emitted is necessarily restrictive,
given the volume of data, although more may be added in the future:

| Category Name           | `category`   |
| ----------------------- | ------------ |
| DisplayLogMessage       | 0x020F (527) |
| DisplayLogMessageParams | 0x0210 (528) |

- `DisplayLogMessage` - used to display a log message in the chat window.
  - `param1`, like the `id` field in
    [SystemLogMessage](#line-41-0x29-systemlogmessage), corresponds to the
    [LogMessage table](https://github.com/xivapi/ffxiv-datamining/blob/master/csv/LogMessage.csv).
  - Remaining parameters are directly read by the LogMessage entry.
- `DisplayLogMessageParams` - used to display a log message in the chat window.
  - Very similar to `DisplayLogMessage`, except that `param2` appears to always be an actor ID.

<!-- AUTO-GENERATED-CONTENT:START (logLines:type=ActorControlSelfExtra&lang=en-US) -->

#### Structure

```log
Network Log Line Structure:
274|[timestamp]|[id]|[category]|[param1]|[param2]|[param3]|[param4]|[param5]|[param6]

Parsed Log Line Structure:
[timestamp] 274 112:[id]:[category]:[param1]:[param2]:[param3]:[param4]:[param5]:[param6]
```

#### Regexes

```log
Network Log Line Regex:
^(?<type>274)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<category>[^|]*)\|(?<param1>[^|]*)\|(?<param2>[^|]*)\|(?<param3>[^|]*)\|(?<param4>[^|]*)\|(?<param5>[^|]*)\|(?<param6>[^|]*)\|

Parsed Log Line Regex:
(?<timestamp>^.{14}) 274 (?<type>112):(?<id>[^:]*):(?<category>[^:]*):(?<param1>[^:]*):(?<param2>[^:]*):(?<param3>[^:]*):(?<param4>[^:]*):(?<param5>[^:]*):(?<param6>[^:]*)(?:$|:)
```

#### Examples

```log
Network Log Line Examples:
274|2024-01-10T19:28:37.5000000-05:00|10001234|020F|04D0|0|93E0|0|0|0|d274429622d0c27e
274|2024-02-15T19:35:41.9950000-05:00|10001234|020F|236D|0|669|0|0|0|d274429622d0c27e
274|2024-03-21T20:45:41.3680000-04:00|10001234|0210|129D|10001234|F|0|0|0|d274429622d0c27e

Parsed Log Line Examples:
[19:28:37.500] 274 112:10001234:020F:04D0:0:93E0:0:0:0
[19:35:41.995] 274 112:10001234:020F:236D:0:669:0:0:0
[20:45:41.368] 274 112:10001234:0210:129D:10001234:F:0:0:0
```

<!-- AUTO-GENERATED-CONTENT:END (logLines:type=ActorControlSelfExtra&lang=en-US) -->
