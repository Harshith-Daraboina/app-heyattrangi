import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxoiluua8',
  api_key: process.env.CLOUDINARY_API_KEY || '384556395212362',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'WAszmKXOftq5fWmK6X0XZVXUpoU',
})

export { cloudinary }

export async function uploadFileToCloudinary(
  buffer: Buffer,
  folder: string = 'attrangi',
  fileName?: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    }

    if (fileName) {
      uploadOptions.public_id = fileName
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          reject(error)
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          })
        } else {
          reject(new Error('Upload failed: No result returned'))
        }
      }
    )

    uploadStream.end(buffer)
  })
}

export async function deleteFileFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

