// // pragma solidity ^0.8.0;

// // struct Bookmark {
// //     bytes32 bookmarkId;
// //     string url;
// // }

// // struct Folder {
// //     bytes32 folderId;
// //     bytes32 name;
// //     bytes32 color;
// //     Bookmark[] bookmarks;
// // }

// // contract TabBookmarks {
// //     mapping(address => Folder[]) private userFolders;
// //     mapping(address => mapping(bytes32 => bool)) private folderExists;
// //     mapping(address => mapping(bytes32 => mapping(bytes32 => bool)))
// //         private bookmarkExists;

// //     event BookmarkAdded(bytes32 folderId, bytes32 bookmarkId);
// //     event BookmarkUpdated(bytes32 folderId, bytes32 bookmarkId);
// //     event BookmarkDeleted(bytes32 folderId, bytes32 bookmarkId);
// //     event FolderAdded(bytes32 folderId);
// //     event FolderUpdated(bytes32 folderId);
// //     event FolderDeleted(bytes32 folderId);
// //     event BookmarkMoved(
// //         bytes32 fromFolderId,
// //         bytes32 toFolderId,
// //         bytes32 bookmarkId
// //     );

// //     modifier validFolder(address user, bytes32 folderId) {
// //         require(folderExists[user][folderId], "Folder does not exist");
// //         _;
// //     }

// //     modifier validBookmark(
// //         address user,
// //         bytes32 folderId,
// //         bytes32 bookmarkId
// //     ) {
// //         require(
// //             bookmarkExists[user][folderId][bookmarkId],
// //             "Bookmark does not exist"
// //         );
// //         _;
// //     }

// //     function isValidFolder(
// //         address user,
// //         bytes32 folderId
// //     ) private view returns (bool) {
// //         return folderExists[user][folderId];
// //     }

// //     function isValidMove(
// //         address user,
// //         bytes32 fromFolderId,
// //         bytes32 toFolderId,
// //         bytes32 bookmarkId
// //     ) private view returns (bool) {
// //         return
// //             isValidFolder(user, fromFolderId) &&
// //             isValidFolder(user, toFolderId) &&
// //             bookmarkExists[user][fromFolderId][bookmarkId] &&
// //             !(bookmarkExists[user][toFolderId][bookmarkId]);
// //     }

// //     modifier validMove(
// //         address user,
// //         bytes32 fromFolderId,
// //         bytes32 toFolderId,
// //         bytes32 bookmarkId
// //     ) {
// //         require(
// //             isValidMove(user, fromFolderId, toFolderId, bookmarkId),
// //             "Invalid move"
// //         );
// //         _;
// //     }

// //     function checkBookmarkExists(
// //         bytes32 bookmarkId
// //     ) private view returns (bool) {
// //         Folder[] storage folders = userFolders[msg.sender];
// //         for (uint256 i = 0; i < folders.length; i++) {
// //             Bookmark[] storage bookmarks = folders[i].bookmarks;
// //             for (uint256 j = 0; j < bookmarks.length; j++) {
// //                 if (bookmarks[j].bookmarkId == bookmarkId) {
// //                     return true;
// //                 }
// //             }
// //         }
// //         return false;
// //     }

// //     function createFolder(
// //         bytes32 _folderId,
// //         bytes32 _name,
// //         bytes32 _color
// //     ) public {
// //         require(!folderExists[msg.sender][_folderId], "Folder already exists");
// //         Folder[] storage folders = userFolders[msg.sender];
// //         Folder storage newFolder = folders.push();
// //         newFolder.folderId = _folderId;
// //         newFolder.name = _name;
// //         newFolder.color = _color;
// //         folderExists[msg.sender][_folderId] = true;
// //         emit FolderAdded(_folderId);
// //     }

// //     function updateFolder(
// //         bytes32 folderId,
// //         bytes32 _name,
// //         bytes32 _color
// //     ) public validFolder(msg.sender, folderId) {
// //         Folder[] storage folders = userFolders[msg.sender];
// //         for (uint256 i = 0; i < folders.length; i++) {
// //             if (folders[i].folderId == folderId) {
// //                 folders[i].name = _name;
// //                 folders[i].color = _color;
// //                 emit FolderUpdated(folderId);
// //                 break;
// //             }
// //         }
// //     }

// //     function deleteFolder(
// //         bytes32 folderId
// //     ) public validFolder(msg.sender, folderId) {
// //         Folder[] storage folders = userFolders[msg.sender];
// //         uint256 folderIndex = folders.length;
// //         for (uint256 i = 0; i < folders.length; i++) {
// //             if (folders[i].folderId == folderId) {
// //                 folderIndex = i;
// //                 break;
// //             }
// //         }

// //         require(folderIndex < folders.length, "Folder does not exist");

// //         // Delete bookmarks related to the folder
// //         Folder storage folderToDelete = folders[folderIndex];
// //         Bookmark[] storage bookmarks = folderToDelete.bookmarks;
// //         for (uint256 j = 0; j < bookmarks.length; j++) {
// //             bookmarkExists[msg.sender][folderId][
// //                 bookmarks[j].bookmarkId
// //             ] = false;
// //         }

