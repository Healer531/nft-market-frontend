import { environment } from '../../../environment';

export const lengthOfAddress = 42;

export async function setLocalStorageWalletAddress(address: string): Promise<void> {
  await window.localStorage.setItem(environment.localStorageKeys.walletAddress, address);
}

export function getLocalStorageWalletAddress(): string {
  const address = window.localStorage.getItem(environment.localStorageKeys.walletAddress);
  return address || '';
}

export function reduceTheWalletAddress(walletAddress: string): string {
  if(walletAddress.length !== lengthOfAddress){
    return '';
  }
  const reducedAddress = walletAddress ? `${walletAddress.substring(0, 4)  }...${  walletAddress.substring(walletAddress.length - 4)}` : '';
  return reducedAddress;
}
