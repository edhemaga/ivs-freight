import { WorkExperienceItemMapped } from '@pages/applicant/models/work-experience-mapped.model';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { WorkExperienceItemResponse } from 'appcoretruckassist';

export class ApplicantMapper {
    public static mapWorkExperienceItems(
        workExperienceItems: WorkExperienceItemResponse[]
    ): WorkExperienceItemMapped[] {
        return workExperienceItems.map((item) => ({
            id: item.id,
            reviewId: item.workExperienceItemReview?.id,
            isEditingWorkExperience: false,
            employer: item.employer,
            jobDescription: item.jobDescription,
            fromDate: MethodsCalculationsHelper.convertDateFromBackend(
                item.from
            ).replace(/-/g, '/'),
            toDate: item.to
                ? MethodsCalculationsHelper.convertDateFromBackend(
                      item.to
                  ).replace(/-/g, '/')
                : null,
            employerPhone: item.phone,
            employerEmail: item.email,
            employerFax: item.fax,
            employerAddress: item.address,
            employerAddressUnit: item.address.addressUnit,
            isDrivingPosition: item.isDrivingPosition,
            currentEmployment: item.currentEmployment,
            reasonForLeaving: item.reasonForLeaving?.name,
            accountForPeriod: item.accountForPeriodBetween,
            classesOfEquipment: item.classesOfEquipment[0]?.vehicleType
                ? item.classesOfEquipment.map((_, index) => ({
                      isEditingClassOfEquipment: false,
                      trailerLength:
                          item.classesOfEquipment[index].trailerLength?.name,
                      trailerType:
                          item.classesOfEquipment[index].trailerType?.name,
                      vehicleType:
                          item.classesOfEquipment[index].vehicleType?.name,
                      trailerTypeLogoName:
                          item.classesOfEquipment[index].trailerType?.logoName,
                      vehicleTypeLogoName:
                          item.classesOfEquipment[index].vehicleType?.logoName,
                      cfrPart: item.classesOfEquipment[index].cfrPart,
                      fmcsa: item.classesOfEquipment[index].fmcsa,
                  }))
                : [],
            workExperienceItemReview: item.workExperienceItemReview || null,
        }));
    }
}
