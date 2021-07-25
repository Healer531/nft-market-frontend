import React, { FunctionComponent } from 'react'
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import { HotItem } from '../core/models/hot-item';
import FavoriteButton from './favorite-button';

export interface HotItemProps {
    hotItems: HotItem[];
}

const HotItemSlider: FunctionComponent<HotItemProps> = ({ hotItems }) => {

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
            {/**/ }
            <div className="d-flex d-lg-flex justify-content-between w-100 mt-100 mt-100 height-50">
                <div className="d-flex h-100">
                    <div className="border-left-5 border-secondary my-5"></div>
                    <div className="font-32 text-center text-white ml-50">HOT ITEMS</div>
                </div>
                <div className="d-flex width-100 h-100 align-items-center justify-content-between mr-30">
                    <div className="d-flex border-1 border-secondary border-radius-4 text-white"
                         onClick={ () => {
                             if (hotIemSlider != null) {
                                 hotIemSlider.slickPrev();
                             }
                         }
                         }
                    >
                        <Icon className="mr-0" name="angle left" size="big"/>
                    </div>
                    <div className="d-flex border-1 border-secondary border-radius-4 text-white"
                         onClick={ () => {
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
            <Slider ref={ c => (hotIemSlider = c) }
                    className="d-flex justify-content-between mt-30" { ...hotItemSettings } >
                {
                    hotItems.map((item, index) => (
                            <div className="p-10" key={ index }>
                                <div
                                    className="d-flex flex-column flex-lg-row w-100 border-1 border-secondary border-radius-3 p-10">
                                    <Link to={ { pathname: '/nftDetail', state: { nftId: item.nftName } } }>
                                        <img className="width-240 height-320 border-1 border-radius-5" src="./images/card.jpg" alt="example"/>
                                    </Link>
                                    <div className="d-flex w-100 flex-column justify-content-between text-white ml-20">
                                        <div className="d-flex flex-column">
                                            <div className="d-flex font-30"> { item.nftName } </div>
                                            <span> Category: { item.category } </span>
                                            <span> Category: { item.category } </span>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <div className="d-flex font-30">{ item.nftName }</div>
                                            <span>Category: { item.category }</span>
                                            <div className="d-flex w-100 height-45 justify-content-between mt-20">
                                                <button
                                                    className="border-radius-4 border-0 width-150 h-100 bg-success font-14 font-weight-bold text-white">
                                                    Buy Now
                                                </button>
                                                <FavoriteButton isFavoritePage={ false }/>
                                            </div>
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

export default HotItemSlider
