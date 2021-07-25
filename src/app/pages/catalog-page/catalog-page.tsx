import React, { ChangeEvent, useEffect, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Pagination from '@material-ui/lab/Pagination';

import { CatalogCard } from '../../component/catalog-card';
import { catalogFilterNft } from '../../core/utils/network/catalog';
import { Filter } from '../../core/models/filter';
import { NFT } from '../../core/models/nft';

import './catalog-page.scss'
import { useUser } from '../../core/context-provider/user/user-context';
import { arrNftCategories } from '../../core/utils/category';

export const countOnDisplay: number = 12;

export interface category {
    name: string;
    value: boolean;
}

export interface CatalogProps {
    location: any
}

export const CatalogPage = (props: CatalogProps) => {
    const [filterData, setFilterData] = useState<Filter>({
        keyWord: '',
        priceRange: [0, 100],
        categories: arrNftCategories,
        offset: 0,
        sortMethod: '',
        limit: countOnDisplay,
    });
    const [nftItems, setNftItems] = useState<NFT[]>([]);
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
    const [sortMethod, setSortMethod] = useState<string>('');
    const arrSortMethode: string[] = ['Relevance', 'Newest', 'Oldest', 'Lowest Price', 'Highest Price'];
    const [pageCount, setPageCount] = useState<number>(0);

    const getArrCategory = (categories: category[]) => {
        let arrCategory: string[] = [];
        categories.map((item: category) => {
            if(item.value) {
                arrCategory.push(item.name);
            }
        });
        if(arrCategory.length === 0) {
            categories.map((item: category) => {
                arrCategory.push(item.name);
            });
        }
        return arrCategory;
    }

    useEffect(() => {
        let filter;
        if(props.location.state) {
            const { keyWord, category } = props.location.state;
            filter = { ...filterData, keyWord: keyWord, categories: category };
        }
        else {
            filter = filterData
        }
        catalogFilterNft(filter).then((result: [NFT[], number]) => {
            if(!result || !result[0]) {
                return;
            }
            setNftItems(result[0]);
            if(parseInt(String(result[1] / countOnDisplay)) === 0){
                setPageCount(parseInt(String(result[1] / countOnDisplay)));
            } else if(parseInt(String(result[1] / countOnDisplay)) > 0) {
                setPageCount(parseInt(String(result[1] / countOnDisplay)) + 1);
            }
        });
    },[]);

    const filter = () => {
        catalogFilterNft(filterData).then((result: [NFT[], number]) => {
            if(!result || !result[0]) {
                return;
            }
            setNftItems(result[0]);
            if(parseInt(String(result[1] / countOnDisplay)) === 0){
                setPageCount(parseInt(String(result[1] / countOnDisplay)));
            } else if(parseInt(String(result[1] / countOnDisplay)) > 0) {
                setPageCount(parseInt(String(result[1] / countOnDisplay)) + 1);
            }
        });
    }

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
                        value={filterData.keyWord}
                        onChange={(e) => {
                                setFilterData({...filterData, keyWord: e.target.value});
                            }
                        }
                        type="text" placeholder="Royalty" name="name"/>
                </div>
                <div className="d-flex flex-column justify-content-between mt-20">
                    <div className="font-15 text-white">Sort by:</div>
                    <select
                        className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-white border-radius-4 mt-10"
                        style={ { background: 'no-repeat center right', backgroundSize: '12px auto' } }
                        onChange={ (e) => {
                            const index: string = e.target.value;
                            if(parseInt(index) < 1) {
                                setFilterData({...filterData, sortMethod: ''});
                            }
                            setFilterData({...filterData, sortMethod: arrSortMethode[parseInt(index)]});
                        } }>
                        {
                            arrSortMethode.map((item: string, index: number) => (
                                <option className="text-white" value={ index } key={ index }>{ item }</option>
                            ))
                        }
                    </select>
                </div>
                <div className="d-flex flex-column justify-content-between mt-20">
                    <div className="font-15 text-white">Price:</div>
                    <Slider
                        value={ priceRange }
                        onChange={ (event, newValue: number | number[]) => {
                                if (typeof newValue === 'number') {
                                    return;
                                }
                                setFilterData({...filterData, priceRange: [newValue[0], newValue[1]]});
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
                                            setFilterData({...filterData, categories: getArrCategory(categories)});
                                        } }
                                    />
                                }
                            />
                        ))
                    }
                </div>
                <button
                    className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-white border-radius-4 mt-10"
                    onClick={() => filter()}
                    placeholder="Royalty" name="name">
                    Apply Filter
                </button>
            </div>
            <div className="d-flex flex-column justify-content-between col-12 col-lg-9 justify-content-center my-30">
                <div className="row">
                    {
                        nftItems.map((item, index) => (
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-10" key={ index }>
                                    <CatalogCard nftItem={ item } isFavoritePage={ false }/>
                                </div>
                            )
                        )
                    }
                </div>
                <div className="d-flex justify-content-center my-20">
                    {
                        pageCount > 1 && (
                            <Pagination count={ pageCount } variant="outlined" shape="rounded"
                                        onChange={(event, value) => {
                                            const offset = (value - 1) * countOnDisplay;
                                            setFilterData({...filterData, offset: offset});
                                            catalogFilterNft({...filterData, offset: offset}).then(async (result: [NFT[], number]) => {
                                                if(!result) {
                                                    return;
                                                }
                                                await setNftItems(result[0]);
                                            });
                                        }}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
}
