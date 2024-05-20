import { spawnSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolYearParam = searchParams.get("schoolYear") || "";
    const clazzNameParam = searchParams.get("clazzName")?.toUpperCase() || "";
    const studentNameParam = searchParams.get("studentName") || "";

    if (
      schoolYearParam === "" ||
      clazzNameParam === "" ||
      studentNameParam === ""
    ) {
      return new Response(
        JSON.stringify({
          message: "schoolYear, clazzName, and studentName must be provided",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const imagePath = join(
      process.cwd(),
      "photos",
      schoolYearParam,
      clazzNameParam,
      `${studentNameParam}.jpeg`
    );

    if (!existsSync(imagePath)) {
      return new Response(
        JSON.stringify({
          message: `Image not found at: ${imagePath}`,
        }),
        {
          status: 500,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const image = readFileSync(imagePath);
    const imageBase64 = `data:image/jpeg;base64,${image.toString("base64")}`;

    return new Response(JSON.stringify({ image: imageBase64 }), {
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
    const opencvDirPath = join(process.cwd(), "opencvScripts");
    const opencvScriptPath = join(opencvDirPath, "crop.py");

    if (!existsSync(opencvScriptPath)) {
      return new Response(
        JSON.stringify({
          message: `Python script not found at: ${opencvScriptPath}`,
        }),
        {
          status: 500,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const data = await req.formData();
    const photo: File | null = data.get("photo") as unknown as File;

    const minFaceHeight: string | null = data.get("minFaceHeight") as
      | string
      | null;
    const maxFaceHeight: string | null = data.get("maxFaceHeight") as
      | string
      | null;
    const minFaceWidth: string | null = data.get("minFaceWidth") as
      | string
      | null;
    const maxFaceWidth: string | null = data.get("maxFaceWidth") as
      | string
      | null;
    const minEyeHeight: string | null = data.get("minEyeHeight") as
      | string
      | null;
    const maxEyeHeight: string | null = data.get("maxEyeHeight") as
      | string
      | null;
    const minEyeWidth: string | null = data.get("minEyeWidth") as string | null;
    const maxEyeWidth: string | null = data.get("maxEyeWidth") as string | null;

    if (!photo) {
      return new Response(
        JSON.stringify({
          message: "photo must be provided",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const pythonProcess = spawnSync("python", [opencvScriptPath], {
      input: buffer,
      env: {
        ...process.env,
        MIN_FACE_HEIGHT: minFaceHeight || "",
        MAX_FACE_HEIGHT: maxFaceHeight || "",
        MIN_FACE_WIDTH: minFaceWidth || "",
        MAX_FACE_WIDTH: maxFaceWidth || "",
        MIN_EYE_HEIGHT: minEyeHeight || "",
        MAX_EYE_HEIGHT: maxEyeHeight || "",
        MIN_EYE_WIDTH: minEyeWidth || "",
        MAX_EYE_WIDTH: maxEyeWidth || "",
      },
    });

    const outputString = pythonProcess.stdout.toString("utf8").trim();
    const jsonStart = outputString.indexOf("{");
    const jsonEnd = outputString.lastIndexOf("}") + 1;
    const jsonString = outputString.substring(jsonStart, jsonEnd);
    const output = JSON.parse(jsonString);

    const croppedImageBase64 = output.photo;
    const croppedImageBuffer = Buffer.from(croppedImageBase64, "base64");
    const success = output.success;

    console.log(`The photo was successfully cropped: ${success}`);

    const { searchParams } = new URL(req.url);
    const schoolYearParam = searchParams.get("schoolYear") || "";
    const clazzNameParam = searchParams.get("clazzName")?.toUpperCase() || "";
    const studentName = searchParams.get("studentName") || "";

    if (schoolYearParam === "" || clazzNameParam === "" || studentName === "") {
      return new Response(
        JSON.stringify({
          message: "schoolYear, clazzName, and studentName must be provided",
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

    const path = join(dirPath, `${studentName}.jpeg`);
    await writeFile(path, croppedImageBuffer);

    return new Response(
      JSON.stringify({
        message: `Succcessfully uploaded file to ${path}`,
        success: success,
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

export async function DELETE(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolYearParam = searchParams.get("schoolYear") || "";
    const clazzNameParam = searchParams.get("clazzName")?.toUpperCase() || "";

    if (schoolYearParam === "") {
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

    const directoryPath = join(
      process.cwd(),
      "photos",
      schoolYearParam,
      clazzNameParam
    );

    if (!existsSync(directoryPath)) {
      return new Response(
        JSON.stringify({
          message: `Photos not found at: ${directoryPath}`,
        }),
        {
          status: 500,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    rmSync(directoryPath, { recursive: true, force: true });

    return new Response(
      JSON.stringify({
        message: `Succcessfully deleted photos at: ${directoryPath}`,
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
