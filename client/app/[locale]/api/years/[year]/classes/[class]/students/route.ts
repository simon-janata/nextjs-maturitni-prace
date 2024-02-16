import prisma from "@/lib/prismaHelper";

// GET all students
export async function GET(req: Request, res: Response) {
  try {
    const students = await prisma.student.findMany({
      orderBy: [
        { lastname: "asc" },
        { middlename: "asc" },
        { firstname: "asc" },
      ],
    });

    return new Response(
      JSON.stringify(students), {
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
      }), {
        status: 500,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    )
  }
}

// POST a new student
export async function POST(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const schoolYear = pathParts[pathParts.indexOf("years") + 1];
    const clazzName = pathParts[pathParts.indexOf("classes") + 1];
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
      )
    }

    const clazz = await prisma.class.findFirst({
      where: {
        year: {
          year: Number(schoolYear),
        },
        name: clazzName.toUpperCase(),
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
      )
    }

    const newStudent = await prisma.student.create({
      data: {
        firstname: body.firstname,
        middlename: body.middlename,
        lastname: body.lastname,
        class: {
          connect: {
            id: clazz.id
          },
        },
      },
    });

    return new Response(JSON.stringify(newStudent), {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })
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
    )
  }
}
