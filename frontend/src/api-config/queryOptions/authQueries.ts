import { queryOptions } from "@tanstack/react-query";
import { fetchCurrentUser, userLogin, userRegister } from "../endpoints";
import { LoginRequestBody, RegisterRequestBody } from "../types";

export const authQueryOptions = {
    signInOptions: {
        mutationFunction: ({ body }: { body: LoginRequestBody }) => {
            return userLogin(body);
        },
    },
    signUpOptions: {
        mutationFunction: ({ body }: { body: RegisterRequestBody }) => {
            return userRegister(body);
        },
    },
    fetchCurrentUserOptions: queryOptions({
        queryFn: fetchCurrentUser,
        queryKey: ["currentUser"],
    }),
};
