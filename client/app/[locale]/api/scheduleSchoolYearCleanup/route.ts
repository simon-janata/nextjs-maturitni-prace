import { CronJob } from "cron";
import axios from "axios";

export async function GET(req: Request, res: Response) {
	try {
		// const cookies = req.headers.get("cookie");
		// const locale = cookies?.split("; ").find(cookie => cookie.startsWith("NEXT_LOCALE="))?.split("=")[1];

		// console.log(locale);
		// console.log(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years`);

		new CronJob("0 0 * * *", async function() {
			try {
				const schoolYears = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years`);
				for (const schoolYear of schoolYears.data) {
					await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years/${schoolYear.year}`);
					await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/photos?year=${schoolYear.year}`);
				}
			} catch (err) {
				console.log(`Error deleting school year - ${err}`);
			}
		}, null, true, "Europe/Prague").start();

		return new Response(
			JSON.stringify({ message: "Cron job scheduled" }), {
				status: 200,
				headers: {
					"content-type": "application/json;charset=UTF-8",
				},
			}
		);
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
