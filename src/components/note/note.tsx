import { useNotes } from "@/contexts/notes-context/notes-context";
import styles from "./note.module.scss";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import { motion } from "framer-motion";
import Checkmark from "@/resources/checkmark";

export class Note {
  text: string;
  uuid: string;
  counter: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  completedAt?: Date;

  constructor(text: string) {
    this.text = text;
    this.uuid = uuidv4();
    this.counter = 1;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  setText(text: string) {
    this.text = text;
    this.updatedAt = new Date();
  }
}

export default function NoteComponent({
  note,
  onClick,
  active = false,
  className,
}: {
  note: Note;
  active: boolean;
  onClick?: (note: Note) => void;
  className?: string;
}) {
  //refresh the component after update
  const { increaseNote, decreaseNote } = useNotes();
  const handleMinus = () => {
    decreaseNote(note);
  };
  const handlePlus = () => {
    increaseNote(note);
  };
  const handleOnClick = () => {
    if (onClick) onClick(note);
  };

  console.log("class", className);

  return (
    <div
      className={classNames(styles.note, className, {
        [styles.active]: active,
      })}
    >
      <motion.button
        className={styles.text}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOnClick}
      >
        <span>{note.text}</span>
        <div className={styles.complete}>
          <Checkmark />
        </div>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={styles.minus}
        onClick={() => handleMinus()}
      >
        <span>-</span>
      </motion.button>
      <div className={styles.counter}>
        <span>{note.counter}</span>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={styles.plus}
        onClick={() => handlePlus()}
      >
        <span>+</span>
      </motion.button>
    </div>
  );
}
