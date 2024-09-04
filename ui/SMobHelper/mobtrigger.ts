
export type mobTrigger = {
  mobID: string;
  mapID: string;
  name: LocaleTextOrArray | string | string[];
  randomicity: boolean;
  triggerText: string;
  atPopPos: boolean;
  norma: string[];
  weather?: string;                             //�Ѯ�
  time?: string;                                //�ɶ�
  minion?: string;                              //�ݨD���d��ID
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
