//context for notes

import { Note } from "@/components/note/note";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

interface NotesContextType {
  notes: Note[];
  addNote: (text: string) => void;
  deleteNote: (note: Note) => void;
  updateNote: (note: Note, newText: string) => void;
  setNotes: (notes: Note[]) => void;
  increaseNote: (note: Note) => void;
  decreaseNote: (note: Note) => void;
}

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  addNote: () => {},
  deleteNote: () => {},
  updateNote: () => {},
  setNotes: () => {},
  increaseNote: () => {},
  decreaseNote: () => {},
});
export const NotesContextProvider = ({ children }: { children: any }) => {
  const [_notes, _setNotes] = useLocalStorage("notes", [] as Note[]);
  const [notes, setNotes] = useState([] as Note[]);
  useEffect(() => {
    setNotes(_notes);
  }, [_notes]);
  const addNote = (text: string) => {
    _setNotes([...notes, new Note(text)]);
  };
  const deleteNote = (note: Note) => {
    const newNotes = notes.filter((n) => n.uuid !== note.uuid);
    _setNotes(newNotes);
  };
  const updateNote = (note: Note, newText: string) => {
    const newNotes = notes.map((n) => {
      if (n.uuid === note.uuid) {
        n.setText(newText);
      }
      return n;
    });
    _setNotes(newNotes);
  };
  const increaseNote = (note: Note) => {
    const newNotes = notes.map((n) => {
      if (n.uuid === note.uuid) {
        n.counter++;
      }
      return n;
    });
    _setNotes(newNotes);
  };
  const decreaseNote = (note: Note) => {
    const newNotes = notes.map((n) => {
      if (n.uuid === note.uuid) {
        n.counter--;
      }
      return n;
    });
    _setNotes(newNotes);
  };
  const forceNotes = (notes: Note[]) => {
    setNotes(notes);
    _setNotes(notes);
  };
  

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        deleteNote,
        updateNote,
        setNotes: forceNotes,
        increaseNote,
        decreaseNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
export const useNotes = () => useContext(NotesContext);
