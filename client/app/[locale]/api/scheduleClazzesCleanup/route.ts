import axios from "axios";
import { CronJob } from "cron";

export async function GET(req: Request, res: Response) {
  try {
    const job = new CronJob(
      "0 0 0 * * *",
      async function () {
        try {
          const clazzes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/cs/api/clazzes`
          );

          if (clazzes.data && clazzes.data.length > 0) {
            for (const clazz of clazzes.data) {
              const createdAtDate = new Date(clazz.createdAt);
              createdAtDate.setHours(0, 0, 0, 0);

              const currentDate = new Date();
              currentDate.setHours(0, 0, 0, 0);

              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(currentDate.getDate() - 7);

              if (createdAtDate.getTime() <= sevenDaysAgo.getTime()) {
                await axios.delete(
                  `${process.env.NEXT_PUBLIC_API_URL}/cs/api/photos`,
                  {
                    params: {
                      schoolYear: clazz.schoolYear.year,
                      clazzName: clazz.name.tolowerCase(),
                    },
                  }
                );
                await axios.delete(
                  `${
                    process.env.NEXT_PUBLIC_API_URL
                  }/cs/api/clazzes/${clazz.name.tolowerCase()}`
                );
              }
            }
          }
        } catch (err) {
          console.log(`Error deleting clazz - ${err}`);
        }
      },
      null,
      true,
      "Europe/Prague"
    );

    return new Response(JSON.stringify({ message: "Cron job scheduled" }), {
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
