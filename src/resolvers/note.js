module.exports = {
    // Resolve the author info for a note when requested
    author: async (note, args, { Models }) => {
      return await Models.User.findById(note.author);
    },
   /*  // Resolved the favoritedBy info for a note when requested
    favoritedBy: async (note, args, { Models }) => {
      return await Models.User.find({ _id: { $in: note.favoritedBy } });
    } */
  };