
export type mobTrigger = {
  mobID: string;
  mapID: string;
  name: LocaleTextOrArray | string | string[];
  randomicity: boolean;
  triggerText: string;
  atPopPos: boolean;
  norma: string[];
  weather?: string;                             //天氣
  time?: string;                                //時間
  minion?: string;                              //需求的寵物ID
  killMob?: string[];                           
  gatherMaterial?: string[];
  FATEID?: string;
  playerCount?: string;
};

export type HuntMap = {
  [huntName: string]: HuntEntry;
};

const data: HuntMap = {
  //data...
}
