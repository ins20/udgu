import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__404")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>404!</h3>
    </div>
  );
}
