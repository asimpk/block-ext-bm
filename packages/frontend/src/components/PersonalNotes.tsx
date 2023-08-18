import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import ContentLayout from './Layouts/ContentLayout'
import HeaderLayout from './Layouts/HeaderLayout'
import MainLayout from './Layouts/MainLayout'
import { Box, Button, IconButton, MenuItem, Tooltip, Typography } from '@mui/material'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import AddFolderDialog from './AddFolderDialog';
import { AllNotesType, PersonalNotesTypes, useAppState } from '../contexts/StateConrext/StateContext';
import BookmarkFolderCard from './Cards/BookmarkFolderCard';
import { useWeb3 } from '../contexts/Web3Context/Web3Context';
import AddPersonalNoteDialog from './AddPersonalNoteDialogue';
import PersonalNoteAccord from './PersonalNoteAccord';

const PersonalNotes = () => {
  const [open, setOpen] = useState(false);
  const [openAddNote, setOpenAddNote] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState("")
  const [view, setView] = useState<"folder" | "notes" | "folder-notes">("folder")
  const [exemptedFolderId, setExemptedFolderId] = useState("")
  const [moveNoteId, setMoveNoteId] = useState("")
  const [note, setNote] = useState<{ id: string, title: string, description: string, folderId: string }>()
  const navigate = useNavigate();

  const { personalNotes } = useAppState()


  const [showBookmarkBtn, setShowBookmarkBtn] = useState<{
    id: string;
    url: string;
    folderId: string
  }>()
  const [allNotes, setAllNotes] = useState<AllNotesType>([]);

  const { createFolder, deleteFolder, updateFolder, addPersonalNote, deleteNote, moveNote, updatePersonalNote, publicAddress, Wallet, getDcryptedString } = useWeb3()

  useEffect(() => {
    if (Wallet) {
      let tempAllNotes: AllNotesType = []
      personalNotes.forEach((note: any) => {
        const { notes } = note;
        notes.length > 0 && notes.forEach((nt: any) => {
          if (nt) {
            tempAllNotes.push(nt)
          }
        })
      })
      setAllNotes(tempAllNotes)
    }
  }, [Wallet, personalNotes])

  const setFolderName = async (folderName: string) => {
    if (folderName) {
      await createFolder("personalNotes", folderName, "Add Category")
      setOpen(false)
    }
  }
  const handleAddNote = async (folderId: string, title: string, description: string) => {
    if (folderId && title && description && (!exemptedFolderId && !moveNoteId)) {
      setOpenAddNote(false)
      await addPersonalNote(folderId, title, description, "Add Note")
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (folderId) {
      await deleteFolder("personalNotes", folderId, "Delete Category")
    }
  }
  const handleUpdateFolder = async (folderId: string) => {
    if (folderId) {
      await updateFolder("personalNotes", folderId, "Update Category")
    }
  }

  const handleDeleteNote = async (folderId: string, noteId: string) => {
    if (folderId && noteId) {
      await deleteNote("personalNotes", folderId, noteId, "Delete Note")
    }
  }

  const handleMove = async (folderId: string) => {
    if (folderId && exemptedFolderId && moveNoteId) {
      setOpenAddNote(false)
      setExemptedFolderId("");
      setMoveNoteId("");
      await moveNote("personalNotes", exemptedFolderId, folderId, moveNoteId, "Change Note Category")
    }
  }

  const handleMoveNote = async (fromFolderId: string, noteId: string) => {
    setExemptedFolderId(fromFolderId);
    setMoveNoteId(noteId);
    setOpenAddNote(true)
  }

  const handleUpdate = (folderId: string, noteId: string) => {
    const folder = personalNotes.find(fld => fld.folderId === folderId);
    if (folder) {
      const note = folder.notes.find(pNote => pNote.id === noteId);
      if (note) {
        setNote(note)
        setOpenAddNote(true)
      }
    }
  }

  const handleUpdateNote = async (id: string, title: string, description: string, folderId: string) => {
    if (note && ((note.title !== title) || (note.description !== description))) {
      await updatePersonalNote(folderId, id, title, description, "Update Note");
      setNote(undefined)
      setOpenAddNote(false)
    }
  }

  const handleSelectFolder = (folderId: string) => {
    if (folderId) {
      setSelectedFolder(folderId)
      setView("folder-notes")
    }
  }

  const getFolderName = (folderId: string): string | undefined => {
    let name;
    if (folderId) {
      personalNotes.find(folder => {
        if (folder.folderId === folderId) {

          name = folder.name
        }
      })
    }
    return name
  }

  const getView = (viewType: "folder" | "notes" | "folder-notes", personalNotes: PersonalNotesTypes) => {
    switch (viewType) {
      case "folder":
        return personalNotes?.map((pNote) => {
          return <BookmarkFolderCard
            bookmarkFolder={{
              folderId: pNote.folderId,
              name: pNote.name,
              bookmarksCount: pNote?.notes?.length
            }}
            deleteFolder={handleDeleteFolder}
            selectFolder={handleSelectFolder}
            updateFolder={handleUpdateFolder} />

        })
      case "notes":
        return allNotes.map((note) => {
          return <PersonalNoteAccord
            note={note}
            showUpdateOpt={true}
            handlerUpdate={handleUpdate}
            deleteBookmark={handleDeleteNote}
            moveBookmark={handleMoveNote}
          />

        })
      case "folder-notes":
        return personalNotes?.map((pNote) => {
          if (pNote.folderId === selectedFolder) {
            const { notes } = pNote
            return notes.map((note) => {
              return <PersonalNoteAccord
                note={note}
                showUpdateOpt={true}
                handlerUpdate={handleUpdate}
                deleteBookmark={handleDeleteNote}
                moveBookmark={handleMoveNote}
              />

            });
          }
        })
      default:
        return null
    }
  }



  return (
    <MainLayout>
      <HeaderLayout>
        <Typography component="h1" variant="h5">
          Personal Notes
        </Typography>
      </HeaderLayout>
      {
        (publicAddress && Wallet) ?
          <ContentLayout>
            <div style={{ display: 'flex', width: '100%', justifyContent: "space-between", alignItems: 'center' }}>

              {selectedFolder && view === "folder-notes" ?
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => setView("folder")} sx={{ marginRight: "4px" }} size='medium'>
                    <ArrowBackIosNewOutlinedIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                  <MenuItem sx={{ minHeight: "22px", height: "max-content", padding: "4px 6px", borderRadius: "6px", marginRight: "4px", backgroundImage: view === 'folder-notes' ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` : 'none' }} >{getFolderName(selectedFolder)}</MenuItem>
                </Box> :
                <Box sx={{ display: "flex" }}>
                  <MenuItem onClick={() => setView("folder")} sx={{ minHeight: "22px", height: "max-content", padding: "4px 6px", borderRadius: "6px", marginRight: "4px", backgroundImage: view === 'folder' ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` : 'none' }} >Categories</MenuItem>
                  <MenuItem onClick={() => setView("notes")} sx={{ minHeight: "22px", height: "max-content", padding: "4px 6px", borderRadius: "6px", marginRight: "4px", backgroundImage: view === 'notes' ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` : 'none' }}>All Notes</MenuItem>
                </Box>
              }

              <Box>
                <Tooltip title={`Add Note`}>
                  <IconButton onClick={() => setOpenAddNote(true)}>
                    <NoteAltOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Add new category`}>
                  <IconButton onClick={() => setOpen(true)}>
                    <CreateNewFolderOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>

            </div>
            {

              getView(view, personalNotes)
            }
            {
              open && <AddFolderDialog handleClose={() => setOpen(false)} handleAdd={setFolderName} title={"Category"}/>
            }
            {
              openAddNote && <AddPersonalNoteDialog handleClose={() => setOpenAddNote(false)}
                handleAdd={handleAddNote} handleMove={handleMove} note={note} handleUpdate={handleUpdateNote} exemptFolderId={exemptedFolderId} handleShowFolder={() => { setOpen(true); setOpenAddNote(false) }} />
            }

          </ContentLayout> :
          <Box sx={{ display: 'flex', width: '100%', justifyContent: "center", alignItems: 'center', flexDirection: "column", height: "70%" }}>
            <Typography component="h1" variant="h6">
              Please connect Wallet to use this Feature!
            </Typography>
            <Button
              onClick={() => navigate('/')}
              variant="outlined"
              sx={{ marginTop: "26px", padding: "0", width: '60%' }}
            >
              CONNECT WALLET
            </Button>
          </Box>
      }


    </MainLayout>
  )
}

export default PersonalNotes;