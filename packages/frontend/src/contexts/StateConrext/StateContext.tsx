// import { Wallet, ethers } from "ethers";
// import { createContext, useContext } from "react";

// export type TabBookmarksTypes = { folderId: string, name: string, color: string, bookmarks: { id: string, url: string, folderId: string }[] }[]
// export type AllBookmarksTypes = { id: string, url: string, folderId: string }[]

// type StateContextType = {
//   tabBookmarks: TabBookmarksTypes
// };

// export const StateContext = createContext<StateContextType | null>(null);

// export const useAppState = (): StateContextType => {
//   const context: StateContextType | null = useContext(StateContext);
//   if (context === null) {
//     throw new Error("You must add a <Staterovider> into the React tree");
//   }
//   return context;
// };

import { Wallet, ethers } from "ethers";
import { createContext, useContext } from "react";

export type TabBookmarksTypes = { folderId: string, name: string, color: string, bookmarks: { id: string, url: string, folderId: string }[] }[]
export type CustomBookmarksTypes = { folderId: string, name: string, color: string, bookmarks: { id: string, url: string, title: string, folderId: string }[] }[]
export type PersonalNotesTypes = { folderId: string, name: string, color: string, notes: { id: string, title: string, description: string, folderId: string }[] }[]
export type AllBookmarksTypes = { id: string, url: string, folderId: string }[]
export type AllNotesType = { id: string, title: string, description: string, folderId: string }[]

type StateContextType = {
  tabBookmarks: TabBookmarksTypes,
  customBookmarks: CustomBookmarksTypes,
  personalNotes: PersonalNotesTypes

};

export const StateContext = createContext<StateContextType | null>(null);

export const useAppState = (): StateContextType => {
  const context: StateContextType | null = useContext(StateContext);
  if (context === null) {
    throw new Error("You must add a <Staterovider> into the React tree");
  }
  return context;
};

