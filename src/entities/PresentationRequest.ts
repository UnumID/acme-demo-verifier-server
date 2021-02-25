import { Entity, Property } from '@mikro-orm/core';
import {
  CredentialRequest,
  Issuer,
  Proof,
  Verifier
} from '@unumid/types';

import { BaseEntity, BaseEntityOptions } from './BaseEntity';

export interface PresentationRequestEntityOptions extends BaseEntityOptions {
  prUuid: string;
  prCreatedAt: Date;
  prUpdatedAt: Date;
  prExpiresAt?: Date;
  prVerifier: string;
  prCredentialRequests: CredentialRequest[];
  prProof: Proof;
  prMetadata: Record<string, any>;
  prHolderAppUuid: string;
  prVerifierInfo: Pick<Verifier, 'did' | 'name' | 'url'>;
  prIssuerInfo: Record<string, Pick<Issuer, 'did' | 'name'>>;
  prDeeplink: string;
  prQrCode: string;
}

@Entity({ tableName: 'PresentationRequest' })
export class PresentationRequestEntity extends BaseEntity {
  @Property()
  prUuid: string;

  @Property({ columnType: 'timestamptz(6)' })
  prCreatedAt: Date;

  @Property({ columnType: 'timestamptz(6)' })
  prUpdatedAt: Date;

  @Property({ columnType: 'timestamptz(6)' })
  prExpiresAt?: Date;

  @Property()
  prVerifier: string;

  @Property()
  prCredentialRequests: CredentialRequest[];

  @Property()
  prProof: Proof;

  @Property()
  prMetadata: Record<string, any>;

  @Property()
  prHolderAppUuid: string;

  @Property()
  prVerifierInfo: Pick<Verifier, 'did' | 'name' | 'url'>;

  @Property()
  prIssuerInfo: Record<string, Pick<Issuer, 'did' | 'name'>>;

  @Property({ columnType: 'text' })
  prDeeplink: string;

  @Property({ columnType: 'text' })
  prQrCode: string;

  constructor (options: PresentationRequestEntityOptions) {
    super(options);

    const {
      prUuid,
      prCreatedAt,
      prUpdatedAt,
      prExpiresAt,
      prVerifier,
      prCredentialRequests,
      prProof,
      prMetadata,
      prHolderAppUuid,
      prVerifierInfo,
      prIssuerInfo,
      prDeeplink,
      prQrCode
    } = options;

    this.prUuid = prUuid;
    this.prCreatedAt = prCreatedAt;
    this.prUpdatedAt = prUpdatedAt;
    this.prExpiresAt = prExpiresAt;
    this.prVerifier = prVerifier;
    this.prCredentialRequests = prCredentialRequests;
    this.prProof = prProof;
    this.prMetadata = prMetadata;
    this.prHolderAppUuid = prHolderAppUuid;
    this.prVerifierInfo = prVerifierInfo;
    this.prIssuerInfo = prIssuerInfo;
    this.prDeeplink = prDeeplink;
    this.prQrCode = prQrCode;
  }
}