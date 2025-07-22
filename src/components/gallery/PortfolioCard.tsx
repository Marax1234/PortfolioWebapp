import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface PortfolioCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function PortfolioCard({ title, description, imageUrl }: PortfolioCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image src={imageUrl} alt={title} width={500} height={300} className="rounded-md" />
      </CardContent>
      <CardFooter>
        <p>{description}</p>
      </CardFooter>
    </Card>
  );
}
