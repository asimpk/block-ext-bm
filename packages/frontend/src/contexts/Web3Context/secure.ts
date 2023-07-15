import { encode, decode } from 'base64-arraybuffer';
import { randomBytes } from 'crypto';


// Argon2 for the browser is available in the argon2-browser module from NPM
// The package also exports "argon2i" and "argon2d" for other Argon2 variants
import { argon2id } from 'hash-wasm'


// export async function deriveKey(passphrase: string, salt: string): Promise<CryptoKey> {
//     // Derive a 32-byte key from a passphrase using argon2id (with the method imported from the hash-wasm NPM module)
//     const rawKey = await argon2id({
//         password: passphrase,
//         salt: salt,
//         hashLength: 32,
//         outputType: 'binary',
//         parallelism: 1,
//         iterations: 3,
//         memorySize: 4096,
//     });

//     // Import the calculated hash as an AES-GCM symmetric key
//     return window.crypto.subtle.importKey(
//         'raw',
//         rawKey,
//         { name: 'AES-GCM', length: 256 },
//         true,
//         ['encrypt', 'decrypt']
//     );
// }

/**
 * Derive a symmetric key from a passphrase using Argon2id.
 * The resulting key can be used to wrap and unwrap keys using AES-KW.
 * @param {string} passphrase Passphrase used to derive the key from
 * @param {ArrayBufferLike} salt Salt used to derive the key
 * @returns {Promise<CryptoKey>} Object containing the symmetric key derived from the passphrase
 */
export const deriveWrappingKey = async (passphrase: string, salt: ArrayBufferLike): Promise<CryptoKey> => {
    // Derive a 32-byte key from a passphrase using argon2id (with the method imported from the hash-wasm NPM module)
    const rawKey = await argon2id({
        password: passphrase,
        // Ensure that if salt is an ArrayBuffer, it's now in a Uint8Array object
        salt: new Uint8Array(salt),

        // Length of the output in bytes
        // We are requesting a 32-byte (256-bit) key
        hashLength: 32,

        // Return type
        // Because we're deriving a key, we want the function to return a Uint8Array
        outputType: 'binary',

        // Parameters for deriving the key
        // These are the default values that node-argon2 uses and may need tuning depending on your requirements
        // Information on parameter choice can be found in RFC-9106, section 4:
        // https://datatracker.ietf.org/doc/html/rfc9106#section-4
        parallelism: 1,
        iterations: 3,
        memorySize: 4096, // In KB
    })

    // Import the calculated hash as an AES-256 symmetric key that can be used for AES-KW
    return window.crypto.subtle.importKey(
        // Specify that the key is in raw format, i.e. just a byte sequence
        'raw',
        // The key's bytes
        rawKey,
        // This key will be used for AES-KW
        'AES-KW',
        // Make the key not extractable
        true,
        // This key can be used to wrap and unwrap other keys only
        ['wrapKey', 'unwrapKey']
    )
}

export const arrayBufferToBase64String = (arrayBuffer: ArrayBuffer): string => {
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
}

// Convert a base64-encoded string to an ArrayBuffer
export const base64StringToArrayBuffer = (base64String: string): ArrayBuffer => {
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array.buffer;
}


export const getWrappedKey = async (userKey: CryptoKey, wrappingKey: CryptoKey) => {
    return await window.crypto.subtle.wrapKey(
        // Symmetric keys are in "raw" format
        'raw',
        // Key to wrap
        userKey,
        // Wrapping key
        wrappingKey,
        // Use AES-KW to wrap the key
        { name: 'AES-KW' }
    )
}

// Perform the opposite operation, and unwrap the wrapped key using AES-KW and the same wrapping key
// The result should be a key that is identical to symmetricKey (but it's a separate object)
export const getUnwrappedKey = async (wrappedKey: ArrayBuffer, wrappingKey: CryptoKey) => {
    return await window.crypto.subtle.unwrapKey(
        // The wrapped key is in raw format
        'raw',
        // Wrapped symmetric key
        wrappedKey,
        // Wrapping key
        wrappingKey,
        // Algorithm used to unwrap the key: AES-KW
        { name: 'AES-KW' },
        // The resulting CryptoKey object will be a symmetric key for usage with AES-CBC
        { name: 'AES-GCM' },
        // The resulting key is not extractable
        false,
        // The resulting key can be used to encrypt and decrypt data (for example)
        ['encrypt', 'decrypt']
    )
}


// // Function to encrypt the mnemonic using a passphrase and return the encrypted data store
// export const encryptMnemonic = async (encryptionKey: CryptoKey, mnemonic: string): Promise<string> => {
//     // Convert the mnemonic to a buffer (Uint8Array)
//     const encoder = new TextEncoder();
//     const mnemonicBuffer = encoder.encode(mnemonic);

//     // Generate a random IV for AES-GCM
//     let iv = new Uint8Array(16);
//     window.crypto.getRandomValues(iv);

//     // Encrypt the mnemonic using AES-GCM and the encryption key
//     const encrypted = await window.crypto.subtle.encrypt(
//         { name: 'AES-GCM', iv: iv },
//         encryptionKey,
//         mnemonicBuffer
//     );

//     // Concatenate the IV and the encrypted data (ciphertext)
//     const encryptedStore = new Uint8Array([
//         ...iv,
//         ...new Uint8Array(encrypted),
//     ]);

