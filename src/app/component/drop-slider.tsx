import React, { FunctionComponent } from 'react'
import { Icon } from 'semantic-ui-react';
import Slider from 'react-slick';

import { HotItem } from '../core/models/hot-item';
import { NftCard } from './nft-card';

export interface DropsProps {
  hotItems: HotItem[];
}

const DropSlider: FunctionComponent<DropsProps> = ({ hotItems }) => {

  let newDropSlider: Slider | null;

  const newDropSettings = {
    infinite: true,
    slidesToShow: 5,
    speed: 500,
    dots: false,
    arrows: false,
  };

  return (
    <div>
        {/*New Drops*/}
        <div className="d-flex justify-content-between w-100 mt-100 mt-100 height-50">
            <div className="d-flex h-100">
                <div className="border-left-5 border-secondary my-5"></div>
                <div className="font-32 text-center text-white ml-50">NEW DROPS</div>
            </div>
            <div className="d-flex width-100 h-100 align-items-center justify-content-between mr-30">
                <div className="d-flex border-1 border-secondary border-radius-4 text-white"
                     onClick={() => {
                         if (newDropSlider != null) {
                             newDropSlider.slickPrev();
                         }
                     }
                     }
                >
                    <Icon className="mr-0" name="angle left" size="big"/>
                </div>
                <div className="d-flex border-1 border-secondary border-radius-4 text-white"
                     onClick={() => {
                         if (newDropSlider != null) {
                             newDropSlider.slickNext();
                         }
                     }
                     }
                >
                    <Icon className="mr-0" name="angle right" size="big"/>
                </div>
            </div>
        </div>

        <Slider ref={c => (newDropSlider = c)}
                className="d-flex justify-content-between mt-30" {...newDropSettings} >
            {
                hotItems.map((item, index) => (
                        <NftCard item={item} key={index}/>
                    )
                )
            }
        </Slider>
    </div>
    )
  }

export default DropSlider
