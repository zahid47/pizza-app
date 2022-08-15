const productSerializer = (body: any, imgURLs: string[]) => {
  let ingredients: string[] = body.ingredients?.split(",");
  ingredients = ingredients?.map((ingredient) => {
    return ingredient.trim();
  });

  let tags: string[] = body.tags?.split(",");
  tags = tags?.map((tag) => {
    return tag.trim();
  });

  const serializedBody: any = {
    name: body.name,
    description: body.description,
    ingredients,
    category: body.category,
    isVegan: body.isVegan,
    prices: body.prices ? JSON.parse(body.prices) : undefined,
    extraIngredients: body.extraIngredients,
    tags,
  };

  if (imgURLs.length) {
    serializedBody.images = imgURLs;
  }

  return serializedBody;
};

export default productSerializer;
