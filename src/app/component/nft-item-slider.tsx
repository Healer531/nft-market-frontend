import React, { FunctionComponent } from 'react'
import { Icon } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import Slider from 'react-slick';

import { HotItem } from '../core/models/hot-item';
import FavoriteButton from './favorite-button';
import { ROUTES } from '../core/data/routes';

export interface NftItemProps {
  hotItems: HotItem[];
}

const NftItemSlider: FunctionComponent<NftItemProps> = ({ hotItems }) => {

  let hotIemSlider: Slider | null;

  const hotItemSettings = {
    infinite: true,
    slidesToShow: 2,
    speed: 500,
    dots: false,
    arrows: false,
  };

  return (
    <div>
        {/**/}
        <div className="d-flex justify-content-between w-100 mt-20 height-50">
            <div className="d-flex h-100">
                <div className="border-left-5 border-secondary my-5"></div>
                <div className="font-32 text-center text-white ml-50">YOUR NFTS</div>
            </div>
            <div className="d-flex width-100 h-100 align-items-center justify-content-between mr-30">
                <div className="d-flex border-1 border-secondary border-radius-4 text-white"
                     onClick={() => {
                             if (hotIemSlider != null) {
                                 hotIemSlider.slickPrev();
                             }
                         }
                     }
                >
                    <Icon className="mr-0" name="angle left" size="big"/>
                </div>
                <div className="d-flex border-1 border-secondary border-radius-4 text-white"
                     onClick={() => {
                             if (hotIemSlider != null) {
                                 hotIemSlider.slickNext();
                             }
                         }
                     }
                >
                    <Icon className="mr-0" name="angle right" size="big"/>
                </div>
            </div>
        </div>
        <Slider ref={c => (hotIemSlider = c)}
                className="d-flex justify-content-between mt-30" {...hotItemSettings} >
            {
                hotItems.map((item, index) => (
                        <div className="d-flex flex-column flex-lg-row w-95 border-1 border-secondary border-radius-3 p-20" key={index}>
                            <Link to={{pathname: '/nftDetail', state: {nftId: item.nftName}}}>
                                <img className="width-240 height-320 border-1 border-radius-5" src="./images/card.jpg" alt="example"/>
                            </Link>
                            <div className="d-flex w-100 flex-column justify-content-between text-white ml-20">
                                <div className="d-flex flex-column">
                                    <div className="d-flex font-30"> {item.nftName} </div>
                                    <span> Category: {item.category} </span>
                                    <span> Category: {item.category} </span>
                                </div>
                                <div className="d-flex flex-column">
                                    <div className="d-flex font-30">{item.nftName}</div>
                                    <span>Category: {item.category}</span>
                                    <div className="d-flex w-100 height-45 justify-content-between mt-20">
                                        <NavLink activeClassName="active" to={ ROUTES.createNFT }>
                                            <button className="border-radius-4 border-0 width-150 h-100 bg-success font-14 font-weight-bold text-white">
                                                Create NFT
                                            </button>
                                        </NavLink>
                                        <FavoriteButton isFavoritePage={ false }/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )
            }
        </Slider>
    </div>
    )
  }

  export default NftItemSlider
