import React from 'react';
import { getTimeSlotFromTokenId, isTokenActiveNow } from "@/utils/timeSlots";
import './RentalNFTCard.css';

interface Listing {
    id: string;
    tokenId: string;
    lender: string;
    pricePerHour: string;
    maxDuration: number;
    isSuperAccess: boolean;
}

interface RentalNFTCardProps {
    listing: Listing;
    onRent: (listingId: string) => void;
}

const RentalNFTCard: React.FC<RentalNFTCardProps> = ({ listing, onRent }) => {
    const timeSlot = getTimeSlotFromTokenId(parseInt(listing.tokenId));
    const isActiveNow = !timeSlot.isSuper && isTokenActiveNow(parseInt(listing.tokenId));

    return (
        <div className={`nft ${isActiveNow ? 'active-slot' : ''}`} onClick={() => onRent(listing.id)}>
            <div className='main'>
                <img
                    className='tokenImage'
                    src={listing.isSuperAccess
                        ? "https://i.pinimg.com/736x/2f/48/10/2f481058c91deb1eb87d46de6b88268a.jpg"
                        : "https://i.pinimg.com/736x/2f/48/10/2f481058c91deb1eb87d46de6b88268a.jpg"}
                    alt="NFT Pass"
                />
                <h2>Pass #{listing.tokenId}</h2>
                <div className='description-container'>
                    <p className='description-label'>Time Slot</p>
                    <p className='description-value'>{timeSlot.displayTime}</p>
                </div>
                <div className='tokenInfo'>
                    <div className="price">
                        <ins>◘</ins>
                        <p>{listing.pricePerHour} ETH/hr</p>
                    </div>
                    <div className="duration">
                        <ins>◷</ins>
                        <p>{listing.maxDuration}h max</p>
                    </div>
                </div>
                <hr />
                <div className='creator'>
                    <div className='wrapper'>
                        <img src="https://www.webthreeradio.xyz/assets/web3radio-logo-QlWPnHjq.png" alt="Creator" />
                    </div>
                    <p><ins>Creation of</ins> web3radio</p>
                </div>
            </div>
        </div>
    );
};

export default RentalNFTCard;
