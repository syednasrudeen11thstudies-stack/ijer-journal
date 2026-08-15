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
          ],

          maximumSizeInBytes: 30 * 1024 * 1024,

          addRandomSuffix: true,

          access: "private",
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log(
          "Published article PDF uploaded:",
          blob.pathname,
        );
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "Published PDF upload failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to upload published PDF.",
      },
      {
        status: 400,
      },
    );
  }
}