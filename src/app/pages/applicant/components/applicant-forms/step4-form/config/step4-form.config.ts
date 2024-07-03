import { ApplicantConfigParams } from '@pages/applicant/models/applicant-input-config.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class Step4FormConfig {
  static getLocationInputConfig(config: ApplicantConfigParams): ITaInput {
    return {
      name: 'Address',
      type: 'text',
      label: 'Location',
      minLength: 12,
      maxLength: 256,
      isRequired: true,
      placeholderIcon: 'address',
      dropdownWidthClass: 'w-col-445',
      isDisabled: config.selectedMode === 'REVIEW_MODE' ||
        (config.selectedMode === 'FEEDBACK_MODE' && config.stepFeedbackValues?.isLocationValid),
      incorrectInput: config.selectedMode === 'REVIEW_MODE',
    };
  }

  static getDateInputConfig(config: ApplicantConfigParams): ITaInput {
    return {
      name: 'datepicker',
      type: 'text',
      label: 'Date',
      isDropdown: true,
      placeholderIcon: 'date',
      isRequired: true,
      customClass: 'datetimeclass',
      isDisabled: config.selectedMode === 'REVIEW_MODE' ||
        (config.selectedMode === 'FEEDBACK_MODE' && config.stepFeedbackValues?.isDateValid),
      incorrectInput: config.selectedMode === 'REVIEW_MODE',
    };
  }

  static getCollisionInputConfig(config: ApplicantConfigParams): ITaInput {
    return {
      name: 'Collision',
      type: 'number',
      label: 'Collision',
      minLength: 1,
      maxLength: 160,
      textTransform: 'capitalize',
      placeholderText: 'vehicles',
      placeholderIcon: 'collision',
      isRequired: true,
      incorrectInput: config.selectedMode === 'REVIEW_MODE',
    };
  }

  static getFatalityInputConfig(config: ApplicantConfigParams): ITaInput {
    return {
      name: 'Fatality',
      type: 'number',
      label: 'Fatality',
      minLength: 1,
      maxLength: 160,
      textTransform: 'capitalize',
      placeholderText: 'persons',
      placeholderIcon: 'fatality',
      isRequired: true,
      incorrectInput: config.selectedMode === 'REVIEW_MODE',
    };
  }

  static getInjuriesInputConfig(config: ApplicantConfigParams): ITaInput {
    return {
      name: 'Injured',
      type: 'number',
      label: 'Injured',
      minLength: 1,
      maxLength: 160,
      textTransform: 'capitalize',
      isRequired: true,
      placeholderText: 'persons',
      placeholderIcon: 'injury',
      incorrectInput: config.selectedMode === 'REVIEW_MODE',
    };
  }

  static getVehicleTypeInputConfig(config: ApplicantConfigParams): ITaInput {
    return {
      name: 'Input Dropdown',
      type: 'text',
      label: 'Vehicle type',
      isRequired: true,
      isDropdown: true,
      isDisabled: config.selectedMode !== 'APPLICANT_MODE',
      dropdownWidthClass: 'w-col-231',
      dropdownImageInput: {
        withText: true,
        svg: true,
        image: false,
        url: config.selectedVehicleType?.logoName,
        template: 'truck',
        class: config.selectedVehicleType?.name
          ?.trim()
          .replace(' ', '')
          .toLowerCase(),
      },
      customClass: 'truck-trailer-dropdown',
    };
  }

  static getDescriptionInputConfig(config: ApplicantConfigParams): ITaInput {
    return {
      name: 'Description',
      type: 'text',
      label: 'Description',
      minLength: 2,
      maxLength: 160,
      textTransform: 'capitalize',
      isRequired: true,
      isDisabled: config.selectedMode === 'REVIEW_MODE' ||
        (config.selectedMode === 'FEEDBACK_MODE' && config.stepFeedbackValues?.isDescriptionValid),
      incorrectInput: config.selectedMode === 'REVIEW_MODE',
    };
  }
}
