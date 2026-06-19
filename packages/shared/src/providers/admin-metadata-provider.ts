import { defaultSearchConfig, mockConcepts, mockTopics } from "../mock/knowledge";
import { createMockContentProvider } from "./content-provider";

export interface AdminMetadataSnapshot {
  navigationCount: number;
  topicCount: number;
  conceptCount: number;
  searchProvider: string;
}

export interface AdminMetadataProvider {
  getSnapshot(): Promise<AdminMetadataSnapshot>;
}

export function createMockAdminMetadataProvider(): AdminMetadataProvider {
  const contentProvider = createMockContentProvider();

  return {
    async getSnapshot() {
      const navigation = await contentProvider.getNavigation();
      return {
        navigationCount: navigation.length,
        topicCount: mockTopics.length,
        conceptCount: mockConcepts.length,
        searchProvider: defaultSearchConfig.provider
      };
    }
  };
}

