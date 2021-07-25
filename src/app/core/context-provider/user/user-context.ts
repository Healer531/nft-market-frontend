
import { createContext, useContext } from 'react';

export type UserContextType = {
  walletAddress: string,
  setWalletAddress: (address: string) => void;
  token: string,
  setToken: (token: string) => void;
  connectWallet: () => void;
}

export const UserContext = createContext<UserContextType>({
  walletAddress: '',
  setWalletAddress: (address: string) => {},
  token: 'string',
  setToken: (token: string) => {},
  connectWallet: () => {},
});

export const useUser = () => useContext(UserContext);
