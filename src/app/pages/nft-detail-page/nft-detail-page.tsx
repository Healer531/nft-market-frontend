import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { CatalogCard, CatalogCardProps } from '../../component/catalog-card';
import Pagination from '@material-ui/lab/Pagination';
import { catalogFilterNft } from '../../core/utils/network/catalog';
import { NFT } from '../../core/models/nft';
import { category, countOnDisplay } from '../catalog-page/catalog-page';
import { environment } from '../../../environment';
import { Link } from 'react-router-dom';
import { useUser } from '../../core/context-provider/user/user-context';
import {
    addOrRemoveFavorite,
    getNftById,
    updateOwnerOfNFT,
    updatePriceOfNFT,
    updateSellTypeOfNFT
} from '../../core/utils/network/nft-detail';
import { toast } from '../../core/utils/notification.util';
import { erc721Abi, escrowAbi, treasuryAbi } from '../../core/data/web3-abi-address/abi';
import { erc721Address, escrowAddress, treasuryAddress } from '../../core/data/web3-abi-address/address';
import { ethUnit } from '../../core/data/ether-unit';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import LoadingOverlay from 'react-loading-overlay-ts';
import { SellType } from '../../core/enum/sell-type';
import { lengthOfAddress, reduceTheWalletAddress } from '../../core/utils/wallet';
import FavoriteButton from '../../component/favorite-button';
import { Favorite as FavoriteIcon, FavoriteBorder } from '@material-ui/icons';
import { Favorite } from '../../core/models/favorite';
import { formatTime } from '../../core/utils/network/time';
import { truncateToDecimals } from '../../core/utils/category';

export interface NftDetailPageProps {
    item: NFT;
    match: any
}

