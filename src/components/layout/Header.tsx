import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        Portfolio
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/portfolio">Portfolio</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
