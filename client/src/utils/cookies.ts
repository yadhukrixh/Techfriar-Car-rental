export class CookieClass {
    // Function to check if a cookie exists
    public checkCookie = async (cookieName: string): Promise<boolean> => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            // Remove leading spaces and check if the cookie starts with the cookie name
            cookie = cookie.trim();
            if (cookie.startsWith(`${cookieName}=`)) {
                return true; // Cookie exists
            }
        }
        return false; // Cookie does not exist
    }

    // Function to get the value of a cookie by name
    public getCookieValue = (cookieName: string): string | null => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            // Remove leading spaces
            cookie = cookie.trim();
            if (cookie.startsWith(`${cookieName}=`)) {
                // Return the value after the equal sign
                return cookie.split('=')[1] || null;
            }
        }
        return null; // Cookie does not exist
    }

    // Function to remove a cookie by setting its expiration date to the past
    public removeCookie = (cookieName: string): void => {
        // Set the cookie's expiration date to a past date
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}
