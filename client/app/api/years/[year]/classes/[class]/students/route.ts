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
    const body = await req.json();
    
    if (!body.firstname || !body.lastname || !body.classId) {
      return new Response(
        JSON.stringify({
          message: "firstname, lastname and classId must be filled in",
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
        middlename: body.middlename === undefined ? "" : body.middlename,
        lastname: body.lastname,
        class: {
          connect: {
            id: body.classId
          }
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
