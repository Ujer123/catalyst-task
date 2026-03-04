import { Spinner } from "flowbite-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="xl" color="info" />
    </div>
  );
}
