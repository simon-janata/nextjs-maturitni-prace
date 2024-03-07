import prisma from "@/lib/prismaHelper";

export async function POST(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolYearParam = searchParams.get("schoolYear") || "";
    const clazzNameParam = searchParams.get("clazzName") || "";

    const body = await req.json();

    if (!body.firstname || !body.lastname) {
      return new Response(
        JSON.stringify({
          message: "Firstname and lastname must be filled in",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const clazz = await prisma.clazz.findFirst({
      where: {
        schoolYear: {
          year: Number(schoolYearParam),
        },
        name: clazzNameParam.toUpperCase(),
      },
    });

    if (!clazz) {
      return new Response(
        JSON.stringify({
          message: "Class not found",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const newStudent = await prisma.student.create({
      data: {
        firstname: body.firstname,
        middlename: body.middlename,
        lastname: body.lastname,
        clazz: {
          connect: {
            id: clazz.id,
          },
        },
      },
    });

    return new Response(JSON.stringify(newStudent), {
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
