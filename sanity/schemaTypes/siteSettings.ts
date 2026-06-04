import { defineField, defineType } from "sanity";

/**
 * Singleton document for site-wide assets and copy.
 * Editors should not be able to create more than one — surfaced as a singleton
 * via the structure builder in sanity.config.ts.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroVideo",
      title: "Hero Video",
      type: "file",
      description:
        "Plays in the hero section as a looping background. MP4 recommended, H.264 codec, 1080p or smaller for fast first paint.",
      options: {
        accept: "video/mp4,video/webm",
      },
    }),
  ],
  // Lock the document title to a constant so the structure-builder singleton
  // doesn't surface an editable title field.
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
