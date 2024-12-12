const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Notes = require("./models/Notes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route to create a new notes
app.post("/notes", async (req, res) => {
  // Validate required fields
  if (!req.body.notes) {
    return res.status(400).json({ message: "Notes required" });
  }

  try {
    const notes = new Notes({
      id: req.body.id,
      notes: req.body.notes,
    });
    const NotesArr = [];
    const savedNotes = await notes.save();
    NotesArr.push(notes);
    res.status(201).json(savedNotes);
  } catch (error) {
    console.error("Error creating notes:", error);
    res.status(500).json({ message: "Error creating notes", error });
  }
});

// Route to get all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Notes.find();
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Error fetching notes", error });
  }
});

// Route to Edit notes

app.post("/updateNotes", async (req, res) => {
  const reqData = req.body;

  const updatedNote = await Notes.findByIdAndUpdate(
    reqData.id,
    {
      notes: reqData.notes,
    },
    {
      new: true, 
    }
  );

  if (!updatedNote) {
    return res.status(404).json({ message: "Note not found" });
  }

  try {
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Error fetching notes", error });
  }
});

// Route to Delete notes
app.post("/deleteNotes", async (req, res) => {

  const { id } = req.body;

  if (!id) return res.status(400).send("Note ID not provided");

  try {
    const result = await Notes.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

      res.send({ message: "Note deleted successfully" });
      res.status(200);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/notes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
