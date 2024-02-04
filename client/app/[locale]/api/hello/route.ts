import { join } from "path";
import { existsSync } from "fs";

export function GET(req: Request, res: Response) {
  try {
    const { spawnSync } = require("child_process");

    const dirPath = join(process.cwd(), "opencvScripts");
    const path = join(dirPath, "hello.py");

    if (!existsSync(path)) {
      return new Response(
        JSON.stringify({
          message: `Python script not found at: ${path}`,
        }),
        {
          status: 500,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      )
    }

    console.log(`Running Python script at: ${path}`);
    const pythonProcess = spawnSync("python", [path]);
    const result = pythonProcess.stdout.toString();

    return new Response(
      JSON.stringify({
        message: `${result}`,
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
