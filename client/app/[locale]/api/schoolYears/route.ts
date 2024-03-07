import prisma from "@/lib/prismaHelper";

// GET all school years
export async function GET(req: Request, res: Response) {
  try {
    const schoolYears = await prisma.schoolYear.findMany({
      orderBy: { year: "desc" },
    });

    return new Response(JSON.stringify(schoolYears), {
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

// POST a new year
export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    if (!body.schoolYear) {
      return new Response(
        JSON.stringify({
          message: "schoolYear must be filled in",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }

    const newSchoolYear = await prisma.schoolYear.create({
      data: {
        year: body.schoolYear,
      },
    });

    return new Response(JSON.stringify(newSchoolYear), {
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