// //         // Shift folders after the deleted folder one position up
// //         for (uint256 k = folderIndex; k < folders.length - 1; k++) {
// //             folders[k] = folders[k + 1];
// //         }

// //         // Remove the last folder from the array
// //         folders.pop();

// //         // Update the folderExists mapping
// //         folderExists[msg.sender][folderId] = false;

// //         emit FolderDeleted(folderId);
// //     }

// //     function addBookmark(
// //         bytes32 folderId,
// //         bytes32 bookmarkId,
// //         string memory url
// //     ) public validFolder(msg.sender, folderId) {
// //         require(
// //             !bookmarkExists[msg.sender][folderId][bookmarkId],
// //             "Bookmark already exists"
// //         );

// //         // Check if the bookmark already exists in any folder
// //         require(
// //             !checkBookmarkExists(bookmarkId),
// //             "Bookmark already exists in another folder"
// //         );
// //         Folder storage folder = getFolder(msg.sender, folderId);
// //         folder.bookmarks.push(Bookmark(bookmarkId, url));
// //         bookmarkExists[msg.sender][folderId][bookmarkId] = true;
// //         emit BookmarkAdded(folderId, bookmarkId);
// //     }

// //     function updateBookmark(
// //         bytes32 folderId,
// //         bytes32 bookmarkId,
// //         string memory url
// //     )
// //         public
// //         validFolder(msg.sender, folderId)
// //         validBookmark(msg.sender, folderId, bookmarkId)
// //     {
// //         Folder storage folder = getFolder(msg.sender, folderId);
// //         Bookmark[] storage bookmarks = folder.bookmarks;
// //         for (uint256 i = 0; i < bookmarks.length; i++) {
// //             if (bookmarks[i].bookmarkId == bookmarkId) {
// //                 bookmarks[i].url = url;
// //                 emit BookmarkUpdated(folderId, bookmarkId);
// //                 break;
// //             }
// //         }
// //     }

// //     function deleteBookmark(
// //         bytes32 folderId,
// //         bytes32 bookmarkId
// //     )
// //         public
// //         validFolder(msg.sender, folderId)
// //         validBookmark(msg.sender, folderId, bookmarkId)
// //     {
// //         Folder storage folder = getFolder(msg.sender, folderId);
// //         Bookmark[] storage bookmarks = folder.bookmarks;
// //         uint256 bookmarkIndex = bookmarks.length;

// //         for (uint256 i = 0; i < bookmarks.length; i++) {
// //             if (bookmarks[i].bookmarkId == bookmarkId) {
// //                 bookmarkIndex = i;
// //                 break;
// //             }
// //         }

// //         require(bookmarkIndex < bookmarks.length, "Bookmark does not exist");

// //         // Shift bookmarks after the deleted bookmark one position up
// //         for (uint256 k = bookmarkIndex; k < bookmarks.length - 1; k++) {
// //             bookmarks[k] = bookmarks[k + 1];
// //         }

// //         // Decrease the length of the array to remove the last element
// //         bookmarks.pop();

// //         // Update the bookmarkExists mapping
// //         bookmarkExists[msg.sender][folderId][bookmarkId] = false;

// //         emit BookmarkDeleted(folderId, bookmarkId);
// //     }

// //     function moveBookmark(
// //         bytes32 fromFolderId,
// //         bytes32 toFolderId,
// //         bytes32 bookmarkId
// //     ) public validMove(msg.sender, fromFolderId, toFolderId, bookmarkId) {
// //         Folder storage fromFolder = getFolder(msg.sender, fromFolderId);
// //         Folder storage toFolder = getFolder(msg.sender, toFolderId);
// //         Bookmark[] storage fromBookmarks = fromFolder.bookmarks;
// //         Bookmark[] storage toBookmarks = toFolder.bookmarks;

// //         uint256 bookmarkIndex = fromBookmarks.length;
// //         Bookmark memory bookmark;
// //         for (uint256 i = 0; i < fromBookmarks.length; i++) {
// //             if (fromBookmarks[i].bookmarkId == bookmarkId) {
// //                 bookmark = fromBookmarks[i];
// //                 bookmarkIndex = i;
// //                 break;
// //             }
// //         }

// //         // Shift bookmarks after the deleted bookmark one position up
// //         for (uint256 k = bookmarkIndex; k < fromBookmarks.length - 1; k++) {
// //             fromBookmarks[k] = fromBookmarks[k + 1];
// //         }

// //         // Decrease the length of the array to remove the last element
// //         fromBookmarks.pop();


// //         toBookmarks.push(bookmark);
        
// //         bookmarkExists[msg.sender][toFolderId][bookmarkId] = true;
// //         bookmarkExists[msg.sender][fromFolderId][bookmarkId] = false;

// //         emit BookmarkMoved(fromFolderId, toFolderId, bookmarkId);
// //     }

// //     function getAllFoldersBookmarks() public view returns (Folder[] memory) {
// //         return userFolders[msg.sender];
// //     }

