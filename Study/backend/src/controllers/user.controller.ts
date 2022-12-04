import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {FilterExcludingWhere, repository} from '@loopback/repository';
import {del, get, getJsonSchemaRef, getModelSchemaRef, param, patch, post, requestBody, response} from '@loopback/rest';
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

  
  @get("admins/users/readAgency")
  @response(200, {
    description: 'Admin read data of agency',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Agency, {exclude: 'where'}) filter?: FilterExcludingWhere<Agency>
  ): Promise<Agency> {
    return this.agencyRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  @patch("admins/users/updateAgency")
  @response(204, {
    description: 'Agency PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    agency: User,
  ): Promise<void> {
    agency.updatedAt = new Date()
    await this.agencyRepository.updateById(id, agency);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  @del("admins/users/deleteAgency")
  @response(204, {
    description: 'Agency DELETE success',
  })
  
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.agencyRepository.deleteById(id);
  }
}
