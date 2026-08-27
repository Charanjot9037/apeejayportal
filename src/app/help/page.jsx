"use client";

import {
  BookOpen,
  FolderKanban,
  GraduationCap,
  Users,
  Settings,
  CircleHelp,
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ArrowRight,
  Headphones,
} from "lucide-react";

const helpCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of using the AppEJay Project Portal.",
    icon: BookOpen,
  },
  {
    title: "Projects",
    description: "Create, upload, manage and track your projects.",
    icon: FolderKanban,
  },
  {
    title: "Students",
    description: "Manage student profiles and academic information.",
    icon: GraduationCap,
  },
  {
    title: "Mentors",
    description: "Review projects and manage your assigned students.",
    icon: Users,
  },
  {
    title: "Account & Settings",
    description: "Manage your profile and account settings.",
    icon: Settings,
  },
  {
    title: "FAQs",
    description: "Find answers to frequently asked questions.",
    icon: CircleHelp,
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen w-full bg-slate-100 text-primary">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white"></header>

      {/* Main */}
      <main className="w-full border px-6 py-8 lg:px-8">
        {/* Page heading */}
        <section className="p-2 flex flex-col gap-2">
          <div className="flex gap-2">
            <img
              src="/logo.png"
              alt="AppEJay Project Portal"
              className="h-12 w-auto rounded-full object-contain"
            />
            <h1 className="text-[30px] font-bold tracking-tight text-[#123b63]">
              Help Center
            </h1>
          </div>

          <div className="h-[3px] w-10 bg-[#f97822]" />

          <p className=" text-[15px] text-[#58718c]">
            Get assistance with the AppEJay Project Portal, project submissions,
            mentoring and account management.
          </p>
        </section>

        {/* Search */}

        {/* Content */}
        <div className="">
          {/* Help Topics */}

          {/* Contact Person */}
          <aside>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Card heading */}
              <div className="border-b border-gray-200 bg-primary-orange px-6 py-5">
                <div className="flex items-center gap-3 rounded-full text-white">
                  <div>
                    <h2 className="font-bold">Need Help?</h2>

                    <p className="text-xs text-blue-100">
                      Contact support personnel
                    </p>
                  </div>
                </div>
              </div>

              {/* Person */}
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/santosh.jpg"
                    alt="Santosh"
                    className="h-30 w-30 rounded-full border-2  object-cover"
                  />

                  <div>
                    <h3 className="text-lg font-bold text-[#123b63]">
                      Dr. Santosh Mishra
                    </h3>

                    <p className="mt-1 text-sm font-medium text-[#f97822]">
                      System Engineer,AIMETC
                    </p>
                  </div>
                </div>

                <div className="my-6 border-t border-gray-100" />

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#fff1e8] text-[#f97822]">
                    <Mail className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Email</p>

                    <p className="text-sm font-medium text-gray-700">
                      santosh@gmail.com
                    </p>
                  </div>
                </div>

                {/* Mobile */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#fff1e8] text-[#f97822]">
                    <Phone className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Mobile Number</p>

                    <p className="text-sm font-medium text-gray-700">
                      +91 XXXXX XXXXX
                    </p>
                  </div>
                </div>

                {/* Designation */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#fff1e8] text-[#f97822]">
                    <Briefcase className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Designation</p>

                    <p className="text-sm font-medium text-gray-700">
                      System Engineer
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#fff1e8] text-[#f97822]">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Location</p>

                    <p className="text-sm font-medium text-gray-700">
                      Visit the Computer Lab and contact Santosh, System
                      Engineer, for further assistance with the portal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
