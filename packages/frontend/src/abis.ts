export const contractsAbi = {
  tabBookmarksAbi: [
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
          "name": "_folderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_bookmarkId",
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
          "name": "_folderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_bookmarkId",
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
          "name": "_folderId",
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
      "name": "getAllFolders",
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
          "name": "_folderId",
          "type": "bytes32"
        }
      ],
      "name": "getBookmarksByFolder",
      "outputs": [
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
          "name": "_fromFolderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_toFolderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_bookmarkId",
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
      "name": "updateFolder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  customBookmarksAbi: [
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
          "name": "_folderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_bookmarkId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_url",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_title",
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
          "name": "_folderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_bookmarkId",
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
          "name": "_folderId",
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
      "name": "getAllFolders",
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
            }
          ],
          "internalType": "struct CustomBookmarks.Folder[]",
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
          "name": "_folderId",
          "type": "bytes32"
        }
      ],
      "name": "getBookmarksByFolder",
      "outputs": [
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
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            }
          ],
          "internalType": "struct CustomBookmarks.Bookmark[]",
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
          "name": "_fromFolderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_toFolderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_bookmarkId",
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
          "name": "_folderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_bookmarkId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_url",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_title",
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
      "name": "updateFolder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  personalNotesAbi: [
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
          "indexed": false,
          "internalType": "bytes32",
          "name": "folderId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "noteId",
          "type": "bytes32"
        }
      ],
      "name": "NoteAdded",
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
          "name": "noteId",
          "type": "bytes32"
        }
      ],
      "name": "NoteDeleted",
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
          "name": "noteId",
          "type": "bytes32"
        }
      ],
      "name": "NoteMoved",
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
          "name": "noteId",
          "type": "bytes32"
        }
      ],
      "name": "NoteUpdated",
      "type": "event"
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
          "name": "_folderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_noteId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "addNote",
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
        }
      ],
      "name": "deleteFolder",
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
          "name": "_noteId",
          "type": "bytes32"
        }
      ],
      "name": "deleteNote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllFolders",
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
            }
          ],
          "internalType": "struct PersonalNotes.Folder[]",
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
          "name": "_folderId",
          "type": "bytes32"
        }
      ],
      "name": "getNotesByFolder",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "noteId",
              "type": "bytes32"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            }
          ],
          "internalType": "struct PersonalNotes.Note[]",
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
          "name": "_fromFolderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_toFolderId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_noteId",
          "type": "bytes32"
        }
      ],
      "name": "moveNote",
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
      "name": "updateFolder",
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
          "name": "_noteId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "updateNote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]


}