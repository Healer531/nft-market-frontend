import React, { useState } from 'react';

import { UserContext } from './user-context';
import { setLocalStorageWalletAddress } from '../../utils/wallet';
import { toast } from '../../utils/notification.util';
import { isBscNetwork, login } from '../../utils/network/user';

export const UserProvider = (props: React.PropsWithChildren<{}>) => {

  const [walletAddress, setWalletAddress] = useState<string>('');
  const [token, setToken] = useState<string>('');

    const connectWallet = () => {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(handleAccountsChanged)
            .catch(async (err: any) => {
                setWalletAddress('');
                setLocalStorageWalletAddress('').then();
                if (err.code === 4001) {
                    toast('danger', 'Please connect to MetaMask.');
                }
            });
    }

    const handleAccountsChanged = async (accounts: any[]) => {
        if (!await isBscNetwork()) {
            setWalletAddress('');
            setLocalStorageWalletAddress('').then();
            return;
        }
        if (!accounts || !accounts.length) {
            setWalletAddress('');
            setLocalStorageWalletAddress('').then();
            toast('danger', 'Please connect to MetaMask.');
            return;
        }
        setWalletAddress(accounts[0])
        login(accounts[0]).then((result: any) => {
            if(!result) {
                return;
            }
            setToken(result.accessToken);
            setLocalStorageWalletAddress(accounts[0]).then();
        });
    }

  return (
    <UserContext.Provider value={{
      walletAddress: walletAddress,
      setWalletAddress: setWalletAddress,
      token: token,
      setToken: setToken,
      connectWallet: connectWallet,
    }}>
      { props.children }
    </UserContext.Provider>
  );

}
