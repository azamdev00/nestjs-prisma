import { User } from 'generated/prisma';

export type RequestWithUser = Request & { user: User; params: any };
