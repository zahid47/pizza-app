import cloudinary from "cloudinary";

export const cloudinaryUpload = async (imagePath: string) => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      imagePath,
      {
        public_id: `${Date.now()}`,
        width: 500,
        height: 500,
        crop: "fill",
      },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result?.url);
      }
    );
  });
};

export const getCloudinaryURLs = async (files: any[]) => {
  const imgURLs = [];
  for (const file of files) {
    const { path } = file;
    const url = await cloudinaryUpload(path);
    imgURLs.push(url);
  }

  return imgURLs;
};
