export class Contact {
  phone: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  state: string;
  email: string;

  constructor(
    phone: string,
    street: string,
    city: string,
    zip: string,
    country: string,
    state: string,
    email: string
  ) {
    this.phone = phone;
    this.street = street;
    this.city = city;
    this.zip = zip;
    this.country = country;
    this.state = state;
    this.email = email;
  }
}

export class User {
  user: UserObject;
  contact: Contact;
  token: string;
  userToken: string;

  constructor(user: UserObject, contact: Contact) {
    this.user = user;
    this.contact = contact;
  }
}

export class UserObject {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthdate: Date;
  gender: string;
  username: string;
  type: string;

  constructor(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    birthdate: Date,
    gender: string,
    username: string
  ) {
    this.firstName = firstname;
    this.lastName = lastname;
    this.email = email;
    this.password = password;
    this.birthdate = birthdate;
    this.gender = gender;
    this.username = username;
  }
}

export class UserState {
  userId: number;
  columns: any[];
  extendedTableColumns: any[];
  touched?: boolean;
  extendedTableTouched?: boolean;
}
