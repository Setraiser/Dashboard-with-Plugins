import { requiredUser } from "../../server/auth/required-user";
import { IUser } from "../../types/user";

type AuthenticatedHandler<TArgs, TResult> = (
  user: IUser,
  args: TArgs
) => Promise<TResult>;

export function authHandler<TArgs, TResult>(
  handler: AuthenticatedHandler<TArgs, TResult>
) {
  return async (args: TArgs): Promise<TResult> => {
    const user = await requiredUser();

    return handler(user, args);
  };
}
