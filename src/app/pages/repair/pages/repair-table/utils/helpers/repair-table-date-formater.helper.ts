import moment from 'moment';
import { RepairTableEnum } from '../../enums/repair-table-enum';

enum Period {
    Today,
    Yesterday,
    ThisWeek,
    LastWeek,
    OneWeek,
    ThisMonth,
    LastMonth,
    OneMonth,
    ThreeMonths,
    ThisQuarter,
    LastQuarter,
    ThisYear,
    OneYear,
    Custom,
}
export class RepairTableDateFormaterHelper {
    static getDateRange(
        period: string,
        year?: number
    ): { fromDate: string; toDate: string } {
        let today: moment.Moment;
        if (year) {
            today = moment().year(year).startOf(RepairTableEnum.DAY);
        } else {
            today = moment().startOf(RepairTableEnum.DAY);
        }

        let fromDate: moment.Moment, toDate: moment.Moment;

        switch (period.toLowerCase()) {
            case RepairTableEnum.TODAY:
                fromDate = moment(today);
                toDate = moment(today);
                break;
            case RepairTableEnum.YESTERDAY:
                fromDate = moment(today).subtract(1, RepairTableEnum.DAYS);
                toDate = moment(today).subtract(1, RepairTableEnum.DAYS);
                break;
            case RepairTableEnum.THIS_WEEK:
                fromDate = moment(today).startOf(RepairTableEnum.WEEK);
                toDate = moment(today).endOf(RepairTableEnum.WEEK);
                break;
            case RepairTableEnum.LAST_WEEK:
                fromDate = moment(today)
                    .subtract(1, RepairTableEnum.WEEKS)
                    .startOf(RepairTableEnum.WEEK);
                toDate = moment(today)
                    .subtract(1, RepairTableEnum.WEEKS)
                    .endOf(RepairTableEnum.WEEK);
                break;
            case RepairTableEnum.ONE_WEEK:
                fromDate = moment(today).subtract(1, RepairTableEnum.WEEKS);
                toDate = moment(today);
                break;
            case RepairTableEnum.THIS_MONTH:
                fromDate = moment(today).startOf(RepairTableEnum.MONTH);
                toDate = moment(today).endOf(RepairTableEnum.MONTH);
                break;
            case RepairTableEnum.LAST_MONTH:
                fromDate = moment(today)
                    .subtract(1, RepairTableEnum.MONTHS)
                    .startOf(RepairTableEnum.MONTH);
                toDate = moment(today)
                    .subtract(1, RepairTableEnum.MONTHS)
                    .endOf(RepairTableEnum.MONTH);
                break;
            case RepairTableEnum.ONE_MONTH:
                fromDate = moment(today).subtract(1, RepairTableEnum.MONTHS);
                toDate = moment(today);
                break;
            case RepairTableEnum.THREE_MONTHS:
                fromDate = moment(today).subtract(3, RepairTableEnum.MONTHS);
                toDate = moment(today);
                break;
            case RepairTableEnum.THIS_QUARTER:
                fromDate = moment(today).startOf(RepairTableEnum.QUARTER);
                toDate = moment(today).endOf(RepairTableEnum.QUARTER);
                break;
            case RepairTableEnum.LAST_QUARTER:
                fromDate = moment(today)
                    .subtract(1, RepairTableEnum.QUARTERS)
                    .startOf(RepairTableEnum.QUARTER);
                toDate = moment(today)
                    .subtract(1, RepairTableEnum.QUARTERS)
                    .endOf(RepairTableEnum.QUARTER);
                break;
            case RepairTableEnum.THIS_YEAR:
                fromDate = moment(today).startOf(RepairTableEnum.YEAR);
                toDate = moment(today).endOf(RepairTableEnum.YEAR);
                break;
            case RepairTableEnum.ONE_YEAR:
                fromDate = moment(today).subtract(1, RepairTableEnum.YEARS);
                toDate = moment(today);
                break;
            default:
                break;
        }

        const fromDateFormatted = fromDate.format('MM/DD/YY');
        const toDateFormatted = toDate.format('MM/DD/YY');
        return { fromDate: fromDateFormatted, toDate: toDateFormatted };
    }
}
