export const isValidMongoId = (id) => /^[a-f\d]{24}$/i.test(id);
