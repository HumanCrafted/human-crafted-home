import Image from "next/image"

interface ImageGalleryProps {
  images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Gallery</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={image.startsWith("/") ? image : `/${image}`}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

