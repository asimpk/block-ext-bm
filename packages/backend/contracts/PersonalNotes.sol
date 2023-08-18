// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PersonalNotes {
    struct Note {
        bytes32 noteId;
        string title;
        string description;
    }

    struct Folder {
        bytes32 folderId;
        string name;
        bytes32 color;
    }

    mapping(address => mapping(bytes32 => Folder)) private userFolder;
    mapping(address => mapping(bytes32 => Note[])) private folderNotes;
    mapping(address => bytes32[]) private userFolderIds;

    event NoteAdded(bytes32 folderId, bytes32 noteId);
    event NoteUpdated(bytes32 folderId, bytes32 noteId);
    event NoteDeleted(bytes32 folderId, bytes32 noteId);
    event FolderAdded(bytes32 folderId);
    event FolderUpdated(bytes32 folderId);
    event FolderDeleted(bytes32 folderId);
    event NoteMoved(
        bytes32 fromFolderId,
        bytes32 toFolderId,
        bytes32 noteId
    );

    modifier validFolder(address _sender, bytes32 folderId) {
        require(
            userFolder[_sender][folderId].folderId == folderId,
            "Folder does not exist"
        );
        _;
    }

    function isValidNote(
        address _sender,
        bytes32 _folderId,
        bytes32 _noteId
    ) private view returns (bool) {
        if (folderNotes[_sender][_folderId].length != 0) {
            for (
                uint256 i = 0;
                i < folderNotes[_sender][_folderId].length;
                i++
            ) {
                if (
                    folderNotes[_sender][_folderId][i].noteId ==
                    _noteId
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkNoteExists(
        address _sender,
        bytes32 _noteId
    ) private view returns (bool) {
        for (uint256 i = 0; i < userFolderIds[_sender].length; i++) {
            Note[] memory notes = folderNotes[_sender][
                userFolderIds[_sender][i]
            ];
            for (uint256 j = 0; j < notes.length; j++) {
                if (notes[j].noteId == _noteId) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkNoteInFolder(
        address _sender,
        bytes32 _folderId,
        bytes32 _noteId
    ) private view returns (bool) {
        Note[] memory notes = folderNotes[_sender][_folderId];
        for (uint256 j = 0; j < notes.length; j++) {
            if (notes[j].noteId == _noteId) {
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
        delete folderNotes[msg.sender][_folderId];

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

    function addNote(
        bytes32 _folderId,
        bytes32 _noteId,
        string memory _title,
        string memory _description
    ) public validFolder(msg.sender, _folderId) {
        require(msg.sender != address(0), "Invalid sender address");
        // Check if the note already exists
        require(
            !checkNoteExists(msg.sender, _noteId),
            "Note already exists"
        );
        folderNotes[msg.sender][_folderId].push(
            Note(_noteId,_title,_description)
        );
        emit NoteAdded(_folderId, _noteId);
    }

    function updateNote(
        bytes32 _folderId,
        bytes32 _noteId,
        string memory _title,
        string memory _description
    ) public validFolder(msg.sender, _folderId) {
        require(msg.sender != address(0), "Invalid sender address");
        require(
            isValidNote(msg.sender, _folderId, _noteId),
            "Note not exist"
        );
        
        uint256 indexToUpdate = getNoteIndex(
            msg.sender,
            _folderId,
            _noteId
        );

        require(
            indexToUpdate < folderNotes[msg.sender][_folderId].length,
            "Note not found for the given user."
        );

        // Access the struct at the specified index
        Note storage noteToUpdate = folderNotes[msg.sender][
            _folderId
        ][indexToUpdate];
        noteToUpdate.title = _title;
        noteToUpdate.description = _description;
        emit NoteUpdated(_folderId, _noteId);
    }

    function deleteNote(
        bytes32 _folderId,
        bytes32 _noteId
    ) public validFolder(msg.sender, _folderId) {
        require(msg.sender != address(0), "Invalid sender address");
        require(
            isValidNote(msg.sender, _folderId, _noteId),
            "Note not exist"
        );

        uint256 indexToDelete = getNoteIndex(
            msg.sender,
            _folderId,
            _noteId
        );

        require(
            indexToDelete < folderNotes[msg.sender][_folderId].length,
            "Note not found for the given user."
        );

        // Shift notes after the deleted note one position up
        for (
            uint256 k = indexToDelete;
            k < folderNotes[msg.sender][_folderId].length - 1;
            k++
        ) {
            folderNotes[msg.sender][_folderId][k] = folderNotes[
                msg.sender
            ][_folderId][k + 1];
        }

        // Decrease the length of the array to remove the last element
        folderNotes[msg.sender][_folderId].pop();

        emit NoteDeleted(_folderId, _noteId);
    }

    function moveNote(
        bytes32 _fromFolderId,
        bytes32 _toFolderId,
        bytes32 _noteId
    )
        public
        validFolder(msg.sender, _fromFolderId)
        validFolder(msg.sender, _toFolderId)
    {
        require(msg.sender != address(0), "Invalid sender address");
        require(
            checkNoteInFolder(msg.sender, _fromFolderId, _noteId),
            "Note not exist in source folder"
        );
        require(
            !checkNoteInFolder(msg.sender, _toFolderId, _noteId),
            "Note already exist in destination folder"
        );
        uint256 noteIndex = getNoteIndex(
            msg.sender,
            _fromFolderId,
            _noteId
        );

        require(
            noteIndex < folderNotes[msg.sender][_fromFolderId].length,
            "Folder not found for the given user."
        );

        folderNotes[msg.sender][_toFolderId].push(
            folderNotes[msg.sender][_fromFolderId][noteIndex]
        );

        // Shift notes after the deleted note one position up
        for (
            uint256 k = noteIndex;
            k < folderNotes[msg.sender][_fromFolderId].length - 1;
            k++
        ) {
            folderNotes[msg.sender][_fromFolderId][k] = folderNotes[
                msg.sender
            ][_fromFolderId][k + 1];
        }

        // Decrease the length of the array to remove the last element
        folderNotes[msg.sender][_fromFolderId].pop();

        emit NoteMoved(_fromFolderId, _toFolderId, _noteId);
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

    function getNotesByFolder(
        bytes32 _folderId
    ) public view returns (Note[] memory) {
        if (folderNotes[msg.sender][_folderId].length != 0) {
            return folderNotes[msg.sender][_folderId];
        }
        return new Note[](0);
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

    function getNoteIndex(
        address user,
        bytes32 _folderId,
        bytes32 _noteId
    ) private view returns (uint256) {
        Note[] memory notes = folderNotes[user][_folderId];
        for (uint256 i = 0; i < notes.length; i++) {
            if (notes[i].noteId == _noteId) {
                return i;
            }
        }
        return notes.length;
    }
}
