import prisma from "@/lib/prismaHelper";

// GET a year by id
export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const year = await prisma.year.findUnique({
      where: { id: id },
      include: { classes: true }
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
          message: "year must be filled in",
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
    const id = url.pathname.split("/").pop();
  
    const deletedYear = await prisma.year.delete({
      where: { id: id },
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
