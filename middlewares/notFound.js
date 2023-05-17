const notFound = (req, res, next) => {
  res.status(404).render("not-found");
};

export default notFound;
