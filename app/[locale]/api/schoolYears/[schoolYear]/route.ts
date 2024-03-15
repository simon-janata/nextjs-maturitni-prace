import prisma from "@/lib/prismaHelper";

export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const schoolYearParam = pathParts[pathParts.indexOf("schoolYears") + 1];

    const schoolYear = await prisma.schoolYear.findUnique({
      where: { year: Number(schoolYearParam) },
      include: {
        clazzes: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    return new Response(JSON.stringify(schoolYear), {
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
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const schoolYearParam = pathParts[pathParts.indexOf("schoolYears") + 1];

    const deletedSchoolYear = await prisma.schoolYear.delete({
      where: { year: Number(schoolYearParam) },
    });

    return new Response(JSON.stringify(deletedSchoolYear), {
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
