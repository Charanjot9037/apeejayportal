

import Link from "next/link";
import { footerContent } from "@/constants/footer"

export default function Footer() {
  const { brand, quickLinks, legalLinks } = footerContent;

  return (
    <footer className="w-full bg-secondary text-lg  text-white">
      <div className="mx-auto w-full px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr] lg:gap-16">
          
          {/* Brand Section */}
          <div className="flex flex-col">
            <p
              className="
                text-md font-semibold tracking-wide text-white
                transition-colors duration-300
              "
            >
              {brand.name}
            </p>

            <p
              className="
                mt-3 max-w-md text-sm leading-5 text-white/65
                transition-colors duration-300
                hover:text-white/80
              "
            >
              {brand.description}
            </p>

            <p
              className="
                mt-8 text-sm leading-4 text-white/45
                transition-colors duration-300
                hover:text-white/70
              "
            >
              {brand.copyright}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p
              className="
                text-md font-medium tracking-wide text-white
              "
            >
              {quickLinks.title}
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {quickLinks.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="
                    w-fit text-sm text-white/65
                    transition-all duration-300 ease-out
                    hover:translate-x-1 hover:text-white
                    focus:outline-none focus-visible:rounded-sm
                    focus-visible:ring-2 focus-visible:ring-white/60
                  "
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <p
              className="
                text-md font-medium tracking-wide text-white
              "
            >
              {legalLinks.title}
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {legalLinks.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="
                    w-fit text-sm text-white/65
                    transition-all duration-300 ease-out
                    hover:translate-x-1 hover:text-white
                    focus:outline-none focus-visible:rounded-sm
                    focus-visible:ring-2 focus-visible:ring-white/60
                  "
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}