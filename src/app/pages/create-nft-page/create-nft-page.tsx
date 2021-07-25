import React, { MouseEventHandler, useEffect, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import Web3 from 'web3';

import { useUser } from '../../core/context-provider/user/user-context';
import UploadIcon from '../../component/uploadIcon';
import { getMaxId, uploadNft } from '../../core/utils/network/nft';
import { NFT } from '../../core/models/nft';
import { toast } from '../../core/utils/notification.util';
import { erc721Abi, treasuryAbi } from '../../core/data/web3-abi-address/abi';
import { erc721Address, treasuryAddress } from '../../core/data/web3-abi-address/address';
import { updateOwnerOfNFT } from '../../core/utils/network/nft-detail';
import { environment } from '../../../environment';
import { lengthOfAddress } from '../../core/utils/wallet';
import { arrNftCategories } from '../../core/utils/category';
import { useOverlay } from '../../core/context-provider/loading-overlay/loading-overlay-context';
import { usePagination } from '@material-ui/lab';

export const CreateNftPage = () => {
    const nftInitialData: NFT = {
        id: '',
        nftName: '',
        creator: '',
        owner: '',
        category: '',
        royalty: 0,
        description: '',
        price: 0,
        sellType: '',
        logoImage: null,
        nftFile: null,
        countOfFavorites: 0,
    };
    const { walletAddress, token, connectWallet } = useUser();
    const [nft, setNft] = useState<NFT>(nftInitialData);
    const [nftFileName, setNftFileName] = useState('Upload Nft File');
    const [logoUrl, setLogoUrl] = useState('');
    const hiddenFileInput = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const arrCategory: string[] = ['Select Category'].concat(arrNftCategories);
    const ethereum = window.ethereum;
    const metaWeb3 = new Web3(ethereum);

    const { setOverlayText, setIsActivity } = useOverlay();

    useEffect(() => {
        if(walletAddress.length === lengthOfAddress) {
            setNft({ ...nft, creator: walletAddress });

            const erc721Contract = new metaWeb3.eth.Contract(erc721Abi, erc721Address);
            erc721Contract.methods.isApprovedForAll(walletAddress, treasuryAddress).call().then((isApprovedAddress: boolean) => {
                if(!isApprovedAddress) {
                    erc721Contract.methods.setApprovalForAll(treasuryAddress, true).send({from: walletAddress});
                    toast('danger', 'Please set approved all.');
                }
            });
        }
    }, [walletAddress]);

    const selectLogoImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null || event.target.files.length === 0) {
            return;
        }
        setLogoUrl(URL.createObjectURL(event.target.files[0]));
        setNft({ ...nft, logoImage: event.target.files[0] });
    }

    const selectNftFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null || event.target.files.length === 0) {
            return;
        }
        const nftFile = event.target.files[0];
        setNftFileName(nftFile.name);
        setNft({ ...nft, nftFile: event.target.files[0] });
    }

    const handleClick: MouseEventHandler = () => {
        if (hiddenFileInput === null || hiddenFileInput.current === null) {
            return;
        }
        hiddenFileInput.current.click();
    }

    const validateNft: any = () => {
        if(nft.nftName === '') {
            toast('danger', 'Please enter the NFT name.');
            return false;
        }
        if(nft.nftFile === null) {
            toast('danger', 'Please select the NFT file.');
            return false;
        }
        if(nft.category === '') {
            toast('danger', 'Please select the category.');
            return false;
        }
        if(nft.description === '') {
            toast('danger', 'Please enter the description.');
            return false;
        }
        if(nft.logoImage === null) {
            toast('danger', 'Please select the logo image.');
            return false;
        }
        if(nft.creator === '') {
            toast('danger', 'Please connect the wallet.');
            return false;
        }
        if(nft.royalty < 0) {
            toast('danger', 'Please enter the royalty.');
            return false;
        }
        if(nft.price < 0) {
            toast('danger', 'Please connect the price.');
            return false;
        }
        setNft({ ...nft, creator: walletAddress});
        return true;
    }

    const upload = async () => {
        if(!validateNft()) {
            return;
        }
        if(walletAddress.length !== lengthOfAddress) {
            toast('danger','Please connect wallet.');
            return;
        }

        const uploadedResult = await uploadNft(token, nft);
        if(uploadedResult.statusCode === 400) {
            toast('danger', uploadedResult.message);
            return;
        }

        const { createdNft, signedMessage } = uploadedResult;
        const { messageHash, r, s, v } = signedMessage;
        const erc721Contract = new metaWeb3.eth.Contract(erc721Abi, erc721Address);
        const isApprovedAddress = await erc721Contract.methods.isApprovedForAll(walletAddress, treasuryAddress).call();
        if(!isApprovedAddress) {
            await erc721Contract.methods.setApprovalForAll(treasuryAddress, true).send({from: walletAddress});
        }
        setIsActivity(true);
        setOverlayText('Uploading NFT...');
        erc721Contract.methods.mint(createdNft.id, [[walletAddress, nft.royalty]], createdNft.nftFileName, messageHash, v, r, s).send({from: walletAddress})
            .on('error', function (error: any) {
                setIsActivity(false);
            })
            .on('confirmation', async () => {
                const updated = await updateOwnerOfNFT(createdNft.id, walletAddress);
                setIsActivity(false);
                if(updated.statusCode === 400) {
                    toast('danger', updated.message);
                } else {
                    toast('success', 'Transaction is success');
                    setNft(nftInitialData);
                    setNftFileName('Upload Nft File');
                    setLogoUrl('');
                }
            });
    }

    return (
        <div className="d-flex w-100 justify-content-center">
            <div className="d-flex flex-column mt-120 min-vh-100">
                <div className="text-white font-36"> Create NFT</div>

                <div className="d-flex flex-column justify-content-between bg-dark flex-lg-row border-1 border-radius-10 border-secondary mt-20 p-20">
                    <div className="d-flex justify-content-center align-items-center width-400 height-400 border-1 border-radius-10 border-secondary">
                        <div className="d-flex flex-column justify-content-center align-items-center position-absolute">
                            <UploadIcon className="width-150 height-150"/>
                            <div className="font-24 text-white">
                                Choose Logo Image File
                            </div>
                        </div>
                        <input className="position-absolute cursor-pointer width-400 height-400" style={{ opacity: 0 }}
                               type="file" accept="image/*" onChange={ (event) => selectLogoImage(event) }/>
                            {
                                logoUrl.length > 0 && (
                                    <img className="border-radius-10 object-fit-cover w-100 h-100" src={ logoUrl } alt="img"/>
                                )
                            }
                    </div>
                    <div className="d-flex flex-column justify-content-between ml-lg-20 min-width-300">
                        <div className="d-flex flex-column">
                            <div className="font-20 text-white"> NFT Name</div>
                            <input
                                className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-secondary border-radius-4"
                                value={nft.nftName}
                                onChange={(e) => {
                                    setNft({...nft, nftName: e.target.value});
                                }}
                                type="text" placeholder="NFT  Name" name="name"/>
                        </div>
                        <div className="d-flex flex-column mt-10">
                            <div className="font-20 text-white"> NFT File</div>
                            <button
                                className="d-flex flex-column bg-dark align-items-center border-1 border-secondary border-radius-4 p-4"
                                onClick={ handleClick }>
                                <UploadIcon className="height-35"/>
                                <div className="font-20 text-white"> { nftFileName } </div>
                            </button>
                            <input
                                type="file"
                                ref={ hiddenFileInput }
                                onChange={ selectNftFile }
                                style={ { display: 'none' } }
                            />
                        </div>
                        <div className="d-flex flex-column mt-10">
                            <div className="font-20 text-white"> Category</div>
                            <select
                                className="text-white w-100 mt-5 border-1 border-radius-4 border-white height-45 cursor-pointer bg-transparent"
                                value={arrCategory.indexOf(nft.category)}
                                style={ { background: 'no-repeat center right', backgroundSize: '12px auto' } }
                                onChange={ (e) => {
                                    const index: string = e.target.value;
                                    setNft({ ...nft, category: parseInt(index) === 0 ? '' : arrCategory[parseInt(index)] });
                                } }>
                                {
                                    arrCategory.map((item: string, index: number) => (
                                        <option className="text-dark" value={ index } key={ index }>{ item }</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="d-flex flex-column mt-10">
                            <div className="font-20 text-white"> Royalty</div>
                            <input className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-white border-radius-4"
                                   value={nft.royalty}
                                   onChange={ (e) => {
                                       const value: string = e.target.value;
                                       setNft({ ...nft, royalty: parseFloat(value) });
                                   } }
                                   type="number" placeholder="Royalty" name="name"/>
                        </div>

                        <div className="d-flex flex-column mt-10">
                            <div className="font-20 text-white"> Price:</div>
                            <input className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-white border-radius-4"
                                   value={nft.price}
                                   onChange={ (e) => {
                                       const value: string = e.target.value;
                                       setNft({ ...nft, price: parseFloat(value) });
                                   } }
                                   type="number" placeholder="Price" name="name"/>
                        </div>

                        <div className="d-flex flex-column mt-10">
                            <div className="font-20 text-white"> Description</div>
                            <textarea
                                className="font-15 mt-5 height-80 bg-dark text-white border-1 border-white border-radius-4 resize"
                                value={nft.description}
                                onChange={(e) => {
                                    const value: string = e.target.value;
                                    setNft({ ...nft, description: value });
                                }}
                                placeholder="Description" name="name" spellCheck={ false }/>
                        </div>
                        {
                            walletAddress.length === lengthOfAddress ? (
                                <button
                                    className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white"
                                    onClick={ () => upload() }>
                                    Create
                                </button>
                            ) : (
                                <button
                                    className="border-radius-4 border-0 w-100 height-40 mt-20 bg-success font-14 font-weight-bold text-white"
                                    onClick={ () => connectWallet() }>
                                    Connect Wallet
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
