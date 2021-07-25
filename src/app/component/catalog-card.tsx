import React, { FunctionComponent, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { NFT } from '../core/models/nft';
import FavoriteButton from './favorite-button';
import { environment } from '../../environment';

export interface CatalogCardProps {
    nftItem: NFT;
    isFavoritePage: boolean
}

export const CatalogCard: FunctionComponent<CatalogCardProps> = ({ nftItem, isFavoritePage }) => {

    return (
        <div className="d-flex flex-column flex-xs-column border-1 border-secondary border-radius-3" >
            <Link to={ { pathname: `/nftDetail/${nftItem.id}`} }>
                {
                    nftItem.logoImageName !== '' && nftItem.logoImageName && (
                        <img className="border-1 w-100 max-height-250 border-radius-5" src={ `${environment.serverUrl}/nft/logo/${nftItem.logoImageName}` } alt="example"/>
                    )
                }
            </Link>
            <div className="d-flex w-100 flex-column justify-content-between text-white p-10">
                <div className="d-flex flex-column">
                    <div className="d-flex font-23">{ nftItem.nftName }</div>
                    <span>Price: 13$</span>
                    <div className="d-flex w-100 height-45 justify-content-between mt-20">
                        <button
                            className="border-radius-4 border-0 w-70 h-100 bg-success font-14 font-weight-bold text-white">
                            Buy Now
                        </button>
                        <FavoriteButton isFavoritePage={ isFavoritePage }/>
                    </div>
                </div>
            </div>
        </div>
    )
}