//     // Encode the encrypted store as a Base64 string
//     const encryptedStoreBase64 = encode(encryptedStore);
//     return encryptedStoreBase64;
// }

// Function to encrypt the mnemonic using a passphrase and return the encrypted data store
export const encryptMnemonic = async (encryptionKey: CryptoKey, mnemonic: string): Promise<string> => {
    // Convert the mnemonic to a buffer (Uint8Array)
    const encoder = new TextEncoder();
    const mnemonicBuffer = encoder.encode(mnemonic);

    // Generate a random IV for AES-GCM
    let iv = new Uint8Array(16);
    window.crypto.getRandomValues(iv);

    // Encrypt the mnemonic using AES-GCM and the encryption key
    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        encryptionKey,
        mnemonicBuffer
    );

    // Concatenate the IV and the encrypted data (ciphertext)
    const encryptedStore = new Uint8Array([
        ...iv,
        ...new Uint8Array(encrypted),
    ]);

    // Encode the encrypted store as a Base64 string
    const encryptedStoreBase64 = encode(encryptedStore);
    return encryptedStoreBase64;
}

// Function to decrypt the encrypted data store using a passphrase and return the decrypted mnemonic
export const decryptMnemonic = async (encryptionKey: CryptoKey, encryptedStore: string) => {
    const encryptedStoreDecoded = decode(encryptedStore);

    // Extract the IV and the ciphertext from the encrypted store
    const iv = encryptedStoreDecoded.slice(0, 16);
    const ciphertext = encryptedStoreDecoded.slice(16);

    // Decrypt the ciphertext using AES-GCM and the encryption key
    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        encryptionKey,
        ciphertext
    );

    // Decode the decrypted buffer to a UTF-8 string (mnemonic)
    const decoder = new TextDecoder('utf-8');
    const mnemonic = decoder.decode(decrypted);
    return mnemonic;
}

export const generateSalt = async (mnemonic: string) => {
    const encoder = new TextEncoder();
    const mnemonicBytes = encoder.encode(mnemonic);
    const saltBytes = await crypto.subtle.digest('SHA-256', mnemonicBytes);
    const salt = new Uint8Array(saltBytes);
    return salt;

}

export const generatePasswordHash = async (passphrase: string, salt: ArrayBufferLike) => {
    const encoder = new TextEncoder();
    const passphraseBytes = encoder.encode(passphrase);

    const derivedKey = await crypto.subtle.importKey(
        'raw',
        passphraseBytes,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        derivedKey,
        128 // 16 bytes = 128 bits
    );

    const hashArray = new Uint8Array(derivedBits);
    const hashHex = Array.from(hashArray)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    return hashHex;
}

function secureCompare(a: Uint8Array, b: Uint8Array) {
    if (a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; ++i) {
        result |= a[i] ^ b[i];
    }

    return result === 0;
}

export const verifyHash = async (passphrase: string, salt: ArrayBufferLike, storedHash: string) => {
    const generatedHash = await generatePasswordHash(passphrase, salt);
    const generatedHashBytes = hexStringToByteArray(generatedHash);
    const storedHashBytes = hexStringToByteArray(storedHash);

    return secureCompare(generatedHashBytes, storedHashBytes);
}

// Helper function to convert a hex string to a byte array
const hexStringToByteArray = (hexString: string) => {
    const byteArray = [];
    for (let i = 0; i < hexString.length; i += 2) {
        const byteValue = parseInt(hexString.substring(i, i + 2), 16);
        byteArray.push(byteValue);
    }
    return new Uint8Array(byteArray);
}


/**
 * Generate or retrieve the user key (UK) from a mnemonic or other source.
 * @param {string} mnemonic The mnemonic used to generate or retrieve the user key
 * @returns {Promise<CryptoKey>} The generated or retrieved user key
 */
export const generateUserKeyFromMnemonic = async (mnemonic: string, salt: ArrayBufferLike,): Promise<CryptoKey> => {
    // Convert the mnemonic to a Uint8Array
    const mnemonicBytes = new TextEncoder().encode(mnemonic)

    // Derive a consistent key from the mnemonic using a key derivation function (KDF)
    const userKey = await window.crypto.subtle.importKey(
        'raw',
        mnemonicBytes,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    )

    // Derive a 256-bit user key (UK) from the consistent key using a derived key derivation function (KDF)
    const derivedKey = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: new Uint8Array(0), // Use an empty salt for simplicity, but a salt is recommended for security
            iterations: 100000, // Choose an appropriate number of iterations
            hash: 'SHA-256' // Use a strong hash function
        },
        userKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )


    return derivedKey
}


// Convert a Uint8Array to a Base64 string
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    const binaryString = Array.from(uint8Array)
      .map((byte) => String.fromCharCode(byte))
      .join('');
    const base64String = btoa(binaryString);
    return base64String;
  }
  
  // Convert a Base64 string to a Uint8Array
export  function base64ToUint8Array(base64String: string): Uint8Array {
    const binaryString = atob(base64String);
    const uint8Array = new Uint8Array(binaryString.length);
    Array.from(binaryString).forEach((char, index) => {
      uint8Array[index] = char.charCodeAt(0);
    });
    return uint8Array;
  }






