import DataLoader from "dataloader";
import { User } from "../entities";

// [1, 78, 8, 9]
// [{id : 1, username : "tim"}, {...}, {...}]
export const createUserLoader = (): DataLoader<number, User> =>
    new DataLoader<number, User>(async userIds => {
        const users = await User.findByIds(userIds as number[]);
        const userIdToUser = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {} as Record<number, User>);

        return userIds.map(userId => userIdToUser[userId]);
    });
