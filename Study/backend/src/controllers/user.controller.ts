import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getJsonSchemaRef, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import _ from 'lodash';
import {UserServiceBindings, PasswordHasherBindings, TokenServiceBindings} from '../keys';
import {Agency, User} from '../models';
import {Credentials, UserRepository, AgencyRepository} from '../repositories';
import {basicAuthorization} from '../services/authorization';
import {BcryptHasher} from '../services/hash.password';
import {JWTService} from '../services/jwt-service';
import {MyUserService} from '../services/user-service';
import {validateCredentials, validateCredentialsAgency} from '../services/validator-service';

export class UserController {
  constructor(
    @repository(UserRepository)
    public UserRepository: UserRepository,

    @repository(AgencyRepository)
    public agencyRepository : AgencyRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

    @inject(UserServiceBindings.USER_SERVICE)
    public customerService: MyUserService,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,

  ) {}

  @post('/admins/users/createAdmin', {
    responses: {
      '200': {
        description: 'create, authorize admin',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async createAdmin(@requestBody() admin: User) {
    validateCredentials(_.pick(admin, ['email', 'password']), this.UserRepository);
    admin.roles = ['admin']

    admin.password = await this.hasher.hashPassword(admin.password);
    const savedAdmin = await this.UserRepository.create(admin);
    return savedAdmin;
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  @post('/admins/users/createAgency', {
    responses: {
      '200': {
        description: 'Admin create Agency',
        content: {
          schema: getJsonSchemaRef(Agency)
        }
      }
    }
  })
  async createAgency(@requestBody() agencyData: Agency) {
    await validateCredentialsAgency(_.pick(agencyData, ['email', 'password']), this.agencyRepository);
    agencyData.password = await this.hasher.hashPassword(agencyData.password)
    const savedAgency = await this.agencyRepository.create(agencyData);
    savedAgency.password = "******"
    return savedAgency;
  }
}
