import { notFound } from "next/navigation";
import { getPageOrNotFound, getSessionUser, canViewPage } from "@/lib/page-access";
import { parseHtmlDataValue } from "@/lib/pages";
import { sanitizePageHtml } from "@/lib/sanitize";

export default async function Page({
  params,
}: {
  params: Promise<{ nanoid: string }>;
}) {
  const { nanoid } = await params;
  const page = await getPageOrNotFound(nanoid).catch(() => null);

  if (!page) {
    notFound();
  }

  const user = await getSessionUser();
  if (!canViewPage(page, user?.id ?? null)) {
    notFound();
  }

  const htmlContent = sanitizePageHtml(parseHtmlDataValue(page.htmlData));

  return (
    <div className="pt-5">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
