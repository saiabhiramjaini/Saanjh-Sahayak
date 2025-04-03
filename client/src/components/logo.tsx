import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      {/* Added Link here */}
      <img src="/logo.png" className="h-12 text-teal-600 mr-2" />
      <h1 className="text-xl font-bold text-teal-600">Saanjh Sahayak</h1>
    </Link>
  );
};
