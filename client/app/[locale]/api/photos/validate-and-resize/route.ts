import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, rmSync } from "fs";
import { v4 as uuid } from "uuid";
import { spawnSync } from "child_process";

export async function POST(req: Request, res: Response) {
  try {
    const opencvDirPath = join(process.cwd(), "opencvScripts");
    const opencvScriptPath = join(opencvDirPath, "validate_and_resize_faces.py");

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
      )
    }

    const data = await req.formData();
    const photo: File | null = data.get("photo") as unknown as File;
  
    if (!photo) {
      return new Response(
        JSON.stringify({
          message: "Photo must be provided",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      )
    }
  
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
  
    console.log(`Running Python script at: ${opencvScriptPath}`);
    const pythonProcess = spawnSync("python", [opencvScriptPath], { input: buffer });

    // const resizedImageBuffer = pythonProcess.stdout as Buffer;
    console.log(`Python script error output: ${pythonProcess.stderr.toString()}`);

    console.log(`Python script output: ${pythonProcess.stdout.toString()}`);
    console.log(`Python script exit code: ${pythonProcess.status}`);
    // console.log(pythonProcess.stdout.toString());

    // Parse the JSON object from the Python script's output
    // const output = JSON.parse(pythonProcess.stdout.toString());
    const outputString = pythonProcess.stdout.toString("utf8").trim();
    const jsonStart = outputString.indexOf('{');
    const jsonEnd = outputString.lastIndexOf('}') + 1;
    const jsonString = outputString.substring(jsonStart, jsonEnd);
    const output = JSON.parse(jsonString);
    // const output = JSON.parse(outputString);


    // console.log(`output: ${output}`)

    // Extract the image and the boolean value from the JSON object
    const resizedImageBase64 = output.image;
    // const resizedImageBuffer = output.image;
    const isSingleFace = output.is_single_face;

    console.log(`isSingleFace: ${isSingleFace}`);

    // Convert the base64 image back to a Buffer
    const resizedImageBuffer = Buffer.from(resizedImageBase64, "base64");

    // const { searchParams } = new URL(req.url);
    // const year = searchParams.get("year") || "";
    // const clazz = searchParams.get("clazz")?.toUpperCase() || "";
    // const name = searchParams.get("name") || "";
  
    // const dirPath = join(process.cwd(), "photos", year, clazz);
  
    // if (!existsSync(dirPath)){
    //   mkdirSync(dirPath, { recursive: true });
    // }
  
    // const path = join(dirPath, `${name}.jpeg`);
    // await writeFile(path, croppedImageBuffer);

    // console.log(`Succcessfully uploaded file to ${path}`);

    return new Response(
      JSON.stringify({
        message: `Succcessfully uploaded file to`,
        resizedImage: resizedImageBase64,
        isSingleFace: isSingleFace,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    )
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
    )
  }
}
