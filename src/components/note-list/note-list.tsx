"use client";
import { useNotes } from "@/contexts/notes-context/notes-context";
import styles from "./note-list.module.scss";
import NoteComponent, { Note } from "@/components/note/note";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

export default function NoteList() {
  const { notes, addNote, setNotes } = useNotes();

  const [selectedNote, setSelectedNote] = useState("");

  const handleOnClick = (note: Note) => {
    if (selectedNote === note.id) {
      if (!note.completedAt) {
        note.completedAt = new Date();
      } else {
        note.completedAt = undefined;
      }
      setSelectedNote("");
    } else {
      setSelectedNote(note.id);
    }
  };
  useEffect(() => {
    const handleOnClickOutside = (event: any) => {
      //styles.note is not parent of event.target
      if (!event.target.closest(`.${styles.note}`)) {
        setSelectedNote("");
      }
    };
    document.addEventListener("click", handleOnClickOutside);
    return () => {
      document.removeEventListener("click", handleOnClickOutside);
    };
  }, []);

  return (
    <>
      <h1 className={styles.title}>Notes</h1>
      <section className={styles.notes}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const input = form.elements.namedItem("note") as HTMLInputElement;
            const text = input.value;
            addNote(text);
            input.value = "";
          }}
        >
          <input
            className={styles.input}
            name="note"
            placeholder="Write a note..."
            type="text"
          />
          <button className={styles.button} type="submit">
            Save
          </button>
        </form>
        <ReactSortable
          animation={150}
          fallbackOnBody={true}
          swapThreshold={0.65}
          className={styles.list}
          list={notes}
          setList={(state, sortable, store) => {
            if (sortable) setNotes(state);
          }}
        >
          {notes
            .filter((note) => !note.completedAt && !note.deletedAt)
            .map((note, index) => (
              <NoteComponent
                key={note.id}
                note={note}
                onClick={(note) => handleOnClick(note)}
                active={selectedNote === note.id}
                className={styles.note}
              />
            ))}
        </ReactSortable>
        <ol className={styles.list}>
          {notes
            .filter((note) => !!note.completedAt && !note.deletedAt)
            .map((note, index) => (
              <NoteComponent
                key={index}
                note={note}
                onClick={(note) => handleOnClick(note)}
                active={selectedNote === note.id}
                className={styles.note}
              />
            ))}
        </ol>
      </section>
    </>
  );
}
