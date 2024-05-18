import axios from "axios";
import { CronJob } from "cron";

export async function GET(req: Request, res: Response) {
  try {
    const job = new CronJob(
      "0 0 0 * * *",
      async function () {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/cs/api/clazzes`
          );

          const clazzes = response.data;

          if (clazzes && clazzes.length > 0) {
            for (const clazz of clazzes) {
              const schoolYear = clazz.schoolYear.year;

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
                      schoolYear: schoolYear,
                      clazzName: clazz.name.tolowerCase(),
                    },
                  }
                );
                await axios.delete(
                  `${
                    process.env.NEXT_PUBLIC_API_URL
                  }/cs/api/clazzes/${clazz.name.tolowerCase()}`
                );

                await axios
                  .get(
                    `${process.env.NEXT_PUBLIC_API_URL}/cs/api/schoolYears/${schoolYear}`
                  )
                  .then(async (res) => {
                    if (res.data) {
                      if (res.data.clazzes.length === 0) {
                        await axios.delete(
                          `${process.env.NEXT_PUBLIC_API_URL}/cs/api/schoolYears/${schoolYear}`
                        );
                      }
                    }
                  });
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
