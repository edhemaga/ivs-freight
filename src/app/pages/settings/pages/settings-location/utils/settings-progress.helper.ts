
import moment from 'moment';
export class SettingsProgressHelper {
    static getRentDate(mod: number): string  {
        let day: number;
        const currentDate = new Date();

        if (mod === 1) day = 1;
        else if (mod === 2) day = 5;
        else if (mod === 3) day = 10;
        else if (mod === 4) day = 15;
        else if (mod === 5) day = 20;
        else if (mod === 6) day = 25;
        else
            day = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth()
            ).getUTCDate();

        const currentDay = currentDate.getUTCDate();
        let expDate;

        if (day > currentDay) {
            expDate = new Date();
            expDate.setUTCDate(day);
        } else {
            expDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                currentDate.getDate()
            );
            expDate.setUTCDate(day);
        }

        return moment(expDate).format('MM/DD/YY');
    }
}