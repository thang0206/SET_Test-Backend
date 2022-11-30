import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getJsonSchemaRef, post, requestBody} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import * as _ from 'lodash';
import {CustomerServiceBindings, PasswordHasherBindings, TokenServiceBindings} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {basicAuthorization} from '../services/authorization';
import {BcryptHasher} from '../services/hash.password';
import {JWTService} from '../services/jwt-service';
import {MyCustomerService} from '../services/user-service';
import {validateCredentials} from '../services/validator-service';

export class CustomerController {
  constructor(
    @repository(UserRepository)
    public customerRepository: UserRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

    @inject(CustomerServiceBindings.CUSTOMER_SERVICE)
    public customerService: MyCustomerService,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,

  ) {}

  @post('/customer/signup', {
    responses: {
      '200': {
        description: 'Customer sign up',
        content: {
          schema: getJsonSchemaRef(User)
        }
      }
    }
  })
  async signup(@requestBody() customerData: User) {
    await validateCredentials(_.pick(customerData, ['email', 'password']), this.customerRepository);
    customerData.roles = ["customer"]
    customerData.password = await this.hasher.hashPassword(customerData.password)
    const savedCustomer = await this.customerRepository.create(customerData);
    savedCustomer.password = "******"
    return savedCustomer;
  }

  @post('/customer/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<{token: string}> {
    // make sure customer exist,password should be valid
    const customer = await this.customerService.verifyCredentials(credentials);
    const customerProfile = await this.customerService.convertToUserProfile(customer);

    const token = await this.jwtService.generateToken(customerProfile);
    return Promise.resolve({token: token})
  }

  @authenticate("jwt")
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  @get("/customer", {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current customer profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User),
          },
        },
      },
    },
  })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentCustomer: UserProfile,
  ): Promise<UserProfile> {
    return Promise.resolve(currentCustomer);
  }
}
