import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';

export const useHasPermission = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    const hasPermission = (permission: string | string[]) => {
        if (!user || !user.permissions) return false;

        if (Array.isArray(permission)) {
            return permission.some(p => user.permissions.includes(p));
        }
        return user.permissions.includes(permission);
    };

    return hasPermission;
};
