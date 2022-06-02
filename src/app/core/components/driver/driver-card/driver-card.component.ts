import { DomSanitizer } from '@angular/platform-browser';
import { DriverTService } from './../state/driver.service';
import { DriverDetailsCardComponent } from './../driver-details-card/driver-details-card.component';
import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs';
import { createBase64 } from 'src/app/core/utils/base64.image';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.scss'],
})
export class DriverCardComponent implements OnInit {
  @Input() viewData : any;
  public selectedData:any;

  constructor(
    private driverService:DriverTService,
    private sanitazer:DomSanitizer
  ) { }

  ngOnInit(): void {
    console.log(this.viewData);
    console.log('Data from card');
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
    this.driverService.getDriverById(e).subscribe(
      x=>this.selectedData=x,
      err => console.error(err),
      
    );
    //this.driverBox[indx].checked = e.target.checked;
  }

}
