import cloudinary from "../config/cloudinary.js";

export const uploadImage = (buffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: getOptimizedUrl(result.public_id),
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

export const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

const getOptimizedUrl = (publicId, width = 600) => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width,
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
};
