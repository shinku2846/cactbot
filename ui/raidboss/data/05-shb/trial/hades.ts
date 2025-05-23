import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  neoHades?: boolean;
  seenLifeInCaptivity?: boolean;
  ancient?: { [name: string]: string };
}

const triggerSet: TriggerSet<Data> = {
  id: 'TheDyingGasp',
  zoneId: ZoneId.TheDyingGasp,
  timelineFile: 'hades.txt',
  triggers: [
    {
      id: 'Hades Phase Tracker',
      type: 'StartsUsing',
      netRegex: { id: '4180', source: 'Hades', capture: false },
      run: (data) => data.neoHades = true,
    },
    {
      id: 'Hades Ravenous Assault',
      type: 'StartsUsing',
      netRegex: { id: '4158', source: 'Hades' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.tankBusterOnYou!();

        if (data.role === 'healer')
          return output.busterOn!({ player: data.party.member(matches.target) });
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me)
          return;
        return output.awayFromPlayer!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        awayFromPlayer: {
          en: 'Away From ${player}',
          de: 'Weg von ${player}',
          fr: 'Éloignez-vous de ${player}',
          ja: '${player} から離れる',
          cn: '远离 ${player}',
          ko: '${player} 한테서 피하세요',
        },
        tankBusterOnYou: Outputs.tankBusterOnYou,
        busterOn: Outputs.tankBusterOnPlayer,
      },
    },
    {
      id: 'Hades Bad Faith Left',
      type: 'StartsUsing',
      netRegex: { id: '4149', source: 'Hades', capture: false },
      response: Responses.goLeft('info'),
    },
    {
      id: 'Hades Bad Faith Right',
      type: 'StartsUsing',
      netRegex: { id: '414A', source: 'Hades', capture: false },
      response: Responses.goRight('info'),
    },
    {
      id: 'Hades Broken Faith',
      type: 'StartsUsing',
      netRegex: { id: '414D', source: 'Hades', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dodge Giant Circles',
          de: 'Weiche dem großen Kreis aus',
          fr: 'Esquivez les cercles géants',
          ja: '降ったサークルを避ける',
          cn: '躲避大圈',
          ko: '대형장판피하기',
        },
      },
    },
    {
      id: 'Hades Echo Right',
      type: 'StartsUsing',
      netRegex: { id: '4164', source: 'Hades', capture: false },
      response: Responses.goRight('info'),
    },
    {
      id: 'Hades Echo Left',
      type: 'StartsUsing',
      netRegex: { id: '4163', source: 'Hades', capture: false },
      response: Responses.goLeft('info'),
    },
    {
      id: 'Hades Titanomachy',
      type: 'StartsUsing',
      netRegex: { id: '4180', source: 'Hades', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Hades Shadow Stream',
      type: 'StartsUsing',
      netRegex: { id: '415C', source: 'Hades', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'Hades Purgation',
      type: 'StartsUsing',
      netRegex: { id: '4170', source: 'Hades', capture: false },
      response: Responses.goMiddle(),
    },
    {
      id: 'Hades Doom',
      type: 'GainsEffect',
      netRegex: { effectId: 'D2' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cleanse Doom In Circle',
          de: 'Entferne Verhängnis mit den Kreisen',
          fr: 'Purifiez-vous du Glas dans le cercle',
          ja: '光った輪を踏む、死の宣告を消す',
          cn: '踩光圈',
          ko: '모든 장판을 밟으세요',
        },
      },
    },
    {
      id: 'Hades Wail of the Lost Right',
      type: 'StartsUsing',
      netRegex: { id: '4166', source: 'Hades', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Right Knockback',
          de: 'Rechter Knockback',
          fr: 'Poussée à droite',
          ja: '東／右からノックバック',
          cn: '右侧击退',
          ko: '오른쪽 넉백',
        },
      },
    },
    {
      id: 'Hades Wail of the Lost Left',
      type: 'StartsUsing',
      netRegex: { id: '4165', source: 'Hades', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Left Knockback',
          de: 'Linker Knockback',
          fr: 'Poussée à gauche',
          ja: '西／左からノックバック',
          cn: '左侧击退',
          ko: '왼쪽 넉백',
        },
      },
    },
    {
      id: 'Hades Dual Strike Healer',
      type: 'StartsUsing',
      netRegex: { id: '4161', source: 'Hades', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.tankBusters,
      },
    },
    {
      id: 'Hades Dual Strike',
      type: 'HeadMarker',
      netRegex: { id: '0060' },
      condition: (data, matches) => data.neoHades && data.me === matches.target,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tank Buster Spread',
          de: 'Tank Buster verteilen',
          fr: 'Tank buster, dispersez-vous',
          ja: 'タンクバスター、散開',
          cn: '坦克死刑分散',
          ko: '탱버 산개',
        },
      },
    },
    {
      id: 'Hades Hellborn Yawp',
      type: 'HeadMarker',
      netRegex: { id: '0028' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Marker Outside',
          de: 'Marker außen ablegen',
          fr: 'Déposez la marque à l\'extérieur',
          ja: '外周に安置',
          cn: '外侧放点名',
          ko: '외곽으로',
        },
      },
    },
    {
      id: 'Hades Fetters',
      type: 'HeadMarker',
      netRegex: { id: '0078' },
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Fetters on YOU',
          de: 'Fessel auf DIR',
          fr: 'Entraves sur VOUS',
          ja: '自分に拘束',
          cn: '锁链点名',
          ko: '선 대상자',
        },
      },
    },
    {
      id: 'Hades Life In Captivity',
      type: 'Ability',
      netRegex: { id: '4175', source: 'Hades', capture: false },
      run: (data) => data.seenLifeInCaptivity = true,
    },
    {
      id: 'Hades Gaol',
      type: 'Ability',
      netRegex: { id: '417F', source: 'Hades', capture: false },
      condition: (data) => {
        // There can be multiple gaols (if the phase loops), but ability also
        // gets used during the finall phase transition.  Ignore that one.
        return !data.seenLifeInCaptivity;
      },
      delaySeconds: 2,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Jail',
          de: 'Gefängniss zerstören',
          fr: 'Détruisez la prison',
          ja: 'ジェイルに攻撃',
          cn: '攻击牢狱',
          ko: '감옥',
        },
      },
    },
    {
      id: 'Hades Nether Blast / Dark Eruption',
      type: 'HeadMarker',
      netRegex: { id: '008B' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread('alert'),
    },
    {
      id: 'Hades Ancient Darkness',
      type: 'HeadMarker',
      netRegex: { id: '0060' },
      condition: (data, matches) => !data.neoHades && data.me === matches.target,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread (Don\'t Stack!)',
          de: 'Verteilen (Ohne stacken)',
          fr: 'Dispersez-vous (Pas de package !)',
          ja: '散開（重ならないように）',
          cn: '分散（别去分摊！）',
          ko: '산개（모이지마세요!）',
        },
      },
    },
    {
      id: 'Hades Ancient Water III',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      condition: Conditions.targetIsYou(),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Hades Ancient Collect',
      type: 'HeadMarker',
      netRegex: { id: ['0060', '003E'] },
      condition: (data) => !data.neoHades,
      run: (data, matches) => {
        data.ancient ??= {};
        data.ancient[matches.target] = matches.id;
      },
    },
    {
      id: 'Hades Ancient No Marker',
      type: 'HeadMarker',
      netRegex: { id: '003E', capture: false },
      delaySeconds: 0.5,
      infoText: (data, _matches, output) => {
        if (!data.ancient || data.ancient[data.me] === undefined)
          return;
        const name = Object.keys(data.ancient).find((key) => data.ancient?.[key] === '003E');
        return output.text!({ player: data.party.member(name) });
      },
      outputStrings: {
        text: Outputs.stackOnPlayer,
      },
    },
    {
      id: 'Hades Ancient Cleanup',
      type: 'HeadMarker',
      netRegex: { id: '003E', capture: false },
      delaySeconds: 10,
      run: (data) => delete data.ancient,
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Hades': 'Hades',
        'Shadow .f .he Ancients': 'Schatten der Alten',
      },
      'replaceText': {
        'Adds': 'Adds',
        'Gaol Add': 'Gefängniss Add',
        'Ancient Aero': 'Wind der Alten',
        'Ancient Dark IV': 'Neka der Alten',
        'Ancient Darkness': 'Dunkelung der Alten',
        'Ancient Water III': 'Aquaga der Alten',
        'Bad Faith': 'Maske des Grolls',
        'Black Cauldron': 'Schwarzer Kessel',
        'Broken Faith': 'Maske der Trauer',
        '(?<! )Captivity': 'Gefangenschaft',
        'Chorus Of The Lost': 'Chor der Verlorenen',
        'Dark Eruption': 'Dunkle Eruption',
        'Doom': 'Verhängnis',
        'Double': 'Doppel',
        'Dual Strike': 'Doppelschlag',
        'Echo Of The Lost': 'Echo der Verlorenen',
        'Hellborn Yawp': 'Höllenschrei',
        'Life In Captivity': 'Leben in Gefangenschaft',
        'Nether Blast': 'Schattenausbruch',
        'Polydegmon\'s Purgation': 'Schlag des Polydegmon',
        'Ravenous Assault': 'Fegefeuer der Helden',
        'Shadow Spread': 'Dunkle Schatten',
        'Shadow Stream': 'Schattenstrom',
        'Stream/Purgation?': 'Schattenstrom/Schlag des Polydegmon',
        'The Dark Devours': 'Fressende Finsternis',
        'Titanomachy': 'Titanomachie',
        '--fetters--': '--fesseln--',
        'Wail Of The Lost': 'Wehklagen der Verlorenen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hades': 'Hadès',
        'Shadow .f .he Ancients': 'Spectre d\'Ascien',
      },
      'replaceText': {
        '--fetters--': '--entraves--',
        'Adds': 'Adds',
        'Ancient Aero': 'Vent ancien',
        'Ancient Dark IV': 'Giga Ténèbres anciennes',
        'Ancient Darkness': 'Ténèbres anciennes',
        'Ancient Water III': 'Méga Eau ancienne',
        'Bad Faith': 'Mauvaise foi',
        'Black Cauldron': 'Chaudron noir',
        'Broken Faith': 'Foi brisée',
        '(?<! )Captivity': 'Captivité',
        'Chorus Of The Lost': 'Refrain des disparus',
        'Dark Eruption': 'Éruption ténébreuse',
        'Doom': 'Glas',
        'Double': 'Double',
        'Dual Strike': 'Frappe redoublée',
        'Echo Of The Lost': 'Écho des disparus',
        'Gaol Add': 'Add Geôle',
        'Hellborn Yawp': 'Braillement infernal',
        'Life In Captivity': 'Vie de captivité',
        'Nether Blast': 'Détonation infernale',
        'Polydegmon\'s Purgation': 'Assaut du Polydegmon',
        'Ravenous Assault': 'Assaut acharné',
        'Shadow Spread': 'Diffusion d\'ombre',
        'Shadow Stream': 'Flux de Ténèbres',
        'Stream/Purgation\\?': 'Flux/Assaut ?',
        'The Dark Devours': 'Ténèbres rongeuses',
        'Titanomachy': 'Titanomachie',
        'Wail Of The Lost': 'Lamentation des disparus',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Hades': 'ハーデス',
        'Shadow .f .he Ancients': '古代人の影',
      },
      'replaceText': {
        'Adds': '雑魚',
        'Gaol Add': 'エーテリアル・ジェイル',
        'Ancient Aero': 'エンシェントエアロ',
        'Ancient Dark IV': 'エンシェントダージャ',
        'Ancient Darkness': 'エンシェントダーク',
        'Ancient Water III': 'エンシェントウォタガ',
        'Bad Faith': 'バッドフェイス',
        'Black Cauldron': 'ブラック・コルドロン',
        'Broken Faith': 'ブロークンフェイス',
        '(?<! )Captivity': 'キャプティビティ',
        'Chorus Of The Lost': 'コーラス・オブ・ザ・ロスト',
        'Dark Eruption': 'ダークエラプション',
        'Doom': '死の宣告',
        'Double': 'ダブル',
        'Dual Strike': 'デュアルストライク',
        'Echo Of The Lost': 'エコー・オブ・ザ・ロスト',
        'Hellborn Yawp': 'ヘルボーンヨープ',
        'Life In Captivity': 'ライフ・オブ・キャプティビティ',
        'Nether Blast': 'ネザーブラスト',
        'Polydegmon\'s Purgation': 'ポリデグモンストライク',
        'Ravenous Assault': 'ラヴェナスアサルト',
        'Shadow Spread': 'シャドウスプレッド',
        'Shadow Stream': 'シャドウストリーム',
        'Stream/Purgation?': 'シャドウストリーム／ポリデグモンストライク？',
        'The Dark Devours': '闇の侵食',
        'Titanomachy': 'ティタノマキア',
        '--fetters--': '--拘束--',
        'Wail Of The Lost': 'ウエイル・オブ・ザ・ロスト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Hades': '哈迪斯',
        'Shadow .f .he Ancients': '古代人之影',
      },
      'replaceText': {
        'Adds': '小怪',
        'Gaol Add': '监狱',
        'Ancient Aero': '古代疾风',
        'Ancient Dark IV': '古代冥暗',
        'Ancient Darkness': '古代黑暗',
        'Ancient Water III': '古代狂水',
        'Bad Faith': '失信',
        'Black Cauldron': '暗黑之釜',
        'Broken Faith': '背信',
        '(?<! )Captivity': '囚禁',
        'Chorus Of The Lost': '逝者的合唱',
        'Dark Eruption': '暗炎喷发',
        'Doom': '死亡宣告',
        'Double': '双重',
        'Dual Strike': '双重强袭',
        'Echo Of The Lost': '逝者的回声',
        'Hellborn Yawp': '地狱之声',
        'Life In Captivity': '囚禁生命',
        'Nether Blast': '幽冥冲击',
        'Polydegmon\'s Purgation': '冥王净化',
        'Ravenous Assault': '贪婪突袭',
        'Shadow Spread': '暗影扩散',
        'Shadow Stream': '暗影流',
        'Stream/Purgation?': '暗影流/冥王净化',
        'The Dark Devours': '黑暗侵蚀',
        'Titanomachy': '诸神之战',
        '--fetters--': '--锁链--',
        'Wail Of The Lost': '逝者的哀嚎',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Hades': '하데스',
        'Shadow .f .he Ancients': '고대인의 그림자',
      },
      'replaceText': {
        'Adds': '쫄',
        'Gaol Add': '감옥',
        'Ancient Aero': '에인션트 에어로',
        'Ancient Dark IV': '에인션트 다쟈',
        'Ancient Darkness': '에인션트 다크',
        'Ancient Water III': '에인션트 워터가',
        'Bad Faith': '불신',
        'Black Cauldron': '검은 도가니',
        'Broken Faith': '배신',
        '(?<! )Captivity': '감금',
        'Chorus Of The Lost': '상실의 합창',
        'Dark Eruption': '황천의 불기둥',
        'Doom': '죽음의 선고',
        'Double': '이중 공격',
        'Dual Strike': '이중 타격',
        'Echo Of The Lost': '상실의 메아리',
        'Hellborn Yawp': '지옥의 아우성',
        'Life In Captivity': '감금된 삶',
        'Nether Blast': '지옥 강풍',
        'Polydegmon\'s Purgation': '폴리데그몬',
        'Ravenous Assault': '탐욕스러운 공격',
        'Shadow Spread': '그림자 전개',
        'Shadow Stream': '그림자 급류',
        'Stream/Purgation?': '그림자 급류/전개',
        'The Dark Devours': '어둠의 침식',
        'Titanomachy': '티타노마키아',
        '--fetters--': '--줄--',
        'Wail Of The Lost': '상실의 통곡',
      },
    },
  ],
};

export default triggerSet;
