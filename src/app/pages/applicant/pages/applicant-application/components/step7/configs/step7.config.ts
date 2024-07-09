import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { Step7ConfigParams } from '@pages/applicant/pages/applicant-application/components/step7/models/step7-config-params.model';

export class Step7Config {
    static getHosInputConfig(config: Step7ConfigParams): ITaInput {
      return {
        name: 'hos',
        type: 'number',
        hideClear: true,
        textAlign: 'center',
        max: 24,
        hideErrorMessage: true,
        hideRequiredCheck: true,
        isDisabled: config.selectedMode === 'REVIEW_MODE' || config.selectedMode === 'FEEDBACK_MODE',
      };
    }
  
    static getStartDateInputConfig(config: Step7ConfigParams): ITaInput {
      return {
        name: 'datepicker',
        type: 'text',
        label: 'Date',
        isDropdown: true,
        placeholderIcon: 'date',
        isRequired: true,
        customClass: 'datetimeclass',
        isDisabled: config.selectedMode === 'REVIEW_MODE' ||
          (config.selectedMode === 'FEEDBACK_MODE' && config.stepFeedbackValues?.isReleaseDateValid),
        incorrectInput: config.selectedMode === 'REVIEW_MODE',
      };
    }
  
    static getAddressInputConfig(config: Step7ConfigParams): ITaInput {
      return {
        name: 'Address',
        type: 'text',
        label: 'City, State',
        isRequired: true,
        placeholderIcon: 'address',
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-434',
        minLength: 6,
        maxLength: 256,
        isDisabled: config.selectedMode === 'REVIEW_MODE' ||
          (config.selectedMode === 'FEEDBACK_MODE' && config.stepFeedbackValues?.isLocationValid),
        incorrectInput: config.selectedMode === 'REVIEW_MODE',
      };
    }
  
    static getExplainInputConfig(config: Step7ConfigParams): ITaInput {
      return {
        name: 'Explain',
        type: 'text',
        label: 'Please explain',
        isRequired: true,
        textTransform: 'capitalize',
        placeholder: 'Please explain',
        placeholderInsteadOfLabel: true,
        isDisabled: config.selectedMode === 'REVIEW_MODE',
        incorrectInput: config.selectedMode === 'REVIEW_MODE',
      };
    }
  }
