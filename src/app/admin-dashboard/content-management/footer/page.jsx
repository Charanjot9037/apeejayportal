

"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { DEPARTEMENT_FOOTER_HEADER } from "@/constants/footer";

import { DashboardHeader } from "@/app/components/elements";
import MentorRosterSkeleton from "@/app/components/admin/skeleton/mentorRosterSkeleton";
/* =========================================================
   HELPERS
========================================================= */

const getItemId = (item) => {
  return item?._id || item?.clientId;
};

/*
  Remove temporary clientId values before sending data
  to MongoDB.

  Existing MongoDB _id values are kept.
  New items don't have _id, so Mongoose will generate them.
*/
const sanitizeFooterForSave = (footer) => {
  if (!footer) return footer;

  return {
    brand: footer.brand,

    quickLinks: {
      title: footer.quickLinks?.title || "Quick Links",

      links: (footer.quickLinks?.links || []).map((link) => {
        const { clientId, ...cleanLink } = link;

        return {
          ...cleanLink,

          subLinks: (link.subLinks || []).map((subLink) => {
            const { clientId: subClientId, ...cleanSubLink } = subLink;

            return cleanSubLink;
          }),
        };
      }),
    },

    legalLinks: {
      title: footer.legalLinks?.title || "Legal",

      links: (footer.legalLinks?.links || []).map((link) => {
        const { clientId, ...cleanLink } = link;

        return cleanLink;
      }),
    },
  };
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function FooterManagementPage() {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [linkModal, setLinkModal] = useState(null);

  /* =======================================================
     FETCH FOOTER
  ======================================================= */

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/footer", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setFooter(data.footer);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch footer:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     SAVE FOOTER
  ======================================================= */

  const saveFooter = async () => {
    try {
      setSaving(true);

      const cleanFooter = sanitizeFooterForSave(footer);

      const res = await fetch("/api/footer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanFooter),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to save footer");
        return;
      }

      /*
        Replace local state with the response from MongoDB.

        This is important because newly created links now
        receive real MongoDB ObjectIds.
      */
      setFooter(data.footer);

      alert("Footer updated successfully");
    } catch (error) {
      console.error("Save footer error:", error);
      alert("Failed to save footer");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     BRAND
  ======================================================= */

  const updateBrand = (field, value) => {
    setFooter((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     SECTION TITLES
  ======================================================= */

  const updateQuickLinksTitle = (value) => {
    setFooter((prev) => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        title: value,
      },
    }));
  };

  const updateLegalLinksTitle = (value) => {
    setFooter((prev) => ({
      ...prev,
      legalLinks: {
        ...prev.legalLinks,
        title: value,
      },
    }));
  };

  /* =======================================================
     QUICK LINK - ADD
  ======================================================= */

  const addQuickLink = (link) => {
    setFooter((prev) => ({
      ...prev,

      quickLinks: {
        ...prev.quickLinks,

        links: [
          ...(prev.quickLinks?.links || []),

          {
            /*
              IMPORTANT:
              Do NOT create _id here.

              clientId is only for React/frontend.
              MongoDB will create _id after saving.
            */
            clientId: crypto.randomUUID(),

            label: link.label,
            href: link.href,

            order: (prev.quickLinks?.links?.length || 0) + 1,

            isActive: true,
            openInNewTab: false,

            subLinks: [],
          },
        ],
      },
    }));

    setLinkModal(null);
  };

  /* =======================================================
     QUICK LINK - EDIT
  ======================================================= */

  const updateQuickLink = (id, updatedLink) => {
    setFooter((prev) => ({
      ...prev,

      quickLinks: {
        ...prev.quickLinks,

        links: prev.quickLinks.links.map((link) =>
          getItemId(link) === id
            ? {
                ...link,
                ...updatedLink,
              }
            : link
        ),
      },
    }));

    setLinkModal(null);
  };

  /* =======================================================
     QUICK LINK - DELETE
  ======================================================= */

  const deleteQuickLink = (id) => {
    const confirmed = window.confirm(
      "Delete this Quick Link and all its sublinks?"
    );

    if (!confirmed) return;

    setFooter((prev) => ({
      ...prev,

      quickLinks: {
        ...prev.quickLinks,

        links: prev.quickLinks.links.filter(
          (link) => getItemId(link) !== id
        ),
      },
    }));
  };

  /* =======================================================
     SUBLINK - ADD
  ======================================================= */

  const addSubLink = (parentId, subLink) => {
    setFooter((prev) => ({
      ...prev,

      quickLinks: {
        ...prev.quickLinks,

        links: prev.quickLinks.links.map((link) => {
          if (getItemId(link) !== parentId) {
            return link;
          }

          return {
            ...link,

            subLinks: [
              ...(link.subLinks || []),

              {
                /*
                  IMPORTANT:
                  Do NOT create MongoDB _id here.
                */
                clientId: crypto.randomUUID(),

                label: subLink.label,
                href: subLink.href,

                order: (link.subLinks?.length || 0) + 1,

                isActive: true,
                openInNewTab: false,
              },
            ],
          };
        }),
      },
    }));

    setLinkModal(null);
  };

  /* =======================================================
     SUBLINK - EDIT
  ======================================================= */

  const updateSubLink = (
    parentId,
    subLinkId,
    updatedSubLink
  ) => {
    setFooter((prev) => ({
      ...prev,

      quickLinks: {
        ...prev.quickLinks,

        links: prev.quickLinks.links.map((link) => {
          if (getItemId(link) !== parentId) {
            return link;
          }

          return {
            ...link,

            subLinks: (link.subLinks || []).map((subLink) =>
              getItemId(subLink) === subLinkId
                ? {
                    ...subLink,
                    ...updatedSubLink,
                  }
                : subLink
            ),
          };
        }),
      },
    }));

    setLinkModal(null);
  };

  /* =======================================================
     SUBLINK - DELETE
  ======================================================= */

  const deleteSubLink = (parentId, subLinkId) => {
    const confirmed = window.confirm("Delete this sublink?");

    if (!confirmed) return;

    setFooter((prev) => ({
      ...prev,

      quickLinks: {
        ...prev.quickLinks,

        links: prev.quickLinks.links.map((link) => {
          if (getItemId(link) !== parentId) {
            return link;
          }

          return {
            ...link,

            subLinks: (link.subLinks || []).filter(
              (subLink) => getItemId(subLink) !== subLinkId
            ),
          };
        }),
      },
    }));
  };

  /* =======================================================
     LEGAL LINK - ADD
  ======================================================= */

  const addLegalLink = (link) => {
    setFooter((prev) => ({
      ...prev,

      legalLinks: {
        ...prev.legalLinks,

        links: [
          ...(prev.legalLinks?.links || []),

          {
            /*
              IMPORTANT:
              No MongoDB _id here.
            */
            clientId: crypto.randomUUID(),

            label: link.label,
            href: link.href,

            order: (prev.legalLinks?.links?.length || 0) + 1,

            isActive: true,
            openInNewTab: false,
          },
        ],
      },
    }));

    setLinkModal(null);
  };

  /* =======================================================
     LEGAL LINK - EDIT
  ======================================================= */

  const updateLegalLink = (id, updatedLink) => {
    setFooter((prev) => ({
      ...prev,

      legalLinks: {
        ...prev.legalLinks,

        links: prev.legalLinks.links.map((link) =>
          getItemId(link) === id
            ? {
                ...link,
                ...updatedLink,
              }
            : link
        ),
      },
    }));

    setLinkModal(null);
  };

  /* =======================================================
     LEGAL LINK - DELETE
  ======================================================= */

  const deleteLegalLink = (id) => {
    const confirmed = window.confirm(
      "Delete this legal link?"
    );

    if (!confirmed) return;

    setFooter((prev) => ({
      ...prev,

      legalLinks: {
        ...prev.legalLinks,

        links: prev.legalLinks.links.filter(
          (link) => getItemId(link) !== id
        ),
      },
    }));
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
     <MentorRosterSkeleton/>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (!footer) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">
          Failed to load footer.
        </p>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ===================================================
          HEADER
      =================================================== */}
        <DashboardHeader
              {...DEPARTEMENT_FOOTER_HEADER}
            />

      {/* ===================================================
          BRAND INFORMATION
      =================================================== */}

      <div className="mb-6 mt-3 rounded-xl border bg-white p-6">

        <h2 className="mb-5 text-lg font-semibold text-secondary">
          Brand Information
        </h2>

        <div className="space-y-5">

          {/* Institute Name */}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Institute Name
            </label>

            <input
              type="text"
              value={footer.brand?.name || ""}
              onChange={(e) =>
                updateBrand("name", e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={footer.brand?.description || ""}
              onChange={(e) =>
                updateBrand(
                  "description",
                  e.target.value
                )
              }
              rows={3}
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>

          {/* Copyright */}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Copyright
            </label>

            <input
              type="text"
              value={footer.brand?.copyright || ""}
              onChange={(e) =>
                updateBrand(
                  "copyright",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>

        </div>
      </div>

      {/* ===================================================
          QUICK LINKS
      =================================================== */}

      <div className="mb-6 rounded-xl border bg-white p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-secondary">
              Quick Links
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage footer quick links and sublinks.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setLinkModal({
                type: "addQuick",
              })
            }
            className="flex items-center gap-2 rounded-lg bg-orange-500 hover:cursor-pointer px-4 py-2 text-sm font-medium text-white"
          >
            <Plus size={16} />
            Add Link
          </button>

        </div>

        {/* Section title */}

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium">
            Section Title
          </label>

          <input
            type="text"
            value={footer.quickLinks?.title || ""}
            onChange={(e) =>
              updateQuickLinksTitle(e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>

        {/* Links */}

        <div className="space-y-3">

          {(footer.quickLinks?.links || []).map((link) => (

            <div
              key={getItemId(link)}
              className="rounded-lg border"
            >

              {/* Main Link */}

              <div className="flex items-center justify-between p-4">

                <div>
                  <p className="font-medium">
                    {link.label}
                  </p>

                  <p className="text-xs text-gray-500">
                    {link.href}
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setLinkModal({
                        type: "editQuick",
                        link,
                      })
                    }
                    className="rounded-md p-2 hover:bg-gray-100"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteQuickLink(getItemId(link))
                    }
                    className="rounded-md p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

              {/* Sublinks */}

              {link.subLinks?.length > 0 && (

                <div className="border-t bg-gray-50 px-6 py-3">

                  {link.subLinks.map((subLink) => (

                    <div
                      key={getItemId(subLink)}
                      className="flex items-center justify-between border-b py-3 last:border-0"
                    >

                      <div className="flex items-center gap-2">

                        <span className="text-gray-400">
                          └─
                        </span>

                        <div>
                          <p className="text-sm">
                            {subLink.label}
                          </p>

                          <p className="text-xs text-gray-500">
                            {subLink.href}
                          </p>
                        </div>

                      </div>

                      <div className="flex gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            setLinkModal({
                              type: "editSub",
                              parentId: getItemId(link),
                              link: subLink,
                            })
                          }
                          className="rounded-md p-2 hover:bg-gray-100"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteSubLink(
                              getItemId(link),
                              getItemId(subLink)
                            )
                          }
                          className="rounded-md p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>

                    </div>

                  ))}

                </div>
              )}

              {/* Add Sublink */}

              <div className="border-t px-4 py-3">

                <button
                  type="button"
                  onClick={() =>
                    setLinkModal({
                      type: "addSub",
                      parentId: getItemId(link),
                    })
                  }
                  className="text-sm font-medium text-orange-500 hover:cursor-pointer"
                >
                  + Add Sublink
                </button>

              </div>

            </div>

          ))}

          {(!footer.quickLinks?.links ||
            footer.quickLinks.links.length === 0) && (
            <p className="py-5 text-center text-sm text-gray-500">
              No Quick Links added yet.
            </p>
          )}

        </div>
      </div>

      {/* ===================================================
          LEGAL LINKS
      =================================================== */}

      <div className="mb-6 rounded-xl border bg-white p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-lg text-secondary font-semibold">
              Legal Links
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage legal and policy links.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setLinkModal({
                type: "addLegal",
              })
            }
            className="flex items-center gap-2 rounded-lg bg-orange-500 hover:cursor-pointer px-4 py-2 text-sm font-medium text-white"
          >
            <Plus size={16} />
            Add Link
          </button>

        </div>

        {/* Section title */}

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium">
            Section Title
          </label>

          <input
            type="text"
            value={footer.legalLinks?.title || ""}
            onChange={(e) =>
              updateLegalLinksTitle(e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>

        {/* Legal Links */}

        <div className="space-y-3">

          {(footer.legalLinks?.links || []).map((link) => (

            <div
              key={getItemId(link)}
              className="flex items-center justify-between rounded-lg border p-4"
            >

              <div>
                <p className="font-medium">
                  {link.label}
                </p>

                <p className="text-xs text-gray-500">
                  {link.href}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setLinkModal({
                      type: "editLegal",
                      link,
                    })
                  }
                  className="rounded-md p-2 hover:bg-gray-100"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteLegalLink(getItemId(link))
                  }
                  className="rounded-md p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))}

          {(!footer.legalLinks?.links ||
            footer.legalLinks.links.length === 0) && (
            <p className="py-5 text-center text-sm text-gray-500">
              No Legal Links added yet.
            </p>
          )}

        </div>
      </div>

      {/* ===================================================
          SAVE
      =================================================== */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={saveFooter}
          disabled={saving}
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Footer"}
        </button>

      </div>

      {/* ===================================================
          MODAL
      =================================================== */}

      {linkModal && (
        <LinkModal
          data={linkModal}
          onClose={() => setLinkModal(null)}
          onAddQuick={addQuickLink}
          onEditQuick={updateQuickLink}
          onAddSub={addSubLink}
          onEditSub={updateSubLink}
          onAddLegal={addLegalLink}
          onEditLegal={updateLegalLink}
        />
      )}

    </div>
  );
}

/* =========================================================
   LINK MODAL
========================================================= */

function LinkModal({
  data,
  onClose,
  onAddQuick,
  onEditQuick,
  onAddSub,
  onEditSub,
  onAddLegal,
  onEditLegal,
}) {
  const editing = data.link;

  const [label, setLabel] = useState(
    editing?.label || ""
  );

  const [href, setHref] = useState(
    editing?.href || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!label.trim() || !href.trim()) {
      return;
    }

    const values = {
      label: label.trim(),
      href: href.trim(),
    };

    switch (data.type) {

      case "addQuick":
        onAddQuick(values);
        break;

      case "editQuick":
        onEditQuick(
          getItemId(data.link),
          values
        );
        break;

      case "addSub":
        onAddSub(
          data.parentId,
          values
        );
        break;

      case "editSub":
        onEditSub(
          data.parentId,
          getItemId(data.link),
          values
        );
        break;

      case "addLegal":
        onAddLegal(values);
        break;

      case "editLegal":
        onEditLegal(
          getItemId(data.link),
          values
        );
        break;

      default:
        break;
    }
  };

  const getModalTitle = () => {
    switch (data.type) {
      case "addQuick":
        return "Add Quick Link";

      case "editQuick":
        return "Edit Quick Link";

      case "addSub":
        return "Add Sublink";

      case "editSub":
        return "Edit Sublink";

      case "addLegal":
        return "Add Legal Link";

      case "editLegal":
        return "Edit Legal Link";

      default:
        return "Link";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

        {/* Modal Header */}

        <div className="flex items-center justify-between border-b px-5 py-4">

          <h3 className="text-lg font-semibold">
            {getModalTitle()}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <X size={18} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          {/* Link Name */}

          <div>

            <label className="mb-1.5 block text-sm font-medium">
              Link Name
            </label>

            <input
              type="text"
              value={label}
              onChange={(e) =>
                setLabel(e.target.value)
              }
              placeholder="e.g. LMS"
              required
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-primary"
            />

          </div>

          {/* URL */}

          <div>

            <label className="mb-1.5 block text-sm font-medium">
              URL
            </label>

            <input
              type="text"
              value={href}
              onChange={(e) =>
                setHref(e.target.value)
              }
              placeholder="/lms or https://example.com"
              required
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-primary"
            />

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm text-white"
            >
              {editing ? "Update" : "Add"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}