export interface Todo {
  parentId: number;
  name: string;
  category: string;
  assigneeId: number;
  url: string;
  note: string;
  priority: number;
  status: number;
}

export interface TodoNew {
  id?: number;
  parentId?: number;
  companyId: number;
  userId?: number;
  assigneeId?: number;
  name: string;
  category: string;
  guid: string;
  url: string;
  startDate: Date;
  deadLine: string;
  note: string;
  priority?: number;
  status: number;
  doc: any;
}
