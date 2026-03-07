'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export default function ProductImageGallery({ 
  images, 
  title 
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  
  return (
    <div className="w-full">
      <div className="relative w-full aspect-square md:aspect-4/3 lg:aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
        <Image
          src={selectedImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority
          key={selectedImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
        />
      </div>
      
      {images && images.length > 1 && (
        <div className="mt-4">
          <div className="grid grid-cols-5 gap-2 md:grid-cols-5 lg:grid-cols-5 md:gap-3">
            {images.map((img: string, idx: number) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                  selectedImage === img 
                    ? 'border-cyan-500 ring-2 ring-cyan-500 ring-offset-2' 
                    : 'border-transparent hover:border-cyan-500 hover:ring-1 hover:ring-cyan-500'
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} image ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  sizes="(max-width: 768px) 20vw, 10vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

