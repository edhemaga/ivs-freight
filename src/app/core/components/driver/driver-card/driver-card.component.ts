import { DomSanitizer } from '@angular/platform-browser';
import { DriverTService } from './../state/driver.service';
import { DriverDetailsCardComponent } from './../driver-details-card/driver-details-card.component';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { map } from 'rxjs';
import { createBase64 } from 'src/app/core/utils/base64.image';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.scss'],
})
export class DriverCardComponent implements OnInit, OnDestroy {
  @Input() viewData : any;
  public selectedData:any;

  constructor(
    private driverService:DriverTService,
    private sanitazer:DomSanitizer
  ) { }

  ngOnInit(): void {
    console.log('Data from card');
    console.log(this.selectedData);
    
    this.transformImage(); 
  }
  public transformImage() {
    let img;
    if (this.viewData.avatar) {
      img= createBase64(this.viewData.avatar) ;
    } else {
      img = 'assets/svg/common/ic_no_avatar_driver.svg';
    }
    return this.sanitazer.bypassSecurityTrustResourceUrl(img);
  }
   changeChatBox(e:number) {
    console.log(e);
     this.driverService.getDriverById(e).pipe(untilDestroyed(this)).subscribe(
      x=>this.selectedData=x,
      err => console.error(err),
      
      );
  console.log(this.selectedData);
  
    //this.driverBox[indx].checked = e.target.checked;
  }
  ngOnDestroy(): void {}
}
