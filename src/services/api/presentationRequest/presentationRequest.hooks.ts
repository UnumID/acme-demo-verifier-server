import { Hook } from '@feathersjs/feathers';
import { BadRequest, GeneralError } from '@feathersjs/errors';
import { sendRequest } from '@unumid/server-sdk';
import { CredentialRequest, PresentationRequestPostDto } from '@unumid/types';
import { config } from '../../../config';
import logger from '../../../logger';

interface PresentationRequestOptions {
  credentialRequests: CredentialRequest[];
}

export const validatePresentationRequestOptions: Hook<PresentationRequestOptions> = (ctx) => {
  const { data } = ctx;

  if (!data) {
    throw new BadRequest('data is required.');
  }

  const { credentialRequests } = data;

  if (!credentialRequests) {
    throw new BadRequest('credentialRequests is required.');
  }

  credentialRequests.forEach(cr => {
    const { type, issuers } = cr;

    if (!type) {
      throw new BadRequest('credentialRequest type is required.');
    }

    if (!issuers || issuers.length === 0) {
      throw new BadRequest('credentialRequest issuers is required.');
    }
  });

  ctx.params.isValidated = true;
};

type SendRequestHookData = PresentationRequestOptions | PresentationRequestPostDto;

const isPresentationRequestOptions = (obj: any): obj is PresentationRequestOptions =>
  !!obj.credentialRequests;

export const sendRequestHook: Hook<SendRequestHookData> = async (ctx) => {
  if (!isPresentationRequestOptions(ctx.data)) {
    throw new BadRequest();
  }

  if (!ctx.params.isValidated) {
    throw new GeneralError('Hook context has not been validated. Did you forget to run the validatePresentationRequestOptions hook before this one?');
  }

  const { credentialRequests } = ctx.data;

  const { uuid, verifierDid, authToken, signingPrivateKey } = await ctx.app.service('verifierData').getDefaultVerifierEntity();

  let response;

  try {
    response = await sendRequest(
      authToken,
      verifierDid,
      credentialRequests,
      signingPrivateKey,
      config.HOLDER_APP_UUID
    );
  } catch (e) {
    logger.error('sendRequestHook caught an error thrown by the server sdk', e);
    throw new GeneralError('Error sending request.');
  }

  if (response.authToken !== authToken) {
    try {
      await ctx.app.service('verifierData').patch(uuid, { authToken: response.authToken });
    } catch (e) {
      logger.error('sendRequestHook caught an error thrown by VerifierDataService.patch', e);
      throw e;
    }
  }

  ctx.data = response.body;
};

export const hooks = {
  before: {
    create: [validatePresentationRequestOptions, sendRequestHook]
  }
};