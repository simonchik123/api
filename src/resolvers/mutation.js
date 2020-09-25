module.exports = {
    newNote: async (parent, args,{Models}) => {
        return await Models.Note.create({
            content: args.content,
            author: 'simonchik'
        });
    },
    updateNote: async (parent, {content,id}, {Models}) => {
        return await Models.Note.findOneAndUpdate({
            _id: id,
        }, {
            $set: {
                content
            }
        }, {
            new: true
        });
    },
    deleteNote: async (parent, {id}, {Models}) => {
        try {
            await Models.Note.findOneAndRemove({
                _id: id
            });
            return true;
        } catch (err) {
            return false;
        }
    }
};