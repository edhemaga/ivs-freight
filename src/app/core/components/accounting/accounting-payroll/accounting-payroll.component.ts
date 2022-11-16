import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-accounting-payroll',
    templateUrl: './accounting-payroll.component.html',
    styleUrls: ['./accounting-payroll.component.scss'],
})
export class AccountingPayrollComponent implements OnInit {
    public loadingItems = false;
    public selectedTab = 'payroll';
    tableData: any[] = [
        {
            title: 'Payroll',
            field: 'payroll',
            data: [],
            extended: false,
            hideLength: false,
            gridColumns: [],
            extendedGridColumns: [],
        },
        {
            title: 'Fuel',
            field: 'fuel',
            data: [],
            extended: false,
            hideLength: false,
            gridColumns: [],
            extendedGridColumns: [],
        },
        {
            title: 'Ledger',
            field: 'ledger',
            data: [],
            extended: false,
            hideLength: false,
            gridColumns: [],
            extendedGridColumns: [],
        },
        {
            title: 'IFTA',
            field: 'ifta',
            data: [],
            extended: false,
            hideLength: false,
            gridColumns: [],
            extendedGridColumns: [],
        },
        {
            title: 'Tax',
            field: 'tax',
            data: [],
            extended: false,
            hideLength: false,
            gridColumns: [],
            extendedGridColumns: [],
        },
    ];

    constructor(private router: Router) {}

    public switchTab(e) {
        this.selectedTab = e;
        if (e == 'payroll' || e == 'fuel') {
            this.router.navigate(['/accounting/' + e]);
        } else {
            this.router.navigate(['/accounting/notfound']);
        }
    }

    public changeScreen(e) {
        console.log('ddd', e);
    }

    ngOnInit(): void {
        /*  if (this.router.url.includes('/fuel')) {
       this.selectedTab = 'fuel';
     } */
        /* this.shared.emitAccountingChange.subscribe(res => {
      this.selectedTab = res;
    }); */
    }
}
