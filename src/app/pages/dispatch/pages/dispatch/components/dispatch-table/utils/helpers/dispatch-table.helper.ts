import { MethodsCalculationsHelper } from "@shared/utils/helpers/methods-calculations.helper";

export class DispatchTableHelper {
    static calculateDateDifference(inputTimeStr: string): string {
        const inputTime = new Date(MethodsCalculationsHelper.convertDateFromBackendToFullUTC(inputTimeStr));
        const currentTime = new Date();

        const timeDifference = currentTime.getTime() - inputTime.getTime();

        const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hoursPassed = Math.floor( 
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesPassed = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );

        let result = '';

        if (daysPassed > 0) {
            result += daysPassed === 1 ? '1 day ' : `${daysPassed} days `;
        }

        if (hoursPassed > 0) {
            result += `${hoursPassed} h `;
        }

        if (minutesPassed > 0) {
            result += `${minutesPassed} min`;
        }

        return result.trim();
    }
}
