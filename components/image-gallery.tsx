import { useState } from "react"
import Image from "next/image"
import { DynamicSvg } from "./dynamic-svg"
import { ImageModal } from "./image-modal"

interface ImageGalleryProps {
  images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const isSvg = (image: string) => image.toLowerCase().endsWith(".svg")

  const handleImageClick = (image: string) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="h-60 relative overflow-hidden rounded-lg cursor-pointer"
            onClick={() => handleImageClick(image)}
          >
            {isSvg(image) ? (
              <DynamicSvg svg={image.startsWith("/") ? image : `/${image}`} className="w-full h-full object-contain" />
            ) : (
              <Image
                src={image.startsWith("/") ? image : `/${image}`}
                alt={`Gallery image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                className="object-contain"
              />
            )}
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImageModal
          src={selectedImage.startsWith("/") ? selectedImage : `/${selectedImage}`}
          alt="Selected gallery image"
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

