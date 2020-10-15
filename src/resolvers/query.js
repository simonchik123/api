const Models = require("../models");

module.exports = {
    notes: async (parent, args,{Models}) => {
        return await Models.Note.find();
    },
    note: async (parent, args,{Models}) => {
        return await Models.Note.findById(args.id);            
    },

    user: async (parent,{username},{Models}) =>{
        return await Models.User.findOne({username});
    },

    users: async (parent,args,{Models}) =>{
        return await Models.User.find();
    },

    me: async(parent,args,{Models,user}) =>{
        return await Models.User.findById(user.id);
    },
    noteFeed: async (parent, { cursor }, { Models }) => {
        // hardcode the limit to 10 items
        const limit = 10;
        // set the default hasNextPage value to false
        let hasNextPage = false;
        // if no cursor is passed the default query will be empty
        // this will pull the newest notes from the db
        let cursorQuery = {};
        // if there is a cursor
        // our query will look for notes with an ObjectId less than that of the cursor
        if (cursor) {
        cursorQuery = { _id: { $lt: cursor } };
        }
        // find the limit + 1 of notes in our db, sorted newest to oldest
        let notes = await Models.Note.find(cursorQuery).sort({ _id: -1 }).limit(limit + 1);

        // if the number of notes we find exceeds our limit
        // set hasNextPage to true and trim the notes to the limit
        if (notes.length > limit) {
            hasNextPage = true;
            notes = notes.slice(0, -1);
        }
        // the new cursor will be the Mongo object ID of the last item in the feed array
        const newCursor = notes[notes.length - 1]._id;
            return {
                notes,
                cursor: newCursor,
                hasNextPage
            };
        }
};