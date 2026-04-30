import { CheckEmailCard } from "../components/check-email-card";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <CheckEmailCard />
      </div>
    </div>
  );
}
