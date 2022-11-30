import {HttpErrors} from '@loopback/rest';
import * as isEmail from 'isemail';
import {Credentials, UserRepository, AgencyRepository} from '../repositories/index';
export async function validateCredentials(credentials: Credentials, userRepository: UserRepository) {
  if (!isEmail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid Email');
  }
  const foundCustomer = await userRepository.findOne({
    where: {
      email: credentials.email
    }
  });
  if (foundCustomer !== null) {
    throw new HttpErrors.UnprocessableEntity('this email already exists');
  }
  if (credentials.email.length < 8) {
    throw new HttpErrors.UnprocessableEntity('email length should be greater than 8')
  }
  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity("passwordd length should be greater than 8")
  }
  if (foundCustomer) {
    throw new HttpErrors.UnprocessableEntity('this email already exists');
  }
}

export async function validateCredentialsAgency(credentials: Credentials, agencyRepository: AgencyRepository) {
  if (!isEmail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid Email');
  }
  const foundAgency = await agencyRepository.findOne({
    where: {
      email: credentials.email
    }
  });
  if (foundAgency !== null) {
    throw new HttpErrors.UnprocessableEntity('this email already exists');
  }
  if (credentials.email.length < 8) {
    throw new HttpErrors.UnprocessableEntity('email length should be greater than 8')
  }
  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity("passwordd length should be greater than 8")
  }
}

