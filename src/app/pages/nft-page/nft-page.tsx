import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import NftItemSlider from '../../component/nft-item-slider';
import { HotItem } from '../../core/models/hot-item';
import { hotItemData } from '../../core/data/hot-item-data';
import { ROUTES } from '../../core/data/routes';

export const NftPage = () => {

    const [hotItems, setHotItems] = useState<HotItem[]>(hotItemData);

    return (
        <div className="d-flex flex-column w-100 bg-primary mt-50 min-vh-100">
            <div className="d-flex justify-content-end w-100 mt-100 height-50">
                <NavLink activeClassName="active" to={ ROUTES.createNFT }>
                    <button className="border-radius-4 border-0 width-150 h-100 bg-success font-14 font-weight-bold text-white">
                        Create NFT
                    </button>
                </NavLink>
            </div>

            <NftItemSlider hotItems={hotItems}/>
        </div>
    );
}
