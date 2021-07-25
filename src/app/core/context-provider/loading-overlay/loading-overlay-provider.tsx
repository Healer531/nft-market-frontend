import React, { useState } from 'react';

import { LoadingOverlayContext } from './loading-overlay-context';
import { setLocalStorageWalletAddress } from '../../utils/wallet';
import { toast } from '../../utils/notification.util';
import { isBscNetwork, login } from '../../utils/network/user';

export const LoadingOverlayProvider = (props: React.PropsWithChildren<{}>) => {

  const [isActivity, setIsActivity] = useState<boolean>(false);
  const [overlayText, setOverlayText] = useState<string>('');

  return (
    <LoadingOverlayContext.Provider value={{
        isActivity: isActivity,
        overlayText: overlayText,
        setIsActivity: setIsActivity,
        setOverlayText: setOverlayText,
    }}>
      { props.children }
    </LoadingOverlayContext.Provider>
  );

}
