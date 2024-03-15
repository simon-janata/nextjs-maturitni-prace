import prisma from "@/lib/prismaHelper";

export async function GET(req: Request, res: Response) {
  try {
    const clazzes = await prisma.clazz.findMany({
      include: {
        schoolYear: true,
      },
      orderBy: [{ schoolYear: { year: "desc" } }, { name: "asc" }],
    });

    return new Response(JSON.stringify(clazzes), {
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
    const { searchParams } = new URL(req.url);
    const schoolYearParam = searchParams.get("schoolYear") || "";

    if (schoolYearParam === "") {
      return new Response(
        JSON.stringify({
          message: "schoolYear must be provided",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const body = await req.json();

    if (!body.name || !body.folderColor) {
      return new Response(
        JSON.stringify({
          message: "name and folderColor must be filled in",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const newClazz = await prisma.clazz.create({
      data: {
        name: body.name,
        folderColor: body.folderColor,
        schoolYear: {
          connect: {
            year: Number(schoolYearParam),
          },
        },
      },
    });

    return new Response(JSON.stringify(newClazz), {
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
