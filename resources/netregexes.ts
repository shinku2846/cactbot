import { NetFields, NetFieldsReverse } from '../types/net_fields';
import { NetParams } from '../types/net_props';
import { CactbotBaseRegExp } from '../types/net_trigger';

import {
  LogDefinitionName,
  logDefinitionsVersions,
  LogDefinitionVersions,
  ParseHelperFields,
  RepeatingFieldsDefinitions,
  RepeatingFieldsTypes,
} from './netlog_defs';
import { UnreachableCode } from './not_reached';
import Regexes from './regexes';

const separator = '\\|';
const matchDefault = '[^|]*';

// If NetRegexes.setFlagTranslationsNeeded is set to true, then any
// regex created that requires a translation will begin with this string
// and match the magicStringRegex.  This is maybe a bit goofy, but is
// a pretty straightforward way to mark regexes for translations.
// If issue #1306 is ever resolved, we can remove this.
const magicTranslationString = `^^`;
const magicStringRegex = /^\^\^/;

// can't simply export this, see https://github.com/OverlayPlugin/cactbot/pull/4957#discussion_r1002590589
const keysThatRequireTranslationAsConst = [
  'ability',
  'name',
  'source',
  'target',
  'line',
] as const;
export const keysThatRequireTranslation: readonly string[] = keysThatRequireTranslationAsConst;
export type KeysThatRequireTranslation = typeof keysThatRequireTranslationAsConst[number];

export const gameLogCodes = {
  echo: '0038',
  dialog: '0044',
  message: '0839',
} as const;

// See docs/LogGuide.md for more info about these categories
export const actorControlType = {
  setAnimState: '003E',
  publicContentText: '0834',
  logMsg: '020F',
  logMsgParams: '0210',
} as const;

const defaultParams = <
  T extends LogDefinitionName,
  V extends LogDefinitionVersions,
>(type: T, version: V, include?: string[]): Partial<ParseHelperFields<T>> => {
  const logType = logDefinitionsVersions[version][type];
  if (include === undefined) {
    include = Object.keys(logType.fields);
    if ('repeatingFields' in logType) {
      include.push(logType.repeatingFields.label);
    }
  }

  const params: {
    [index: number]: {
      field: string;
      value?: string;
      optional: boolean;
      repeating?: boolean;
      repeatingKeys?: string[];
      sortKeys?: boolean;
      primaryKey?: string;
      possibleKeys?: string[];
    };
  } = {};
  const firstOptionalField = logType.firstOptionalField;

  for (const [prop, index] of Object.entries(logType.fields)) {
    if (!include.includes(prop))
      continue;
    const param: { field: string; value?: string; optional: boolean; repeating?: boolean } = {
      field: prop,
      optional: firstOptionalField !== undefined && index >= firstOptionalField,
    };
    if (prop === 'type')
      param.value = logType.type;

    params[index] = param;
  }

  if ('repeatingFields' in logType && include.includes(logType.repeatingFields.label)) {
    params[logType.repeatingFields.startingIndex] = {
      field: logType.repeatingFields.label,
      optional: firstOptionalField !== undefined &&
        logType.repeatingFields.startingIndex >= firstOptionalField,
      repeating: true,
      repeatingKeys: [...logType.repeatingFields.names],
      sortKeys: logType.repeatingFields.sortKeys,
      primaryKey: logType.repeatingFields.primaryKey,
      possibleKeys: [...logType.repeatingFields.possibleKeys],
    };
  }

  return params as Partial<ParseHelperFields<T>>;
};

type RepeatingFieldsMap<
  TBase extends LogDefinitionName,
  TKey extends RepeatingFieldsTypes = TBase extends RepeatingFieldsTypes ? TBase : never,
> = {
  [name in RepeatingFieldsDefinitions[TKey]['repeatingFields']['names'][number]]:
    | string
    | string[];
}[];

