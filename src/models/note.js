// Require the mongoose library
const mongoose = require('mongoose');
const { User } = require('.');

// Define the note's database schema
const noteSchema = new mongoose.Schema(
    {
        content:{
            type: String,
            required: true
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        
    },
    {
        // Временные метки (создано,обновлено)
        timestamps: true
    });

// Define the 'Note' model with the schema
const Note = mongoose.model('Note', noteSchema);

// Export the module
module.exports = Note;