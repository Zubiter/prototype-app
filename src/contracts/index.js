import { ethers } from 'ethers';

import Zubiter from './Zubiter.json';
import ZubiterClonableERC721 from './ZubiterClonableERC721.json';

export const initContracts = ({provider, signer}) => {
    return {
        Zubiter: new ethers.Contract(Zubiter.address['binance-test'], Zubiter.abi, signer || provider),
        ZubiterClonableERC721: new ethers.Contract(ZubiterClonableERC721.address['binance-test'], ZubiterClonableERC721.abi, signer || provider),
    }
};