type RepeatingFieldsMapTypeCheck<
  TBase extends LogDefinitionName,
  F extends keyof NetFields[TBase],
  TKey extends RepeatingFieldsTypes = TBase extends RepeatingFieldsTypes ? TBase : never,
> = F extends RepeatingFieldsDefinitions[TKey]['repeatingFields']['label']
  ? RepeatingFieldsMap<TKey> :
  never;

type RepeatingFieldsMapType<
  T extends LogDefinitionName,
  F extends keyof NetFields[T],
> = T extends RepeatingFieldsTypes ? RepeatingFieldsMapTypeCheck<T, F>
  : never;

type ParseHelperType<T extends LogDefinitionName> =
  & {
    [field in keyof NetFields[T]]?: string | readonly string[] | RepeatingFieldsMapType<T, field>;
  }
  & { capture?: boolean };

const isRepeatingField = <
  T extends LogDefinitionName,
>(
  repeating: boolean | undefined,
  value: string | readonly string[] | RepeatingFieldsMap<T> | undefined,
): value is RepeatingFieldsMap<T> => {
  if (repeating !== true)
    return false;
  // Allow excluding the field to match for extraction
  if (value === undefined)
    return true;
  if (!Array.isArray(value))
    return false;
  for (const e of value) {
    if (typeof e !== 'object')
      return false;
  }
  return true;
};

