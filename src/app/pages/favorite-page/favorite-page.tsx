import React, { ChangeEvent, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Pagination from '@material-ui/lab/Pagination';

import { CatalogCard } from '../../component/catalog-card';
import { NFT } from '../../core/models/nft';

export interface category {
    name: string;
    value: boolean;
}

export const FavoritePage = () => {

    const [arrFavoriteNft, setArrFavoriteNft] = useState<NFT[]>([]);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [categories, setCategories] =
        useState<category[]>([
            { name: 'Art', value: false },
            { name: 'Video', value: false },
            { name: 'Podcast', value: false },
            { name: 'Sports', value: false },
            { name: 'Tickets', value: false },
            { name: 'Music', value: false },
            { name: 'Gaming', value: false },
        ]);

    return (
        <div className="d-flex flex-column flex-lg-row w-100 mt-100 border-1 border-secondary justify-content-between">
            <div className="d-flex flex-column col-12 col-lg-3 p-30">
                <div className="d-flex justify-content-between">
                    <h4 className="text-white">Filters</h4>
                    <button className="border-0 bg-primary text-secondary">Clear All</button>
                </div>
                <div className="d-flex flex-column justify-content-between mt-20">
                    <div className="font-15 text-white">Key Word:</div>
                    <input
                        className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-white border-radius-4 mt-10"
                        type="number" placeholder="Royalty" name="name"/>
                </div>
                <div className="d-flex flex-column justify-content-between mt-20">
                    <div className="font-15 text-white">Sort by:</div>
                    <input
                        className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-white border-radius-4 mt-10"
                        type="number" placeholder="Royalty" name="name"/>
                </div>
                <div className="d-flex flex-column justify-content-between mt-20">
                    <div className="font-15 text-white">Price:</div>
                    <Slider
                        value={ priceRange }
                        onChange={ (event, newValue: number | number[]) => {
                            if (typeof newValue === 'number') {
                                return;
                            }
                            setPriceRange([newValue[0], newValue[1]])
                        }
                        }
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />
                </div>
                <div className="d-flex flex-column justify-content-between mt-20">
                    <div className="font-15 text-white mb-10">Category:</div>
                    {
                        categories.map((item: category, index: number) => (
                            <FormControlLabel
                                className="text-white font-24"
                                key={ index }
                                label={ item.name }
                                control={
                                    <Checkbox
                                        checked={ item.value }
                                        style={ { color: '#a782e9' } }
                                        onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                            categories[index].value = event.target.checked;
                                            setCategories([...categories]);
                                        } }
                                    />
                                }
                            />
                        ))
                    }
                </div>
                <button
                    className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-white border-radius-4 mt-10"
                    placeholder="Royalty" name="name">
                    Apply Filter
                </button>
            </div>
            <div className="col-12 col-lg-9 row justify-content-center my-30">
                {
                    arrFavoriteNft.map((item, index) => (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-10" key={ index }>
                                <CatalogCard nftItem={ item } key={ index } isFavoritePage={ true }/>
                            </div>
                        )
                    )
                }
                <div className="d-flex justify-content-between my-20">
                    <div>

                    </div>
                    <Pagination count={ 10 } variant="outlined" shape="rounded"/>
                </div>
            </div>
        </div>
    );
}
