import { type Address, type SignableMessage, type TypedData, type TypedDataDefinition } from 'viem';
import { Implementation } from '@metamask/delegation-utils';

/**
 * Base interface for all signatory configurations
 */
export interface BaseSignatoryConfig {
  address: Address;
}

/**
 * Configuration for wallet-based signatory
 */
export interface WalletSignatoryConfig extends BaseSignatoryConfig {
  walletClient: {
    signMessage: (args: { message: SignableMessage }) => Promise<string>;
    signTypedData: (typedData: TypedDataDefinition<any, any>) => Promise<string>;
    account: {
      address: Address;
    };
  };
}

/**
 * Configuration for account-based signatory
 */
export interface AccountSignatoryConfig extends BaseSignatoryConfig {
  account: {
    address: Address;
    signMessage?: (args: { message: SignableMessage }) => Promise<string>;
    signTypedData?: (typedData: TypedDataDefinition<any, any>) => Promise<string>;
  };
}

/**
 * Configuration for WebAuthn-based signatory
 */
export interface WebAuthnSignatoryConfig extends BaseSignatoryConfig {
  keyId: string;
  webAuthnAccount: {
    type: 'webAuthn';
    signMessage: (args: { message: SignableMessage }) => Promise<any>;
    signTypedData: (typedData: TypedDataDefinition<any, any>) => Promise<any>;
  };
}

/**
 * Union type for hybrid signatory configurations
 */
export type HybridSignatoryConfig = 
  | WalletSignatoryConfig 
  | AccountSignatoryConfig 
  | WebAuthnSignatoryConfig;

/**
 * Type for multi-signature signatory configuration
 */
export type MultiSigSignatoryConfig = Array<WalletSignatoryConfig | AccountSignatoryConfig>;

/**
 * Type mapping implementation types to their corresponding signatory configs
 */
export type SignatoryConfigByImplementation = {
  [Implementation.Hybrid]: HybridSignatoryConfig;
  [Implementation.MultiSig]: MultiSigSignatoryConfig;
};

/**
 * Internal signatory interface that all resolvers must implement
 */
export interface InternalSignatory {
  signMessage: (args: { message: SignableMessage }) => Promise<string>;
  signTypedData: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'EIP712Domain' = keyof typedData,
  >(
    typedDataDefinition: TypedDataDefinition<typedData, primaryType>,
  ) => Promise<string>;
  getStubSignature: () => Promise<string>;
} 