const parseHelper = <T extends LogDefinitionName>(
  params: ParseHelperType<T> | undefined,
  funcName: string,
  fields: Partial<ParseHelperFields<T>>,
): CactbotBaseRegExp<T> => {
  params = params ?? {};
  const validFields: string[] = [];

  for (const index in fields) {
    const field = fields[index];
    if (field)
      validFields.push(field.field);
  }

  Regexes.validateParams(params, funcName, ['capture', ...validFields]);

  // Find the last key we care about, so we can shorten the regex if needed.
  const capture = Regexes.trueIfUndefined(params.capture);
  const fieldKeys = Object.keys(fields).sort((a, b) => parseInt(a) - parseInt(b));
  let maxKeyStr: string;
  if (capture) {
    const keys: Extract<keyof NetFieldsReverse[T], string>[] = [];
    for (const key in fields)
      keys.push(key);
    let tmpKey = keys.pop();
    if (tmpKey === undefined) {
      maxKeyStr = fieldKeys[fieldKeys.length - 1] ?? '0';
    } else {
      while (
        fields[tmpKey]?.optional &&
        !((fields[tmpKey]?.field ?? '') in params)
      )
        tmpKey = keys.pop();
      maxKeyStr = tmpKey ?? '0';
    }
  } else {
    maxKeyStr = '0';
    for (const key in fields) {
      const value = fields[key] ?? {};
      if (typeof value !== 'object')
        continue;
      const fieldName = fields[key]?.field;
      if (fieldName !== undefined && fieldName in params)
        maxKeyStr = key;
    }
  }
  const maxKey = parseInt(maxKeyStr);

  // For testing, it's useful to know if this is a regex that requires
  // translation.  We test this by seeing if there are any specified
  // fields, and if so, inserting a magic string that we can detect.
  // This lets us differentiate between "regex that should be translated"
  // e.g. a regex with `target` specified, and "regex that shouldn't"
  // e.g. a gains effect with just effectId specified.
  const transParams = Object.keys(params).filter((k) => keysThatRequireTranslation.includes(k));
  const needsTranslations = NetRegexes.flagTranslationsNeeded && transParams.length > 0;

  // Build the regex from the fields.
  let str = needsTranslations ? magicTranslationString : '^';
  let lastKey = -1;
  for (const keyStr in fields) {
    const key = parseInt(keyStr);
    // Fill in blanks.
    const missingFields = key - lastKey - 1;
    if (missingFields === 1)
      str += '\\y{NetField}';
    else if (missingFields > 1)
      str += `\\y{NetField}{${missingFields}}`;
    lastKey = key;

    const value = fields[keyStr];
    if (typeof value !== 'object')
      throw new Error(`${funcName}: invalid value: ${JSON.stringify(value)}`);

    const fieldName = value.field;
    const defaultFieldValue = value.value?.toString() ?? matchDefault;
    const fieldValue = params[fieldName];

    if (isRepeatingField(fields[keyStr]?.repeating, fieldValue)) {
      let repeatingArray: RepeatingFieldsMap<T> | undefined = fieldValue;

      const sortKeys = fields[keyStr]?.sortKeys;
      const primaryKey = fields[keyStr]?.primaryKey;
      const possibleKeys = fields[keyStr]?.possibleKeys;

      // primaryKey is required if this is a repeating field per typedef in netlog_defs.ts
      // Same with possibleKeys
      if (primaryKey === undefined || possibleKeys === undefined)
        throw new UnreachableCode();

      // Allow sorting if needed
      if (sortKeys) {
        // Also sort our valid keys list
        possibleKeys.sort((left, right) => left.toLowerCase().localeCompare(right.toLowerCase()));
        if (repeatingArray !== undefined) {
          repeatingArray = [...repeatingArray].sort(
            (left: Record<string, unknown>, right: Record<string, unknown>): number => {
              // We check the validity of left/right because they're user-supplied
              if (typeof left !== 'object' || left[primaryKey] === undefined) {
                console.warn('Invalid argument passed to trigger:', left);
                return 0;
              }
              const leftValue = left[primaryKey];
              if (typeof leftValue !== 'string' || !possibleKeys?.includes(leftValue)) {
                console.warn('Invalid argument passed to trigger:', left);
                return 0;
              }
              if (typeof right !== 'object' || right[primaryKey] === undefined) {
                console.warn('Invalid argument passed to trigger:', right);
                return 0;
              }
              const rightValue = right[primaryKey];
              if (typeof rightValue !== 'string' || !possibleKeys?.includes(rightValue)) {
                console.warn('Invalid argument passed to trigger:', right);
                return 0;
              }
              return leftValue.toLowerCase().localeCompare(rightValue.toLowerCase());
            },
          );
        }
      }

      const anonReps: { [name: string]: string | string[] }[] | undefined = repeatingArray;
      // Loop over our possible keys
      // Build a regex that can match any possible key with required values substituted in
      possibleKeys.forEach((possibleKey) => {
        const rep = anonReps?.find((rep) => primaryKey in rep && rep[primaryKey] === possibleKey);

        let fieldRegex = '';
        // Rather than looping over the keys defined on the object,
        // loop over the base type def's keys. This enforces the correct order.
        fields[keyStr]?.repeatingKeys?.forEach((key) => {
          let val = rep?.[key];
          if (rep === undefined || !(key in rep)) {
            // If we don't have a value for this key
            // insert a placeholder, unless it's the primary key
            if (key === primaryKey)
              val = possibleKey;
            else
              val = matchDefault;
          }
          if (typeof val !== 'string') {
            if (!Array.isArray(val))
              val = matchDefault;
            else if (val.length < 1)
              val = matchDefault;
            else if (val.some((v) => typeof v !== 'string'))
              val = matchDefault;
          }
          fieldRegex += Regexes.maybeCapture(
            key === primaryKey ? false : capture,
            // All capturing groups are `fieldName` + `possibleKey`, e.g. `pairIsCasting1`
            fieldName + possibleKey,
            val,
            defaultFieldValue,
          ) +
            separator;
        });

        if (fieldRegex.length > 0) {
          str += `(?:${fieldRegex})${rep !== undefined ? '' : '?'}`;
        }
      });
    } else if (fields[keyStr]?.repeating) {
      // If this is a repeating field but the actual value is empty or otherwise invalid,
      // don't process further. We can't use `continue` in the above block because that
      // would skip the early-out break at the end of the loop.
    } else {
      if (fieldName !== undefined) {
        str += Regexes.maybeCapture(
          // more accurate type instead of `as` cast
          // maybe this function needs a refactoring
          capture,
          fieldName,
          fieldValue,
          defaultFieldValue,
        ) +
          separator;
      } else {
        str += defaultFieldValue + separator;
      }
    }

    // Stop if we're not capturing and don't care about future fields.
    if (key >= maxKey)
      break;
  }
  return Regexes.parse(str) as CactbotBaseRegExp<T>;
};

