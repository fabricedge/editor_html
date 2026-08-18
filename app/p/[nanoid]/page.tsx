import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { getPage, getPageOwnerId, parseHtmlDataValue } from "@/lib/pages";
import { auth } from "@/lib/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ nanoid: string }>;
}) {
  const { nanoid } = await params;
  const page = await getPage(nanoid).catch(() => null);

  if (!page) {
    notFound();
  }

  if (page.private) {
    const session = await auth();
    const user = session?.user ?? null;
    const ownerId = getPageOwnerId(page);
    if (!ownerId || !user?.id || user.id !== ownerId) {
      notFound();
    }
  }

  const htmlContent = sanitizeHtml(parseHtmlDataValue(page.htmlData), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["style"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["style", "class", "id"],
    },
  });

  return (
    <div className="pt-5">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
