export function parseHtmlDataValue(htmlData: string | null): string {
  if (!htmlData) {
    return "";
  }

  try {
    const data = JSON.parse(htmlData);
    return data.components?.raw_html?.value ?? "";
  } catch (error) {
    console.error("Failed to parse htmlData:", error);
    return "";
  }
}
