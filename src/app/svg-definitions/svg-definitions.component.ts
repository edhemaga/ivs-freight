import { Component, OnInit } from '@angular/core';
import svgList from 'src/assets/svg/image-list.json';

@Component({
   selector: 'app-svg-definitions',
   templateUrl: './svg-definitions.component.html',
   styleUrls: ['./svg-definitions.component.scss'],
})
export class SvgDefinitionsComponent implements OnInit {
   imageList: any[] = svgList;
   constructor() {}

   ngOnInit(): void {}
}
