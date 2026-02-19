export const dynamic = "force-dynamic";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default async function AdminPage() {
  const { env } = await getCloudflareContext({ async: true });
  const result = await env.DB.prepare(
    "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC"
  ).all();
  const users = (result.results ?? []) as User[];

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Admin <span className="text-accent">Panel</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Kayıtlı kullanıcıları yönet
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-surface-light border border-surface-lighter hover:bg-surface-lighter text-sm transition-colors"
          >
            Ana Sayfa
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-light border border-surface-lighter rounded-lg p-4">
            <p className="text-2xl font-bold">{users?.length ?? 0}</p>
            <p className="text-sm text-gray-400">Toplam Kullanıcı</p>
          </div>
          <div className="bg-surface-light border border-surface-lighter rounded-lg p-4">
            <p className="text-2xl font-bold">
              {users?.filter((u) => u.role === "admin").length ?? 0}
            </p>
            <p className="text-sm text-gray-400">Admin</p>
          </div>
          <div className="bg-surface-light border border-surface-lighter rounded-lg p-4 col-span-2 sm:col-span-1">
            <p className="text-2xl font-bold">
              {users?.filter((u) => u.role === "user").length ?? 0}
            </p>
            <p className="text-sm text-gray-400">Kullanıcı</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-surface-light border border-surface-lighter rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-lighter text-left text-gray-400">
                  <th className="px-4 py-3 font-medium">Kullanıcı</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    Kayıt Tarihi
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-surface-lighter/50 last:border-0 hover:bg-surface-lighter/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {user.email[0].toUpperCase()}
                        </div>
                        <span className="truncate">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-accent/20 text-accent"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Kullanıcı"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                      {new Date(user.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
                {(!users || users.length === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Henüz kayıtlı kullanıcı yok
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
