// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Bookmark {
    string url;
    uint256 folderId;
    string title;
    string description;
    string pic; // IPFS link to the picture
}

contract BookmarkManager {
    struct Folder {
        string name;
        string color;
        mapping(uint256 => Bookmark) bookmarks;
        uint256 bookmarkCount;
    }

    struct User {
        mapping(uint256 => Folder) folders;
        uint256 folderCount;
    }

    mapping(address => User) private users;
    uint256 private folderIdCounter;

    event BookmarkAdded(uint256 folderId, uint256 bookmarkIndex);
    event BookmarkUpdated(uint256 folderId, uint256 bookmarkIndex);
    event BookmarkDeleted(uint256 folderId, uint256 bookmarkIndex);
    event FolderAdded(uint256 folderId);
    event FolderUpdated(uint256 folderId);
    event FolderDeleted(uint256 folderId);

    // Default folder details
    string private constant DEFAULT_FOLDER_NAME = "Default Folder";
    string private constant DEFAULT_FOLDER_COLOR = "#000000";

    // Modifier to check if the folder belongs to the user
    modifier folderExists(uint256 folderId) {
        require(
            folderId < users[msg.sender].folderCount,
            "Folder does not exist"
        );
        _;
    }

    // Modifier to check if the bookmark belongs to the folder
    modifier bookmarkExists(uint256 folderId, uint256 bookmarkIndex) {
        require(
            bookmarkIndex < users[msg.sender].folders[folderId].bookmarkCount,
            "Bookmark does not exist"
        );
        _;
    }

    // Modifier to check if the folder or bookmark belongs to the user
    modifier userHasAccess(uint256 folderId, uint256 bookmarkIndex) {
        require(folderId < users[msg.sender].folderCount, "Access denied");
        require(
            bookmarkIndex < users[msg.sender].folders[folderId].bookmarkCount,
            "Access denied"
        );
        _;
    }

    // Constructor
    constructor() {
        createFolder(DEFAULT_FOLDER_NAME, DEFAULT_FOLDER_COLOR);
    }

    function createFolder(string memory _name, string memory _color) public {
        Folder storage newFolder = users[msg.sender].folders[folderIdCounter];
        newFolder.name = _name;
        newFolder.color = _color;
        emit FolderAdded(folderIdCounter);
        folderIdCounter++;
        users[msg.sender].folderCount++;
    }

    function updateFolder(
        uint256 folderId,
        string memory _name,
        string memory _color
    ) public folderExists(folderId) {
        Folder storage folder = users[msg.sender].folders[folderId];
        folder.name = _name;
        folder.color = _color;
        emit FolderUpdated(folderId);
    }

    function deleteFolder(uint256 folderId) public folderExists(folderId) {
        Folder storage folder = users[msg.sender].folders[folderId];
        for (uint256 i = 0; i < folder.bookmarkCount; i++) {
            emit BookmarkDeleted(folderId, i);
            delete folder.bookmarks[i];
        }
        delete users[msg.sender].folders[folderId];
        emit FolderDeleted(folderId);
    }

    function addBookmark(
        uint256 folderId,
        string memory _url
    ) public folderExists(folderId) {
        Folder storage folder = users[msg.sender].folders[folderId];
        Bookmark storage newBookmark = folder.bookmarks[folder.bookmarkCount];
        newBookmark.url = _url;
        newBookmark.folderId = folderId;
        emit BookmarkAdded(folderId, folder.bookmarkCount);
        folder.bookmarkCount++;
    }

    function updateBookmark(
        uint256 folderId,
        uint256 bookmarkIndex,
        string memory _url
    ) public folderExists(folderId) bookmarkExists(folderId, bookmarkIndex) {
        Bookmark storage bookmark = users[msg.sender]
            .folders[folderId]
            .bookmarks[bookmarkIndex];
        bookmark.url = _url;
        emit BookmarkUpdated(folderId, bookmarkIndex);
    }

    function deleteBookmark(
        uint256 folderId,
        uint256 bookmarkIndex
    ) public folderExists(folderId) bookmarkExists(folderId, bookmarkIndex) {
        Folder storage folder = users[msg.sender].folders[folderId];
        emit BookmarkDeleted(folderId, bookmarkIndex);
        delete folder.bookmarks[bookmarkIndex];
        folder.bookmarkCount--;
    }

    function moveBookmark(
        uint256 fromFolderId,
        uint256 fromBookmarkIndex,
        uint256 toFolderId
    )
        public
        folderExists(fromFolderId)
        folderExists(toFolderId)
        bookmarkExists(fromFolderId, fromBookmarkIndex)
    {
        Folder storage fromFolder = users[msg.sender].folders[fromFolderId];
        Folder storage toFolder = users[msg.sender].folders[toFolderId];

        Bookmark storage bookmarkToMove = fromFolder.bookmarks[
            fromBookmarkIndex
        ];
        delete fromFolder.bookmarks[fromBookmarkIndex];
        fromFolder.bookmarkCount--;

        Bookmark storage newBookmark = toFolder.bookmarks[
            toFolder.bookmarkCount
        ];
        newBookmark.url = bookmarkToMove.url;
        newBookmark.folderId = toFolderId;
        emit BookmarkAdded(toFolderId, toFolder.bookmarkCount);
        toFolder.bookmarkCount++;
    }

    function getBookmark(
        uint256 folderId,
        uint256 bookmarkIndex
    ) public view returns (Bookmark memory) {
        return users[msg.sender].folders[folderId].bookmarks[bookmarkIndex];
    }

    function getBookmarks(
        uint256 folderId
    ) public view returns (Bookmark[] memory) {
        Folder storage folder = users[msg.sender].folders[folderId];
        Bookmark[] memory bookmarks = new Bookmark[](folder.bookmarkCount);
        for (uint256 i = 0; i < folder.bookmarkCount; i++) {
            bookmarks[i] = folder.bookmarks[i];
        }
        return bookmarks;
    }

    function getFolder(
        uint256 folderId
    ) public view returns (string memory, string memory, uint256) {
        Folder storage folder = users[msg.sender].folders[folderId];
        return (folder.name, folder.color, folder.bookmarkCount);
    }

    function getFolderBookmarks(
        uint256 folderId
    ) public view returns (Bookmark[] memory) {
        Folder storage folder = users[msg.sender].folders[folderId];
        Bookmark[] memory bookmarks = new Bookmark[](folder.bookmarkCount);
        for (uint256 i = 0; i < folder.bookmarkCount; i++) {
            bookmarks[i] = folder.bookmarks[i];
        }
        return bookmarks;
    }

    // Custom Bookmarks

    function addCustomBookmark(
        uint256 folderId,
        string memory url,
        string memory title,
        string memory description,
        string memory pic
    ) public folderExists(folderId) {
        Folder storage folder = users[msg.sender].folders[folderId];
        Bookmark storage newBookmark = folder.bookmarks[folder.bookmarkCount];
        newBookmark.url = url;
        newBookmark.folderId = folderId;
        newBookmark.title = title;
        newBookmark.description = description;
        newBookmark.pic = pic;
        emit BookmarkAdded(folderId, folder.bookmarkCount);
        folder.bookmarkCount++;
    }

    function updateCustomBookmark(
        uint256 folderId,
        uint256 bookmarkIndex,
        string memory title,
        string memory description,
        string memory pic
    ) public folderExists(folderId) bookmarkExists(folderId, bookmarkIndex) {
        Bookmark storage bookmark = users[msg.sender]
            .folders[folderId]
            .bookmarks[bookmarkIndex];
        bookmark.title = title;
        bookmark.description = description;
        bookmark.pic = pic;
        emit BookmarkUpdated(folderId, bookmarkIndex);
    }

    function getCustomBookmark(
        uint256 folderId,
        uint256 bookmarkIndex
    )
        public
        view
        returns (
            string memory,
            uint256,
            string memory,
            string memory,
            string memory
        )
    {
        Bookmark memory bookmark = users[msg.sender]
            .folders[folderId]
            .bookmarks[bookmarkIndex];
        return (
            bookmark.url,
            bookmark.folderId,
            bookmark.title,
            bookmark.description,
            bookmark.pic
        );
    }
}
