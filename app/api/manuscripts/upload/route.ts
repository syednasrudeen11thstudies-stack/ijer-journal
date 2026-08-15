import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const response = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],

          maximumSizeInBytes: 20 * 1024 * 1024,

          addRandomSuffix: true,

          access: "private",
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log("IJER manuscript uploaded:", blob.pathname);
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Manuscript upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to upload manuscript.",
      },
      {
        status: 400,
      },
    );
  }
}