export const NftDetailPage: FunctionComponent<NftDetailPageProps> = (props) => {

    const nftInitialData = {
        id: '',
        nftName: '',
        creator: '',
        owner: '',
        category: '',
        royalty: 0,
        description: '',
        sellType: '',
        price: 0,
        logoImageName: '',
        nftFileName: '',
        logoImage: null,
        nftFile: null,
        countOfFavorites: 0,
    };
    const { walletAddress, token, connectWallet } = useUser();

    const[nftItem, setNftItem] = useState<NFT>(nftInitialData);
    const[isOwner, setIsOwner] = useState<boolean>(false);
    const[favorite, setFavorite] = useState<Favorite>({
        isFavorite: false,
        countOfUsers: 0,
    });
    const [sellType, setSellType] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [bidPrice, setBidPrice] = useState<number>(0);
    const [auctionDuration, setAuctionDuration] = useState<number>(0);
    const ethereum = window.ethereum;
    const web3 = new Web3(ethereum);
    const ropstenWeb3 = new Web3(new Web3.providers.HttpProvider(environment.ropstenNetworkUrl));

    useEffect(() => {
        const param = props.match.params;
        if(param.id === '') {
            return;
        }
        getNftById(param.id).then((nft) => {
            if (!nft) {
                return;
            }
            setNftItem(nft);
            loadSellTypeOfNFT(nft.id);
        });
    },[]);

    useEffect(() => {
        const param = props.match.params;
        if(walletAddress.length === lengthOfAddress && parseInt(param.id) > -1)
        {
            addOrRemoveFavorite(parseInt(param.id), walletAddress, true).then((result) => {
                setFavorite({ ...favorite, isFavorite: result.isFavorite, countOfUsers: result.countOfUsers });
            });
        }
        if(nftItem.owner === walletAddress) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }, [nftItem, walletAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        let isSubscribed = true;

        intervalId = setInterval(() => {
            if(auctionDuration > 0){
                setAuctionDuration(auctionDuration - 1);
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
            isSubscribed = false;
        }
    }, [auctionDuration])

    const loadSellTypeOfNFT = (id: number) => {
        const escrowContract = new ropstenWeb3.eth.Contract(escrowAbi, escrowAddress);
        const treasuryContract = new ropstenWeb3.eth.Contract(treasuryAbi, treasuryAddress);
        const erc721Contract = new ropstenWeb3.eth.Contract(erc721Abi, erc721Address);
        erc721Contract.methods.tokenStatus(id).call().then((status: any) => {
            setSellType(parseInt(status));
            if(parseInt(status) === SellType.Auction) {
                escrowContract.methods.getFinalPrice(id).call().then((finalPrice: number) => {
                    setBidPrice(truncateToDecimals(finalPrice / ethUnit));
                });
                treasuryContract.methods.auctionDuration(id).call().then((duration: number) => {
                    const currentTime = new Date();
                    let remainingTime = 0;
                    if (duration * 1000 - currentTime.getTime() < 0) {
                        remainingTime = 0;
                    } else {
                        remainingTime = Math.floor((duration * 1000 - currentTime.getTime()) / 1000);
                    }
                    setAuctionDuration(remainingTime);
                });
            }
        });
    }

    const setOnAuction = () => {
        const treasuryContract = new web3.eth.Contract(treasuryAbi, treasuryAddress);
        treasuryContract.methods.setOnAuction(nftItem.id, new BigNumber(nftItem.price * ethUnit), 14400).send({from: walletAddress})
            .on('error', function (error: any) {
                console.log(error);
            })
            .on('confirmation', async () => {
                updateSellTypeOfNFT(nftItem.id, 'Auction').then((result) => {
                    setIsLoading(false);
                    loadSellTypeOfNFT(parseInt(nftItem.id));
                    if(!result) {
                        return;
                    }
                    setNftItem(result);
                    toast('success', 'Nft was set on sale.');
                });
            });
    }

    const finishAuction = () => {
        const treasuryContract = new web3.eth.Contract(treasuryAbi, treasuryAddress);
        setIsLoading(true);
        treasuryContract.methods.finishAuction(nftItem.id).send({from: walletAddress})
            .on('error', function (error: any) {
                console.log(error);
                setIsLoading(false);
            })
            .on('confirmation', async () => {
                updateSellTypeOfNFT(nftItem.id, '').then((result) => {
                    setIsLoading(false);
                    loadSellTypeOfNFT(parseInt(nftItem.id));
                    if(!result) {
                        return;
                    }
                    setNftItem(result);
                    toast('success', 'Nft was set on sale.');
                });
            });
    }

    const setOnSale = () => {
        const treasuryContract = new web3.eth.Contract(treasuryAbi, treasuryAddress);
        setIsLoading(true);
        treasuryContract.methods.setOnSale(nftItem.id, new BigNumber(nftItem.price * ethUnit)).send({from: walletAddress})
            .on('error', function (error: any) {
                console.log(error);
                setIsLoading(false);
            })
            .on('confirmation', async () => {
                updateSellTypeOfNFT(nftItem.id, 'Sell').then((result) => {
                    setIsLoading(false);
                    loadSellTypeOfNFT(parseInt(nftItem.id));
                    if(!result) {
                        return;
                    }
                    setNftItem(result);
                    toast('success', 'Nft was set on sale.');
                });
            });
    }

    const cancelOnSale = () => {
        const treasuryContract = new web3.eth.Contract(treasuryAbi, treasuryAddress);
        setIsLoading(true);
        treasuryContract.methods.cancelOnSale(nftItem.id).send({from: walletAddress})
            .on('error', function (error: any) {
                console.log(error);
                setIsLoading(false);
            })
            .on('confirmation', async () => {
                updateSellTypeOfNFT(nftItem.id, '').then((result) => {
                    setIsLoading(false);
                    loadSellTypeOfNFT(parseInt(nftItem.id));
                    if(!result) {
                        return;
                    }
                    setNftItem(result);
                    toast('success', 'Nft was set on sale.');
                });
            });
    }

    const onTokenBuy = () => {
        const treasuryContract = new web3.eth.Contract(treasuryAbi, treasuryAddress);
        setIsLoading(true);
        treasuryContract.methods.buyToken(nftItem.id).send({from: walletAddress, value:nftItem.price * ethUnit})
            .on('error', function (error: any) {
                setIsLoading(false);
                console.log(error);
            })
            .on('confirmation', async () => {
                updateOwnerOfNFT(nftItem.id, walletAddress).then((result => {
                    setIsLoading(false);
                    loadSellTypeOfNFT(parseInt(nftItem.id));
                    if(result) {
                        toast('success', 'Transaction sent successfully.');
                        setNftItem(result);
                    }
                }));
            });
    }

    const onTokenBid = () => {
        if(bidPrice > nftItem.price) {
            const treasuryContract = new web3.eth.Contract(treasuryAbi, treasuryAddress);
            const escrowContract = new ropstenWeb3.eth.Contract(escrowAbi, escrowAddress);
            treasuryContract.methods.bidOnAuction(nftItem.id).send({from: walletAddress, value:bidPrice * ethUnit})
                .on('error', function (error: any) {
                    console.log(error);
                })
                .on('confirmation', async () => {
                    escrowContract.methods.getFinalPrice(nftItem.id).call().then((finalPrice: number) => {
                        setBidPrice(truncateToDecimals(finalPrice / ethUnit));
                    });
                });
        } else {
            toast('danger', 'New bid price is higher than old price.');
        }
    }

    return (
        <div className="d-flex flex-column flex-lg-row w-100 mt-100 border-1 border-secondary justify-content-between" style={{ minHeight: '70vh' }}>
            <div className="d-flex col-12 col-lg-9 justify-content-center my-30">
                {
                    nftItem.logoImageName !== '' && nftItem.logoImageName && (
                        <img className="border-1 h-100 border-radius-5" src={ `${environment.serverUrl}/nft/logo/${nftItem?.logoImageName}` } alt="example"/>
                    )
                }
            </div>
            <div className="d-flex flex-column justify-content-between col-12 col-lg-3 my-30">
                <div>
                    <div className="d-flex justify-content-between">
                        <h2 className="text-white">{nftItem?.nftName}</h2>
                        <FormControlLabel
                            className="d-flex align-items-center text-white h-100 ml-0 mr-0"
                            label={ favorite.countOfUsers }
                            labelPlacement="start"
                            control={
                                <Checkbox
                                    checked={ favorite.isFavorite }
                                    icon={<FavoriteBorder color={"primary"} />}
                                    checkedIcon={<FavoriteIcon />} name="checkedH"
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                        addOrRemoveFavorite(parseInt(nftItem.id), walletAddress, false).then((result) => {
                                            setFavorite(result);
                                        });
                                    }}
                                />
                            }

                        />
                   </div>
                    <div className="d-flex font-17 align-items-center text-white mt-20">
                        <div className="d-flex font-17 text-white">Price:</div>
                        <div className="ml-10 font-18 font-weight-bold text-white">{nftItem.price} ETH</div>
                    </div>
                    <div className="d-flex font-17 align-items-center text-white">
                        <div className="d-flex font-17 text-white">Creator:</div>
                        <div className="ml-10 font-18 font-weight-bold text-white">{reduceTheWalletAddress(nftItem.creator)}</div>
                    </div>
                    <div className="d-flex font-17 align-items-center text-white">
                        <div className="d-flex font-17 text-white">Owner:</div>
                        <div className="ml-10 font-18 font-weight-bold text-white">{reduceTheWalletAddress(nftItem.owner)}</div>
                    </div>
                    <div className="d-flex font-17 align-items-center text-white">
                        <div className="d-flex font-17 text-white">Sell Type:</div>
                        <div className="ml-10 font-18 font-weight-bold text-white">{nftItem.sellType}</div>
                    </div>
                    <div className="d-flex font-17 align-items-center text-white">
                        <div className="d-flex font-17 text-white">Category:</div>
                        <div className="ml-10 font-18 font-weight-bold text-white">{nftItem.category}</div>
                    </div>
                    <div className="mt-30 font-15 text-white">Description:</div>
                    <div className="font-15 text-white bg-dark border-1 border-radius-3 border-white"> {nftItem.description}</div>
                </div>
                {
                    walletAddress.length === lengthOfAddress ? (
                        <div>
                            {
                                sellType === SellType.Auction && (
                                    <div className="d-flex font-17 align-items-center text-white">
                                        <div className="d-flex font-17 text-white">Auction ends in:</div>
                                        <div className="ml-10 font-18 font-weight-bold text-white">{ formatTime(auctionDuration) }</div>
                                    </div>
                                )
                            }
                            {
                                isOwner ? (
                                    <div>
                                        {
                                            sellType === SellType.None && (
                                                <div>
                                                    <button className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white"
                                                            onClick={() => setOnAuction()}>
                                                        Set On Auction.
                                                    </button>
                                                    <button className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white"
                                                            onClick={() => setOnSale()}>
                                                        Set On Sale.
                                                    </button>
                                                </div>
                                            )
                                        }
                                        {
                                            sellType === SellType.Sell && (
                                                <button className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white"
                                                        onClick={() => cancelOnSale()}>
                                                    Cancel On Sale.
                                                </button>
                                            )
                                        }
                                        {
                                            sellType === SellType.Auction && (
                                                <button className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white"
                                                        onClick={() => finishAuction()}>
                                                    Finish On Auction.
                                                </button>
                                            )
                                        }

                                    </div>
                                ) : (
                                    <div>
                                        {
                                            sellType === SellType.Sell && (
                                                <button className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white"
                                                        onClick={() => onTokenBuy()}
                                                >
                                                    Buy
                                                </button>
                                            )
                                        }
                                        {
                                            sellType === SellType.Auction && (
                                                <div>
                                                    <input className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-white border-radius-4"
                                                           value={bidPrice}
                                                           onChange={ (e) => {
                                                               const value: string = e.target.value;
                                                               setBidPrice(parseFloat(value));
                                                           } }
                                                           type="number" placeholder="Price" name="name"/>
                                                    <button className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white"
                                                            onClick={() => onTokenBid()}
                                                    >
                                                        Bid
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        <div>
                            <button className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white"
                                    onClick={() => connectWallet()}
                            >
                                Connect Wallet
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
