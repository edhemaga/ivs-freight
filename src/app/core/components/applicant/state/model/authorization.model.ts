export class Authorization {
  id?: number;
  applicantId?: string;
  isFirstAuthorization: boolean;
  isSecondAuthorization: boolean;
  isThirdAuthorization: boolean;
  isFourthAuthorization: boolean;
  signature: string;

  constructor(authorization?: Authorization) {
    this.id = authorization?.id ? authorization.id : undefined;
    this.applicantId = authorization?.applicantId
      ? authorization.applicantId
      : undefined;
    this.isFirstAuthorization = authorization?.isFirstAuthorization
      ? authorization.isFirstAuthorization
      : false;
    this.isSecondAuthorization = authorization?.isSecondAuthorization
      ? authorization.isSecondAuthorization
      : false;
    this.isThirdAuthorization = authorization?.isThirdAuthorization
      ? authorization.isThirdAuthorization
      : false;
    this.isFourthAuthorization = authorization?.isFourthAuthorization
      ? authorization.isFourthAuthorization
      : false;
    this.signature = authorization?.signature ? authorization.signature : '';
  }
}
