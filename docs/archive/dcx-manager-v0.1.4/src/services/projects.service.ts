import { MockClient, MOCK_CLIENTS_WITH_PROJECTS } from "../mock/projects";

export const projectsService = {
  /**
   * Fetches the complete hierarchical collection of clients and their child project portfolios.
   *
   * @route GET /api/v1/clients-projects
   * @access Authenticated (Client-Access or Admin Token required)
   * @response Array<MockClient> maps to nested Client structure containing Array<MockProject>
   */
  getClientsWithProjects: async (): Promise<MockClient[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CLIENTS_WITH_PROJECTS);
      }, 300);
    });
  },
};

