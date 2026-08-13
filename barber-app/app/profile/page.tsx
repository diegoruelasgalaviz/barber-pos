"use client";

import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function ProfileView() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Profile</h1>
      <Card className="mt-6">
        <CardBody className="flex items-center gap-4">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.name.slice(0, 1)}
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">{user.name}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.phone}</p>
          </div>
        </CardBody>
      </Card>
      <Button variant="outline" className="mt-6 w-full" onClick={handleSignOut}>
        Log out
      </Button>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileView />
    </RequireAuth>
  );
}
