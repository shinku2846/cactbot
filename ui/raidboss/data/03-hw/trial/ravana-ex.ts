import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'ThokAstThokExtreme',
  zoneId: ZoneId.ThokAstThokExtreme,
  comments: {
    en: 'Timeline only, no triggers',
    de: 'Nur Timeline, keine Trigger',
    fr: 'Timeline seulement, aucun trigger',
    cn: '只有时间轴，没有触发器',
    ko: '타임라인만, 트리거 없음',
  },
  timelineFile: 'ravana-ex.txt',
  triggers: [],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ravana': 'Ravana',
      },
      'replaceText': {
        '\\(1st Double Prey\\)': '(1. Doppel-Markierung)',
        '\\(2nd Double Prey\\)': '(2. Doppel-Markierung)',
        '\\(Circles\\)': '(Kreise)',
        '\\(Flames\\)': '(Flammen) ',
        'Atma-Linga': 'Atma-Linga',
        'Beetle Avatar': 'Käfer-Inkarnation',
        'Blades of Carnage and Liberation': 'Klingen des Gemetzels und der Befreiung',
        'Blinding Blade': 'Blendende Klinge',
        'Bloody Fuller': 'Blutrille',
        'Chandrahas': 'Chandrahas',
        'Clone Spawn': 'Klon erscheint #',
        'Clone Dash': 'Klon stürmt #',
        'Dragonfly Avatar': 'Libellen-Inkarnation',
        'Final Liberation': 'Endgültige Befreiung',
        'Inner AOE': 'AoE innen',
        'Laughing Rose': 'Lachende Rose',
        '(?<! )Liberation': 'Befreiung',
        'Outer AOE': 'AoE außen',
        'Pillars of Heaven': 'Säulen des Himmels',
        'Prelude to Liberation': 'Auftakt zur Befreiung',
        'Scorpion Avatar': 'Skorpion-Inkarnation',
        'Surpanakha': 'Surpanakha',
        'Swift Liberation': 'Schnelle Befreiung',
        'Tapasya': 'Tapasya',
        'The Rose Of Conquest': 'Rose der Eroberung',
        'The Rose Of Conviction': 'Rose der Überzeugung',
        'The Rose Of Hate': 'Rose des Hasses',
        'The Seeing': 'Sehende',
        'Warlord Flame': 'Kriegsherren-Flamme',
        'Warlord Shell': 'Kriegsherren-Hülle',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ravana': 'Ravana',
      },
      'replaceText': {
        '\\?': ' ?',
        '\\(1st Double Prey\\)': '(1er Double marquage)',
        '\\(2nd Double Prey\\)': '(2ème Double marquage)',
        '\\(Circles\\)': '(Cercles)',
        '\\(Flames\\)': '(Flammes) ',
        '\\(Inner AoE\\)': '(AoE intérieur)',
        '\\(Outer AoE\\)': '(AoE extérieur)',
        'Atma-Linga': 'Atma-Linga',
        'Beetle Avatar': 'Incarnation du scarabée',
        'Blades of Carnage and Liberation': 'Lames ardentes',
        'Blinding Blade': 'Lame aveuglante',
        'Bloody Fuller': 'Entaille sanglante',
        'Chandrahas': 'Chandrahas',
        'Clone Spawn': 'Apparition du clone',
        'Clone Dash': 'Charge du clone',
        'Dragonfly Avatar': 'Incarnation de la libellule',
        'Final Liberation': 'Libération rapide',
        'Laughing Rose': 'Rose rieuse',
        '(?<! )Liberation': 'Libération',
        'Pillars of Heaven': 'Piliers du ciel',
        'Prelude to Liberation': 'Prélude de la libération',
        'Scorpion Avatar': 'Incarnation du scorpion',
        'Surpanakha': 'Surpanakha',
        'Swift Liberation(?! Dash)': 'Libération rapide',
        'Swift Liberation Dash': 'Libération rapide + Charge',
        'Tapasya': 'Tapasya',
        'The Rose Of Conquest': 'Rose de la conquête',
        'The Rose Of Conviction': 'Rose de la conviction',
        'The Rose Of Hate': 'Rose de la célérité',
        'The Seeing': 'Élytre(s)',
        'Warlord Flame': 'Flamme du Maître des lames',
        'Warlord Shell': 'Bouclier du Maître des lames',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ravana': 'ラーヴァナ',
      },
      'replaceText': {
        '\\?': ' ?',
        '\\(1st Double Prey\\)': '(マーキング１)',
        '\\(2nd Double Prey\\)': '(マーキング２)',
        '\\(Circles\\)': '(輪)',
        '\\(Flames\\)': '(炎) ',
        '\\(Inner AoE\\)': '(AoE: 中)',
        '\\(Outer AoE\\)': '(AoE: 外)',
        'Atma-Linga': 'アートマリンガ',
        'Beetle Avatar': '甲殻の化身',
        'Blades of Carnage and Liberation': '焔剣',
        'Blinding Blade': '武神閃',
        'Bloody Fuller': '神通力',
        'Chandrahas': 'チャンドラハース',
        'Clone Spawn': '幻影出現',
        'Clone Dash': '幻影突進',
        'Dragonfly Avatar': '武辺の化身',
        'Final Liberation': '光焔【滅】',
        'Laughing Rose': '月気弾',
        '(?<! )Liberation': '光焔【破】',
        'Pillars of Heaven': '衝天撃',
        'Prelude to Liberation': '光焔【序】',
        'Scorpion Avatar': '光焔の化身',
        'Surpanakha': '徹甲散弾',
        'Swift Liberation(?! Dash)': '光焔【急】',
        'Swift Liberation Dash': '光焔【急】突進',
        'Tapasya': '鬼武神',
        'The Rose Of Conquest': '闘気爆砕',
        'The Rose Of Conviction': '闘気弾',
        'The Rose Of Hate': '闘気砲',
        'The Seeing': '左翼防御/右翼防御/两翼防御',
        'Warlord Flame': '武神焔',
        'Warlord Shell': '武神甲',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ravana': '罗波那',
      },
      'replaceText': {
        '\\?': ' ?',
        '\\(1st Double Prey\\)': '(第1次双红球点名)',
        '\\(2nd Double Prey\\)': '(第2次双红球点名)',
        '\\(Circles\\)': '(圆圈)',
        '\\(Flames\\)': '(十字火) ',
        '\\(Inner AoE\\)': '(中间AOE)',
        '\\(Outer AoE\\)': '(外圈AOE)',
        'Atma-Linga': '武神魂',
        'Beetle Avatar': '甲壳化身',
        'Blades of Carnage and Liberation': '焰剑',
        'Blinding Blade': '武神闪',
        'Bloody Fuller': '神通力',
        'Chandrahas': '明月之笑',
        'Clone Spawn': '分身出现',
        'Clone Dash': '分身冲锋',
        'Dragonfly Avatar': '武毅化身',
        'Final Liberation': '光焰【灭】',
        'Laughing Rose': '月气弹',
        '(?<! )Liberation': '光焰【破】',
        'Pillars of Heaven': '冲天击',
        'Prelude to Liberation': '光焰【序】',
        'Scorpion Avatar': '光焰化身',
        'Surpanakha': '穿甲散弹',
        'Swift Liberation(?! Dash)': '光焰【急】',
        'Swift Liberation Dash': '光焰【急】+冲锋',
        'Tapasya': '鬼武神',
        'The Rose Of Conquest': '斗气爆碎',
        'The Rose Of Conviction': '斗气弹',
        'The Rose Of Hate': '斗气炮',
        'The Seeing': '左翼防御/右翼防御/两翼防御',
        'Warlord Flame': '武神焰',
        'Warlord Shell': '武神甲',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ravana': '라바나',
      },
      'replaceText': {
        '\\(1st Double Prey\\)': '(첫번째 표식)',
        '\\(2nd Double Prey\\)': '(두번째 표식)',
        '\\(Circles\\)': '(원형)',
        '\\(Flames\\)': '(화염) ',
        '\\(Inner AoE\\)': '(내부 장판)',
        '\\(Outer AoE\\)': '(외부 장판)',
        'Atma-Linga': '불멸혼',
        'Beetle Avatar': '갑각의 화신',
        'Blades of Carnage and Liberation': '불꽃검',
        'Blinding Blade': '무신섬',
        'Bloody Fuller': '신통력',
        'Chandrahas': '찬드라하스',
        'Clone Spawn': '분신 소환',
        'Clone Dash': '분신 돌진',
        'Dragonfly Avatar': '무도의 화신',
        'Final Liberation': '광염: 파멸',
        'Laughing Rose': '월기탄',
        '(?<! )Liberation': '광염: 전개',
        'Pillars of Heaven': '충천격',
        'Prelude to Liberation': '광염: 발단',
        'Scorpion Avatar': '광염의 화신',
        'Surpanakha': '관통산탄',
        'Swift Liberation': '광염: 절정',
        'Tapasya': '귀무신',
        'The Rose Of Conquest': '투기탄쇄',
        'The Rose Of Conviction': '투기탄',
        'The Rose Of Hate': '투기포',
        'The Seeing': '좌익/우익/양익 방어',
        'Warlord Flame': '돌연변이',
        'Warlord Shell': '무신갑',
      },
    },
  ],
};

export default triggerSet;
