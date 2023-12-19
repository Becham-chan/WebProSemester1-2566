import Link from "next/link";
import ShopLogo from "@/components/icons/ShopLogo";


export default function Logo() {
  return (
    <Link href={'/'} className="flex gap-1">
      <span className="">
          <ShopLogo/>
        </span>
    </Link>
  );
}