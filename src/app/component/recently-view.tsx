import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import { HotItem } from '../core/models/hot-item';

export interface RecentlyViewProps {
    title: string
    recentlyViewData: HotItem[];
}

const RecentlyView: FunctionComponent<RecentlyViewProps> = ({ title, recentlyViewData }) => {

  return (
    <div className="col-12 col-md-6 col-xl-4">
        <div className="row">
            <div className="col-12">
                <div className="d-flex w-100 align-items-center justify-content-between">
                    <div className="font-30 text-white">{ title }</div>
                    <button className="d-flex width-80 height-30 bg-dark border-radius-6 border-1 text-white justify-content-center align-items-center">
                        View All
                    </button>
                </div>

                <div className="d-flex flex-column w-100 mt-15 border-1 border-secondary border-radius-6 align-items-center justify-content-center">
                    {
                        recentlyViewData.map((item, index) => (
                                <div className="d-flex w-100 p-20" key={index}>
                                    <Link to={{pathname: '/nftDetail', state: {nftId: item.nftName}}}>
                                        <img className="border-1 border-radius-5 w-100" src="./images/card.jpg" alt="example"/>
                                    </Link>
                                    <div className="d-flex w-100 flex-column justify-content-between text-white ml-20">
                                        <div className="d-flex font-16"> The Evil Within: The Assignment </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex flex-column">
                                                <div className="d-flex font-24"> $1.99 </div>
                                                <div className="d-flex">
                                                    <div className="d-flex font-13 font-italic"> $4.99 </div>
                                                    <div className="d-flex font-13 ml-10"> 60% OFF </div>
                                                </div>
                                            </div>
                                            <button className="border-1 bg-success border-radius-6 width-45 height-45">
                                                <Icon className="mr-0" name="plus"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>

            </div>

        </div>
    </div>
    )
  }

export default RecentlyView