// //     function getFolder(
// //         address user,
// //         bytes32 folderId
// //     ) private view returns (Folder storage) {
// //         Folder[] storage folders = userFolders[user];
// //         for (uint256 i = 0; i < folders.length; i++) {
// //             if (folders[i].folderId == folderId) {
// //                 return folders[i];
// //             }
// //         }
// //         revert("Folder does not exist");
// //     }
// // }

// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// // import "@openzeppelin/contracts/access/AccessControl.sol";

// struct Bookmark {
//     bytes32 bookmarkId;
//     string url;
// }

// struct Folder {
//     bytes32 folderId;
//     bytes32 name;
//     bytes32 color;
//     Bookmark[] bookmarks;
// }

// contract TabBookmarks is AccessControl {
//     bytes32 public constant FOLDER_MANAGER_ROLE = keccak256("FOLDER_MANAGER_ROLE");
//     bytes32 public constant BOOKMARK_MANAGER_ROLE = keccak256("BOOKMARK_MANAGER_ROLE");

//     mapping(address => Folder[]) private userFolders;
//     mapping(address => mapping(bytes32 => bool)) private folderExists;
//     mapping(address => mapping(bytes32 => mapping(bytes32 => bool)))
//         private bookmarkExists;

//     event BookmarkAdded(bytes32 folderId, bytes32 bookmarkId);
//     event BookmarkUpdated(bytes32 folderId, bytes32 bookmarkId);
//     event BookmarkDeleted(bytes32 folderId, bytes32 bookmarkId);
//     event FolderAdded(bytes32 folderId);
//     event FolderUpdated(bytes32 folderId);
//     event FolderDeleted(bytes32 folderId);
//     event BookmarkMoved(
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     );

//     modifier validFolder(address user, bytes32 folderId) {
//         require(folderExists[user][folderId], "Folder does not exist");
//         _;
//     }

//     modifier validBookmark(
//         address user,
//         bytes32 folderId,
//         bytes32 bookmarkId
//     ) {
//         require(
//             bookmarkExists[user][folderId][bookmarkId],
//             "Bookmark does not exist"
//         );
//         _;
//     }

//     constructor() {
//         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
//     }

//     function isValidFolder(
//         address user,
//         bytes32 folderId
//     ) private view returns (bool) {
//         return folderExists[user][folderId];
//     }

