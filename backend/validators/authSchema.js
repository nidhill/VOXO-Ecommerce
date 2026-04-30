const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

const success = (data) => ({ success: true, data });

const failure = (message) => ({
    success: false,
    error: { errors: [{ message }] },
});

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const registerSchema = {
    safeParse(input = {}) {
        const name = normalizeString(input.name);
        const email = normalizeString(input.email).toLowerCase();
        const password = typeof input.password === 'string' ? input.password : '';
        const phone = typeof input.phone === 'string' ? input.phone.trim() : '';

        if (name.length < 2) return failure('Name must be at least 2 characters');
        if (name.length > 60) return failure('Name too long');
        if (!validateEmail(email)) return failure('Invalid email address');
        if (password.length < 8) return failure('Password must be at least 8 characters');
        if (password.length > 128) return failure('Password is too long');
        if (phone && !PHONE_REGEX.test(phone)) return failure('Invalid phone number');

        return success({ name, email, password, phone });
    },
};

const loginSchema = {
    safeParse(input = {}) {
        const email = normalizeString(input.email).toLowerCase();
        const password = typeof input.password === 'string' ? input.password : '';

        if (!validateEmail(email)) return failure('Invalid email address');
        if (!password) return failure('Password is required');

        return success({ email, password });
    },
};

const forgotPasswordSchema = {
    safeParse(input = {}) {
        const email = normalizeString(input.email).toLowerCase();

        if (!validateEmail(email)) return failure('Invalid email address');

        return success({ email });
    },
};

const resetPasswordSchema = {
    safeParse(input = {}) {
        const password = typeof input.password === 'string' ? input.password : '';

        if (password.length < 8) return failure('Password must be at least 8 characters');
        if (password.length > 128) return failure('Password is too long');

        return success({ password });
    },
};

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
