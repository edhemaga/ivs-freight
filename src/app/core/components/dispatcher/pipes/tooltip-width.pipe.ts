import { Pipe, PipeTransform } from '@angular/core';

const SLIDER_RATION = 4.39;
@Pipe({
  name: 'tooltipWidth',
  pure: false,
})
export class TooltipWidthPipe implements PipeTransform {
  transform(item: { start: number; end: number }): {
    width: number;
    left: number;
    time: string;
  } {
    const fullWidth = item.end / SLIDER_RATION;
    const startPos = item.start / SLIDER_RATION;
    const minutes = item.end - item.start;
    const m = minutes % 60;
    const h = (minutes - m) / 60;
    const time = `${h.toString()}:${m < 10 ? '0' : ''}${m}`;
    return { width: fullWidth - startPos, left: startPos, time: time };
  }
}