//     function isValidMove(
//         address user,
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     ) private view returns (bool) {
//         return
//             isValidFolder(user, fromFolderId) &&
//             isValidFolder(user, toFolderId) &&
//             bookmarkExists[user][fromFolderId][bookmarkId] &&
//             !(bookmarkExists[user][toFolderId][bookmarkId]);
//     }

//     modifier validMove(
//         address user,
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     ) {
//         require(
//             isValidMove(user, fromFolderId, toFolderId, bookmarkId),
//             "Invalid move"
//         );
//         _;
//     }

//     function checkBookmarkExists(
//         bytes32 bookmarkId
//     ) private view returns (bool) {
//         Folder[] storage folders = userFolders[msg.sender];
//         for (uint256 i = 0; i < folders.length; i++) {
//             Bookmark[] storage bookmarks = folders[i].bookmarks;
//             for (uint256 j = 0; j < bookmarks.length; j++) {
//                 if (bookmarks[j].bookmarkId == bookmarkId) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }

//     function createFolder(
//         bytes32 _folderId,
//         bytes32 _name,
//         bytes32 _color
//     ) public {
//         require(!folderExists[msg.sender][_folderId], "Folder already exists");
//         _setupRole(FOLDER_MANAGER_ROLE, msg.sender);
//         Folder[] storage folders = userFolders[msg.sender];
//         Folder storage newFolder = folders.push();
//         newFolder.folderId = _folderId;
//         newFolder.name = _name;
//         newFolder.color = _color;
//         folderExists[msg.sender][_folderId] = true;
//         emit FolderAdded(_folderId);
//     }

//     function updateFolder(
//         bytes32 folderId,
//         bytes32 _name,
//         bytes32 _color
//     ) public validFolder(msg.sender, folderId) {
//         Folder[] storage folders = userFolders[msg.sender];
//         for (uint256 i = 0; i < folders.length; i++) {
//             if (folders[i].folderId == folderId) {
//                 require(hasRole(FOLDER_MANAGER_ROLE, msg.sender), "Not authorized to update folder");
//                 folders[i].name = _name;
//                 folders[i].color = _color;
//                 emit FolderUpdated(folderId);
//                 break;
//             }
//         }
//     }

//     function deleteFolder(
//         bytes32 folderId
//     ) public validFolder(msg.sender, folderId) {
//         Folder[] storage folders = userFolders[msg.sender];
//         uint256 folderIndex = folders.length;
//         for (uint256 i = 0; i < folders.length; i++) {
//             if (folders[i].folderId == folderId) {
//                 folderIndex = i;
//                 break;
//             }
//         }

//         require(folderIndex < folders.length, "Folder does not exist");
//         require(hasRole(FOLDER_MANAGER_ROLE, msg.sender), "Not authorized to delete folder");

//         // Delete bookmarks related to the folder
//         Folder storage folderToDelete = folders[folderIndex];
//         Bookmark[] storage bookmarks = folderToDelete.bookmarks;
//         for (uint256 j = 0; j < bookmarks.length; j++) {
//             bookmarkExists[msg.sender][folderId][
//                 bookmarks[j].bookmarkId
//             ] = false;
//         }

//         // Shift folders after the deleted folder one position up
//         for (uint256 k = folderIndex; k < folders.length - 1; k++) {
//             folders[k] = folders[k + 1];
//         }

//         // Remove the last folder from the array
//         folders.pop();

//         // Update the folderExists mapping
//         folderExists[msg.sender][folderId] = false;

//         emit FolderDeleted(folderId);
//     }

//     function addBookmark(
//         bytes32 folderId,
//         bytes32 bookmarkId,
//         string memory url
//     ) public validFolder(msg.sender, folderId) {
//         require(
//             !bookmarkExists[msg.sender][folderId][bookmarkId],
//             "Bookmark already exists"
//         );
//         require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to add bookmark");

//         // Check if the bookmark already exists in any folder
//         require(
//             !checkBookmarkExists(bookmarkId),
//             "Bookmark already exists in another folder"
//         );
//         Folder storage folder = getFolder(msg.sender, folderId);
//         folder.bookmarks.push(Bookmark(bookmarkId, url));
//         bookmarkExists[msg.sender][folderId][bookmarkId] = true;
//         emit BookmarkAdded(folderId, bookmarkId);
//     }

//     function updateBookmark(
//         bytes32 folderId,
//         bytes32 bookmarkId,
//         string memory url
//     )
//         public
//         validFolder(msg.sender, folderId)
//         validBookmark(msg.sender, folderId, bookmarkId)
//     {
//         Folder storage folder = getFolder(msg.sender, folderId);
//         Bookmark[] storage bookmarks = folder.bookmarks;
//         for (uint256 i = 0; i < bookmarks.length; i++) {
//             if (bookmarks[i].bookmarkId == bookmarkId) {
//                 require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to update bookmark");
//                 bookmarks[i].url = url;
//                 emit BookmarkUpdated(folderId, bookmarkId);
//                 break;
//             }
//         }
//     }

//     function deleteBookmark(
//         bytes32 folderId,
//         bytes32 bookmarkId
//     )
//         public
//         validFolder(msg.sender, folderId)
//         validBookmark(msg.sender, folderId, bookmarkId)
//     {
//         Folder storage folder = getFolder(msg.sender, folderId);
//         Bookmark[] storage bookmarks = folder.bookmarks;
//         uint256 bookmarkIndex = bookmarks.length;

//         for (uint256 i = 0; i < bookmarks.length; i++) {
//             if (bookmarks[i].bookmarkId == bookmarkId) {
//                 bookmarkIndex = i;
//                 break;
//             }
//         }

//         require(bookmarkIndex < bookmarks.length, "Bookmark does not exist");
//         require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to delete bookmark");

//         // Shift bookmarks after the deleted bookmark one position up
//         for (uint256 k = bookmarkIndex; k < bookmarks.length - 1; k++) {
//             bookmarks[k] = bookmarks[k + 1];
//         }

//         // Decrease the length of the array to remove the last element
//         bookmarks.pop();

//         // Update the bookmarkExists mapping
//         bookmarkExists[msg.sender][folderId][bookmarkId] = false;

//         emit BookmarkDeleted(folderId, bookmarkId);
//     }

//     function moveBookmark(
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     ) public validMove(msg.sender, fromFolderId, toFolderId, bookmarkId) {
//         Folder storage fromFolder = getFolder(msg.sender, fromFolderId);
//         Folder storage toFolder = getFolder(msg.sender, toFolderId);
//         Bookmark[] storage fromBookmarks = fromFolder.bookmarks;
//         Bookmark[] storage toBookmarks = toFolder.bookmarks;

//         uint256 bookmarkIndex = fromBookmarks.length;
//         Bookmark memory bookmark;
//         for (uint256 i = 0; i < fromBookmarks.length; i++) {
//             if (fromBookmarks[i].bookmarkId == bookmarkId) {
//                 bookmark = fromBookmarks[i];
//                 bookmarkIndex = i;
//                 break;
//             }
//         }

//         require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to move bookmark");

//         // Shift bookmarks after the deleted bookmark one position up
//         for (uint256 k = bookmarkIndex; k < fromBookmarks.length - 1; k++) {
//             fromBookmarks[k] = fromBookmarks[k + 1];
//         }

//         // Decrease the length of the array to remove the last element
//         fromBookmarks.pop();

//         toBookmarks.push(bookmark);

//         bookmarkExists[msg.sender][toFolderId][bookmarkId] = true;
//         bookmarkExists[msg.sender][fromFolderId][bookmarkId] = false;

//         emit BookmarkMoved(fromFolderId, toFolderId, bookmarkId);
//     }

//     function getAllFoldersBookmarks() public view returns (Folder[] memory) {
//         return userFolders[msg.sender];
//     }

//     function getFolder(
//         address user,
//         bytes32 folderId
//     ) private view returns (Folder storage) {
//         Folder[] storage folders = userFolders[user];
//         for (uint256 i = 0; i < folders.length; i++) {
//             if (folders[i].folderId == folderId) {
//                 return folders[i];
//             }
//         }
//         revert("Folder does not exist");
//     }
// }




// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/access/AccessControl.sol";

// struct Bookmark {
//     bytes32 bookmarkId;
//     string url;
// }

// struct Folder {
//     bytes32 folderId;
//     bytes32 name;
//     bytes32 color;
//     Bookmark[] bookmarks;
// }

// contract TabBookmarks is AccessControl {
//     bytes32 public constant FOLDER_MANAGER_ROLE = keccak256("FOLDER_MANAGER_ROLE");
//     bytes32 public constant BOOKMARK_MANAGER_ROLE = keccak256("BOOKMARK_MANAGER_ROLE");

//     mapping(address => Folder[]) private userFolders;
//     mapping(address => mapping(bytes32 => bool)) private folderExists;
//     mapping(address => mapping(bytes32 => mapping(bytes32 => bool)))
//         private bookmarkExists;

//     event BookmarkAdded(bytes32 folderId, bytes32 bookmarkId);
//     event BookmarkUpdated(bytes32 folderId, bytes32 bookmarkId);
//     event BookmarkDeleted(bytes32 folderId, bytes32 bookmarkId);
//     event FolderAdded(bytes32 folderId);
//     event FolderUpdated(bytes32 folderId);
//     event FolderDeleted(bytes32 folderId);
//     event BookmarkMoved(
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     );

