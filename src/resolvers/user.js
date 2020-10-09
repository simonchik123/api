module.exports = {
    // Resolve the list of notes for a user when requested
    notes: async (user, args, { Models }) => {
    return await Models.Note.find({ author: user._id }).sort({ _id: -1 });
    },
    // Resolve the list of favorites for a user when requested
    favorites: async (user, args, { Models }) => {
    return await Models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
    }
};