import { Component, OnInit } from '@angular/core';
import svgList from 'src/assets/svg/image-list.json';

@Component({
    selector: 'app-catalog-svg-definitions',
    templateUrl: './catalog-svg-definitions.component.html',
    styleUrls: ['./catalog-svg-definitions.component.scss'],
})
export class CatalogSvgDefinitionsComponent implements OnInit {
    imageList: any[] = svgList.imageArray;
    constructor() {}

    ngOnInit(): void {}
}