//     modifier validFolder(address user, bytes32 folderId) {
//         require(folderExists[user][folderId], "Folder does not exist");
//         _;
//     }

//     modifier validBookmark(
//         address user,
//         bytes32 folderId,
//         bytes32 bookmarkId
//     ) {
//         require(
//             bookmarkExists[user][folderId][bookmarkId],
//             "Bookmark does not exist"
//         );
//         _;
//     }

//     constructor() {
//         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
//     }

//     function isValidFolder(
//         address user,
//         bytes32 folderId
//     ) private view returns (bool) {
//         return folderExists[user][folderId];
//     }

//     function isValidMove(
//         address user,
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     ) private view returns (bool) {
//         return
//             isValidFolder(user, fromFolderId) &&
//             isValidFolder(user, toFolderId) &&
//             bookmarkExists[user][fromFolderId][bookmarkId] &&
//             !(bookmarkExists[user][toFolderId][bookmarkId]);
//     }

//     modifier validMove(
//         address user,
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     ) {
//         require(
//             isValidMove(user, fromFolderId, toFolderId, bookmarkId),
//             "Invalid move"
//         );
//         _;
//     }

//     function checkBookmarkExists(
//         bytes32 bookmarkId
//     ) private view returns (bool) {
//         Folder[] storage folders = userFolders[msg.sender];
//         for (uint256 i = 0; i < folders.length; i++) {
//             Bookmark[] storage bookmarks = folders[i].bookmarks;
//             for (uint256 j = 0; j < bookmarks.length; j++) {
//                 if (bookmarks[j].bookmarkId == bookmarkId) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }

//     function createFolder(
//         bytes32 _folderId,
//         bytes32 _name,
//         bytes32 _color
//     ) public {
//         require(!folderExists[msg.sender][_folderId], "Folder already exists");
//         _setupRole(FOLDER_MANAGER_ROLE, msg.sender);
//         _setupRole(BOOKMARK_MANAGER_ROLE, msg.sender);
//         Folder[] storage folders = userFolders[msg.sender];
//         Folder storage newFolder = folders.push();
//         newFolder.folderId = _folderId;
//         newFolder.name = _name;
//         newFolder.color = _color;
//         folderExists[msg.sender][_folderId] = true;
//         emit FolderAdded(_folderId);
//     }

//     function updateFolder(
//         bytes32 folderId,
//         bytes32 _name,
//         bytes32 _color
//     ) public validFolder(msg.sender, folderId) {
//         Folder[] storage folders = userFolders[msg.sender];
//         for (uint256 i = 0; i < folders.length; i++) {
//             if (folders[i].folderId == folderId) {
//                 require(hasRole(FOLDER_MANAGER_ROLE, msg.sender), "Not authorized to update folder");
//                 folders[i].name = _name;
//                 folders[i].color = _color;
//                 emit FolderUpdated(folderId);
//                 break;
//             }
//         }
//     }

//     function deleteFolder(
//         bytes32 folderId
//     ) public validFolder(msg.sender, folderId) {
//         Folder[] storage folders = userFolders[msg.sender];
//         uint256 folderIndex = folders.length;
//         for (uint256 i = 0; i < folders.length; i++) {
//             if (folders[i].folderId == folderId) {
//                 folderIndex = i;
//                 break;
//             }
//         }

//         require(folderIndex < folders.length, "Folder does not exist");
//         require(hasRole(FOLDER_MANAGER_ROLE, msg.sender), "Not authorized to delete folder");

//         // Delete bookmarks related to the folder
//         Folder storage folderToDelete = folders[folderIndex];
//         Bookmark[] storage bookmarks = folderToDelete.bookmarks;
//         for (uint256 j = 0; j < bookmarks.length; j++) {
//             bookmarkExists[msg.sender][folderId][
//                 bookmarks[j].bookmarkId
//             ] = false;
//         }

//         // Shift folders after the deleted folder one position up
//         for (uint256 k = folderIndex; k < folders.length - 1; k++) {
//             folders[k] = folders[k + 1];
//         }

//         // Remove the last folder from the array
//         folders.pop();

//         // Update the folderExists mapping
//         folderExists[msg.sender][folderId] = false;

//         emit FolderDeleted(folderId);
//     }

//     function addBookmark(
//         bytes32 folderId,
//         bytes32 bookmarkId,
//         string memory url
//     ) public validFolder(msg.sender, folderId) {
//         require(
//             !bookmarkExists[msg.sender][folderId][bookmarkId],
//             "Bookmark already exists"
//         );
//         require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to add bookmark");

//         // Check if the bookmark already exists in any folder
//         require(
//             !checkBookmarkExists(bookmarkId),
//             "Bookmark already exists in another folder"
//         );
//         Folder storage folder = getFolder(msg.sender, folderId);
//         folder.bookmarks.push(Bookmark(bookmarkId, url));
//         bookmarkExists[msg.sender][folderId][bookmarkId] = true;
//         emit BookmarkAdded(folderId, bookmarkId);
//     }

//     function updateBookmark(
//         bytes32 folderId,
//         bytes32 bookmarkId,
//         string memory url
//     )
//         public
//         validFolder(msg.sender, folderId)
//         validBookmark(msg.sender, folderId, bookmarkId)
//     {
//         Folder storage folder = getFolder(msg.sender, folderId);
//         Bookmark[] storage bookmarks = folder.bookmarks;
//         for (uint256 i = 0; i < bookmarks.length; i++) {
//             if (bookmarks[i].bookmarkId == bookmarkId) {
//                 require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to update bookmark");
//                 bookmarks[i].url = url;
//                 emit BookmarkUpdated(folderId, bookmarkId);
//                 break;
//             }
//         }
//     }

//     function deleteBookmark(
//         bytes32 folderId,
//         bytes32 bookmarkId
//     )
//         public
//         validFolder(msg.sender, folderId)
//         validBookmark(msg.sender, folderId, bookmarkId)
//     {
//         Folder storage folder = getFolder(msg.sender, folderId);
//         Bookmark[] storage bookmarks = folder.bookmarks;
//         uint256 bookmarkIndex = bookmarks.length;

//         for (uint256 i = 0; i < bookmarks.length; i++) {
//             if (bookmarks[i].bookmarkId == bookmarkId) {
//                 bookmarkIndex = i;
//                 break;
//             }
//         }

//         require(bookmarkIndex < bookmarks.length, "Bookmark does not exist");
//         require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to delete bookmark");

//         // Shift bookmarks after the deleted bookmark one position up
//         for (uint256 k = bookmarkIndex; k < bookmarks.length - 1; k++) {
//             bookmarks[k] = bookmarks[k + 1];
//         }

//         // Decrease the length of the array to remove the last element
//         bookmarks.pop();

//         // Update the bookmarkExists mapping
//         bookmarkExists[msg.sender][folderId][bookmarkId] = false;

//         emit BookmarkDeleted(folderId, bookmarkId);
//     }

//     function moveBookmark(
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     ) public validMove(msg.sender, fromFolderId, toFolderId, bookmarkId) {
//         Folder storage fromFolder = getFolder(msg.sender, fromFolderId);
//         Folder storage toFolder = getFolder(msg.sender, toFolderId);
//         Bookmark[] storage fromBookmarks = fromFolder.bookmarks;
//         Bookmark[] storage toBookmarks = toFolder.bookmarks;

//         uint256 bookmarkIndex = fromBookmarks.length;
//         Bookmark memory bookmark;
//         for (uint256 i = 0; i < fromBookmarks.length; i++) {
//             if (fromBookmarks[i].bookmarkId == bookmarkId) {
//                 bookmark = fromBookmarks[i];
//                 bookmarkIndex = i;
//                 break;
//             }
//         }

//         require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to move bookmark");

//         // Shift bookmarks after the deleted bookmark one position up
//         for (uint256 k = bookmarkIndex; k < fromBookmarks.length - 1; k++) {
//             fromBookmarks[k] = fromBookmarks[k + 1];
//         }

//         // Decrease the length of the array to remove the last element
//         fromBookmarks.pop();

//         toBookmarks.push(bookmark);

//         bookmarkExists[msg.sender][toFolderId][bookmarkId] = true;
//         bookmarkExists[msg.sender][fromFolderId][bookmarkId] = false;

//         emit BookmarkMoved(fromFolderId, toFolderId, bookmarkId);
//     }

//     function getAllFoldersBookmarks() public view returns (Folder[] memory) {
//         return userFolders[msg.sender];
//     }

//     function getFolder(
//         address user,
//         bytes32 folderId
//     ) private view returns (Folder storage) {
//         Folder[] storage folders = userFolders[user];
//         for (uint256 i = 0; i < folders.length; i++) {
//             if (folders[i].folderId == folderId) {
//                 return folders[i];
//             }
//         }
//         revert("Folder does not exist");
//     }
// }


// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/access/AccessControl.sol";

// struct Bookmark {
//     bytes32 bookmarkId;
//     string url;
// }

// struct Folder {
//     bytes32 folderId;
//     string name;
//     bytes32 color;
//     Bookmark[] bookmarks;
// }

// contract TabBookmarks is AccessControl {
//     bytes32 public constant FOLDER_MANAGER_ROLE = keccak256("FOLDER_MANAGER_ROLE");
//     bytes32 public constant BOOKMARK_MANAGER_ROLE = keccak256("BOOKMARK_MANAGER_ROLE");

//     mapping(address => Folder[]) private userFolders;
//     mapping(address => mapping(bytes32 => bool)) private folderExists;
//     mapping(address => mapping(bytes32 => mapping(bytes32 => bool)))
//         private bookmarkExists;

//     event BookmarkAdded(bytes32 folderId, bytes32 bookmarkId);
//     event BookmarkUpdated(bytes32 folderId, bytes32 bookmarkId);
//     event BookmarkDeleted(bytes32 folderId, bytes32 bookmarkId);
//     event FolderAdded(bytes32 folderId);
//     event FolderUpdated(bytes32 folderId);
//     event FolderDeleted(bytes32 folderId);
//     event BookmarkMoved(
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     );

