import { useMemo, useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { WEB3_RADIO_ACCESS_PASS_ADDRESS, WEB3_RADIO_ACCESS_PASS_ABI } from '@/config/contracts';
import { getCurrentUTCTime } from '@/utils/timeSlots';

// UTC Offset +8 for WITA display reference
const WITA_OFFSET_HOURS = 8;
const SESSION_KEY = 'web3radio_admin_access';

interface AdminAccessResult {
    hasAccess: boolean;
    isAdmin: boolean;
    hasTimeRestriction: boolean;
    allowedSlot: string | null;
    currentTimeWITA: string;
    message: string | null;
    isLoading: boolean;
}

interface CachedAccess {
    address: string;
    hasAccess: boolean;
    isAdmin: boolean;
    hasTimeRestriction: boolean;
    allowedSlot: string | null;
    timestamp: number;
}

/**
 * Custom hook to check admin access based on smart contract time slots
 * Caches successful verification in sessionStorage to avoid repeated on-chain calls
 * @param address - The connected wallet address
 * @returns AdminAccessResult with access status and messages
 */
export function useAdminAccess(address: string | undefined): AdminAccessResult {
    // Lazy initialize state from sessionStorage to avoid initial loading flash
    const [cachedAccess, setCachedAccess] = useState<CachedAccess | null>(() => {
        if (!address) return null;
        try {
            const stored = sessionStorage.getItem(SESSION_KEY);
            if (stored) {
                const parsed: CachedAccess = JSON.parse(stored);
                // Validate it's for the same address
                if (parsed.address.toLowerCase() === address.toLowerCase()) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Failed to read cached access', e);
        }
        return null;
    });

    // Update state if address changes
    useEffect(() => {
        if (!address) {
            setCachedAccess(null);
            return;
        }

        // Check cache again when address changes
        try {
            const stored = sessionStorage.getItem(SESSION_KEY);
            if (stored) {
                const parsed: CachedAccess = JSON.parse(stored);
                if (parsed.address.toLowerCase() === address.toLowerCase()) {
                    setCachedAccess(parsed);
                    return;
                }
            }
        } catch (e) {
            // ignore
        }
        setCachedAccess(null);
    }, [address]);

    // Only query on-chain if we don't have a valid cache
    // This calculation must be consistent with the state
    const shouldQueryChain = !cachedAccess || (address && cachedAccess.address.toLowerCase() !== address.toLowerCase());

    const { data: hasAccessNow, isLoading, isError } = useReadContract({
        address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
        abi: WEB3_RADIO_ACCESS_PASS_ABI,
        functionName: 'hasAccessNow',
        args: address ? [address as `0x${string}`] : undefined,
        query: {
            enabled: shouldQueryChain && !!address,
        }
    });

    const { data: hasRegularAccess } = useReadContract({
        address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
        abi: WEB3_RADIO_ACCESS_PASS_ABI,
        functionName: 'hasRegularAccess',
        args: address ? [address as `0x${string}`] : undefined,
        query: {
            enabled: shouldQueryChain && !!address,
        }
    });

    const currentTimeWITA = useMemo(() => {
        const now = new Date();
        const witaHour = (now.getUTCHours() + WITA_OFFSET_HOURS) % 24;
        const witaMinutes = now.getUTCMinutes().toString().padStart(2, '0');
        return `${witaHour.toString().padStart(2, '0')}:${witaMinutes} WITA`;
    }, []);

    // Cache access result in sessionStorage (whether granted or denied)
    useEffect(() => {
        if (address && !isLoading && hasAccessNow !== undefined) {
            const accessData: CachedAccess = {
                address,
                hasAccess: Boolean(hasAccessNow),
                isAdmin: Boolean(hasAccessNow) || Boolean(hasRegularAccess),
                hasTimeRestriction: !isUnrestrictedAdmin(address),
                allowedSlot: isUnrestrictedAdmin(address) ? "Super Admin (Full Access)" : "Current Active Slot",
                timestamp: Date.now()
            };

            try {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(accessData));
                setCachedAccess(accessData);
            } catch (e) {
                console.warn('Failed to cache access', e);
            }
        }
    }, [address, hasAccessNow, hasRegularAccess, isLoading]);

    const result = useMemo(() => {
        // 1. Return cached result if available in state
        if (cachedAccess && address && cachedAccess.address.toLowerCase() === address.toLowerCase()) {
            return {
                hasAccess: cachedAccess.hasAccess,
                isAdmin: cachedAccess.isAdmin,
                hasTimeRestriction: cachedAccess.hasTimeRestriction,
                allowedSlot: cachedAccess.allowedSlot,
                currentTimeWITA,
                message: null,
                isLoading: false
            };
        }

        // 2. Escape Hatch: Try direct read from sessionStorage to prevent flicker
        // This handles the render cycle where address is defined but state hasn't updated yet
        if (address) {
            try {
                const stored = sessionStorage.getItem(SESSION_KEY);
                if (stored) {
                    const parsed: CachedAccess = JSON.parse(stored);
                    if (parsed.address.toLowerCase() === address.toLowerCase()) {
                        return {
                            hasAccess: parsed.hasAccess,
                            isAdmin: parsed.isAdmin,
                            hasTimeRestriction: parsed.hasTimeRestriction,
                            allowedSlot: parsed.allowedSlot,
                            currentTimeWITA,
                            message: null,
                            isLoading: false
                        };
                    }
                }
            } catch (e) {
                // Ignore errors here
            }
        }

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
        if (isUnrestrictedAdmin(address)) {
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
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentSlotLabel = `${dayNames[dayIndex]} ${hour.toString().padStart(2, '0')}:00 UTC`;

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
    }, [address, hasAccessNow, isLoading, hasRegularAccess, currentTimeWITA, cachedAccess]);

    return result;
}

// Helper function to check unrestricted admins
function isUnrestrictedAdmin(address: string): boolean {
    const UNRESTRICTED_ADMINS = [
        '0x242DfB7849544eE242b2265cA7E585bdec60456B'.toLowerCase(),
        '0x46b4ee7c6dc39ee96009b0808378df11c6938c6b'.toLowerCase()
    ];
    return UNRESTRICTED_ADMINS.includes(address.toLowerCase());
}

// Export function to clear cache (for logout)
export function clearAdminAccessCache(): void {
    try {
        sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
        console.warn('Failed to clear access cache', e);
    }
}
