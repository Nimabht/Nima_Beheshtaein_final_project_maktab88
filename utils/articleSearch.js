import { Article } from "../models/article.js";
import escapeRegExp from "./escapeRegExp.js";

export default (searchQuery) => {
  const escapedSearchQuery = escapeRegExp(searchQuery);
  const query = Article.find({
    $or: [
      { sketch: { $regex: escapedSearchQuery, $options: "i" } },
      { title: { $regex: escapedSearchQuery, $options: "i" } },
    ],
  })
    .populate("author", "-_id firstname lastname avatarFileName")
    .select("-views");

  return query;
};
