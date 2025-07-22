import PortfolioCard from "./PortfolioCard";

const portfolioItems = [
  {
    title: "Project 1",
    description: "A description of project 1.",
    imageUrl: "https://via.placeholder.com/500x300.png?text=Project+1",
  },
  {
    title: "Project 2",
    description: "A description of project 2.",
    imageUrl: "https://via.placeholder.com/500x300.png?text=Project+2",
  },
  {
    title: "Project 3",
    description: "A description of project 3.",
    imageUrl: "https://via.placeholder.com/500x300.png?text=Project+3",
  },
  {
    title: "Project 4",
    description: "A description of project 4.",
    imageUrl: "https://via.placeholder.com/500x300.png?text=Project+4",
  },
  {
    title: "Project 5",
    description: "A description of project 5.",
    imageUrl: "https://via.placeholder.com/500x300.png?text=Project+5",
  },
  {
    title: "Project 6",
    description: "A description of project 6.",
    imageUrl: "https://via.placeholder.com/500x300.png?text=Project+6",
  },
];

export default function PortfolioGrid() {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
      {portfolioItems.map((item) => (
        <div key={item.title} className="mb-4 break-inside-avoid">
          <PortfolioCard {...item} />
        </div>
      ))}
    </div>
  );
}
