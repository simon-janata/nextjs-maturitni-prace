import prisma from "@/lib/prismaHelper";

// GET a student by id
export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const year = await prisma.student.findUnique({
      where: { id: id },
      include: { class: true}
    });
    return new Response(JSON.stringify(year), {
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

// PATCH a student
export async function PATCH(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const body = await req.json();

    if (!body.firstname || !body.lastname || !body.classId) {
      return new Response(
        JSON.stringify({
          message: "firstname, lastname and class must be filled in",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      )
    }

    const updatedStudent = await prisma.student.update({
      where: { id: id },
      data: {
        firstname: body.firstname,
        middlename: body.middlename,
        lastname: body.lastname,
        // classId: body.classId,
        class: {
          connect: {
            id: body.classId
          }
        },
      },
    });

    return new Response(JSON.stringify(updatedStudent), {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
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

// DELETE a student
export async function DELETE(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
  
    const deletedStudent = await prisma.student.delete({
      where: { id: id },
    });

    return new Response(JSON.stringify(deletedStudent), {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
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
