/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import joi from '@hapi/joi';
joi.objectId = require('joi-objectid')(joi);

export const AuthSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
});

export const UserIdSchema = joi.object({
  id: joi.objectId().required()
});
