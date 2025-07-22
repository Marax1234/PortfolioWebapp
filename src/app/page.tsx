import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to My Portfolio</h1>
      <p className="text-lg mb-8">
        I build beautiful and responsive web applications.
      </p>
      <Link href="/portfolio">
        <Button>View My Work</Button>
      </Link>
    </section>
  );
}
