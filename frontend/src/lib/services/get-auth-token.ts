import { cookies } from "next/headers";

export async function getAuthToken() {
  // const authToken = cookies().get("jwt")?.value;
  let authToken;
  await cookies().then((c) => {
    authToken = c.get("jwt")?.value;
  });

  return authToken;
}
