import moment from 'moment';

//Enums
import { RepairTableStringEnum } from '@pages/repair/pages/repair-table/enums/repair-table-string.enum';

export class RepairTableDateFormaterHelper {
    static getDateRange(
        period: string,
        year?: number
    ): { fromDate: string; toDate: string } {
        let today: moment.Moment;
        if (year) {
            today = moment().year(year).startOf(RepairTableStringEnum.DAY);
        } else {
            today = moment().startOf(RepairTableStringEnum.DAY);
        }

        let fromDate: moment.Moment, toDate: moment.Moment;

        switch (period.toLowerCase()) {
            case RepairTableStringEnum.TODAY:
                fromDate = moment(today);
                toDate = moment(today);
                break;
            case RepairTableStringEnum.YESTERDAY:
                fromDate = moment(today).subtract(
                    1,
                    RepairTableStringEnum.DAYS
                );
                toDate = moment(today).subtract(1, RepairTableStringEnum.DAYS);
                break;
            case RepairTableStringEnum.THIS_WEEK:
                fromDate = moment(today).startOf(RepairTableStringEnum.WEEK);
                toDate = moment(today).endOf(RepairTableStringEnum.WEEK);
                break;
            case RepairTableStringEnum.LAST_WEEK:
                fromDate = moment(today)
                    .subtract(1, RepairTableStringEnum.WEEKS)
                    .startOf(RepairTableStringEnum.WEEK);
                toDate = moment(today)
                    .subtract(1, RepairTableStringEnum.WEEKS)
                    .endOf(RepairTableStringEnum.WEEK);
                break;
            case RepairTableStringEnum.ONE_WEEK:
                fromDate = moment(today).subtract(
                    1,
                    RepairTableStringEnum.WEEKS
                );
                toDate = moment(today);
                break;
            case RepairTableStringEnum.THIS_MONTH:
                fromDate = moment(today).startOf(RepairTableStringEnum.MONTH);
                toDate = moment(today).endOf(RepairTableStringEnum.MONTH);
                break;
            case RepairTableStringEnum.LAST_MONTH:
                fromDate = moment(today)
                    .subtract(1, RepairTableStringEnum.MONTHS)
                    .startOf(RepairTableStringEnum.MONTH);
                toDate = moment(today)
                    .subtract(1, RepairTableStringEnum.MONTHS)
                    .endOf(RepairTableStringEnum.MONTH);
                break;
            case RepairTableStringEnum.ONE_MONTH:
                fromDate = moment(today).subtract(
                    1,
                    RepairTableStringEnum.MONTHS
                );
                toDate = moment(today);
                break;
            case RepairTableStringEnum.THREE_MONTHS:
                fromDate = moment(today).subtract(
                    3,
                    RepairTableStringEnum.MONTHS
                );
                toDate = moment(today);
                break;
            case RepairTableStringEnum.THIS_QUARTER:
                fromDate = moment(today).startOf(RepairTableStringEnum.QUARTER);
                toDate = moment(today).endOf(RepairTableStringEnum.QUARTER);
                break;
            case RepairTableStringEnum.LAST_QUARTER:
                fromDate = moment(today)
                    .subtract(1, RepairTableStringEnum.QUARTERS)
                    .startOf(RepairTableStringEnum.QUARTER);
                toDate = moment(today)
                    .subtract(1, RepairTableStringEnum.QUARTERS)
                    .endOf(RepairTableStringEnum.QUARTER);
                break;
            case RepairTableStringEnum.THIS_YEAR:
                fromDate = moment(today).startOf(RepairTableStringEnum.YEAR);
                toDate = moment(today).endOf(RepairTableStringEnum.YEAR);
                break;
            case RepairTableStringEnum.ONE_YEAR:
                fromDate = moment(today).subtract(
                    1,
                    RepairTableStringEnum.YEARS
                );
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
