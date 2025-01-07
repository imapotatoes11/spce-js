/**
 * Converts a date in mm-dd-yyyy format to a Discord snowflake.
 * @param dateStr - The date string in mm-dd-yyyy format
 * @returns The Discord snowflake for the given date
 * @throws Error if the date format is invalid
 */
function dateToSnowflake(dateStr: string): bigint {
    // Discord epoch: January 1, 2015 at 00:00:00 UTC
    const DISCORD_EPOCH = new Date('2015-01-01T00:00:00.000Z');

    // Parse the input date
    const [month, day, year] = dateStr.split('-').map(num => parseInt(num, 10));
    const date = new Date(Date.UTC(year, month - 1, day));

    // Validate date format
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format. Expected mm-dd-yyyy');
    }

    // Calculate milliseconds since Discord epoch
    const timestampMs = date.getTime() - DISCORD_EPOCH.getTime();

    // Shift timestamp left by 22 bits to create the snowflake
    return BigInt(timestampMs) << BigInt(22);
}