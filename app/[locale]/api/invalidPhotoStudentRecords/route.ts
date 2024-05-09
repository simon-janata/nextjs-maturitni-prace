import { existsSync, mkdirSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolYearParam = searchParams.get("schoolYear") || "";
    const clazzNameParam = searchParams.get("clazzName")?.toUpperCase() || "";

    if (schoolYearParam === "" || clazzNameParam === "") {
      return new Response(
        JSON.stringify({
          message: "schoolYear and clazzName must be provided",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const textFilePath = join(
      process.cwd(),
      "photos",
      schoolYearParam,
      clazzNameParam,
      `${schoolYearParam}_${clazzNameParam}_InvalidPhotoStudentRecords.txt`
    );

    if (!existsSync(textFilePath)) {
      return new Response(
        JSON.stringify({
          message: `Text file not found at: ${textFilePath}`,
        }),
        {
          status: 500,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const textFile = readFileSync(textFilePath);
    const textFileBlob = new Blob([textFile], { type: "text/plain" });

    return new Response(textFileBlob, {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Internal Server Error - ${error}`,
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    if (!body.invalidPhotoStudentRecords) {
      return new Response(
        JSON.stringify({
          message: "invalidPhotoStudentRecords must be provided",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const invalidPhotoStudentRecords = body.invalidPhotoStudentRecords;

    const { searchParams } = new URL(req.url);
    const schoolYearParam = searchParams.get("schoolYear") || "";
    const clazzNameParam = searchParams.get("clazzName")?.toUpperCase() || "";

    if (schoolYearParam === "" || clazzNameParam === "") {
      return new Response(
        JSON.stringify({
          message: "schoolYear and clazzName must be provided",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const dirPath = join(
      process.cwd(),
      "photos",
      schoolYearParam,
      clazzNameParam
    );

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    const invalidPhotoStudentRecordsString = JSON.stringify(invalidPhotoStudentRecords, null, 2);

    const textFilePath = join(
      dirPath,
      `${schoolYearParam}_${clazzNameParam}_InvalidPhotoStudentRecords.txt`
    );

    await writeFile(textFilePath, invalidPhotoStudentRecordsString);

    return new Response(
      JSON.stringify({
        message: `Succcessfully uploaded file to ${textFilePath}`,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Internal Server Error - ${error}`,
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
  }
}
