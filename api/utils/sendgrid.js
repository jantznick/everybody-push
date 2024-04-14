const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendgridTemplates = {
	emailConfirm: {
		templateId: 'd-5bede02723fc421892928984479d8aa7'
	},
	userInvite: {
		templateId: 'd-ecb8bb56a40246cfb49f7e7f77eb4a72'
	},
	resetPassword: {
		templateId: 'd-48ed4c72d3924982996801de405e9f90'
	},
	loginToken: {
		templateId: 'd-0368ffe9529a42629638389fef6de7d8'
	}
}

export const sendEmail = async ({token, email, templateString}) => {
	const result = sgMail.send({
		to: email,
		from: 'everybodypush@nickjantz.com',
		templateId: sendgridTemplates[templateString].templateId,
		dynamicTemplateData: {
			token: token
		},
	})
	return result
	// .then(() => {
	// 	console.log('Email sent')
	// 	return { status: 'email sent' }
	// })
	// .catch((error) => {
	// 	console.error(error)
	// 	return { status: 'error', errorMessage: error }
	// })
}