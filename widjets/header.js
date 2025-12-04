import { Link } from "../Shared/ui";
import Image from "next/image";
    const link = [

        {link:'#catalogDeals', content: 'Каталог скидок'},
        {link:'#searchCatalog', content: 'Поиск игр'}
    ];

export const Header = () => {

   return <div className=" bg-[#171D25] flex w-full gap-5 px-5 p-2 items-center ">
        <div className="text-white text-2xl">
            <Image 
            src="/steamAnalytics.png"
            alt="steamAnalytics"
            width={64}
            height={64}
            />
        </div>
            <nav className="flex gap-5 border p-1 rounded-lg"> 
               {link.map((item, i ) => {
                   return <Link key={i} link={item.link}>{item.content}</Link>
               })}
            </nav>
    </div>

};
