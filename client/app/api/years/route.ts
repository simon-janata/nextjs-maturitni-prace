import prisma from "@/lib/prismaHelper";

// GET all years
export async function GET(req: Request, res: Response) {
  try {
    const years = await prisma.year.findMany({
      orderBy: { year: "desc" }
    });
    
    return new Response(
      JSON.stringify(years), {
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

// POST a new year
export async function POST(req: Request, res: Response) {
  try {
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

    const newYear = await prisma.year.create({
      data: {
        year: body.year,
      },
    });

    return new Response(JSON.stringify(newYear), {
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
