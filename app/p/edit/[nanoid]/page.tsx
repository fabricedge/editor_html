import { notFound } from "next/navigation";
import Editor from "../../../components/editor";
import { getPage, getPageOwnerId, parseHtmlDataValue } from "../../../lib/pages";
import { MAX_CHARACTERS } from "../../../lib/constants";
import { auth } from "@/auth";

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

  const session = await auth();
  const user = session?.user ?? null;
  const ownerId = getPageOwnerId(page);
  if (ownerId && user?.id !== ownerId) {
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
