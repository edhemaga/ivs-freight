import {DOCUMENT} from '@angular/common';
import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AuthService} from "../../../services/auth/auth.service";
//import {SelectCompany} from '../../model/select-company';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.scss'],
})
export class SelectCompanyComponent implements OnInit, AfterViewInit, OnDestroy {
  //apiData: SelectCompany[];
  customOptions: any;
  selectedCompanyID: any;
  apiData: any;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument,
    private router: Router,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.apiData = JSON.parse(localStorage.getItem('multiple_companies'));
    this.customOptions = {
      loop: false,
      autoplay: false,
      center: true,
      dots: false,
      startPosition: 2,
      responsive: {
        0: {
          items: this.apiData.length < 5 ? this.apiData.length : 5,
        },
      },
    };
    setInterval(() => {
      const center: any = this.document.querySelectorAll('.center');
      this.selectedCompanyID = center[0]?.firstChild?.id;
    }, 400);
  }

  ngAfterViewInit() {
    const center: any = this.document.querySelectorAll('.center');
    this.selectedCompanyID = center[0]?.firstChild?.id;
  }

  onCompanySelect() {
    const selected = this.apiData.find((x: any) => x.companyId.toString() === this.selectedCompanyID);
    this.auth
      .onCompanySelect(selected.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
