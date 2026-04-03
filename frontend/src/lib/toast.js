import { toast } from 'sonner';

/**
 * Centralised toast helpers — import `notify` anywhere to show a toast
 * without hardcoding strings throughout the codebase.
 */
export const notify = {
    cartAdd:       (name)    => toast.success(`${name} added to bag`,     { duration: 2500 }),
    cartRemove:    (name, onUndo) => toast(`${name} removed from bag`, {
        action: onUndo ? { label: 'Undo', onClick: onUndo } : undefined,
        duration: 4000,
    }),
    wishlistAdd:   ()        => toast.success('Saved to wishlist'),
    wishlistRemove: ()       => toast('Removed from wishlist'),
    loginSuccess:  (name)    => toast.success(`Welcome back, ${name}!`),
    registerSuccess: (name)  => toast.success(`Welcome to WAVWAY, ${name}!`),
    logoutSuccess: ()        => toast('Logged out successfully'),
    orderPlaced:   (id)      => toast.success(`Order #${id} placed!`,     { duration: 5000 }),
    networkError:  ()        => toast.error('Connection lost — check your internet'),
    genericError:  (msg)     => toast.error(msg || 'Something went wrong'),
    copied:        ()        => toast('Link copied to clipboard'),
};
