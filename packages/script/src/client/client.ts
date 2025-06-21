import createClient from "openapi-fetch";
import { paths } from "./openapi";

export const getClient = (apiUrl: string) => {
	return createClient<paths>({
		baseUrl: apiUrl,
	});
};
