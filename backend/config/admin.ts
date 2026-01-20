// Function to generate preview pathname based on content type and document
const getPreviewPathname = (
  uid: string,
  { locale, document }: { locale?: string; document: any }
): string | null => {
  const { slug } = document;

  switch (uid) {
    // Handle landing page (single type - homepage)
    case "api::landing-page.landing-page":
      return `/${locale || "lv"}`;

    // Handle pages collection
    case "api::page.page":
      if (!slug) return null;
      return `/${locale || "lv"}/${slug}`;

    // Handle blog posts
    case "api::post.post":
      if (!slug) return null;
      return `/${locale || "lv"}/blog/${slug}`;

    // Content types that don't need preview
    case "api::global.global":
    case "api::category.category":
    default:
      return null;
  }
};

export default ({ env }) => {
  const clientUrl = env("CLIENT_URL", "http://localhost:3000");
  const previewSecret = env("PREVIEW_SECRET", "preview-secret-key");

  return {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
    apiToken: {
      salt: env("API_TOKEN_SALT"),
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT"),
      },
    },
    flags: {
      nps: env.bool("FLAG_NPS", false),
      promoteEE: env.bool("FLAG_PROMOTE_EE", false),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: clientUrl,
        async handler(uid, { documentId, locale, status }) {
          // Fetch the complete document from Strapi
          const document = await strapi.documents(uid).findOne({ documentId });

          // Generate the preview pathname based on content type and document
          const pathname = getPreviewPathname(uid, { locale, document });

          // Disable preview if the pathname is not found
          if (!pathname) {
            return null;
          }

          // Use Next.js draft mode passing it a secret key and the content-type status
          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: previewSecret,
            status,
          });

          return `${clientUrl}/api/preview?${urlSearchParams}`;
        },
      },
    },
  };
};
