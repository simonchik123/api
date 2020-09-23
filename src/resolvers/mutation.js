module.exports = {
    newNote: async (parent, args,{Models}) => {
        return await Models.Note.create({
            content: args.content,
            author: 'simonchik'
        });
    }
};