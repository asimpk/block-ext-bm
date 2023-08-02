// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CustomBookmarks {
    struct Bookmark {
        bytes32 bookmarkId;
        string url;
        string title;
    }

    struct Folder {
        bytes32 folderId;
        string name;
        bytes32 color;
    }

    mapping(address => mapping(bytes32 => Folder)) private userFolder;
    mapping(address => mapping(bytes32 => Bookmark[])) private folderBookmarks;
    mapping(address => bytes32[]) private userFolderIds;

    event BookmarkAdded(bytes32 folderId, bytes32 bookmarkId);
    event BookmarkUpdated(bytes32 folderId, bytes32 bookmarkId);
    event BookmarkDeleted(bytes32 folderId, bytes32 bookmarkId);
    event FolderAdded(bytes32 folderId);
    event FolderUpdated(bytes32 folderId);
    event FolderDeleted(bytes32 folderId);
    event BookmarkMoved(
        bytes32 fromFolderId,
        bytes32 toFolderId,
        bytes32 bookmarkId
    );

    modifier validFolder(address _sender, bytes32 folderId) {
        require(
            userFolder[_sender][folderId].folderId == folderId,
            "Folder does not exist"
        );
        _;
    }

    function isValidBookmark(
        address _sender,
        bytes32 _folderId,
        bytes32 _bookmarkId
    ) private view returns (bool) {
        if (folderBookmarks[_sender][_folderId].length != 0) {
            for (
                uint256 i = 0;
                i < folderBookmarks[_sender][_folderId].length;
                i++
            ) {
                if (
                    folderBookmarks[_sender][_folderId][i].bookmarkId ==
                    _bookmarkId
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkBookmarkExists(
        address _sender,
        bytes32 _bookmarkId
    ) private view returns (bool) {
        for (uint256 i = 0; i < userFolderIds[_sender].length; i++) {
            Bookmark[] memory bookmarks = folderBookmarks[_sender][
                userFolderIds[_sender][i]
            ];
            for (uint256 j = 0; j < bookmarks.length; j++) {
                if (bookmarks[j].bookmarkId == _bookmarkId) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkBookmarkInFolder(
        address _sender,
        bytes32 _folderId,
        bytes32 _bookmarkId
    ) private view returns (bool) {
        Bookmark[] memory bookmarks = folderBookmarks[_sender][_folderId];
        for (uint256 j = 0; j < bookmarks.length; j++) {
            if (bookmarks[j].bookmarkId == _bookmarkId) {
                return true;
            }
        }
        return false;
    }

    function addFolder(
        bytes32 _folderId,
        string memory _name,
        bytes32 _color
    ) public {
        require(msg.sender != address(0), "Invalid sender address");
        require(
            !(userFolder[msg.sender][_folderId].folderId == _folderId),
            "Folder already exists"
        );
        userFolder[msg.sender][_folderId] = Folder(_folderId, _name, _color);
        userFolderIds[msg.sender].push(_folderId);
        emit FolderAdded(_folderId);
    }

    function updateFolder(
        bytes32 _folderId,
        string memory _name,
        bytes32 _color
    ) public validFolder(msg.sender, _folderId) {
        require(msg.sender != address(0), "Invalid sender address");
        userFolder[msg.sender][_folderId] = Folder(_folderId, _name, _color);
    }

    function deleteFolder(
        bytes32 _folderId
    ) public validFolder(msg.sender, _folderId) {
        require(msg.sender != address(0), "Invalid sender address");

        delete userFolder[msg.sender][_folderId];
        delete folderBookmarks[msg.sender][_folderId];

        uint256 indexToDelete = getUserFolderIndex(msg.sender, _folderId);

        require(
            indexToDelete < userFolderIds[msg.sender].length,
            "Folder not found for the given user."
        );

        if (indexToDelete < userFolderIds[msg.sender].length - 1) {
            // Shift the elements after the target index to the left
            for (
                uint256 i = indexToDelete;
                i < userFolderIds[msg.sender].length - 1;
                i++
            ) {
                userFolderIds[msg.sender][i] = userFolderIds[msg.sender][i + 1];
            }
        }
        // Decrease the array's length to effectively remove the last element
        userFolderIds[msg.sender].pop();

        emit FolderDeleted(_folderId);
    }

    function addBookmark(
        bytes32 _folderId,
        bytes32 _bookmarkId,
        string memory _url,
        string memory _title
    ) public validFolder(msg.sender, _folderId) {
        require(msg.sender != address(0), "Invalid sender address");
        // Check if the bookmark already exists
        require(
            !checkBookmarkExists(msg.sender, _bookmarkId),
            "Bookmark already exists"
        );
        folderBookmarks[msg.sender][_folderId].push(
            Bookmark(_bookmarkId, _url, _title)
        );
        emit BookmarkAdded(_folderId, _bookmarkId);
    }

    function updateBookmark(
        bytes32 _folderId,
        bytes32 _bookmarkId,
        string memory _url,
        string memory _title
    ) public validFolder(msg.sender, _folderId) {
        require(msg.sender != address(0), "Invalid sender address");
        require(
            isValidBookmark(msg.sender, _folderId, _bookmarkId),
            "Bookmark not exist"
        );
        
        uint256 indexToUpdate = getBookmarkIndex(
            msg.sender,
            _folderId,
            _bookmarkId
        );

        require(
            indexToUpdate < folderBookmarks[msg.sender][_folderId].length,
            "Bookmark not found for the given user."
        );

        // Access the struct at the specified index
        Bookmark storage bookmarkToUpdate = folderBookmarks[msg.sender][
            _folderId
        ][indexToUpdate];
        bookmarkToUpdate.url = _url;
        bookmarkToUpdate.title = _title;
        emit BookmarkUpdated(_folderId, _bookmarkId);
    }

    function deleteBookmark(
        bytes32 _folderId,
        bytes32 _bookmarkId
    ) public validFolder(msg.sender, _folderId) {
        require(msg.sender != address(0), "Invalid sender address");
        require(
            isValidBookmark(msg.sender, _folderId, _bookmarkId),
            "Bookmark not exist"
        );

        uint256 indexToDelete = getBookmarkIndex(
            msg.sender,
            _folderId,
            _bookmarkId
        );

        require(
            indexToDelete < folderBookmarks[msg.sender][_folderId].length,
            "Bookmark not found for the given user."
        );

        // Shift bookmarks after the deleted bookmark one position up
        for (
            uint256 k = indexToDelete;
            k < folderBookmarks[msg.sender][_folderId].length - 1;
            k++
        ) {
            folderBookmarks[msg.sender][_folderId][k] = folderBookmarks[
                msg.sender
            ][_folderId][k + 1];
        }

        // Decrease the length of the array to remove the last element
        folderBookmarks[msg.sender][_folderId].pop();

        emit BookmarkDeleted(_folderId, _bookmarkId);
    }

    function moveBookmark(
        bytes32 _fromFolderId,
        bytes32 _toFolderId,
        bytes32 _bookmarkId
    )
        public
        validFolder(msg.sender, _fromFolderId)
        validFolder(msg.sender, _toFolderId)
    {
        require(msg.sender != address(0), "Invalid sender address");
        require(
            checkBookmarkInFolder(msg.sender, _fromFolderId, _bookmarkId),
            "Bookmark not exist in source folder"
        );
        require(
            !checkBookmarkInFolder(msg.sender, _toFolderId, _bookmarkId),
            "Bookmark already exist in destination folder"
        );
        uint256 bookmarkIndex = getBookmarkIndex(
            msg.sender,
            _fromFolderId,
            _bookmarkId
        );

        require(
            bookmarkIndex < folderBookmarks[msg.sender][_fromFolderId].length,
            "Folder not found for the given user."
        );

        folderBookmarks[msg.sender][_toFolderId].push(
            folderBookmarks[msg.sender][_fromFolderId][bookmarkIndex]
        );

        // Shift bookmarks after the deleted bookmark one position up
        for (
            uint256 k = bookmarkIndex;
            k < folderBookmarks[msg.sender][_fromFolderId].length - 1;
            k++
        ) {
            folderBookmarks[msg.sender][_fromFolderId][k] = folderBookmarks[
                msg.sender
            ][_fromFolderId][k + 1];
        }

        // Decrease the length of the array to remove the last element
        folderBookmarks[msg.sender][_fromFolderId].pop();

        emit BookmarkMoved(_fromFolderId, _toFolderId, _bookmarkId);
    }

    function getAllFolders() public view returns (Folder[] memory) {
        Folder[] memory folders = new Folder[](
            userFolderIds[msg.sender].length
        );
        for (uint256 i = 0; i < userFolderIds[msg.sender].length; i++) {
            folders[i] = userFolder[msg.sender][userFolderIds[msg.sender][i]];
        }
        return folders;
    }

    function getBookmarksByFolder(
        bytes32 _folderId
    ) public view returns (Bookmark[] memory) {
        if (folderBookmarks[msg.sender][_folderId].length != 0) {
            return folderBookmarks[msg.sender][_folderId];
        }
        return new Bookmark[](0);
    }

    // Helper function to get the index of a folderId in the userFolderIds array
    function getUserFolderIndex(
        address user,
        bytes32 folderId
    ) private view returns (uint256) {
        for (uint256 i = 0; i < userFolderIds[user].length; i++) {
            if (userFolderIds[user][i] == folderId) {
                return i;
            }
        }
        return userFolderIds[user].length;
    }

    function getBookmarkIndex(
        address user,
        bytes32 _folderId,
        bytes32 _bookmarkId
    ) private view returns (uint256) {
        Bookmark[] memory bookmarks = folderBookmarks[user][_folderId];
        for (uint256 i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i].bookmarkId == _bookmarkId) {
                return i;
            }
        }
        return bookmarks.length;
    }
}
