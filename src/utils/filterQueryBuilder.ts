export const filterQueryBuilder = (data: any) => {
  const name: string = data.query || data.q || data.name;
  const isVegan: string = data.isVegan?.toString();
  const category: boolean = data.category;

  // let minPrice = data.minPrice;
  // if (minPrice) minPrice = parseFloat(minPrice);

  // let maxPrice = data.maxPrice;
  // if (maxPrice) maxPrice = parseFloat(maxPrice);

  //building the query
  let query = {};

  if (isVegan) query = { ...query, isVegan };
  if (category) query = { ...query, category };

  // if (minPrice || maxPrice) {
  //   query = {
  //     ...query,
  //     Price: { $gte: minPrice || 0, $lte: maxPrice || 99999 },
  //   };
  // }

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
