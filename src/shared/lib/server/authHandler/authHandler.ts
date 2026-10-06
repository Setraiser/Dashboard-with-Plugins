import { getCurrentUser } from "../../server/auth/current-user";
import { ApiError } from "../apiHandler/api-error";
import { IUser } from "../../types/user";

type AuthenticatedHandler<TArgs, TResult> = (
  user: IUser,
  args: TArgs
) => Promise<TResult>;

export function authHandler<TArgs, TResult>(
  handler: AuthenticatedHandler<TArgs, TResult>
) {
  return async (args: TArgs): Promise<TResult> => {
    const user = await getCurrentUser();

    if (!user) {
      throw new ApiError(401, "SESSION_EXPIRED");
    }

    return handler(user, args);
  };
}
