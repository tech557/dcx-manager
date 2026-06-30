import { User } from "../types";
import { MOCK_USERS } from "../mock/users";

export const usersService = {
  /**
   * Retrieves the directory of registered portal collaborators and campaign staffers.
   *
   * @route GET /api/v1/users
   * @access Authenticated (All workspace users)
   * @response Array<User> listing full name, avatar, title, and role tags
   */
  getUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_USERS);
      }, 250);
    });
  },
};

