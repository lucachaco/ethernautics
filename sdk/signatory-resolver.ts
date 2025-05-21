/**
 * Signatory Resolver Module
 * 
 * This module provides functionality to resolve different types of signatories
 * (Hybrid, MultiSig, etc.) and create appropriate signing interfaces for them.
 * It supports various signing methods including EOA wallets, WebAuthn, and MultiSig.
 */

import {
  Address,
  concat,
  type SignableMessage,
  type TypedData,
  type TypedDataDefinition,
} from 'viem';

import type { SignReturnType as WebAuthnSignReturnType } from 'webauthn-p256';
import {
  createDummyWebAuthnSignature,
  encodeDeleGatorSignature,
  Implementation,
  aggregateSignature,
} from '@metamask/delegation-utils';
import {
  AccountSignatoryConfig,
  HybridSignatoryConfig,
  InternalSignatory,
  MultiSigSignatoryConfig,
  SignatoryConfigByImplementation,
  WalletSignatoryConfig,
} from './types';

// Default EOA (Externally Owned Account) stub signature
const EOA_STUB_SIGNATURE =
  '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' as const;

/**
 * Main resolver function that determines the appropriate signatory based on implementation type
 * @param config Configuration object containing implementation type and signatory details
 * @returns Resolved InternalSignatory with appropriate signing methods
 */
export const resolveSignatory = <
  TImplementation extends Implementation,
>(config: {
  implementation: TImplementation;
  signatory: SignatoryConfigByImplementation<TImplementation>;
}): InternalSignatory => {
  const { implementation } = config;

  if (implementation === Implementation.Hybrid) {
    return resolveHybridSignatory(config.signatory as HybridSignatoryConfig);
  } else if (implementation === Implementation.MultiSig) {
    return resolveMultiSigSignatory(
      config.signatory as MultiSigSignatoryConfig,
    );
  } else {
    throw new Error(`Implementation type '${implementation}' not supported`);
  }
};

/**
 * Resolves a signatory from a wallet configuration
 * @param config Wallet configuration containing wallet client
 * @returns InternalSignatory with wallet-based signing methods
 */
const resolveSignatoryFromWalletConfig = (
  config: WalletSignatoryConfig,
): InternalSignatory => {
  return {
    signMessage: config.walletClient.signMessage,
    signTypedData: (typedData) => {
      // TODO: Improve type handling to avoid type assertion
      return config.walletClient.signTypedData(typedData as any);
    },
    getStubSignature: async () => EOA_STUB_SIGNATURE,
  };
};

/**
 * Resolves a signatory from an account configuration
 * @param config Account configuration containing account details
 * @returns InternalSignatory with account-based signing methods
 */
const resolveSignatoryFromAccountConfig = (config: AccountSignatoryConfig) => {
  return {
    signMessage: config.account.signMessage,
    signTypedData: config.account.signTypedData,
    getStubSignature: async () => EOA_STUB_SIGNATURE,
  };
};

/**
 * Resolves a hybrid signatory that can handle multiple signing methods
 * @param config Hybrid configuration that can be wallet, account, or WebAuthn based
 * @returns InternalSignatory with appropriate hybrid signing methods
 */
const resolveHybridSignatory = (
  config: HybridSignatoryConfig,
): InternalSignatory => {
  if ('walletClient' in config) {
    return resolveSignatoryFromWalletConfig(config);
  } else if ('account' in config) {
    const { signMessage, signTypedData, getStubSignature } =
      resolveSignatoryFromAccountConfig(config);
    
    // Validate required signing capabilities
    if (!signMessage) {
      throw new Error('Account does not support signMessage');
    }
    if (!signTypedData) {
      throw new Error('Account does not support signTypedData');
    }
    
    return {
      signMessage,
      signTypedData,
      getStubSignature,
    };
  } else {
    // Handle WebAuthn configuration
    const { keyId, webAuthnAccount } = config;

    if (webAuthnAccount.type !== 'webAuthn') {
      throw new Error('Account is not a webAuthn account');
    }

    // Helper function to encode WebAuthn signatures
    const encodeSignature = ({ signature, webauthn }: WebAuthnSignReturnType) =>
      encodeDeleGatorSignature(
        keyId,
        signature,
        webauthn.clientDataJSON,
        webauthn.authenticatorData,
      );

    // Create signing methods for WebAuthn
    const signMessage = async (args: { message: SignableMessage }) =>
      webAuthnAccount.signMessage(args).then(encodeSignature);
    
    const signTypedData = async <
      const typedData extends TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | 'EIP712Domain' = keyof typedData,
    >(
      typedDataDefinition: TypedDataDefinition<typedData, primaryType>,
    ) =>
      webAuthnAccount.signTypedData(typedDataDefinition).then(encodeSignature);

    const getStubSignature = async () => createDummyWebAuthnSignature(keyId);

    return {
      signMessage,
      signTypedData,
      getStubSignature,
    };
  }
};

/**
 * Resolves a multi-signature signatory that requires multiple signatures
 * @param config Array of signatory configurations for multi-sig
 * @returns InternalSignatory with multi-sig signing methods
 */
const resolveMultiSigSignatory = (
  config: MultiSigSignatoryConfig,
): InternalSignatory => {
  // Resolve individual signatories
  const resolvedSignatories = config.map((signatory) => {
    let individualSignMessage: InternalSignatory['signMessage'];
    let individualSignTypedData: InternalSignatory['signTypedData'];
    let address: Address;

    if ('walletClient' in signatory) {
      const { signMessage, signTypedData } =
        resolveSignatoryFromWalletConfig(signatory);
      individualSignMessage = signMessage;
      individualSignTypedData = signTypedData;
      address = signatory.walletClient.account.address;
    } else {
      const { signMessage, signTypedData } =
        resolveSignatoryFromAccountConfig(signatory);
      
      if (!signMessage) {
        throw new Error('Account does not support signMessage');
      }
      if (!signTypedData) {
        throw new Error('Account does not support signTypedData');
      }

      individualSignMessage = signMessage;
      individualSignTypedData = signTypedData;
      address = signatory.account.address;
    }

    return {
      address,
      individualSignMessage,
      individualSignTypedData,
    };
  });

  // Create multi-sig message signing method
  const signMessage = async (args: { message: SignableMessage }) => {
    const addressAndSignatures = resolvedSignatories.map(
      async ({ individualSignMessage, address }) => ({
        signature: await individualSignMessage(args),
        signer: address,
        type: 'ECDSA' as const,
      }),
    );

    const signatures = await Promise.all(addressAndSignatures);

    return aggregateSignature({
      signatures,
    });
  };

  // Create multi-sig typed data signing method
  const signTypedData = async <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'EIP712Domain' = keyof typedData,
  >(
    typedDataDefinition: TypedDataDefinition<typedData, primaryType>,
  ) => {
    const addressAndSignatures = resolvedSignatories.map(
      async ({ individualSignTypedData, address }) => ({
        signature: await individualSignTypedData(typedDataDefinition),
        signer: address,
        type: 'ECDSA' as const,
      }),
    );

    const signatures = await Promise.all(addressAndSignatures);

    return aggregateSignature({
      signatures,
    });
  };

  // Create stub signature for multi-sig
  const getStubSignature = async () =>
    concat(resolvedSignatories.map(() => EOA_STUB_SIGNATURE));

  return {
    signMessage,
    signTypedData,
    getStubSignature,
  };
}; 