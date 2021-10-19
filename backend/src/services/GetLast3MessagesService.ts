import { prismaClient } from "../prisma";

export class GetLast3MessagesService {
    async execute() {
        const messages = await prismaClient.message.findMany({
            take: 3, // LIMITE DE DADOS QUE QUERO PEGAR
            orderBy: {
                created_at: "desc"
            },
            include: {
                user: true
            }
        });

        return messages;
    }
}