import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';
import { CheckCircle, Clock, Search } from 'lucide-react';
import MaintenanceButton from './MaintenanceButton';

export const revalidate = 0;

async function getUsers() {
  try {
    const plusUsersRaw = await prisma.license.findMany({
      where: { plan: 'PLUS' },
      orderBy: { createdAt: 'desc' },
    });

    const proUsersRaw = await prisma.license.findMany({
      where: { plan: 'PRO' },
      orderBy: { createdAt: 'desc' },
    });

    const plusUsers = plusUsersRaw.map(user => ({
      ...user,
      key: decrypt(user.encryptedKey)
    }));

    const proUsers = proUsersRaw.map(user => ({
      ...user,
      key: decrypt(user.encryptedKey)
    }));

    return { plusUsers, proUsers };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return { plusUsers: [], proUsers: [] };
  }
}

export default async function UsersPage() {
  const { plusUsers, proUsers } = await getUsers();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <MaintenanceButton />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Plus Subscribers</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">Monthly</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{plusUsers.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Pro Users</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">Lifetime</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{proUsers.length}</p>
        </div>
      </div>

      {/* Pro Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-yellow-500" />
            Pro Users (One-Time)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">License Key</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Purchased Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {proUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No Pro users found.
                  </td>
                </tr>
              ) : (
                proUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{user.email}</td>
                    <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{user.key}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plus Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Plus Subscribers (Monthly)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">License Key</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Start Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {plusUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No Plus subscribers found.
                  </td>
                </tr>
              ) : (
                plusUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{user.email}</td>
                    <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{user.key}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
