import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsCompanyService } from '../../state/company-state/settings-company.service';

@Component({
  selector: 'app-settings-nodata',
  templateUrl: './settings-nodata.component.html',
  styleUrls: ['./settings-nodata.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsNodataComponent implements OnInit {
  @Input() public showComponent: boolean;
  constructor(
    private settingsCompanyService: SettingsCompanyService,
    private route: ActivatedRoute
  ) {}

  public companyData: any = this.route.snapshot.data.company;

  ngOnInit(): void {
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
  }

  public openModal() {
    this.showComponent = !this.showComponent;
    this.settingsCompanyService.onModalAction({
      modalName: 'basic',
      type: this.companyData?.divisions?.length
        ? 'edit-company'
        : 'edit-division',
      company: this.companyData,
    });
    const body = document.querySelector('body');
    body.style.overflow = 'visible';
  }
}
