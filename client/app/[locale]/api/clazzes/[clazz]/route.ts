import prisma from "@/lib/prismaHelper";

export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const clazzNameParam = pathParts[pathParts.indexOf("clazzes") + 1];

    const { searchParams } = new URL(req.url);
    const schoolYearParam = searchParams.get("schoolYear") || "";

    const clazz = await prisma.clazz.findFirst({
      where: {
        schoolYear: {
          year: Number(schoolYearParam),
        },
        name: clazzNameParam.toUpperCase(),
      },
      include: {
        schoolYear: true,
        students: {
          orderBy: [
            { lastname: "asc" },
            { middlename: "asc" },
            { firstname: "asc" },
          ],
        },
      },
    });

    return new Response(JSON.stringify(clazz), {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Internal Server Error ${error}`,
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
    const clazzNameParam = searchParams.get("clazzName") || "";

    const deletedClass = await prisma.clazz.deleteMany({
      where: {
        schoolYear: {
          year: Number(schoolYearParam),
        },
        name: clazzNameParam.toUpperCase(),
      },
    });

    return new Response(JSON.stringify(deletedClass), {
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
