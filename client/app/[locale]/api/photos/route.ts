import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { v4 as uuid } from "uuid";

export async function POST(req: Request, res: Response) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
  
    if (!file) {
      return new Response(
        JSON.stringify({
          message: "File must be provided",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      )
    }
  
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
  
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || "";
    const clazz = searchParams.get("clazz") || "";
  
    const dirPath = join(process.cwd(), "photos", year, clazz);
  
    if (!existsSync(dirPath)){
      mkdirSync(dirPath, { recursive: true });
    }
  
    const path = join(dirPath, file.name);
    await writeFile(path, buffer);

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
