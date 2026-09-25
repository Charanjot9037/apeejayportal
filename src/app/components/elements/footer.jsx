"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const res = await fetch("/api/footer");

        const data = await res.json();

        if (data.success) {
          setFooter(data.footer);
        }
      } catch (error) {
        console.error("Failed to load footer:", error);
      }
    };

    loadFooter();
  }, []);

  if (!footer) return null;

  const { brand, quickLinks, legalLinks } = footer;

  return (
    <footer className="w-full bg-secondary text-lg text-white">
      <div className="mx-auto w-full px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr] lg:gap-16">

          {/* Brand */}
          <div className="flex flex-col">
            <p className="text-md font-semibold tracking-wide text-white">
              {brand.name}
            </p>

            <p className="mt-3 max-w-md text-sm leading-5 text-white/65">
              {brand.description}
            </p>

            <p className="mt-8 text-sm leading-4 text-white/45">
              {brand.copyright}
            </p>
          </div>

          {/* Quick Links */}
          <FooterSection
            title={quickLinks.title}
            links={quickLinks.links}
          />

          {/* Legal */}
          <FooterSection
            title={legalLinks.title}
            links={legalLinks.links}
          />

        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, links }) {
  return (
    <div>
      <p className="text-md font-medium tracking-wide text-white">
        {title}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {links
          .filter((link) => link.isActive)
          .sort((a, b) => a.order - b.order)
          .map((link) => (
            <div key={link._id}>
              <Link
                href={link.href}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={
                  link.openInNewTab
                    ? "noopener noreferrer"
                    : undefined
                }
                className="
                  w-fit text-sm text-white/65
                  transition-all duration-300
                  hover:translate-x-1 hover:text-white
                "
              >
                {link.label}
              </Link>

              {link.subLinks?.length > 0 && (
                <div className="mt-2 ml-3 flex flex-col gap-2">
                  {link.subLinks
                    .filter((subLink) => subLink.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map((subLink) => (
                      <Link
                        key={subLink._id}
                        href={subLink.href}
                        target={
                          subLink.openInNewTab
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          subLink.openInNewTab
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="
                          text-xs text-white/50
                          transition-all duration-300
                          hover:translate-x-1 hover:text-white
                        "
                      >
                        {subLink.label}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}