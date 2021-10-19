import axios from "axios";
import { prismaClient } from "../prisma";
import { sign } from "jsonwebtoken";

/**
 * Receber code(string)
 * Recuperar o access_token no hithub
 * Recuperar infos do user no github
 * Verificar se o usuario existe no DB
 * ----- SIM = Gerar token
 * ----- Não = Criar no DB, gerar token
 * Retornar o token com as infos
**/

interface IAccessTokenResponse {
    access_token: string
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

export class AuthenticateUserService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token";

        const { data: accesTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: { // PARA RETORNAR COMO JSON
                "Accept": "application/json"
            }
        });

        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accesTokenResponse.access_token}`
            }
        });

        const { login, id, avatar_url, name } = response.data;

        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id
            }
        })

        if(!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            })
        }

        const token = sign ({
            user: {
                name: user.name,
                avatar_url: user.avatar_url,
                id: user.id
            },
            
        },
        process.env.JWT_SECRET,
        {
            subject: user.id,
            expiresIn: "1d"
        }
        );

        /**
         * Quando utilizamos o axios, toda a informação é inserida dentro do data.
        **/
        // return response.data;
        return { token, user };
    }
}