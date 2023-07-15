// background.js
// import { decode } from 'base64-arraybuffer';
// import { argon2id } from 'hash-wasm'
// import { encryptMnemonic } from '../contexts/Web3Context/secure';

// const argon2 = require('argon2-browser\\dist\\argon2.wasm')

// async function loadArgon2Module() : Promise<WebAssembly.Exports> {
//   const response = await fetch(argon2);
//   const buffer = await response.arrayBuffer();
//   const module = await WebAssembly.instantiate(buffer);
//   return module.instance.exports;
// }




// Listen for messages from the popup script
// chrome.runtime.onMessage.addListener( async function(request, sender, sendResponse) {
//     // loadArgon2Module().then(argon => {
//     //     console.log("encryptedStore1", argon)
//     // });
//     // if (request.greeting === "Hello from the popup!") {
//         // console.log("encryptedStore1", request.seedPhrase)
//         // encryptMnemonic('asim101', request.seedPhrase).then(store => {
//         //     console.log("encryptedStore2", store)
//         // })
//         // const encryptedStore = await encryptMnemonic('asim101', request.seedPhrase);
//       // Process the message and send a response back to the popup
//     //   console.log("encryptedStore2", encryptedStore)
//     //   const result  = await chrome.storage.local.get(["encryptedStore"]);
//     //   sendResponse(request.seedPhrase);
//     // }
//   });

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === 'seed') {
    //   try {
        // const rawKey = await argon2id({
        //     password: message.seedPhrase,
        //     // Ensure that if salt is an ArrayBuffer, it's now in a Uint8Array object
        //     salt: new Uint8Array(decode('0tZSVPntDHSRiLlD4tYOjA==')),
    
        //     // Length of the output in bytes
        //     // We are requesting a 32-byte (256-bit) key
        //     hashLength: 32,
    
        //     // Return type
        //     // Because we're deriving a key, we want the function to return a Uint8Array
        //     outputType: 'binary',
    
        //     // Parameters for deriving the key
        //     // These are the default values that node-argon2 uses and may need tuning depending on your requirements
        //     // Information on parameter choice can be found in RFC-9106, section 4:
        //     // https://datatracker.ietf.org/doc/html/rfc9106#section-4
        //     parallelism: 1,
        //     iterations: 3,
        //     memorySize: 4096, // In KB
        // })
        // Perform an asynchronous operation using await
        console.log("rawKey1", message.seedPhrase)
        // const result = encryptMnemonic('asim101', message.seedPhrase)
  
        // Send the response back to the sender
        // const argon = loadArgon2Module()
        // console.log("rawKey2", result)
        // sendResponse({ success: true, result });
     // } 
    //   catch (error) {
    //     sendResponse({ success: false, error });
    //   }
    }
  
    // Make sure to return true from the listener function
    // to indicate that you will be sending a response asynchronously
    return true;
  });

  export {}