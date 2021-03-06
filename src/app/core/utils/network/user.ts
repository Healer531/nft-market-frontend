import { toast } from '../notification.util';
import { environment } from '../../../../environment';
import { NFT } from '../../models/nft';
import { User } from '../../models/user';

const bscNetworkChainId = '0x3';

export const isBscNetwork = async () => {
    const { ethereum } = window;
    if(!ethereum) {
        return;
    }
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    if (chainId !== bscNetworkChainId) {
        toast('danger', 'Please select network of MetaMask as "Binance Smart Chain"');
        return false;
    }
    return true;
};

export function login(walletAddress: string) {
    const data = { walletAddress: walletAddress };
    return fetch(`${ environment.serverUrl }/auth/login`, {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: JSON.stringify(data),
    }).then(handleResponse)
}

export function uploadNft(user: User) {
    const data = new FormData();
    data.append( 'userName', user.userName );
    data.append( 'walletAddress', user.walletAddress );
    if(user.logoImage != null) {
        data.append( 'logoImage', user.logoImage );
    } else {
        data.append( 'logoImage', '' );
    }
    return fetch(`${ environment.serverUrl }/user/updateProfile`, {
        headers: {
            // 'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: data,
    }).then(handleResponse)
}

export function getUserByWalletAddress(walletAddress: string) {
    return fetch(`${ environment.serverUrl }/user/${walletAddress}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET',
    }).then(handleResponse)
}

function handleResponse(response: any) {
    return response.json();
}