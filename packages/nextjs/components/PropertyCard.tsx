import Link from "next/link";

export default function PropertyCard({ property }: { property: any }) {
  // property may be array or object depending on ABI; handle both
  const id = Number(property.id ?? property[0] ?? 0);
  const title = `Property #${id}`;
  const verified = property.verified ?? false;
  const salePrice = property.salePrice ? property.salePrice.toString() : null;

  return (
    <div className="p-4 bg-white rounded shadow flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
        <span className={`px-2 py-1 text-xs rounded ${verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {verified ? "Verified" : "Unverified"}
        </span>
      </div>
      <p className="text-sm text-gray-600 flex-1 mb-3">{property.metadataURI ?? property[6] ?? "No metadata"}</p>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{salePrice ? `${salePrice} wei` : "Not listed"}</div>
        <Link href={`/property/${id}`} className="text-indigo-600">View</Link>
      </div>
    </div>
  );
}
