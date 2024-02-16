import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, rmSync } from "fs";
import { v4 as uuid } from "uuid";
import { spawnSync } from "child_process";

export async function GET(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || "";
    const clazz = searchParams.get("clazz") || "";
    const name = searchParams.get("name") || "";

    const imagePath = join(process.cwd(), "photos", year, clazz, `${name}.jpeg`);

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
      )
    }
    
    const image = readFileSync(imagePath);
    const imageBase64 = `data:image/jpeg;base64,${image.toString("base64")}`;

    return new Response(
      JSON.stringify({ image: imageBase64 }), {
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

export async function POST(req: Request, res: Response) {
  try {
    const opencvDirPath = join(process.cwd(), "opencvScripts");
    const opencvScriptPath = join(opencvDirPath, "image_crop.py");

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

    const croppedImageBuffer = pythonProcess.stdout as Buffer;

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || "";
    const clazz = searchParams.get("clazz")?.toUpperCase() || "";
    const name = searchParams.get("name") || "";
  
    const dirPath = join(process.cwd(), "photos", year, clazz);
  
    if (!existsSync(dirPath)){
      mkdirSync(dirPath, { recursive: true });
    }
  
    const path = join(dirPath, `${name}.jpeg`);
    await writeFile(path, croppedImageBuffer);

    console.log(`Succcessfully uploaded file to ${path}`);

    return new Response(
      JSON.stringify({
        message: `Succcessfully uploaded file to ${path}`,
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

export async function DELETE(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || "";
    const clazz = searchParams.get("clazz")?.toUpperCase() || "";

    const directoryPath = join(process.cwd(), "photos", year, clazz);

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
      )
    }

    rmSync(directoryPath, { recursive: true, force: true });

    console.log(`Succcessfully deleted photos at: ${directoryPath}`);
    
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
