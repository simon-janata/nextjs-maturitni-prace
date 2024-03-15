import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

export async function POST(req: Request, res: Response) {
  try {
    const opencvDirPath = join(process.cwd(), "opencvScripts");
    const opencvScriptPath = join(
      opencvDirPath,
      "validate_and_resize_faces.py"
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
    });

    const outputString = pythonProcess.stdout.toString("utf8").trim();
    const jsonStart = outputString.indexOf("{");
    const jsonEnd = outputString.lastIndexOf("}") + 1;
    const jsonString = outputString.substring(jsonStart, jsonEnd);
    const output = JSON.parse(jsonString);

    const resizedImageBase64 = output.image;
    const isSingleFace = output.is_single_face;

    return new Response(
      JSON.stringify({
        message: "Succcessfully validated and resized image",
        resizedImage: resizedImageBase64,
        isSingleFace: isSingleFace,
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
