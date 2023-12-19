import Image from 'next/image';
import logopic from '/components/icons/logo.png';

export default function ShopLogo({className="w-6 h-6"}) {
    return (
        <div>
            <Image
            src={logopic}
            width={200}
            height={25}
            alt=""
            />
        </div>
      )
    }