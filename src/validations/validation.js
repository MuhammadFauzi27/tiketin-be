import { ValidationError } from "../exceptions/validationError.js";
import * as auth from './authValidation.js'


const validateSchema = (schema, payload) => {
  const result = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  });

  if(result.error) {
    throw new ValidationError(result.error);
  } else {
    return result.value
  }
}

const validate = {
  auth: {
    login : (payload) => validateSchema(auth.loginSchema, payload),
    register : (payload) => validateSchema(auth.registerSchema, payload)
  },
}

export {
  validate
}