"use client";
import NoteList from "@/components/note-list/note-list";
import styles from "./page.module.scss";
import { NotesContextProvider } from "@/contexts/notes-context/notes-context";

export default function Home() {
  return (
    <main className={styles.main}>
      <NotesContextProvider>
        <NoteList />
      </NotesContextProvider>
    </main>
  );
}
