import { ethers } from 'ethers';

import Zubiter from './Zubiter.json';
import ZubiterClonableERC721 from './ZubiterClonableERC721.json';

export const initContracts = ({provider, signer}, network='binance-test') => {
    return {
        Zubiter: new ethers.Contract(Zubiter.address[network], Zubiter.abi, signer || provider),
        ZubiterClonableERC721: new ethers.Contract(ZubiterClonableERC721.address[network], ZubiterClonableERC721.abi, signer || provider),
    }
};