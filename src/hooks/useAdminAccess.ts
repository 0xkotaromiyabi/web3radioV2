import { useMemo } from 'react';

// WITA = UTC+8 (Waktu Indonesia Tengah)
const WITA_OFFSET_HOURS = 8;

// Admin time slots configuration
// Format: { address (lowercase): { startHour, endHour, label } }
const ADMIN_TIME_SLOTS: Record<string, { startHour: number; endHour: number; label: string }> = {
    // 0x242dfb7849544ee242b2265ca7e585bdec60456b - 20:00-23:59 WITA
    '0x242dfb7849544ee242b2265ca7e585bdec60456b': {
        startHour: 20,
        endHour: 24, // 23:59 is effectively until 24:00
        label: '20:00 - 23:59 WITA'
    },
    // 0x13dd8b8f54c3b54860f8d41a6fbff7ffc6bf01ef - 00:00-03:59 WITA
    '0x13dd8b8f54c3b54860f8d41a6fbff7ffc6bf01ef': {
        startHour: 0,
        endHour: 4, // 03:59 is effectively until 04:00
        label: '00:00 - 03:59 WITA'
    },
    // 0xdbca8ab9eb325a8f550ffc6e45277081a6c7d681 - 04:00-08:00 WITA
    '0xdbca8ab9eb325a8f550ffc6e45277081a6c7d681': {
        startHour: 4,
        endHour: 8,
        label: '04:00 - 08:00 WITA'
    }
};

// Wallets without time restrictions (full access)
const UNRESTRICTED_ADMINS = [
    '0x46b4ee7c6dc39ee96009b0808378df11c6938c6b'
];

interface AdminAccessResult {
    hasAccess: boolean;
    isAdmin: boolean;
    hasTimeRestriction: boolean;
    allowedSlot: string | null;
    currentTimeWITA: string;
    message: string | null;
}

/**
 * Get current hour in WITA timezone
 */
function getCurrentWITAHour(): { hour: number; timeString: string } {
    const now = new Date();
    // UTC time
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();

    // Convert to WITA (UTC+8)
    let witaHour = (utcHours + WITA_OFFSET_HOURS) % 24;

    const timeString = `${witaHour.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')} WITA`;

    return { hour: witaHour, timeString };
}

/**
 * Check if current WITA hour is within allowed range
 */
function isWithinTimeSlot(currentHour: number, startHour: number, endHour: number): boolean {
    // Handle normal range (e.g., 04:00-08:00)
    if (startHour < endHour) {
        return currentHour >= startHour && currentHour < endHour;
    }
    // Handle wrap-around range (e.g., 22:00-02:00) - not currently used but good to have
    return currentHour >= startHour || currentHour < endHour;
}

/**
 * Custom hook to check admin access based on wallet and time slot
 * @param address - The connected wallet address
 * @returns AdminAccessResult with access status and messages
 */
export function useAdminAccess(address: string | undefined): AdminAccessResult {
    return useMemo(() => {
        if (!address) {
            return {
                hasAccess: false,
                isAdmin: false,
                hasTimeRestriction: false,
                allowedSlot: null,
                currentTimeWITA: '',
                message: null
            };
        }

        const lowerAddress = address.toLowerCase();
        const { hour, timeString } = getCurrentWITAHour();

        // Check if unrestricted admin
        if (UNRESTRICTED_ADMINS.includes(lowerAddress)) {
            return {
                hasAccess: true,
                isAdmin: true,
                hasTimeRestriction: false,
                allowedSlot: 'Full Access (24/7)',
                currentTimeWITA: timeString,
                message: null
            };
        }

        // Check if time-restricted admin
        const timeSlot = ADMIN_TIME_SLOTS[lowerAddress];
        if (timeSlot) {
            const isWithinSlot = isWithinTimeSlot(hour, timeSlot.startHour, timeSlot.endHour);

            if (isWithinSlot) {
                return {
                    hasAccess: true,
                    isAdmin: true,
                    hasTimeRestriction: true,
                    allowedSlot: timeSlot.label,
                    currentTimeWITA: timeString,
                    message: null
                };
            } else {
                return {
                    hasAccess: false,
                    isAdmin: true,
                    hasTimeRestriction: true,
                    allowedSlot: timeSlot.label,
                    currentTimeWITA: timeString,
                    message: `Akses Anda dibatasi pada jam ${timeSlot.label}. Waktu saat ini: ${timeString}.`
                };
            }
        }

        // Not an admin at all
        return {
            hasAccess: false,
            isAdmin: false,
            hasTimeRestriction: false,
            allowedSlot: null,
            currentTimeWITA: timeString,
            message: 'Wallet Anda tidak terdaftar sebagai admin.'
        };
    }, [address]);
}

export { ADMIN_TIME_SLOTS, UNRESTRICTED_ADMINS };
