import {
    Component,
    HostListener,
    ViewChild,
    ElementRef,
    Input,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'app-pick-company',
    templateUrl: './pick-company.component.html',
    styleUrls: ['./pick-company.component.scss'],
})
export class PickCompanyComponent implements OnInit {
    @Input() userData: any;
    ngOnInit() {}
}
