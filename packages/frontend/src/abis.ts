export const tabBookmarksAbi = [
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
        "internalType": "bytes32",
        "name": "_name",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_color",
        "type": "bytes32"
      }
    ],
    "name": "createFolder",
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
            "internalType": "bytes32",
            "name": "name",
            "type": "bytes32"
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
    "name": "updateBookmark",
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
        "name": "_name",
        "type": "bytes32"
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