/**
 * Time Slot Utilities for Web3Radio Access Pass
 * 
 * Mapping:
 * - Regular Access: Token 0-167 (168 total) = 7 days × 24 hours
 * - Super Access: Token 169-175 (7 total) = Monday-Sunday
 */

export const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
] as const;

export const REGULAR_SUPPLY = 168;
export const SUPER_START_ID = 168;
export const SUPER_SUPPLY = 7;
export const TOTAL_SUPPLY = 175;

export interface TimeSlot {
    day: string;
    dayIndex: number; // 1-7 (1 = Monday)
    hour: number; // 0-23
    displayTime: string; // e.g., "Monday 13:00-14:00 UTC"
    isSuper: boolean;
}

/**
 * Convert Token ID to Time Slot
 * @param tokenId - NFT Token ID (0-167 for Regular, 169-175 for Super)
 * @returns TimeSlot object with day, hour, and display info
 */
export function getTimeSlotFromTokenId(tokenId: number): TimeSlot {
    // Super Access tokens
    if (tokenId >= SUPER_START_ID && tokenId < SUPER_START_ID + SUPER_SUPPLY) {
        const dayIndex = tokenId - SUPER_START_ID + 1; // 1-7
        const day = DAYS_OF_WEEK[dayIndex - 1];
        return {
            day,
            dayIndex,
            hour: -1, // Flexible hour
            displayTime: `${day} (Any 1 hour/week)`,
            isSuper: true,
        };
    }

    // Regular Access tokens (0-167)
    if (tokenId >= 0 && tokenId < REGULAR_SUPPLY) {
        const dayIndex = Math.floor(tokenId / 24) + 1; // 1-7
        const hour = tokenId % 24; // 0-23
        const day = DAYS_OF_WEEK[dayIndex - 1];

        const hourStart = hour.toString().padStart(2, '0');
        const hourEnd = ((hour + 1) % 24).toString().padStart(2, '0');

        return {
            day,
            dayIndex,
            hour,
            displayTime: `${day} ${hourStart}:00-${hourEnd}:00 UTC`,
            isSuper: false,
        };
    }

    // Invalid token ID
    throw new Error(`Invalid token ID: ${tokenId}`);
}

/**
 * Convert Day & Hour to Token ID
 * @param dayIndex - Day of week (1 = Monday, 7 = Sunday)
 * @param hour - Hour of day (0-23)
 * @returns Token ID (0-167)
 */
export function getTokenIdFromTimeSlot(dayIndex: number, hour: number): number {
    if (dayIndex < 1 || dayIndex > 7) {
        throw new Error('Day index must be between 1-7');
    }
    if (hour < 0 || hour > 23) {
        throw new Error('Hour must be between 0-23');
    }

    return (dayIndex - 1) * 24 + hour;
}

/**
 * Get current UTC day index (1-7) and hour (0-23)
 */
export function getCurrentUTCTime(): { dayIndex: number; hour: number } {
    const now = new Date();
    const dayIndex = now.getUTCDay() === 0 ? 7 : now.getUTCDay(); // Convert Sunday from 0 to 7
    const hour = now.getUTCHours();

    return { dayIndex, hour };
}

/**
 * Check if a Regular Access token is currently active
 * @param tokenId - Token ID (0-167)
 * @returns true if current UTC time matches this token's slot
 */
export function isTokenActiveNow(tokenId: number): boolean {
    if (tokenId >= SUPER_START_ID) {
        return false; // Super Access requires manual claim check
    }

    const { dayIndex, hour } = getCurrentUTCTime();
    const expectedTokenId = getTokenIdFromTimeSlot(dayIndex, hour);

    return tokenId === expectedTokenId;
}

/**
 * Get the token ID that should be active right now
 */
export function getCurrentActiveTokenId(): number {
    const { dayIndex, hour } = getCurrentUTCTime();
    return getTokenIdFromTimeSlot(dayIndex, hour);
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(dayIndex: number, hour: number): string {
    const day = DAYS_OF_WEEK[dayIndex - 1];
    const hourStart = hour.toString().padStart(2, '0');
    const hourEnd = ((hour + 1) % 24).toString().padStart(2, '0');

    return `${day} ${hourStart}:00-${hourEnd}:00 UTC`;
}

/**
 * Get all token IDs for a specific day
 * @param dayIndex - Day of week (1-7)
 * @returns Array of token IDs for that day
 */
export function getTokensForDay(dayIndex: number): number[] {
    if (dayIndex < 1 || dayIndex > 7) {
        throw new Error('Day index must be between 1-7');
    }

    const startTokenId = (dayIndex - 1) * 24;
    return Array.from({ length: 24 }, (_, i) => startTokenId + i);
}

/**
 * Get Super Access token ID for a specific day
 * @param dayIndex - Day of week (1-7)
 * @returns Token ID (168-174)
 */
export function getSuperTokenForDay(dayIndex: number): number {
    if (dayIndex < 1 || dayIndex > 7) {
        throw new Error('Day index must be between 1-7');
    }

    return SUPER_START_ID + dayIndex - 1;
}

/**
 * Calculate time until a slot becomes active
 * @param tokenId - Token ID
 * @returns Milliseconds until slot is active, or null if Super Access
 */
export function getTimeUntilActive(tokenId: number): number | null {
    if (tokenId >= SUPER_START_ID) {
        return null; // Super Access doesn't have fixed time
    }

    const slot = getTimeSlotFromTokenId(tokenId);
    const { dayIndex: currentDay, hour: currentHour } = getCurrentUTCTime();

    const currentMinutes = (currentDay - 1) * 24 * 60 + currentHour * 60;
    const slotMinutes = (slot.dayIndex - 1) * 24 * 60 + slot.hour * 60;

    let diffMinutes = slotMinutes - currentMinutes;

    // If slot is in the past this week, add a full week
    if (diffMinutes < 0) {
        diffMinutes += 7 * 24 * 60;
    }

    return diffMinutes * 60 * 1000; // Convert to milliseconds
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
    }

    return `${hours}h ${minutes}m`;
}
