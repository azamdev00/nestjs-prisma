import { User } from 'prisma/generated/prisma';

export type RequestWithUser = Request & { user: User; params: any };
