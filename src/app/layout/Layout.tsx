import React, { useEffect } from 'react';
import { SpinnerComponent } from 'react-element-spinner';

import { Header } from './header/header';
import { Footer } from './footer/footer';
import { useOverlay } from '../core/context-provider/loading-overlay/loading-overlay-context';
import { useUser } from '../core/context-provider/user/user-context';
import LoadingOverlay from 'react-loading-overlay-ts';

export const Layout = (props: React.PropsWithChildren<{}>) => {
    const { isActivity, overlayText } = useOverlay();

  return (
    <LoadingOverlay
          active={ isActivity }
          spinner
          text={ overlayText }
          className="d-flex flex-column bg-primary">
          <Header/>
              <div className="d-flex container">
                { props.children }
              </div>
          <Footer />
    </LoadingOverlay>
  );
}
