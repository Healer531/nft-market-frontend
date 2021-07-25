import React, { useEffect, useState } from 'react';
import UploadIcon from '../../component/uploadIcon';
import { User } from '../../core/models/user';
import { lengthOfAddress, reduceTheWalletAddress } from '../../core/utils/wallet';
import { useUser } from '../../core/context-provider/user/user-context';
import { getUserByWalletAddress, uploadNft } from '../../core/utils/network/user';
import { toast } from '../../core/utils/notification.util';
import { environment } from '../../../environment';

export const ProfilePage = () => {
    const initialUserData: User = {
        id: -1,
        userName: '',
        walletAddress: '',
        logoImageName: '',
        logoImage: null,
        favoriteNFTs: [],
    };
    const { walletAddress, token, connectWallet } = useUser();
    const [logoUrl, setLogoUrl] = useState<string>('./images/user.svg');
    const [user, setUser] = useState<User>(initialUserData);

    useEffect(() => {
        if(walletAddress.length !== lengthOfAddress) {
            setUser(initialUserData);
            // toast('danger', 'Please connect wallet');
        } else {
            getUserByWalletAddress(walletAddress).then((user) => {
                setUser(user);
            });
        }
    }, [walletAddress])

    const selectLogoImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null || event.target.files.length === 0) {
            return;
        }
        setLogoUrl(URL.createObjectURL(event.target.files[0]));
        setUser({ ...user, logoImage: event.target.files[0] });
    }

    const uploadProfile = () => {
        uploadNft(user).then((result) => {
            console.log(result);
        });
    }

    return (
        <div className="d-flex w-100 align-items-center mt-100 flex-column" style={{ minHeight: '75vh' }}>
            <div className="d-flex flex-column justify-content-between bg-dark flex-lg-row border-1 border-radius-10 border-secondary mt-20 p-20">
                <div className="d-flex justify-content-center align-items-center width-100 height-100 border-1 border-radius-10 border-secondary">
                    <input className="position-absolute cursor-pointer width-100 height-100" style={{ opacity: 0 }}
                           type="file" accept="image/*" onChange={ (event) => selectLogoImage(event) }/>
                    {
                        user.logoImageName.length > 0 ? (
                            <img className="border-radius-10 object-fit-cover w-100 h-100"
                                 src={ `${environment.serverUrl}/user/logo/${ user.logoImageName }` } alt="img"/>
                        ) : (
                            <img className="border-radius-10 object-fit-cover w-100 h-100"
                                 src={ logoUrl } alt="img"/>
                        )
                    }
                </div>
                <div className="d-flex flex-column ml-20">
                    <div className="d-flex flex-column">
                        <div className="d-flex font-17 text-white">Wallet Address:</div>
                        {
                            walletAddress.length === lengthOfAddress ? (
                                <div className="font-18 font-weight-bold text-white mt-10">{ reduceTheWalletAddress(user.walletAddress) }</div>
                            ) : (
                                <button className="border-radius-4 border-0 w-100 mt-10 bg-success font-14 font-weight-bold text-white p-10"
                                    onClick={ () => connectWallet() }>
                                    Connect Wallet
                                </button>
                            )
                        }
                    </div>
                    <div className="d-flex flex-column">
                        <div className="font-20 text-white"> Name: </div>
                        <input
                            className="font-15 mt-5 w-100 height-40 bg-dark text-white border-1 border-secondary border-radius-4"
                            value={user.userName}
                            onChange={(e) => {
                                setUser({...user, userName: e.target.value});
                            }}
                            type="text" placeholder="User Name" name="name"/>
                    </div>
                    {
                        walletAddress.length === lengthOfAddress ? (
                            <button className="border-radius-4 border-0 w-100 mt-10 bg-success font-14 font-weight-bold text-white p-10"
                                    onClick={ () => uploadProfile() }>
                                Upload
                            </button>
                        ):(
                            <button className="border-radius-4 border-0 w-100 mt-10 bg-success font-14 font-weight-bold text-white p-10"
                                    onClick={ () => connectWallet() }>
                                Connect Wallet
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
