const productSerializer = (body: any) => {
  let ingredients: string[] = body.ingredients?.split(",");
  ingredients = ingredients?.map((ingredient) => {
    return ingredient.trim();
  });

  let images: string[] = body.images?.split(",");
  images = images?.map((image) => {
    return image.trim();
  });

  let tags: string[] = body.tags?.split(",");
  tags = tags?.map((tag) => {
    return tag.trim();
  });

  const serializedBody: any = {
    name: body.name,
    description: body.description,
    images,
    ingredients,
    category: body.category,
    isVegan: body.isVegan,
    prices: body.prices,
    extraIngredients: body.extraIngredients,
    tags,
  };

  return serializedBody;
};

export default productSerializer;
