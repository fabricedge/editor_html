import { notFound } from "next/navigation";
import Editor from "@/components/editor";
import { getPageOrNotFound, getSessionUser, canEditPage } from "@/lib/page-access";
import { parseHtmlDataValue } from "@/lib/pages";
import { MAX_CHARACTERS } from "@/lib/constants";

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
  if (!user?.id) {
    notFound();
  }

  if (!canEditPage(page, user.id)) {
    notFound();
  }

  const expiration = page.expiresAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(page.expiresAt)
    : undefined;

  return (
    <Editor
      page_value={parseHtmlDataValue(page.htmlData)}
      page_id={nanoid}
      expiration={expiration}
      server_updated_at={page.updatedAt.toISOString()}
      max_characters={MAX_CHARACTERS}
    />
  );
}
