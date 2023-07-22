export const tabBookmarksAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "bookmarkId",
        "type": "bytes32"
      }
    ],
    "name": "BookmarkAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "bookmarkId",
        "type": "bytes32"
      }
    ],
    "name": "BookmarkDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "fromFolderId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "toFolderId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "bookmarkId",
        "type": "bytes32"
      }
    ],
    "name": "BookmarkMoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "bookmarkId",
        "type": "bytes32"
      }
    ],
    "name": "BookmarkUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      }
    ],
    "name": "FolderAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      }
    ],
    "name": "FolderDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      }
    ],
    "name": "FolderUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "BOOKMARK_MANAGER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "FOLDER_MANAGER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "bookmarkId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "url",
        "type": "string"
      }
    ],
    "name": "addBookmark",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_folderId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "_color",
        "type": "bytes32"
      }
    ],
    "name": "addFolder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "bookmarkId",
        "type": "bytes32"
      }
    ],
    "name": "deleteBookmark",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      }
    ],
    "name": "deleteFolder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllFoldersBookmarks",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "folderId",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "color",
            "type": "bytes32"
          },
          {
            "components": [
              {
                "internalType": "bytes32",
                "name": "bookmarkId",
                "type": "bytes32"
              },
              {
                "internalType": "string",
                "name": "url",
                "type": "string"
              }
            ],
            "internalType": "struct Bookmark[]",
            "name": "bookmarks",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct Folder[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "fromFolderId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "toFolderId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "bookmarkId",
        "type": "bytes32"
      }
    ],
    "name": "moveBookmark",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "folderId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "_color",
        "type": "bytes32"
      }
    ],
    "name": "updateFolder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]