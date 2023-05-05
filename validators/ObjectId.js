import mongodb from "mongodb";

export default (id) => {
  return mongodb.ObjectId.isValid(id);
};
