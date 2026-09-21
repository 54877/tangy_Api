import sanitizeHtml from "sanitize-html";

const MAX_IMAGE_DATA_URL_LENGTH = 7_000_000;

//驗證color
const isSafeColor = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

//驗證url
const isSafeImageUrl = (value: string) => {
  try {
    const url = new URL(value, "https://tangy.local");
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

//允許的照片型別
const isSafeImageDataUrl = (value: string) =>
  /^data:image\/(jpg|jpeg|webp);base64,[a-z0-9+/=\s]+$/i.test(value) &&
  value.length <= MAX_IMAGE_DATA_URL_LENGTH;

const isSafeImageSource = (value: string) =>
  isSafeImageUrl(value) || isSafeImageDataUrl(value);

export const sanitizeCourseContent = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "div",
      "h2",
      "h3",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "font",
      "img",
    ],
    allowedAttributes: {
      font: ["color"],
      img: ["src", "alt", "width"],
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {
      img: ["data"],
    },
    allowProtocolRelative: true,
    nonTextTags: [
      "script",
      "style",
      "iframe",
      "object",
      "embed",
      "svg",
      "math",
      "template",
    ],
    transformTags: {
      font: (_tagName, attribs) => {
        const color = attribs.color ?? "";
        const sanitizedAttribs: Record<string, string> = {};
        if (isSafeColor(color)) sanitizedAttribs.color = color;

        return {
          tagName: "font",
          attribs: sanitizedAttribs,
        };
      },
      img: (_tagName, attribs) => {
        const src = attribs.src ?? "";
        const width = attribs.width ?? "";
        const sanitizedAttribs: Record<string, string> = {};

        if (isSafeImageSource(src)) sanitizedAttribs.src = src;
        if (attribs.alt) sanitizedAttribs.alt = attribs.alt;
        if (/^\d{1,4}$/.test(width) && Number(width) <= 2000) {
          sanitizedAttribs.width = width;
        }

        return {
          tagName: "img",
          attribs: sanitizedAttribs,
        };
      },
    },
    exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  });
