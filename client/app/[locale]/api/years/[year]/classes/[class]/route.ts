import prisma from "@/lib/prismaHelper";

// GET a class by id
export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const year = pathParts[pathParts.indexOf("years") + 1];
    const clazzName = pathParts[pathParts.indexOf("classes") + 1];
    const clazz = await prisma.class.findFirst({
      where: {
        year: {
          year: Number(year),
        },
        name: clazzName.toUpperCase(),
      },
      include: {
        year: true,
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

// PATCH a class
export async function PATCH(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const body = await req.json();

    if (!body.name || !body.folderColor || !body.yearId) {
      return new Response(
        JSON.stringify({
          message: "Name, folderColor and yearId must be filled in",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      )
    }

    const updatedClass = await prisma.class.update({
      where: { id: id },
      data: {
        name: body.name,
        folderColor: body.folderColor,
        year: {
          connect: {
            id: body.yearId
          }
        },
      },
    });

    return new Response(JSON.stringify(updatedClass), {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })
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

// DELETE a class
export async function DELETE(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const year = pathParts[pathParts.indexOf("years") + 1];
    const clazzName = pathParts[pathParts.indexOf("classes") + 1];
  
    const deletedClass = await prisma.class.deleteMany({
      where: {
        year: {
          year: Number(year),
        },
        name: clazzName.toUpperCase(),
      },
    });

    return new Response(JSON.stringify(deletedClass), {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })
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
