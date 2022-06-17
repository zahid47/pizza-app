//FIXME incomplete maybe

const bodySerializer = (body: any) => {
  let ingredients: string[] = body.ingredients?.split(",");
  ingredients = ingredients?.map((ingredient) => {
    return ingredient.trim();
  });

  let images: string[] = body.images?.split(",");
  images = images?.map((image) => {
    return image.trim();
  });

  let optionsAvailable: string[] = body.optionsAvailable?.split(",");
  optionsAvailable = optionsAvailable?.map((option) => {
    return option.trim();
  });

  let prices: string[] = body.prices?.split(",");
  prices = prices?.map((price) => {
    return price.trim();
  });

  let extraIngredients: string[] = body.extraIngredients?.split(",");
  extraIngredients = extraIngredients?.map((extraIngredient) => {
    return extraIngredient.trim();
  });

  let tags: string[] = body.tags?.split(",");
  tags = tags?.map((tag) => {
    return tag.trim();
  });

  interface serializedBodyType {
    name: string;
    description?: string;
    images?: string[];
    ingredients?: string[];
    category?: string;
    type?: string;
    isVegan?: boolean;
    optionsAvailable?: string[];
    prices: any[];
    extraIngredients?: any[];
    tags?: string[];
  }

  const serializedBody: Partial<serializedBodyType> = {
    name: body.name,
    description: body.description,
    images,
    ingredients,
    category: body.category,
    type: body.type,
    isVegan: body.isVegan,
    optionsAvailable,
    prices,
    extraIngredients,
    tags,
  };

  return serializedBody;
};

export default bodySerializer;
