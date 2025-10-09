// src/utils/cloudinaryUpload.js
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dcekwruai", 
  UPLOAD_PRESET: "nhu_upload", 
  FOLDER: "companies", 
}

/**
 * Upload 1 file lên Cloudinary (Unsigned Mode)
 * @param {File} file - ảnh cần upload
 * @returns {Promise<string>} secure_url ảnh đã upload
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET)
  if (CLOUDINARY_CONFIG.FOLDER) formData.append("folder", CLOUDINARY_CONFIG.FOLDER)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    console.error("❌ Lỗi upload Cloudinary:", res.statusText)
    throw new Error("Upload failed")
  }

  const data = await res.json()
  return data.secure_url // ✅ trả về link ảnh thật
}
