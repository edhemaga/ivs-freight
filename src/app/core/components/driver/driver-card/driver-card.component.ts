import { DriverTService } from './../state/driver.service';
import { DriverDetailsCardComponent } from './../driver-details-card/driver-details-card.component';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.scss'],
})
export class DriverCardComponent implements OnInit {
  @Input() viewData : any;
  public selectedData:any;

  constructor(
    private driverService:DriverTService
  ) { }

  ngOnInit(): void {
    console.log("DRIVER DATA");
    console.log(this.viewData);
  }

  changeChatBox(e:number) {
    console.log(e);
   this.selectedData = this.driverService.getDriverById(e);
   console.log(this.selectedData);
   
    //this.driverBox[indx].checked = e.target.checked;
  }

}
