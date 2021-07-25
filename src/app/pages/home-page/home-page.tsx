import React, { useState } from 'react';

import HotItemSlider from '../../component/hot-item-slider';
import DropSlider from '../../component/drop-slider';
import RecentlyView from '../../component/recently-view';
import { HotItem } from '../../core/models/hot-item';
import { hotItemData, recentData } from '../../core/data/hot-item-data';

import 'slick-carousel/slick/slick-theme.css';
import 'semantic-ui-css/semantic.min.css'
import 'slick-carousel/slick/slick.css';
import './home-page.scss'


export const HomePage = () => {

    const [hotItems, setHotItems] = useState<HotItem[]>(hotItemData);
    const [recent, setRecent] = useState<HotItem[]>(recentData);

    return (
        <div className="d-flex flex-column w-100 bg-primary mt-10">

            {/*Hot Items*/ }
            <HotItemSlider hotItems={ hotItems }/>

            {/*New Drops*/ }
            <DropSlider hotItems={ hotItems }/>

            {/*Hot Items*/ }
            <DropSlider hotItems={ hotItems }/>

            <div className="row mt-30">
                {/*Recently Viewed*/ }
                <RecentlyView title={ 'Recently Viewed' } recentlyViewData={ recent }/>

                {/*Your Auctions*/ }
                <RecentlyView title={ 'Your Auctions' } recentlyViewData={ recent }/>

                {/*Collections*/ }
                <RecentlyView title={ 'Collections' } recentlyViewData={ recent }/>
            </div>

        </div>
    );
}
