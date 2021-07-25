import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useUser } from '../../core/context-provider/user/user-context';
import { HotItem } from '../../core/models/hot-item';
import { hotItemData } from '../../core/data/hot-item-data';
import CollectionItemSlider from '../../component/collection-item-slider';
import { ROUTES } from '../../core/data/routes';

export const CollectionPage = () => {

    const [hotItems, setHotItems] = useState<HotItem[]>(hotItemData);

    return (
        <div className="d-flex flex-column w-100 bg-primary mt-50 min-vh-100">
            <div className="d-flex justify-content-end w-100 mt-100 height-50">
                <NavLink activeClassName="active" to={ ROUTES.createCollection }>
                    <button className="border-radius-4 border-0 width-150 h-100 bg-success font-14 font-weight-bold text-white">
                        Create Collection
                    </button>
                </NavLink>
            </div>

            <CollectionItemSlider hotItems={hotItems}/>
        </div>
    );
}
