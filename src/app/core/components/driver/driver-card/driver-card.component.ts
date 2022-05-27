import { DriverTService } from './../state/driver.service';
import { DriverDetailsCardComponent } from './../driver-details-card/driver-details-card.component';
import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs';

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
