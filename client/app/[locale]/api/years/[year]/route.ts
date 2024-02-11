import prisma from "@/lib/prismaHelper";

// GET a year by year
export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const year = await prisma.year.findFirst({
      where: { year: Number(id) },
      include: {
        classes: {
          orderBy: {
            name: "asc"
          }
        }
      }
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

// PATCH a year
export async function PATCH(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const body = await req.json();

    if (!body.year) {
      return new Response(
        JSON.stringify({
          message: "Year must be filled in",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      )
    }

    const updatedYear = await prisma.year.update({
      where: { id: id },
      data: {
        year: body.year,
      },
    });

    return new Response(JSON.stringify(updatedYear), {
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

// DELETE a year (this will also delete all dependent classes and students)
export async function DELETE(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const year = pathParts[pathParts.indexOf("years") + 1];
  
    const deletedYear = await prisma.year.delete({
      where: { year: Number(year) },
    });

    return new Response(JSON.stringify(deletedYear), {
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
