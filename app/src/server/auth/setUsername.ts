import { defineUserSignupFields } from 'wasp/auth/providers/types';

export const getUsernameAndPasswordUserFields = defineUserSignupFields({
	username: (data: any) => data.username,
});

const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

export const getEmailUserFields = defineUserSignupFields({
	username: (data: any) => data.email,
	isAdmin: (data: any) => adminEmails.includes(data.email),
});
