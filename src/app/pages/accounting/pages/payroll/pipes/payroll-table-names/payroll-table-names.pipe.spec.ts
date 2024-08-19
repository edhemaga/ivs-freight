import { PayrollTableNamesPipe } from './PayrollTableNames/payroll-table-names.pipe';

describe('PayrollTableNamesPipe', () => {
  it('create an instance', () => {
    const pipe = new PayrollTableNamesPipe();
    expect(pipe).toBeTruthy();
  });
});
