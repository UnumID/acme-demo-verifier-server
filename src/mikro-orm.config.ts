
import { Options, EntityCaseNamingStrategy } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import { config } from './config';
import { BaseEntity } from './entities/BaseEntity';
import { Session } from './entities/Session';
import { VerifierEntity } from './entities/Verifier';
import { PresentationRequestEntity } from './entities/PresentationRequest';
import { PresentationEntity } from './entities/Presentation';
import { NoPresentationEntity } from './entities/NoPresentation';

const mikroOrmConfig: Options = {
  cache: { enabled: false }, // disabling to try to get around the odd PushToken invalid transaction "stuck" bug. ref: https://mikro-orm.io/docs/metadata-cache/
  baseDir: process.cwd(),
  type: 'postgresql',
  dbName: config.DB_NAME,
  host: config.DB_HOST,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
  user: config.DB_USER,
  entities: [
    BaseEntity,
    Session,
    VerifierEntity,
    PresentationRequestEntity,
    PresentationEntity,
    NoPresentationEntity
  ],
  entitiesTs: ['src/entities'],
  metadataProvider: TsMorphMetadataProvider,
  tsNode: false,
  namingStrategy: EntityCaseNamingStrategy,
  migrations: {
    path: `${process.cwd()}/src/migrations`
  }
};

export default mikroOrmConfig;
