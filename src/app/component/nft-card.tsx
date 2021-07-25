import { HotItem } from '../core/models/hot-item';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './favorite-button';

export interface NftCardProps {
    item: HotItem;
    key: number;
}

export const NftCard: FunctionComponent<NftCardProps> = ({ item,key }) => {
    return(
        <div className="d-flex w-95 flex-column border-1 border-secondary border-radius-3" key={key}>
            <Link to={{pathname: '/nftDetail', state: {nftId: item.nftName}}}>
                <img className="border-1 width-240 height-320 border-radius-5 height-280" src="./images/card.jpg"
                     alt="example"/>
            </Link>
            <div className="d-flex w-100 flex-column justify-content-between text-white p-10">
                <div className="d-flex flex-column">
                    <div className="d-flex font-30">{item.nftName}</div>
                    <span>Category: {item.category}</span>
                    <span>Category: {item.category}</span>
                </div>
                <div className="d-flex flex-column">
                    <div className="d-flex font-30">{item.nftName}</div>
                    <span>Category: {item.category}</span>
                    <div className="d-flex w-100 height-45 justify-content-between mt-20">
                        <button
                            className="border-radius-4 border-0 w-70 h-100 bg-success font-14 font-weight-bold text-white">
                            Buy Now
                        </button>
                        <FavoriteButton isFavoritePage={ false }/>
                    </div>
                </div>
            </div>
        </div>
    )
}
