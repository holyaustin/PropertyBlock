"use client";

import PropertyCard from "../components/PropertyCard";
import { useAllProperties } from "../hooks/useRegistry";
import Image from "next/image";
import Link from "next/link";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const props = useAllProperties();
  const forSale = (props || []).filter(
    (p: any) => Number(p.forSale ?? p[5] ?? 0) === 1 || p.forSale === true
  );

  return (
    <div className="flex flex-col items-center">
      <div className="px-5 pt-10 text-center">
        <h1>
          <span className="block text-5xl font-bold">PropertyBlock</span>
          <span className="block text-yellow-500 font-semibold text-2xl mb-2">
            Fractionalized Real Estate Investment on Blockchain
          </span>
        </h1>

        <div className="w-full relative my-6">
          <Image alt="banner" src="/banner.jpg" width={1000} height={400} />
        </div>
      </div>

      <aside className="bg-white p-4 rounded shadow my-6">
        <h3 className="font-semibold">Snapshot</h3>
        <p>Total properties: {props?.length ?? 0}</p>
        <p>
          Verified: {(props || []).filter((p: any) => p.verified || p[6]).length}
        </p>
      </aside>

      <section className="w-full px-6">
        <h2 className="text-xl font-semibold mb-3">Latest Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forSale.length === 0 ? (
            <div className="text-gray-500">No properties currently for sale</div>
          ) : (
            forSale.slice(0, 6).map((p: any, i: number) => (
              <PropertyCard key={i} property={p} />
            ))
          )}
        </div>
      </section>

      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12 flex flex-col sm:flex-row gap-12 justify-center">
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
          <BugAntIcon className="h-8 w-8 fill-secondary" />
          <p>
            Debug contracts in{" "}
            <Link href="/debug" className="link">
              Debug Console
            </Link>
          </p>
        </div>
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
          <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
          <p>
            Explore transactions in{" "}
            <Link href="/blockexplorer" className="link">
              Block Explorer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
