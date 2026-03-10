import React from "react";
import { getAllUsersForAdmin, deleteUserByAdmin, isAdmin } from "@/lib/actions/admin.actions";
import { redirect } from "next/navigation";
import { User, Shield, Book, Trash2, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";

export default async function AdminDashboard() {
  if (!(await isAdmin())) {
    redirect("/");
  }

  const result = await getAllUsersForAdmin();
  const users = result.success ? result.data : [];

  return (
    <main className="wrapper pt-[120px] pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-[#212a3b] flex items-center gap-3 font-serif">
            <Shield className="text-[#663820]" size={36} />
            Admin Control Center
          </h1>
          <p className="text-[#3d485e] mt-2">
            Monitor system usage and manage user accounts.
          </p>
        </div>
        
        <div className="bg-white px-6 py-4 rounded-2xl shadow-soft border border-black/5 flex items-center gap-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-[#212a3b]">{users.length}</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Live Books</p>
            <p className="text-2xl font-bold text-[#212a3b]">
              {users.reduce((acc: number, u: any) => acc + (u.bookCount || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-soft-lg border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdfcf6] border-b border-black/5">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#212a3b]">User</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#212a3b]">Contact</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#212a3b]">Usage</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#212a3b]">Joined</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-[#212a3b] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${user.role === 'admin' ? 'bg-[#212a3b] text-white' : 'bg-[#f3e4c7] text-[#663820]'}`}>
                        {user.firstName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-[#212a3b] flex items-center gap-2">
                          {user.firstName} {user.lastName}
                          {user.role === 'admin' && <Shield size={14} className="text-indigo-500" title="Administrator" />}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm text-[#3d485e]">
                      <Mail size={14} className="text-gray-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-[#212a3b]">
                      <Book size={12} />
                      {user.bookCount || 0} Materials
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-[#3d485e]">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-300" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {user.role !== 'admin' && (
                      <form action={async () => {
                        "use server";
                        await deleteUserByAdmin(user._id.toString());
                      }}>
                        <button className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="Delete User">
                          <Trash2 size={18} />
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 italic">No users found in the system.</p>
          </div>
        )}
      </div>
    </main>
  );
}
