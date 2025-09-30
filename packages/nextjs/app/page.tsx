"use client";
import PropertyCard from "../components/PropertyCard";
import { useAllProperties } from "../hooks/useRegistry";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
    const props = useAllProperties();
  const forSale = (props || []).filter((p:any) => Number(p.forSale ?? p[5] ?? 0) === 1 || p.forSale === true);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-5xl font-bold">PropertyBlock</span>
            <span className="block text-yellow-500 font-semibold text-2xl mb-2">
              ReFi Fractionalized Real Estate Investment on Blockchain
            </span>
          </h1>

          <div className="flex flex-col p-6 justify-center items-center">
            <div className="w-full relative bg-slate-300 mb-5">
              <Image className="w-full h-2/5 object-fit" alt="banner" src="/banner.jpg" width={1000} height={400} />
            </div>

            {/**
            <h1
              className="text-2xl text-center  
                     font-semibold text-green-600"
            >
              Available Real Estate for Purchase or Rent
            </h1>
              */}
            <div className="flex flex-row">
              <Image
                alt="1"
                src={
                  "https://www.tpihomes.com.ng/wp-content/uploads/2023/08/lekki-foreshore-estate-cypress-detached-duplex-2.jpg"
                }
                width={300}
                height={300}
                className="shadow-2xl bg-red rounded-xl  
                    p-4 m-4   shadow-rose-400  
                     hover:rotate-45 duration-150  
                     ease-in-out "
              />
              <Image
                alt="2"
                src={
                  "https://media.istockphoto.com/id/1409298953/photo/real-estate-agents-shake-hands-after-the-signing-of-the-contract-agreement-is-complete.jpg?b=1&s=612x612&w=0&k=20&c=CZnxPVVMkJEuEo0wwHZALFl3kxwcc8UTHacyltADwt0="
                }
                width={300}
                height={300}
                className="shadow-2xl bg-red rounded-xl  
                     p-4 m-4 shadow-cyan-400  
                     hover:scale-125  
                     duration-150 ease-in-out "
              />
              <Image
                alt="3"
                src={"https://www.propertypro.ng/offers/wp-content/themes/reserville/images/0-main-slider/9.jpg"}
                width={300}
                height={300}
                className="shadow-2xl bg-red  
                     rounded-xl p-4 m-4  
                     shadow-green-400  
                     hover:skew-x-12  
                     duration-150 ease-in-out "
              />
              <Image
                alt="4"
                src={
                  "https://www.preleaseproperty.com/assets/images/blogs_static/fractional-owenership/Fractional-Ownership--The-new-reality-of-the-Real-Estate-Market-1.jpg"
                }
                width={300}
                height={300}
                className="shadow-2xl bg-red rounded-xl  
                     p-4 m-4 shadow-pink-400  
                     hover:skew-y-12 duration-150  
                     ease-in-out "
              />
            </div>
          </div>
        </div>

                <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <h3 className="font-semibold text-center text-2xl mb-4">Snapshot</h3>
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          
            <div className="flex flex-col bg-base-100 px-10 py-5 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Total properties:{" "}
                <p>
                  {props?.length ?? 0}
          
                </p>
              </p>
            </div>
            
            <div className="flex flex-col bg-base-100 px-10 py-5 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Verified Properties:{" "}
                <p>
                
                 { (props || []).filter((p:any)=>p.verified || p[6]).length }
             
                </p>
              </p>
            </div>
          </div>
        </div>

      <div>
        <section>
          <h2 className="text-xl font-semibold mb-3">Latest Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forSale.length === 0 ? <div className="text-gray-500">No properties currently for sale</div> : forSale.slice(0,6).map((p:any, i:number) => <PropertyCard key={i} property={p} />)}
          </div>
        </section>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row mx-20 px-10">
            <Image className="w-full h-3/5 object-cover" alt="benefit" src="/benefit.png" width={1000} height={250} />
          </div>
        </div>



      </div>
    </>
  );
};

export default Home;
