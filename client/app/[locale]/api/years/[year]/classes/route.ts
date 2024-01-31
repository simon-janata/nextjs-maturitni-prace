import prisma from "@/lib/prismaHelper";

// GET all classes
export async function GET(req: Request, res: Response) {
  try {
    const classes = await prisma.class.findMany({
      include: {
        year: true
      },
      orderBy: [
        { year: { year: "desc" } },
        { name: "asc" },
      ],
    });
    
    return new Response(
      JSON.stringify(classes), {
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

// POST a new class
export async function POST(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const year = pathParts[pathParts.indexOf("years") + 1];
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
      )
    }

    const newClass = await prisma.class.create({
      data: {
        name: body.name,
        folderColor: body.folderColor,
        year: {
          connect: {
            year: Number(year)
          }
        },
      },
    });

    return new Response(JSON.stringify(newClass), {
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
