import { Camera, UserRound } from "lucide-react";
import { EditProfileForm } from "@/features/profile/EditProfileForm.jsx";
import { PageHeader } from "@/components/PageHeader.jsx";
import { useAuthContext } from "@/context/AuthContext.jsx";

export default function ProfilePage() {
  const { user, role } = useAuthContext();
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
      <div className="border-b border-stone-200 bg-white px-4 py-8 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-2xl">
          <PageHeader
            eyebrow="Account"
            icon={UserRound}
            title="Profile"
            description="Update your name and account information."
          />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
          {/* gradient header */}
          <div
            className="relative flex items-center gap-5 px-6 py-7"
            style={{
              background:
                "linear-gradient(135deg, #0f4c3a 0%, #1a6b55 50%, #0d7a6b 100%)",
            }}
          >
            {/* avatar with camera overlay */}
            <div className="group relative shrink-0">
              <div
                className="flex h-18 w-18 items-center justify-center rounded-2xl bg-teal-600 text-2xl font-bold text-white ring-4 ring-white/20"
                style={{ height: "72px", width: "72px" }}
              >
                {initials}
              </div>
              <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/40 opacity-0 transition group-hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-tight">
                {user?.user_metadata?.full_name ?? "Pengguna"}
              </p>
              <p className="text-sm text-teal-200/80">{user?.email}</p>
              <p className="mt-1 text-xs text-teal-300/60">
                {role === "owner"
                  ? "Owner"
                  : role === "super_admin"
                    ? "Admin"
                    : "Tenant"}
              </p>
            </div>
          </div>

          {/* form */}
          <div className="p-6">
            <EditProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}
