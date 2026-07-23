import WorkspaceEditor from "./WorkspaceEditor";

export default async function WorkspacePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams;
  return <WorkspaceEditor date={params.date} />;
}
