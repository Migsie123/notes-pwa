"use client";
import { useNotes } from "@/contexts/notes-context/notes-context";
import styles from "./note-list.module.scss";
import NoteComponent, { Note } from "@/components/note/note";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  resetServerContext,
} from "react-beautiful-dnd";

export default function NoteList() {
  const { notes, addNote, setNotes } = useNotes();

  const [selectedNote, setSelectedNote] = useState("");

  const handleOnClick = (note: Note) => {
    if (selectedNote === note.uuid) {
      if (!note.completedAt) {
        note.completedAt = new Date();
      } else {
        note.completedAt = undefined;
      }
      setSelectedNote("");
    } else {
      setSelectedNote(note.uuid);
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

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const reorder = (list: Note[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    const items = reorder(notes, result.source.index, result.destination.index);

    setNotes(items);
  };

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
        <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
          <Droppable droppableId="tasks">
            {(provided, snapshot) => (
              <ol
                {...provided.droppableProps}
                className={styles.list}
                ref={provided.innerRef}
              >
                {notes
                  .filter((note) => !note.completedAt && !note.deletedAt)
                  .map((note, index) => (
                    <Draggable
                      key={note.uuid}
                      draggableId={note.uuid}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                        >
                          <NoteComponent
                            key={note.uuid}
                            note={note}
                            onClick={(note) => handleOnClick(note)}
                            active={selectedNote === note.uuid}
                            className={styles.note}
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ol>
            )}
          </Droppable>
        </DragDropContext>
        --------
        <ol className={styles.list}>
          {notes
            .filter((note) => !!note.completedAt && !note.deletedAt)
            .map((note, index) => (
              <NoteComponent
                key={index}
                note={note}
                onClick={(note) => handleOnClick(note)}
                active={selectedNote === note.uuid}
                className={styles.note}
              />
            ))}
        </ol>
      </section>
    </>
  );
}

export async function getServerSideProps() {
  resetServerContext();
  return {};
}
