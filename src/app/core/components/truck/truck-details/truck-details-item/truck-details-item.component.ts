import { Subject } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/modals/custom-modal.service';
import { FormControl } from '@angular/forms';
import { truck_details_animation } from './../truck-details.animation';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import moment from 'moment';
@Component({
  selector: 'app-truck-details-item',
  templateUrl: './truck-details-item.component.html',
  styleUrls: ['./truck-details-item.component.scss'],
  encapsulation:ViewEncapsulation.None,
  animations:[truck_details_animation('showHideDetails')]
})
export class TruckDetailsItemComponent implements OnInit {
  @ViewChild('autosize',{static:false}) autosize:CdkTextareaAutosize;
  @Input() data:any=null;

  public fhwaNote:FormControl=new FormControl();
  public purchaseNote:FormControl=new FormControl();
   
  private destory$:Subject<void>=new Subject<void>();

   headerTextExm:any[]=[];
   headerTitle:string='';
  constructor( private customModalService:CustomModalService) { }

  ngOnInit(): void {
    this.headerTitle='Truck Details';
    this.headerTextExm=[
      {name:'Registration'},
      {name:'FHWA Inspection'},
      {name:'Title'},
      {name:'Lease / Purchase'}
    ]
  }
  ngOnDestroy():void{
    this.destory$.next();
    this.destory$.complete();
  }

  public onShowDetails(componentData:any){
    componentData.showDetails=!componentData.showDetails
  }
  
  public onModalAction(){
    
  }
  public formatData(date:string){
    return moment(date).format('MM/DD/YY');
  }

  public formatText(data:any, type:boolean, numOfCharacters:string){
    if(!type){
      return data.map((item)=>
         item.endorsementName?.substring(0, numOfCharacters)
      )
    }
    return data.map((item)=> `<span class='first-character'>
    ${item.endorsmentName?.substring(0,numOfCharacters)}</span> ` + item.endorsementName.substring(0, numOfCharacters))
  }
   
  public identity(item:any):number{
    return item.id;
  }

}
