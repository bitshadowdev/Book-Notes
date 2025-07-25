import { truncateWords } from "../lib";
import type { Note } from "../types";

export default function BookDetails({ currentNote }: { currentNote: Note }) {
  
  return (
    <section
      id="bookDetails"
      className="max-w-sm mx-auto h-full bg-[#0f172a] text-white p-4 rounded-md shadow-md"
    >
      <h1 className="text-xl font-semibold mb-2 text-center">{currentNote.title}</h1>

      <img
        src={currentNote.image as string}
        alt="Book image"
        className="h-[200px] w-[150px] border border-gray-700 p-2 mb-4 mx-auto"
      />

      <div>

        <label
          className="w-full border-gray-700 rounded-md resize-none text-sm overflow-visible"
          id="description"
        > {truncateWords(currentNote.description, 30)} </label>
      </div>

    </section>
  );
}