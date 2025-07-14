import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProfileIndex = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to stats tab by default
        router.replace('/profile/stats');
    }, [router]);

    return null;
};

export default ProfileIndex;
