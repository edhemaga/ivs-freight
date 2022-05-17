import { TrailerTService } from './../../state/trailer.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-trailer-details-item',
  templateUrl: './trailer-details-item.component.html',
  styleUrls: ['./trailer-details-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TrailerDetailsItemComponent implements OnInit {
  @Input() data: any = null;
  public note:FormControl=new FormControl();
  public trailerData:any;
  public svgColorVar:string;
  public toggleOwner:boolean=false;
  public trailerName:string;
  constructor(
    private activated_route:ActivatedRoute,
    private trailerTService:TrailerTService

  ) { }

  ngOnInit(): void {
    this.getTrailerById()
  }
  public getTrailerById(){
      const trailer_id=this.activated_route.snapshot.paramMap.get("id");
      this.trailerTService.getTruckById(+trailer_id).subscribe((data)=>{
        this.trailerData=data;
        this.note.patchValue(this.trailerData.note);
        this.trailerName=this.trailerData.trailerNumber
        this.svgColorVar=data.color.code
        console.log(this.trailerData);
      })
  }
  public formatDate(date: string) {
    return moment(date).format('MM/DD/YY');
  }
  public formatPhone(phoneNumberString: string) {
    const value = phoneNumberString;
    const number = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    phoneNumberString = number;
    return number;
  }
}
