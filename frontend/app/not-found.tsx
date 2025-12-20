import Image from "next/image";
import Link from "next/link";
import ClickSpark from "@/components/bits/ClickSpark";

const ELLIPSE_SRC = "/images/404/ellipse.svg";
const ICON_SRC = "/images/404/icon.svg";

export default function NotFound() {
  return (
    <main className="bg-brand-gray text-brand-dark">
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center px-4 pb-16 pt-24 sm:px-6 md:px-8 md:pb-20 md:pt-28 lg:pb-28">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-[168px] w-[168px] items-center justify-center sm:h-[188px] sm:w-[188px] lg:h-[218px] lg:w-[218px]">
            <Image
              src={ELLIPSE_SRC}
              alt=""
              fill
              sizes="218px"
              className="select-none object-contain"
              unoptimized
            />
            <Image
              src={ICON_SRC}
              alt="404 illustration"
              width={134}
              height={134}
              sizes="134px"
              className="relative h-[96px] w-[96px] sm:h-[112px] sm:w-[112px] lg:h-[134px] lg:w-[134px]"
              unoptimized
            />
          </div>

          <h1 className="mt-10 max-w-[728px] font-heading text-[32px] font-bold leading-[1.05] tracking-[-0.01em] sm:text-[40px] lg:text-[64px] lg:leading-none">
            This is “404 error” page
          </h1>

          <p className="mt-4 max-w-[720px] font-heading text-[16px] font-normal leading-[1.6] text-brand-dark/70 sm:text-[18px] lg:text-[20px] lg:leading-[1.4]">
            Unfortunately, there is no such page on the website. It has been deleted, or perhaps it never existed in the first place.
          </p>

          <ClickSpark sparkColor="#FFE4F0" sparkRadius={14} sparkCount={9} duration={220} easing="linear" className="mt-10 inline-block">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-dark px-6 font-heading text-[16px] font-bold text-white transition-transform transition-colors duration-150 hover:scale-[1.02] hover:bg-brand-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky sm:h-[50px] sm:px-7 lg:h-[53px] lg:w-[252px] lg:px-0"
            >
              Return to home page
            </Link>
          </ClickSpark>
        </div>
      </div>
    </main>
  );
}
