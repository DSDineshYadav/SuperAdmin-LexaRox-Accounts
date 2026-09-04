import {
  getDefaultPermissionsForRole,
  platformUsers,
  type PlatformUser,
} from "@/lib/platform-data";

const STORAGE_KEY = "lexarox-platform-users";

function normalizePlatformUser(user: PlatformUser): PlatformUser {
  return {
    ...user,
    enabled: user.enabled ?? true,
    permissions:
      user.permissions?.length > 0 ? user.permissions : getDefaultPermissionsForRole(user.roleId),
  };
}

export function getPlatformUsers(): PlatformUser[] {
  if (typeof sessionStorage === "undefined") return platformUsers.map(normalizePlatformUser);
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return (JSON.parse(stored) as PlatformUser[]).map(normalizePlatformUser);
  } catch {
    /* ignore */
  }
  return platformUsers.map(normalizePlatformUser);
}

export function setPlatformUsers(users: PlatformUser[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function addPlatformUser(user: PlatformUser) {
  setPlatformUsers([user, ...getPlatformUsers()]);
}

export function updatePlatformUser(id: string, patch: Partial<PlatformUser>) {
  setPlatformUsers(getPlatformUsers().map((u) => (u.id === id ? { ...u, ...patch } : u)));
}

export function deletePlatformUser(id: string) {
  setPlatformUsers(getPlatformUsers().filter((u) => u.id !== id));
}
