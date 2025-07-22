import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { PortfolioItem } from "./PortfolioGrid"

interface PortfolioCardProps {
  item: PortfolioItem
  onClick: () => void
}

export function PortfolioCard({ item, onClick }: PortfolioCardProps) {
  return (
    <Card 
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1" 
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
          <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur-sm inline-block">
              {item.category}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}