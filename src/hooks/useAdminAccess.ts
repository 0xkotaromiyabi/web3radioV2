import { useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { WEB3_RADIO_ACCESS_PASS_ADDRESS, WEB3_RADIO_ACCESS_PASS_ABI } from '@/config/contracts';
import { getCurrentUTCTime, getTimeSlotFromTokenId } from '@/utils/timeSlots';

// UTC Offset +8 for WITA display reference
const WITA_OFFSET_HOURS = 8;

interface AdminAccessResult {
    hasAccess: boolean;
    isAdmin: boolean;
    hasTimeRestriction: boolean;
    allowedSlot: string | null;
    currentTimeWITA: string;
    message: string | null;
    isLoading: boolean;
}

/**
 * Custom hook to check admin access based on smart contract time slots
 * @param address - The connected wallet address
 * @returns AdminAccessResult with access status and messages
 */
export function useAdminAccess(address: string | undefined): AdminAccessResult {
    const { data: hasAccessNow, isLoading, isError } = useReadContract({
        address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
        abi: WEB3_RADIO_ACCESS_PASS_ABI,
        functionName: 'hasAccessNow',
        args: address ? [address as `0x${string}`] : undefined,
        query: {
            enabled: !!address,
        }
    });

    // Also check if the user is an owner of ANY pass (to differentiate between "not authorized at all" and "not authorized RIGHT NOW")
    const { data: hasRegularAccess } = useReadContract({
        address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
        abi: WEB3_RADIO_ACCESS_PASS_ABI,
        functionName: 'hasRegularAccess', // We might need a generic "isAnyPassHolder" but for now this helps
        args: address ? [address as `0x${string}`] : undefined,
        query: {
            enabled: !!address,
        }
    });

    const currentTimeWITA = useMemo(() => {
        const now = new Date();
        const witaHour = (now.getUTCHours() + WITA_OFFSET_HOURS) % 24;
        const witaMinutes = now.getUTCMinutes().toString().padStart(2, '0');
        return `${witaHour.toString().padStart(2, '0')}:${witaMinutes} WITA`;
    }, []);

    const result = useMemo(() => {
        if (!address) {
            return {
                hasAccess: false,
                isAdmin: false,
                hasTimeRestriction: false,
                allowedSlot: null,
                currentTimeWITA,
                message: null,
                isLoading: false
            };
        }

        if (isLoading) {
            return {
                hasAccess: false,
                isAdmin: false,
                hasTimeRestriction: false,
                allowedSlot: null,
                currentTimeWITA,
                message: "Checking access...",
                isLoading: true
            };
        }

        // Super Admin / Unrestricted Bypass
        const UNRESTRICTED_ADMINS = [
            '0x242DfB7849544eE242b2265cA7E585bdec60456B'.toLowerCase(),
            '0x46b4ee7c6dc39ee96009b0808378df11c6938c6b'.toLowerCase()
        ];

        if (UNRESTRICTED_ADMINS.includes(address.toLowerCase())) {
            return {
                hasAccess: true,
                isAdmin: true,
                hasTimeRestriction: false,
                allowedSlot: "Super Admin (Full Access)",
                currentTimeWITA,
                message: null,
                isLoading: false
            };
        }

        const { dayIndex, hour } = getCurrentUTCTime();
        const currentSlotLabel = `${dayIndex === 1 ? 'Monday' : dayIndex === 2 ? 'Tuesday' : dayIndex === 3 ? 'Wednesday' : dayIndex === 4 ? 'Thursday' : dayIndex === 5 ? 'Friday' : dayIndex === 6 ? 'Saturday' : 'Sunday'} ${hour.toString().padStart(2, '0')}:00 UTC`;

        if (hasAccessNow) {
            return {
                hasAccess: true,
                isAdmin: true,
                hasTimeRestriction: true,
                allowedSlot: "Current Active Slot",
                currentTimeWITA,
                message: null,
                isLoading: false
            };
        }

        // Check if is admin (owns a regular pass)
        const isAdmin = Boolean(hasRegularAccess) || false;

        return {
            hasAccess: false,
            isAdmin: isAdmin,
            hasTimeRestriction: true,
            allowedSlot: "Your NFT Time Slots",
            currentTimeWITA,
            message: isAdmin
                ? `Akses Anda tidak aktif pada jam ini (${currentSlotLabel}). Silakan cek jadwal NFT Anda.`
                : 'Wallet Anda tidak memiliki Access Pass yang aktif.',
            isLoading: false
        };
    }, [address, hasAccessNow, isLoading, hasRegularAccess, currentTimeWITA]);

    return result;
}
