import { ServerResponse, ServerResponseList } from './response';

export interface BankAccount {
  bank: any;
  bankName: any;
  accountNumber: string;
  routingNumber: string;
  bankImage: string;
}

export interface BankAccountList extends ServerResponseList {
  data: BankAccount[];
}

export interface BankAccountDetail extends ServerResponse {
  data: BankAccount;
}
