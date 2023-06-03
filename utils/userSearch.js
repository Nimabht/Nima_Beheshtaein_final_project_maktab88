import { User } from "../models/user.js";
import escapeRegExp from "./escapeRegExp.js";

export default (searchQuery) => {
  const escapedSearchQuery = escapeRegExp(searchQuery);
  const query = User.find({
    $or: [
      { firstname: { $regex: escapedSearchQuery, $options: "i" } },
      { lastname: { $regex: escapedSearchQuery, $options: "i" } },
      { username: { $regex: escapedSearchQuery, $options: "i" } },
    ],
  }).select("-__v -password");

  return query;
};
