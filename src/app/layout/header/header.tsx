import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useUser } from '../../core/context-provider/user/user-context';

import { ROUTES } from '../../core/data/routes';
import { toast } from '../../core/utils/notification.util';
import { isBscNetwork, login } from '../../core/utils/network/user';
import { getLocalStorageWalletAddress, lengthOfAddress, setLocalStorageWalletAddress } from '../../core/utils/wallet';

import '../layout.scss';
import { RouteItem } from '../../core/models/route';
import { Search } from '../../core/models/search';
import { arrNftCategories } from '../../core/utils/category';

declare global {
    interface Window {
        ethereum: any;
    }
}

export const Header = () => {

    const arrCategory: string[] = ['All Category'].concat(arrNftCategories);
    const [category, setCategory] = useState('All Category');

    const { walletAddress, setWalletAddress, setToken, connectWallet } = useUser();
    const [searchData, setSearchData] = useState<Search>({
        keyWord: '',
        category: arrNftCategories,
    });

    useEffect(() => {
        loadWallet().then();
    });

    const mainPages: RouteItem[] = [
        {
            name: 'HOME',
            route: ROUTES.home
        }, {
            name: 'CATALOG',
            route: ROUTES.catalog
        }, {
            name: 'NEWS',
            route: ROUTES.news
        }, {
            name: 'YOUR PROFILE',
            route: ROUTES.profile
        }
    ];

    const userPages: RouteItem[] = [
        {
            name: 'FAVORITES',
            route: ROUTES.favorite
        }, {
            name: 'SUBSCRIPTION',
            route: ROUTES.subscription
        }, {
            name: 'CREATE',
            route: ROUTES.createNFT
        }, {
            name: 'SELL',
            route: ROUTES.sell
        }
    ];

    const disconnectWallet = () => {
        setWalletAddress('');
        setLocalStorageWalletAddress('').then();
    }

    const loadWallet = async () => {
        if (!await isBscNetwork()) {
            setWalletAddress('');
            return;
        }
        if(getLocalStorageWalletAddress() !== '') {
            setWalletAddress(getLocalStorageWalletAddress());
        }
    }

    return (
        <header className="w-100 bg-primary">
            <div className="d-flex flex-column justify-content-center height-60 border-bottom-1 border-secondary">
                <div className="d-none d-lg-flex">
                    <div className="container h-100">
                        <div className="d-flex h-100">
                            <div className="d-flex align-items-center  justify-content-between flex-grow-1 mr-200">
                                {
                                    mainPages.map((page: RouteItem, index) => (
                                        <NavLink activeClassName="active" to={ page.route } key={ index }>
                                            <span className="font-weight-bold">{ page.name }</span>
                                        </NavLink>
                                    ))
                                }
                            </div>
                            <div className="d-flex align-items-center text-white">
                                {
                                    walletAddress.length === lengthOfAddress ? (
                                        <button className="min-width-135 btn btn-danger"
                                                onClick={ () => disconnectWallet() }>Disconnect Wallet</button>
                                    ) : (
                                        <button className="min-width-135 btn btn-danger"
                                                onClick={ () => connectWallet() }>Connect Wallet</button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column justify-content-center border-bottom-1 border-secondary py-5">
                <div className="d-none d-lg-flex">
                    <div className="d-flex justify-content-between container h-100">
                        <div className="d-flex align-items-center border-1 border-radius-3 border-secondary p-5">
                            <input className="bg-primary border-0 text-white font-18" type="text" placeholder="I'm searching for..."
                                    onChange={(e) => {
                                        setSearchData({...searchData, keyWord: e.target.value});
                                    }}/>
                            <div className="h-80 border-right-1 border-secondary"/>
                            <select className="d-none d-lg-flex mx-20 bg-primary border-0 h-100 text-white font-18"
                                value={arrCategory.indexOf(category)}
                                style={ { background: 'no-repeat center right', backgroundSize: '12px auto' } }
                                onChange={ (e) => {
                                    const index: string = e.target.value;
                                    setCategory(arrCategory[parseInt(index)]);
                                    if(parseInt(index) === 0) {
                                        setSearchData({ ...searchData, category: arrNftCategories });
                                    } else {
                                        const temp = [arrCategory[parseInt(index)]];
                                        setSearchData({ ...searchData, category: temp });
                                    }
                                } }>
                                {
                                    arrCategory.map((item: string, index: number) => (
                                        <option value={ index } key={ index }>{ item }</option>
                                    ))
                                }
                            </select>

                            <div className="h-80 border-right-1 border-secondary"/>
                            <Link className="bg-primary border-0 height-40 width-45" to={{ pathname: ROUTES.catalog, state: searchData }}>
                                <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' stroke='#a782e9'
                                     viewBox='0 0 512 512'>
                                    <path
                                        d='M221.09,64A157.09,157.09,0,1,0,378.18,221.09,157.1,157.1,0,0,0,221.09,64Z'
                                        style={ {
                                            fill: 'none',
                                            strokeLinecap: 'round',
                                            strokeLinejoin: 'round',
                                            strokeWidth: '32px'
                                        } }/>
                                    <line x1='338.29' y1='338.29' x2='448' y2='448'
                                          style={ {
                                              fill: 'none',
                                              strokeLinecap: 'round',
                                              strokeLinejoin: 'round',
                                              strokeWidth: '32px'
                                          } }/>
                                </svg>
                            </Link>
                        </div>
                        <div className="d-flex align-items-center">
                            {
                                userPages.map((page: RouteItem, index) => (
                                    <NavLink className="ml-30" to={ page.route } key={ index }>
                                        <span className="font-weight-bold">{ page.name }</span>
                                    </NavLink>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );

}
