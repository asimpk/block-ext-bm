// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct PersonalNote {
    uint256 folderId;
    string note;
}

contract PersonalNotes {
    struct Folder {
        string name;
        string color;
    }

    mapping(address => mapping(uint256 => Folder)) private userFolders;
    mapping(address => mapping(uint256 => PersonalNote)) private folderNotes;
    mapping(address => uint256) private folderCount;

    uint256 private constant DEFAULT_FOLDER_ID = 0;
    string private constant DEFAULT_FOLDER_NAME = "Default Folder";
    string private constant DEFAULT_FOLDER_COLOR = "#000000";

    event NoteAdded(address user, uint256 folderId);
    event NoteUpdated(address user, uint256 folderId);
    event NoteDeleted(address user, uint256 folderId);
    event FolderAdded(address user, uint256 folderId);
    event FolderUpdated(address user, uint256 folderId);
    event FolderDeleted(address user, uint256 folderId);

    // Modifier to check if the folder belongs to the user
    modifier folderExists(address user, uint256 folderId) {
        require(folderId < folderCount[user], "Folder does not exist");
        _;
    }

    // Modifier to check if the note belongs to the folder
    modifier noteExists(address user, uint256 folderId) {
        require(folderNotes[user][folderId].folderId == folderId, "Note does not exist");
        _;
    }

    constructor() {
        createFolder(msg.sender, DEFAULT_FOLDER_NAME, DEFAULT_FOLDER_COLOR);
    }

    function createFolder(address user, string memory name, string memory color) public {
        Folder storage newFolder = userFolders[user][folderCount[user]];
        newFolder.name = name;
        newFolder.color = color;
        emit FolderAdded(user, folderCount[user]);
        folderCount[user]++;
    }

    function updateFolder(address user, uint256 folderId, string memory name, string memory color)
        public
        folderExists(user, folderId)
    {
        Folder storage folder = userFolders[user][folderId];
        folder.name = name;
        folder.color = color;
        emit FolderUpdated(user, folderId);
    }

    function deleteFolder(address user, uint256 folderId) public folderExists(user, folderId) {
        delete userFolders[user][folderId];
        delete folderNotes[user][folderId];
        emit FolderDeleted(user, folderId);
    }

    function addNote(address user, uint256 folderId, string memory note) public folderExists(user, folderId) {
        folderNotes[user][folderId] = PersonalNote(folderId, note);
        emit NoteAdded(user, folderId);
    }

    function updateNote(
        address user,
        uint256 folderId,
        string memory note
    ) public folderExists(user, folderId) noteExists(user, folderId) {
        folderNotes[user][folderId].note = note;
        emit NoteUpdated(user, folderId);
    }

    function deleteNote(address user, uint256 folderId) public folderExists(user, folderId) {
        delete folderNotes[user][folderId];
        emit NoteDeleted(user, folderId);
    }

    function getNote(address user, uint256 folderId) public view returns (PersonalNote memory) {
        return folderNotes[user][folderId];
    }

    function getNotes(address user, uint256 folderId) public view returns (PersonalNote[] memory) {
        PersonalNote[] memory notes = new PersonalNote[](1);
        notes[0] = folderNotes[user][folderId];
        return notes;
    }

    function getFolder(address user, uint256 folderId) public view returns (Folder memory) {
        return userFolders[user][folderId];
    }

    function getDefaultFolder(address user) public view returns (Folder memory) {
        return userFolders[user][DEFAULT_FOLDER_ID];
    }
}
