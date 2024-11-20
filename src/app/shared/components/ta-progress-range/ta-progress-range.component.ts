import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// enums
import { eProgressRangeUnit } from '@shared/components/ta-progress-range/enums/index';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// svg routes
import { TaProgressRangeSvgRoutes } from '@shared/components/ta-progress-range/utils/svg-routes/index';
import { TaProgressRangeConstants } from 'src/app/shared/components/ta-progress-range/utils/constants/index';

// models
import { IProgressRangeLastPriceRangeItem } from '@shared/components/ta-progress-range/models/index';

@Component({
	selector: 'app-ta-progress-range',
	templateUrl: './ta-progress-range.component.html',
	styleUrls: ['./ta-progress-range.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		AngularSvgIconModule
	]
})
export class TaProgressRangeComponent implements OnInit {
	@Input() startRange: number;
	@Input() endRange: number;
	@Input() value: number;
	@Input() unit: eProgressRangeUnit

	public svgRoutes = TaProgressRangeSvgRoutes;

	public priceRangeItem: IProgressRangeLastPriceRangeItem;

	constructor() {}

	ngOnInit(): void {
		this.calculatePriceRange();
	}

	private calculatePriceRange(): void {
		if (this.startRange && this.endRange && this.value) {
			const range: number = Math.abs(this.endRange - this.startRange);
			const step: number = range / TaProgressRangeConstants.PROGRESS_RANGE_LAST_PRICE_ITEMS?.length;

			TaProgressRangeConstants.PROGRESS_RANGE_LAST_PRICE_ITEMS.forEach((item, index) => {
				const currentStepStartRange: number = 
					index === 0 
					? this.startRange 
					: this.startRange + (step * index);
				const currentStepEndRange: number = 
					index === (TaProgressRangeConstants.PROGRESS_RANGE_LAST_PRICE_ITEMS.length - 1)
					? this.endRange
					: this.startRange + (step * (index + 1));
				
				if (currentStepStartRange <= this.value && currentStepEndRange >= this.value) 
					this.priceRangeItem = item;
			});
		}
	}
}
