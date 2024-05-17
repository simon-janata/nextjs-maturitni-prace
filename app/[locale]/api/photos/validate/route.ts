import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

export async function POST(req: Request, res: Response) {
  try {
    const opencvDirPath = join(process.cwd(), "opencvScripts");
    const opencvScriptPath = join(
      opencvDirPath,
      "validate.py"
    );

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

    const minFaceHeight: string | null = data.get("minFaceHeight") as string | null;
    const maxFaceHeight: string | null = data.get("maxFaceHeight") as string | null;
    const minFaceWidth: string | null = data.get("minFaceWidth") as string | null;
    const maxFaceWidth: string | null = data.get("maxFaceWidth") as string | null;
    const minEyeHeight: string | null = data.get("minEyeHeight") as string | null;
    const maxEyeHeight: string | null = data.get("maxEyeHeight") as string | null;
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

    const amountOfFaces = output.amount_of_faces;

    return new Response(
      JSON.stringify({
        message: "Succcessfully validated and resized image",
        amountOfFaces: amountOfFaces,
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
