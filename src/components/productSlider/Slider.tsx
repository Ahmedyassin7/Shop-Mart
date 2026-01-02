"use client";

import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";

export default function Slider({
  imageUrls,
  altText,
}: {
  imageUrls: string[];
  altText: string;
}) {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 1500,
        }),
      ]}
      opts={{ loop: true }}
      className="w-full"
    >
      <CarouselContent>
        {imageUrls.map((imageUrl, idx) => (
          <CarouselItem key={idx} className="flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={altText}
              width={600}
              height={600}
              className="w-full h-full object-contain"
              priority={idx === 0}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
