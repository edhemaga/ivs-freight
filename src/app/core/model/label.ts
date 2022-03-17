export class Label {
  labelName: string;
  colorCode: string;
  usedXTimes: string;
  id: number;
}

export class NewLabel {
  // id?: number;
  domain?: string;
  key?: string;
  value?: string;
  count?: number;
  labelId: number;
  labelName: string;
  labelColor: string;
  labelCount: number;
}
