export const filterQueryBuilder = (data: any) => {
  const name: string = data.query || data.q || data.name;
  const isVegan: string = data.isVegan?.toString();
  const category: boolean = data.category;

  //building the query
  let query = {};

  if (isVegan) query = { ...query, isVegan };
  if (category) query = { ...query, category };

  if (name) {
    query = {
      ...query,
      $or: [
        { name: { $regex: name, $options: "ie" } },
        { description: { $regex: name, $options: "ie" } },
      ],
    };
  }

  return query;
};
