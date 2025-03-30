import { Pipe, PipeTransform } from '@angular/core';

// models
import { EnumValue, LoadRequirementsResponse } from 'appcoretruckassist';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers';

// enums
import { eUnit } from 'ca-components';
import { eLoadDetailsGeneral } from '@pages/new-load/enums';

@Pipe({
    name: 'loadRequirementsFormat',
    standalone: true,
})
export class LoadRequirementsFormatPipe implements PipeTransform {
    private loadRequirementsTitles: Record<string, string> = {
        commodity: eLoadDetailsGeneral.COMMODITY,
        weight: eLoadDetailsGeneral.WEIGHT,
        truckType: eLoadDetailsGeneral.TRUCK_REQ,
        trailerType: eLoadDetailsGeneral.TRAILER_REQ,
        trailerLength: eLoadDetailsGeneral.LENGTH,
        doorType: eLoadDetailsGeneral.DOOR_TYPE,
        suspension: eLoadDetailsGeneral.SUSPENSION,
        year: eLoadDetailsGeneral.YEAR,
        liftgate: eLoadDetailsGeneral.LIFTGATE,
        driverMessage: eLoadDetailsGeneral.DRIVER_MESSAGE,
    };

    transform(
        loadRequirements: LoadRequirementsResponse,
        loadCommodity: EnumValue,
        weight: number | null
    ): { title: string; value: string | number | boolean }[] {
        if (!loadRequirements) return null;

        const weightValue = weight
            ? MethodsCalculationsHelper.convertNumberInThousandSep(weight) +
              eLoadDetailsGeneral.EMPTY_SPACE_STRING +
              'lbs' //eUnit.POUNDS
            : null;

        const liftGateValue = loadRequirements?.liftgate
            ? eLoadDetailsGeneral.YES
            : eLoadDetailsGeneral.NO;

        const yearValue = loadRequirements?.year
            ? loadRequirements?.year + eLoadDetailsGeneral.PLUS_SIGN
            : null;

        const requirementsData = {
            commodity: loadCommodity?.name,
            weight: weightValue,
            truckType: loadRequirements?.truckType?.name,
            trailerType: loadRequirements?.trailerType?.name,
            trailerLength: loadRequirements?.trailerLength?.name,
            doorType: loadRequirements?.doorType?.name,
            suspension: loadRequirements?.suspension?.name,
            year: yearValue,
            liftgate: liftGateValue,
            // driverAssist
        };

        const formattedLoadRequirements = Object.entries(requirementsData)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => ({
                title: this.loadRequirementsTitles[key] || key,
                value,
            }));

        return formattedLoadRequirements;
    }
}
