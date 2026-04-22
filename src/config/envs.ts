import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
}).unknown(true);

const {error, value} = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
};

/* Crear un Snippet
1. Instalar la extension Easy Snippet
2. seleccionar el codigo a crear el snippet
3. cntrl + alt + p
4. escribir easy snippet
5. seleccionar ">easy snippet: add Snippet From Selection"
6. ubicar nombre
*/
