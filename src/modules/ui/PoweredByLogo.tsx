import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";
interface Props {}

const PoweredByLogo: FC<Props> = (props) => {
  const {} = props;
  return (
    <Link
      href="https://www.andromedaprotocol.io/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="fixed left-2 bottom-2 max-w-fit pl-1.5 pr-3 py-1 rounded-lg bg-gray-900 flex items-center gap-2">
        <Image
          src="/logo.png"
          className="h-6 w-6"
          alt="logo"
          width={100}
          height={100}
        />
        <span className="text-sm text-white">Powered by Andromeda</span>
      </div>
    </Link>
  );
};

export default PoweredByLogo;
