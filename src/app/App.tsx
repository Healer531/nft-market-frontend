import React from 'react';
import ReactNotification from 'react-notifications-component'
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';

import { UserProvider } from './core/context-provider/user/user-provider';
import { HomePage } from './pages/home-page/home-page';
import { CatalogPage } from './pages/catalog-page/catalog-page';
import { NewsPage } from './pages/news-page/news-page';
import { ProfilePage } from './pages/your-profile-page/profile-page';
import { CollectionPage } from './pages/collection-page/collection-page';
import { CreateCollectionPage } from './pages/create-collection-page/create-collection-page';
import { CreateNftPage } from './pages/create-nft-page/create-nft-page';
import { Layout } from './layout/Layout';
import { NftPage } from './pages/nft-page/nft-page';
import { FavoritePage } from "./pages/favorite-page/favorite-page";
import { NftDetailPage } from './pages/nft-detail-page/nft-detail-page';
import { ROUTES } from './core/data/routes';

import 'react-notifications-component/dist/theme.css'
import { LoadingOverlayProvider } from './core/context-provider/loading-overlay/loading-overlay-provider';

function App() {
    return (
        <UserProvider>
            <ReactNotification/>
            <Router>
                <LoadingOverlayProvider>
                    <Layout>
                        <Switch>
                            <Redirect exact from="/" to={ ROUTES.home }/>
                            <Route exact path={ `${ ROUTES.home }` } component={ HomePage }/>
                            <Route exact path={ `${ ROUTES.catalog }` } component={ CatalogPage }/>
                            <Route exact path={ `${ ROUTES.news }` } component={ NewsPage }/>
                            <Route exact path={ `${ ROUTES.profile }` } component={ ProfilePage }/>
                            <Route exact path={ `${ ROUTES.collection }` } component={ CollectionPage }/>
                            <Route exact path={ `${ ROUTES.nft }` } component={ NftPage }/>
                            <Route exact path={ `${ ROUTES.createNFT }` } component={ CreateNftPage }/>
                            <Route exact path={ `${ ROUTES.favorite }` } component={ FavoritePage }/>
                            <Route exact path={ `${ ROUTES.createCollection }` } component={ CreateCollectionPage }/>
                            <Route exact path={ `${ ROUTES.nftDetail }/:id` } component={ NftDetailPage }/>
                        </Switch>
                    </Layout>
                </LoadingOverlayProvider>
            </Router>
        </UserProvider>
    );
}


export default App;
