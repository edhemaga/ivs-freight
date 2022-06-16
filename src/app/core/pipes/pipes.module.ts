import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { formatDatePipe } from './formatDate.pipe';
import { formatEinPipe } from './formatEin.pipe';
import { formatPhonePipe } from './formatPhone.pipe';
import { formatSsnPipe } from './formatSsn.pipe';
import { DropdownCountPipe } from '../components/shared/ta-input-dropdown/dropdown-count.pipe';
import { InputErrorPipe } from '../components/shared/ta-input/input-error.pipe';
import { InputTypePipe } from '../components/shared/ta-input/input-type.pipe';
import { ReviewsSortPipe } from '../components/shared/ta-user-review/reviews-sort.pipe';
import { CalendarMonthsPipe } from './calendarMonths.pipe';
import { CdkConnectPipe } from './cdkconnect.pipe';
import { CdkIdPipe } from './cdkid.pipe';
import { FormatRestrictionEndorsmentPipe } from './formatRestrictionEndorsment.pipe';
import { HidePasswordPipe } from './hide-password.pipe';
import { HighlightSearchPipe } from './highlight-search.pipe';
import { HosTimePipe } from './hostime';
import { NFormatterPipe } from './n-formatter.pipe';
import { SortPipe } from './sort.pipe';
import { StatusPipePipe } from './status-pipe.pipe';
import { SumArraysPipe } from './sum-arrays.pipe';
import { TaSvgPipe } from './ta-svg.pipe';
import { BlockedContentPipe } from './blockedContent.pipe';
import { DetailsActiveItemPipe } from './detailsActiveItem.pipe';
import { TaThousandSeparatorPipe } from './taThousandSeparator.pipe';
@NgModule({
  declarations: [
    SafeHtmlPipe,
    formatDatePipe,
    formatPhonePipe,
    formatEinPipe,
    formatSsnPipe,
    // Pipes
    InputErrorPipe,
    SortPipe,
    StatusPipePipe,
    HighlightSearchPipe,
    HosTimePipe,
    CdkIdPipe,
    CdkConnectPipe,
    CalendarMonthsPipe,
    NFormatterPipe,
    TaSvgPipe,
    DropdownCountPipe,
    ReviewsSortPipe,
    SumArraysPipe,
    HidePasswordPipe,
    InputTypePipe,
    FormatRestrictionEndorsmentPipe,
    BlockedContentPipe,
    DetailsActiveItemPipe,
    TaThousandSeparatorPipe,
  ],
  imports: [CommonModule],
  exports: [
    SafeHtmlPipe,
    formatDatePipe,
    formatPhonePipe,
    formatEinPipe,
    formatSsnPipe,
    InputErrorPipe,
    SortPipe,
    StatusPipePipe,
    HighlightSearchPipe,
    HosTimePipe,
    CdkIdPipe,
    CdkConnectPipe,
    CalendarMonthsPipe,
    NFormatterPipe,
    TaSvgPipe,
    DropdownCountPipe,
    ReviewsSortPipe,
    SumArraysPipe,
    HidePasswordPipe,
    InputTypePipe,
    FormatRestrictionEndorsmentPipe,
    BlockedContentPipe,
    DetailsActiveItemPipe,
    TaThousandSeparatorPipe,
  ],
  providers: [
    DatePipe,
    SortPipe,
    NFormatterPipe,
    StatusPipePipe,
    CdkConnectPipe,
    CalendarMonthsPipe,
    CdkIdPipe,
    HighlightSearchPipe,
    HosTimePipe,
    SumArraysPipe,
  ],
})
export class PipesModule {}
