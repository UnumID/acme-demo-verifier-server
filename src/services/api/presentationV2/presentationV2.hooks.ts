import { Hook } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { Presentation as PresentationDeprecated, NoPresentation as NoPresentationDeprecated } from '@unumid/types-deprecated-v1';
import { Presentation, EncryptedPresentation, WithVersion } from '@unumid/types-deprecated-v2';

import { lt, valid } from 'semver';
import logger from '../../../logger';

export const validateData: Hook<WithVersion<EncryptedPresentation>> = (ctx) => {
  const { data, params } = ctx;
  if (!data) {
    throw new BadRequest('data is required.');
  }

  if (!data.presentationRequestInfo) {
    throw new BadRequest('presentationRequestInfo is required.');
  }

  if (!data.encryptedPresentation) {
    throw new BadRequest('encryptedPresentation is required.');
  }

  if (!params.headers || !params.headers.version) {
    throw new BadRequest('version header is required.');
  } else {
    logger.debug(`Request made with version ${params.headers.version}`);
  }

  if (!valid(params.headers.version)) {
    throw new BadRequest('version header must be in valid semver notation.');
  }

  if (lt(params.headers.version, '2.0.0')) {
    throw new BadRequest('version header must be 2.x.x for the presentationV2 service.');
  }

  data.version = params.headers.version;

  params.isValidated = true;
};

export interface DataWithVerification {
  presentation: Presentation | PresentationDeprecated | NoPresentationDeprecated;
  isVerified: boolean;
}

export const hooks = {
  before: {
    create: [validateData]
  }
};
