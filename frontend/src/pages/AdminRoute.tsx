import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';
interface AdminRouteProps {
  element: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element,}) => {
  const [cookies] = useCookies(['id', 'username',]); 
  const [decryptedUsername, setDecryptedUsername] = useState<string | null>(null);
  const [decryptedUserId, setDecryptedUserId] = useState<string | null>(null);

  const decrypt = (text: string) => {
    const bytes = CryptoJS.AES.decrypt(text, 'secret-key');
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    if (cookies.username && cookies.id) {
      setDecryptedUsername(decrypt(cookies.username));
      setDecryptedUserId(decrypt(cookies.id));
    }
  }, [cookies]);

  const isAdmin = decryptedUsername == 'admin';



  return isAdmin ? element : <Navigate to="/profile" />;
};

export default AdminRoute;
