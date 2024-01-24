import { Options } from '@angular-slider/ngx-slider';

export class filterConfig {
    static SLIDER_DATA: Options = {
        floor: 0,
        ceil: 10,
        step: 0,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    static LOACTION_SLIDER_DATA: Options = {
        floor: 25,
        ceil: 500,
        step: 5,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    static PAY_SLIDER_DATA: Options = {
        floor: 0,
        ceil: 20000,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
        noSwitching: true,
        pushRange: true,
        minRange: 2000,
    };

    static MILES_SLIDER_DATA: Options = {
        floor: 0,
        ceil: 5000,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
        noSwitching: true,
        pushRange: true,
        minRange: 10,
    };
}
