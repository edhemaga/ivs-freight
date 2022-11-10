import {Observable} from 'rxjs';

export class TableColumnDefinitionAccount {
  public title: string;
  public field: string;
  public edit?: string;
}

export class TableMainOptions {
  public addItem: boolean;
  public editItem: string;
}

export class TableOptions {
  public name: string;
  public options: any;
  public data: Observable<Array<any>>;
  public columns: Array<TableColumnDefinitionAccount>;
}

export class TableData {
  public description: string;
  public location: string;
  public date: string;
  public amount: string;
}


export class IftaTableOptions {
  public data: Observable<any>;
  public config: any;
}
