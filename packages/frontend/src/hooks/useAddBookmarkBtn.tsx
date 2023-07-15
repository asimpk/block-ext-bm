import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const useAddBookmarkBtn = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<{ id: number, url: string, title: string } | undefined>()
    const [showAddBookMarkBtn, setShowAddBookMarkBtn] = useState(false)
    const [bookmarks, setBookmarks] = useState<{ id: number, url: string, title: string }[]>([])


    useEffect(() => {
        async function fetchData() {
            try {
                const tabs = await chrome.tabs.query({
                    currentWindow: true,
                    active: true
                });
                return tabs[0];
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData().then(tab => {
            if (tab?.id && tab?.url && tab?.title) {
                chrome.storage.local.get({ bookmarks: [] }).then(result => {
                    const bookmarks = result.bookmarks;
                    const existingBookmark = bookmarks.find((bookmark: { id: number, url: string, title: string }) => bookmark?.url === tab.url);
                    if (existingBookmark) {
                        // Bookmark already exists
                        console.log('Bookmark already created for this tab');
                        setShowAddBookMarkBtn(false)
                        setActiveTab(undefined)
                        return;
                    } else {
                        setShowAddBookMarkBtn(true)
                        if (tab?.id && tab?.url && tab?.title) {
                            setActiveTab({ id: tab.id, url: tab.url, title: tab.title })
                        }

                    }
                })

            }
        });
    }, [])

     useEffect(() => {
        chrome.storage.local.get({ bookmarks: [] }).then(result => {
            const bookmarks = result.bookmarks;
            setBookmarks(bookmarks)
        })
    }, [activeTab])

    const resetBookMarkBtnState = () => {
        setShowAddBookMarkBtn(false)
        setActiveTab(undefined)
    }

    const addBookMark = (activtb: { id: number, url: string, title: string }) => {
        chrome.storage.local.get({ bookmarks: [] }).then(result => {
            const bookmarks = result.bookmarks;
            bookmarks.push({ ...activtb });
            chrome.storage.local.set({ bookmarks }).then(success => {
                console.log("success", bookmarks)
                setBookmarks(bookmarks)
                navigate("/")
                resetBookMarkBtnState()
            });
        })
    }

    return {showAddBookMarkBtn, activeTab, addBookMark, bookmarks}
}

export default useAddBookmarkBtn