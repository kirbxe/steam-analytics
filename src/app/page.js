import Image from "next/image";
import { Header } from "../../widjets/header";
import { DealsCatalog } from "../../widjets/dealsCatalog";
import { SearchCatalog } from "../../widjets/searchCatalog";

export default function Home() {
  return (
    <div>
      <header>
        <Header/>
      </header>
    <main className="px-20">
      <DealsCatalog />
      <SearchCatalog />
    </main>
    <footer>

    </footer>
    </div>
  );
}