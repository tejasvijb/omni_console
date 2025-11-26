import api from "../api";
import {
    LoginRequestBody,
    RegisterRequestBody,
    LoginInfoAPIResponse,
    RegisterInfoAPIResponse,
    CurrentUserAPIResponse,
} from "../types";

const URLS = {
    login: "/users/login",
    register: "/users/register",
    me: "/users/me",
    logout: "/users/logout",
};

export const userLogin = (body: LoginRequestBody) => {
    return api.post<LoginInfoAPIResponse>(URLS.login, body);
};

export const userRegister = (body: RegisterRequestBody) => {
    return api.post<RegisterInfoAPIResponse>(URLS.register, body);
};

export const fetchCurrentUser = () => {
    return api.get<CurrentUserAPIResponse>(URLS.me);
};

export const userLogout = () => {
    return api.post(URLS.logout, {});
};
