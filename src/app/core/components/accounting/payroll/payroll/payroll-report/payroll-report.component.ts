import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PayrollStoreService } from '../state/payroll.service';
import { owner_open_loads } from '../state/table-settings/owner_open_load';

@Component({
  selector: 'app-payroll-report',
  templateUrl: './payroll-report.component.html',
  styleUrls: ['./payroll-report.component.scss']
})
export class PayrollReportComponent implements OnInit {

  reportMainData: any = { loads: []};
  tableSettings: any[] = [];

  @Input() set reportTableData(value) {
    if( value.id ){
      this.getDataBasedOnTitle(value);
    }
  }

  constructor(private ps: PayrollStoreService, private dch: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  getDataBasedOnTitle(data: {id: number, title: string}){
    switch(data.title){
      case "Owner": 
        this.tableSettings = owner_open_loads;
        this.ps.getPayrollOwnerOpenReport(data.id).subscribe(res => {
          this.reportMainData = res;
          this.dch.detectChanges();
        })
      break;
    }
  }

}
