module.exports = {
    notes: async ({Models}) => {
        return await Models.Note.find();
    },
    note: async (parent, args,{Models}) => {
        return await Models.Note.findById(args.id);            
    }
};