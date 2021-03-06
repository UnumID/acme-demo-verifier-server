import { Service as MikroOrmService } from 'feathers-mikro-orm';
import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { VerifierEntity } from '../../entities/Verifier';
import logger from '../../logger';
import { config } from '../../config';

export class VerifierDataService extends MikroOrmService<VerifierEntity> {
  async getVerifierEntity (verifierDid = config.VERIFIER_DID): Promise<VerifierEntity> {
    try {
      return await this.get(null, { where: { verifierDid } });
    } catch (e) {
      logger.error('VerifierDataService.getVerifierEntity caught an error thrown by this.find', e);
      throw e;
    }
  }
}
declare module '../../declarations' {
  interface ServiceTypes {
    verifierData: VerifierDataService & ServiceAddons<VerifierEntity>;
  }
}

export default function (app: Application): void {
  const verifierDataService = new VerifierDataService({
    Entity: VerifierEntity,
    orm: app.get('orm')
  });
  app.use('/verifierData', verifierDataService);
}