export const buildRegex = <T extends keyof NetParams>(
  type: T,
  params?: ParseHelperType<T>,
): CactbotBaseRegExp<T> => {
  return parseHelper(params, type, defaultParams(type, NetRegexes.logVersion));
};

export default class NetRegexes {
  static logVersion: LogDefinitionVersions = 'latest';

  static flagTranslationsNeeded = false;
  static setFlagTranslationsNeeded(value: boolean): void {
    NetRegexes.flagTranslationsNeeded = value;
  }
  static doesNetRegexNeedTranslation(regex: RegExp | string): boolean {
    // Need to `setFlagTranslationsNeeded` before calling this function.
    console.assert(NetRegexes.flagTranslationsNeeded);
    const str = typeof regex === 'string' ? regex : regex.source;
    return !!magicStringRegex.exec(str);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-20-0x14-networkstartscasting
   */
  static startsUsing(params?: NetParams['StartsUsing']): CactbotBaseRegExp<'StartsUsing'> {
    return buildRegex('StartsUsing', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-21-0x15-networkability
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-22-0x16-networkaoeability
   */
  static ability(params?: NetParams['Ability']): CactbotBaseRegExp<'Ability'> {
    return parseHelper(params, 'Ability', {
      ...defaultParams('Ability', NetRegexes.logVersion),
      // Override type
      0: { field: 'type', value: '2[12]', optional: false },
    });
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-21-0x15-networkability
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-22-0x16-networkaoeability
   *
   * @deprecated Use `ability` instead
   */
  static abilityFull(params?: NetParams['Ability']): CactbotBaseRegExp<'Ability'> {
    return this.ability(params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-27-0x1b-networktargeticon-head-marker
   */
  static headMarker(params?: NetParams['HeadMarker']): CactbotBaseRegExp<'HeadMarker'> {
    return buildRegex('HeadMarker', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-03-0x03-addcombatant
   */
  static addedCombatant(params?: NetParams['AddedCombatant']): CactbotBaseRegExp<'AddedCombatant'> {
    return parseHelper(
      params,
      'AddedCombatant',
      defaultParams('AddedCombatant', NetRegexes.logVersion),
    );
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-03-0x03-addcombatant
   * @deprecated Use `addedCombatant` instead
   */
  static addedCombatantFull(
    params?: NetParams['AddedCombatant'],
  ): CactbotBaseRegExp<'AddedCombatant'> {
    return NetRegexes.addedCombatant(params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-04-0x04-removecombatant
   */
  static removingCombatant(
    params?: NetParams['RemovedCombatant'],
  ): CactbotBaseRegExp<'RemovedCombatant'> {
    return buildRegex('RemovedCombatant', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-26-0x1a-networkbuff
   */
  static gainsEffect(params?: NetParams['GainsEffect']): CactbotBaseRegExp<'GainsEffect'> {
    return buildRegex('GainsEffect', params);
  }

  /**
   * Prefer gainsEffect over this function unless you really need extra data.
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-38-0x26-networkstatuseffects
   */
  static statusEffectExplicit(
    params?: NetParams['StatusEffect'],
  ): CactbotBaseRegExp<'StatusEffect'> {
    return buildRegex('StatusEffect', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-30-0x1e-networkbuffremove
   */
  static losesEffect(params?: NetParams['LosesEffect']): CactbotBaseRegExp<'LosesEffect'> {
    return buildRegex('LosesEffect', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-35-0x23-networktether
   */
  static tether(params?: NetParams['Tether']): CactbotBaseRegExp<'Tether'> {
    return buildRegex('Tether', params);
  }

  /**
   * 'target' was defeated by 'source'
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-25-0x19-networkdeath
   */
  static wasDefeated(params?: NetParams['WasDefeated']): CactbotBaseRegExp<'WasDefeated'> {
    return buildRegex('WasDefeated', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-24-0x18-networkdot
   */
  static networkDoT(params?: NetParams['NetworkDoT']): CactbotBaseRegExp<'NetworkDoT'> {
    return buildRegex('NetworkDoT', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static echo(params?: Omit<NetParams['GameLog'], 'code'>): CactbotBaseRegExp<'GameLog'> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(
      params,
      'Echo',
      ['type', 'timestamp', 'code', 'name', 'line', 'capture'],
    );

    return NetRegexes.gameLog({ ...params, code: gameLogCodes.echo });
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static dialog(params?: Omit<NetParams['GameLog'], 'code'>): CactbotBaseRegExp<'GameLog'> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(
      params,
      'Dialog',
      ['type', 'timestamp', 'code', 'name', 'line', 'capture'],
    );

    return NetRegexes.gameLog({ ...params, code: gameLogCodes.dialog });
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static message(params?: Omit<NetParams['GameLog'], 'code'>): CactbotBaseRegExp<'GameLog'> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(
      params,
      'Message',
      ['type', 'timestamp', 'code', 'name', 'line', 'capture'],
    );

    return NetRegexes.gameLog({ ...params, code: gameLogCodes.message });
  }

  /**
   * fields: code, name, line, capture
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static gameLog(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    return buildRegex('GameLog', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static gameNameLog(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    // Backwards compatability.
    return NetRegexes.gameLog(params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-12-0x0c-playerstats
   */
  static statChange(params?: NetParams['PlayerStats']): CactbotBaseRegExp<'PlayerStats'> {
    return buildRegex('PlayerStats', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-01-0x01-changezone
   */
  static changeZone(params?: NetParams['ChangeZone']): CactbotBaseRegExp<'ChangeZone'> {
    return buildRegex('ChangeZone', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-33-0x21-network6d-actor-control
   */
  static network6d(params?: NetParams['ActorControl']): CactbotBaseRegExp<'ActorControl'> {
    return buildRegex('ActorControl', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-34-0x22-networknametoggle
   */
  static nameToggle(params?: NetParams['NameToggle']): CactbotBaseRegExp<'NameToggle'> {
    return buildRegex('NameToggle', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-40-0x28-map
   */
  static map(params?: NetParams['Map']): CactbotBaseRegExp<'Map'> {
    return buildRegex('Map', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-41-0x29-systemlogmessage
   */
  static systemLogMessage(
    params?: NetParams['SystemLogMessage'],
  ): CactbotBaseRegExp<'SystemLogMessage'> {
    return buildRegex('SystemLogMessage', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-257-0x101-mapeffect
   */
  static mapEffect(params?: NetParams['MapEffect']): CactbotBaseRegExp<'MapEffect'> {
    return buildRegex('MapEffect', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-258-0x102-fatedirector
   */
  static fateDirector(params?: NetParams['FateDirector']): CactbotBaseRegExp<'FateDirector'> {
    return buildRegex('FateDirector', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-259-0x103-cedirector
   */
  static ceDirector(params?: NetParams['CEDirector']): CactbotBaseRegExp<'CEDirector'> {
    return buildRegex('CEDirector', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-260-0x104-incombat
   */
  static inCombat(params?: NetParams['InCombat']): CactbotBaseRegExp<'InCombat'> {
    return buildRegex('InCombat', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-261-0x105-combatantmemory
   */
  static combatantMemory(
    params?: NetParams['CombatantMemory'],
  ): CactbotBaseRegExp<'CombatantMemory'> {
    return buildRegex('CombatantMemory', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-262-0x106-rsvdata
   */
  static rsvData(
    params?: NetParams['RSVData'],
  ): CactbotBaseRegExp<'RSVData'> {
    return buildRegex('RSVData', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-263-0x107-startsusingextra
   */
  static startsUsingExtra(
    params?: NetParams['StartsUsingExtra'],
  ): CactbotBaseRegExp<'StartsUsingExtra'> {
    return buildRegex('StartsUsingExtra', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-264-0x108-abilityextra
   */
  static abilityExtra(
    params?: NetParams['AbilityExtra'],
  ): CactbotBaseRegExp<'AbilityExtra'> {
    return buildRegex('AbilityExtra', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-265-0x109-contentfindersettings
   */
  static contentFinderSettings(
    params?: NetParams['ContentFinderSettings'],
  ): CactbotBaseRegExp<'ContentFinderSettings'> {
    return buildRegex('ContentFinderSettings', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-266-0x10a-npcyell
   */
  static npcYell(
    params?: NetParams['NpcYell'],
  ): CactbotBaseRegExp<'NpcYell'> {
    return buildRegex('NpcYell', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-267-0x10b-battletalk2
   */
  static battleTalk2(
    params?: NetParams['BattleTalk2'],
  ): CactbotBaseRegExp<'BattleTalk2'> {
    return buildRegex('BattleTalk2', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-268-0x10c-countdown
   */
  static countdown(
    params?: NetParams['Countdown'],
  ): CactbotBaseRegExp<'Countdown'> {
    return buildRegex('Countdown', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-269-0x10d-countdowncancel
   */
  static countdownCancel(
    params?: NetParams['CountdownCancel'],
  ): CactbotBaseRegExp<'CountdownCancel'> {
    return buildRegex('CountdownCancel', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-270-0x10e-actormove
   */
  static actorMove(
    params?: NetParams['ActorMove'],
  ): CactbotBaseRegExp<'ActorMove'> {
    return buildRegex('ActorMove', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-271-0x10f-actorsetpos
   */
  static actorSetPos(
    params?: NetParams['ActorSetPos'],
  ): CactbotBaseRegExp<'ActorSetPos'> {
    return buildRegex('ActorSetPos', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-272-0x110-spawnnpcextra
   */
  static spawnNpcExtra(
    params?: NetParams['SpawnNpcExtra'],
  ): CactbotBaseRegExp<'SpawnNpcExtra'> {
    return buildRegex('SpawnNpcExtra', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-273-0x111-actorcontrolextra
   */
  static actorControlExtra(
    params?: NetParams['ActorControlExtra'],
  ): CactbotBaseRegExp<'ActorControlExtra'> {
    return buildRegex('ActorControlExtra', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-274-0x112-actorcontrolselfextra
   */
  static actorControlSelfExtra(
    params?: NetParams['ActorControlSelfExtra'],
  ): CactbotBaseRegExp<'ActorControlSelfExtra'> {
    return buildRegex('ActorControlSelfExtra', params);
  }
}

export const commonNetRegex = {
  // TODO(6.2): remove 40000010 after everybody is on 6.2.
  // TODO: or maybe keep around for playing old log files??
  wipe: NetRegexes.network6d({ command: ['40000010', '4000000F'] }),
  cactbotWipeEcho: NetRegexes.echo({ line: 'cactbot wipe.*?' }),
  userWipeEcho: NetRegexes.echo({ line: 'end' }),
} as const;

export const buildNetRegexForTrigger = <T extends keyof NetParams>(
  type: T,
  params?: NetParams[T],
): CactbotBaseRegExp<T> => {
  if (type === 'Ability')
    // ts can't narrow T to `Ability` here, need casting.
    return NetRegexes.ability(params) as CactbotBaseRegExp<T>;

  return buildRegex<T>(type, params);
};
