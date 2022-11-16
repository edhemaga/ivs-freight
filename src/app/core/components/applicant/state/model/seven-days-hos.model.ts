export class HosData {
   id?: number;
   name: string;
   value?: number;
   isCompleted: boolean;
   constructor(hosData?: HosData) {
      this.id = hosData?.id ? hosData.id : undefined;
      this.name = hosData?.name ? hosData.name : '';
      this.value = hosData?.value ? hosData.value : undefined;
      this.isCompleted = hosData?.isCompleted ? hosData.isCompleted : true;
   }
}

export class SevenDaysHos {
   id?: number;
   applicantId?: string;
   isValidHos: boolean;
   startDate?: string;
   address: string;
   isValidAnotherEmployer: boolean;
   anotherEmployer?: boolean;
   intendToWorkAnotherEmployer?: boolean;
   hosData: HosData[];
   isCompleted: boolean;

   constructor(sevenDaysHos?: SevenDaysHos) {
      this.id = sevenDaysHos?.id ? sevenDaysHos.id : undefined;
      this.applicantId = sevenDaysHos?.applicantId
         ? sevenDaysHos.applicantId
         : undefined;
      this.isValidHos = sevenDaysHos?.isValidHos
         ? sevenDaysHos.isValidHos
         : false;
      this.startDate = this.startDate ?? undefined;
      this.address = sevenDaysHos?.address ? sevenDaysHos.address : '';
      this.isValidAnotherEmployer = sevenDaysHos?.isValidAnotherEmployer
         ? sevenDaysHos.isValidAnotherEmployer
         : false;
      this.anotherEmployer = sevenDaysHos?.anotherEmployer
         ? sevenDaysHos.anotherEmployer
         : false;
      this.intendToWorkAnotherEmployer =
         sevenDaysHos?.intendToWorkAnotherEmployer
            ? sevenDaysHos.intendToWorkAnotherEmployer
            : false;
      this.hosData = sevenDaysHos?.hosData ? sevenDaysHos.hosData : [];
      this.isCompleted = sevenDaysHos?.isCompleted
         ? sevenDaysHos.isCompleted
         : true;
   }
}
