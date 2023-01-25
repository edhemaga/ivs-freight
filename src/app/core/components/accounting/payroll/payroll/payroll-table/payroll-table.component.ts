import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-payroll-table',
  templateUrl: './payroll-table.component.html',
  styleUrls: ['./payroll-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PayrollTableComponent implements OnInit {
  @Output() expandTable = new EventEmitter();
  @Input() tableSettings: any[];
  @Input() tableSettingsResizable: any[];
  @Input() tableData: any[];
  @Input() title: string;
  @Input() isResizableTable: boolean = false;
  @Input() tableAddClas: string = "";

  @Input() expandedTable: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  openReport(data){
    //const id = this.getReportBasedOnTitle(this.title, data);
    this.expandTable.emit({title: this.title, id: data.id});
  }


  getReportBasedOnTitle(title: string, data){
    switch(title){
      case "Owner": 
      return data.id;
    }
  }
  

}