//     modifier validFolder(address user, bytes32 folderId) {
//         require(folderExists[user][folderId], "Folder does not exist");
//         _;
//     }

//     modifier validBookmark(
//         address user,
//         bytes32 folderId,
//         bytes32 bookmarkId
//     ) {
//         require(
//             bookmarkExists[user][folderId][bookmarkId],
//             "Bookmark does not exist"
//         );
//         _;
//     }

//     constructor() {
//         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
//     }

//     function isValidFolder(
//         address user,
//         bytes32 folderId
//     ) private view returns (bool) {
//         return folderExists[user][folderId];
//     }

//     function isValidMove(
//         address user,
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     ) private view returns (bool) {
//         return
//             isValidFolder(user, fromFolderId) &&
//             isValidFolder(user, toFolderId) &&
//             bookmarkExists[user][fromFolderId][bookmarkId] &&
//             !(bookmarkExists[user][toFolderId][bookmarkId]);
//     }

//     modifier validMove(
//         address user,
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     ) {
//         require(
//             isValidMove(user, fromFolderId, toFolderId, bookmarkId),
//             "Invalid move"
//         );
//         _;
//     }

//     function checkBookmarkExists(
//         bytes32 bookmarkId
//     ) private view returns (bool) {
//         Folder[] storage folders = userFolders[msg.sender];
//         for (uint256 i = 0; i < folders.length; i++) {
//             Bookmark[] storage bookmarks = folders[i].bookmarks;
//             for (uint256 j = 0; j < bookmarks.length; j++) {
//                 if (bookmarks[j].bookmarkId == bookmarkId) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }

//     function addFolder(
//         bytes32 _folderId,
//         string memory _name,
//         bytes32 _color
//     ) public {
//         require(!folderExists[msg.sender][_folderId], "Folder already exists");
//         _setupRole(FOLDER_MANAGER_ROLE, msg.sender);
//         _setupRole(BOOKMARK_MANAGER_ROLE, msg.sender);
//         Folder[] storage folders = userFolders[msg.sender];
//         Folder storage newFolder = folders.push();
//         newFolder.folderId = _folderId;
//         newFolder.name = _name;
//         newFolder.color = _color;
//         folderExists[msg.sender][_folderId] = true;
//         emit FolderAdded(_folderId);
//     }

//     function updateFolder(
//         bytes32 folderId,
//         string memory _name,
//         bytes32 _color
//     ) public validFolder(msg.sender, folderId) {
//         Folder[] storage folders = userFolders[msg.sender];
//         for (uint256 i = 0; i < folders.length; i++) {
//             if (folders[i].folderId == folderId) {
//                 require(hasRole(FOLDER_MANAGER_ROLE, msg.sender), "Not authorized to update folder");
//                 folders[i].name = _name;
//                 folders[i].color = _color;
//                 emit FolderUpdated(folderId);
//                 break;
//             }
//         }
//     }

//     function deleteFolder(
//         bytes32 folderId
//     ) public validFolder(msg.sender, folderId) {
//         Folder[] storage folders = userFolders[msg.sender];
//         uint256 folderIndex = folders.length;
//         for (uint256 i = 0; i < folders.length; i++) {
//             if (folders[i].folderId == folderId) {
//                 folderIndex = i;
//                 break;
//             }
//         }

//         require(folderIndex < folders.length, "Folder does not exist");
//         require(hasRole(FOLDER_MANAGER_ROLE, msg.sender), "Not authorized to delete folder");

//         // Delete bookmarks related to the folder
//         Folder storage folderToDelete = folders[folderIndex];
//         Bookmark[] storage bookmarks = folderToDelete.bookmarks;
//         for (uint256 j = 0; j < bookmarks.length; j++) {
//             bookmarkExists[msg.sender][folderId][
//                 bookmarks[j].bookmarkId
//             ] = false;
//         }

//         // Shift folders after the deleted folder one position up
//         for (uint256 k = folderIndex; k < folders.length - 1; k++) {
//             folders[k] = folders[k + 1];
//         }

//         // Remove the last folder from the array
//         folders.pop();

//         // Update the folderExists mapping
//         folderExists[msg.sender][folderId] = false;

//         emit FolderDeleted(folderId);
//     }

//     function addBookmark(
//         bytes32 folderId,
//         bytes32 bookmarkId,
//         string memory url
//     ) public validFolder(msg.sender, folderId) {
//         require(
//             !bookmarkExists[msg.sender][folderId][bookmarkId],
//             "Bookmark already exists"
//         );
//         require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to add bookmark");

//         // Check if the bookmark already exists in any folder
//         require(
//             !checkBookmarkExists(bookmarkId),
//             "Bookmark already exists in another folder"
//         );
//         Folder storage folder = getFolder(msg.sender, folderId);
//         folder.bookmarks.push(Bookmark(bookmarkId, url));
//         bookmarkExists[msg.sender][folderId][bookmarkId] = true;
//         emit BookmarkAdded(folderId, bookmarkId);
//     }

//     function deleteBookmark(
//         bytes32 folderId,
//         bytes32 bookmarkId
//     )
//         public
//         validFolder(msg.sender, folderId)
//         validBookmark(msg.sender, folderId, bookmarkId)
//     {
//         Folder storage folder = getFolder(msg.sender, folderId);
//         Bookmark[] storage bookmarks = folder.bookmarks;
//         uint256 bookmarkIndex = bookmarks.length;

//         for (uint256 i = 0; i < bookmarks.length; i++) {
//             if (bookmarks[i].bookmarkId == bookmarkId) {
//                 bookmarkIndex = i;
//                 break;
//             }
//         }

//         require(bookmarkIndex < bookmarks.length, "Bookmark does not exist");
//         require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to delete bookmark");

//         // Shift bookmarks after the deleted bookmark one position up
//         for (uint256 k = bookmarkIndex; k < bookmarks.length - 1; k++) {
//             bookmarks[k] = bookmarks[k + 1];
//         }

//         // Decrease the length of the array to remove the last element
//         bookmarks.pop();

//         // Update the bookmarkExists mapping
//         bookmarkExists[msg.sender][folderId][bookmarkId] = false;

//         emit BookmarkDeleted(folderId, bookmarkId);
//     }

//     function moveBookmark(
//         bytes32 fromFolderId,
//         bytes32 toFolderId,
//         bytes32 bookmarkId
//     ) public validMove(msg.sender, fromFolderId, toFolderId, bookmarkId) {
//         Folder storage fromFolder = getFolder(msg.sender, fromFolderId);
//         Folder storage toFolder = getFolder(msg.sender, toFolderId);
//         Bookmark[] storage fromBookmarks = fromFolder.bookmarks;
//         Bookmark[] storage toBookmarks = toFolder.bookmarks;

//         uint256 bookmarkIndex = fromBookmarks.length;
//         Bookmark memory bookmark;
//         for (uint256 i = 0; i < fromBookmarks.length; i++) {
//             if (fromBookmarks[i].bookmarkId == bookmarkId) {
//                 bookmark = fromBookmarks[i];
//                 bookmarkIndex = i;
//                 break;
//             }
//         }

//         require(hasRole(BOOKMARK_MANAGER_ROLE, msg.sender), "Not authorized to move bookmark");

//         // Shift bookmarks after the deleted bookmark one position up
//         for (uint256 k = bookmarkIndex; k < fromBookmarks.length - 1; k++) {
//             fromBookmarks[k] = fromBookmarks[k + 1];
//         }

//         // Decrease the length of the array to remove the last element
//         fromBookmarks.pop();

//         toBookmarks.push(bookmark);

//         bookmarkExists[msg.sender][toFolderId][bookmarkId] = true;
//         bookmarkExists[msg.sender][fromFolderId][bookmarkId] = false;

//         emit BookmarkMoved(fromFolderId, toFolderId, bookmarkId);
//     }

//     function getAllFoldersBookmarks() public view returns (Folder[] memory) {
//         return userFolders[msg.sender];
//     }

//     function getFolder(
//         address user,
//         bytes32 folderId
//     ) private view returns (Folder storage) {
//         Folder[] storage folders = userFolders[user];
//         for (uint256 i = 0; i < folders.length; i++) {
//             if (folders[i].folderId == folderId) {
//                 return folders[i];
//             }
//         }
//         revert("Folder does not exist");
//     }
// }



