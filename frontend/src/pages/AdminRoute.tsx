import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';

interface AdminRouteProps {
  element: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  const [cookies] = useCookies(['id', 'username']);
  const [decryptedUsername, setDecryptedUsername] = useState<string | null>(null);
  const [decryptedUserId, setDecryptedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // To handle loading state

  const decrypt = (text: string) => {
    const bytes = CryptoJS.AES.decrypt(text, 'secret-key');
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    if (cookies.username) {
      const username = decrypt(cookies.username);
      const userId = decrypt(cookies.id);
      setDecryptedUsername(username);
      setDecryptedUserId(userId);
    }
    setLoading(false); // Set loading to false after decryption
  }, [cookies]);

  // If loading, you might want to return a loading indicator or null
  if (loading) {
    return null; // or a loading spinner
  }

  return decryptedUsername === 'admin' ? element : <Navigate to="/profile" />;
};

export default AdminRoute;
